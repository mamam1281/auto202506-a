from datetime import datetime, timedelta
import os
from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
import random
import string
from jose import jwt, JWTError
from passlib.context import CryptContext

from ..database import get_db
from .. import models
from ..services import token_service

# 표준화된 환경 변수명 사용
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "changeme")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
JWT_EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES", "60"))
INITIAL_CYBER_TOKENS = int(os.getenv("INITIAL_CYBER_TOKENS", "200"))
ADMIN_USER_IDS = [
    int(i) for i in os.getenv("ADMIN_USER_IDS", "1").split(",")
]  # simple admin list

router = APIRouter(prefix="/auth", tags=["auth"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

login_attempts: dict[str, dict] = {}


def generate_random_code(length: int = 12) -> str:
    chars = string.ascii_letters + string.digits
    return "".join(random.choice(chars) for _ in range(length))


def get_admin_user(
    user_id: int = Depends(lambda token: get_user_from_token(token)),
    db: Session = Depends(get_db),
):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user or user.id not in ADMIN_USER_IDS:
        raise HTTPException(status_code=403, detail="Admin privileges required")
    return user


class LoginRequest(BaseModel):
    nickname: str
    password: str


class SignUpRequest(BaseModel):
    nickname: str
    password: str
    invite_code: str


class InviteCodeResponse(BaseModel):
    id: int
    code: str
    expires_at: datetime

    class Config:
        orm_mode = True


class UserUpdateRequest(BaseModel):
    nickname: Optional[str] = None
    password: Optional[str] = None


class VerifyInviteRequest(BaseModel):
    code: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserMe(BaseModel):
    id: int
    nickname: str
    cyber_token_balance: int

    class Config:
        orm_mode = True


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (
        expires_delta or timedelta(minutes=JWT_EXPIRE_MINUTES)
    )
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)


def get_user_from_token(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        user_id: int = int(payload.get("sub"))
    except JWTError:
        raise credentials_exception
    return user_id


@router.post("/verify-invite")
async def verify_invite(req: VerifyInviteRequest, db: Session = Depends(get_db)):
    code = (
        db.query(models.InviteCode)
        .filter(models.InviteCode.code == req.code, models.InviteCode.is_used == False)
        .first()
    )
    return {"valid": bool(code)}


@router.post("/admin/generate-invite", response_model=List[InviteCodeResponse])
async def generate_invite_codes(
    count: int = 10,
    expires_in_days: int = 30,
    admin: models.User = Depends(get_admin_user),
    db: Session = Depends(get_db),
):
    codes: list[models.InviteCode] = []
    for _ in range(count):
        code = generate_random_code(12)
        expires_at = datetime.utcnow() + timedelta(days=expires_in_days)
        invite = models.InviteCode(
            code=code,
            created_by=admin.id,
            expires_at=expires_at,
            is_used=False,
        )
        db.add(invite)
        codes.append(invite)
    db.commit()
    for inv in codes:
        db.refresh(inv)
    return codes


@router.post("/signup", response_model=TokenResponse)
async def signup(data: SignUpRequest, db: Session = Depends(get_db)):
    if db.query(models.User).filter(models.User.nickname == data.nickname).first():
        raise HTTPException(status_code=400, detail="Nickname already taken")
    invite = (
        db.query(models.InviteCode)
        .filter(
            models.InviteCode.code == data.invite_code,
            models.InviteCode.is_used == False,
        )
        .first()
    )
    if not invite:
        raise HTTPException(status_code=400, detail="Invalid invite code")
    hashed_password = pwd_context.hash(data.password)
    user = models.User(
        nickname=data.nickname,
        password_hash=hashed_password,
        invite_code=data.invite_code,
    )
    db.add(user)
    invite.is_used = True
    db.commit()
    db.refresh(user)
    token_service.add_tokens(user.id, INITIAL_CYBER_TOKENS)  # 표준화된 초기 토큰 값 사용
    access_token = create_access_token({"sub": str(user.id)})
    return TokenResponse(access_token=access_token)


@router.put("/profile", response_model=UserMe)
async def update_profile(
    data: UserUpdateRequest,
    user_id: int = Depends(get_user_from_token),
    db: Session = Depends(get_db),
):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if data.nickname and data.nickname != user.nickname:
        existing = (
            db.query(models.User).filter(models.User.nickname == data.nickname).first()
        )
        if existing:
            raise HTTPException(status_code=400, detail="Nickname already taken")
        user.nickname = data.nickname
    if data.password:
        user.password_hash = pwd_context.hash(data.password)
    db.commit()
    db.refresh(user)
    return user


@router.post("/login", response_model=TokenResponse)
async def login(
    data: LoginRequest,
    db: Session = Depends(get_db),
    request: Request = None,
):
    client_ip = request.client.host if request else "unknown"

    if client_ip in login_attempts and login_attempts[client_ip]["count"] >= 5:
        last = login_attempts[client_ip]["timestamp"]
        if datetime.utcnow() - last < timedelta(minutes=15):
            raise HTTPException(
                status_code=429, detail="Too many login attempts. Try again later."
            )
        login_attempts[client_ip] = {"count": 0, "timestamp": datetime.utcnow()}

    user = db.query(models.User).filter(models.User.nickname == data.nickname).first()
    if not user or not pwd_context.verify(data.password, user.password_hash):
        if client_ip not in login_attempts:
            login_attempts[client_ip] = {"count": 1, "timestamp": datetime.utcnow()}
        else:
            login_attempts[client_ip]["count"] += 1
            login_attempts[client_ip]["timestamp"] = datetime.utcnow()
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if client_ip in login_attempts:
        del login_attempts[client_ip]

    history = models.LoginHistory(
        user_id=user.id,
        ip_address=client_ip,
        user_agent=request.headers.get("user-agent", "unknown")
        if request
        else "unknown",
        success=True,
    )
    db.add(history)
    db.commit()

    access_token = create_access_token({"sub": str(user.id)})
    return TokenResponse(access_token=access_token)


@router.get("/me", response_model=UserMe)
async def get_me(
    user_id: int = Depends(get_user_from_token), db: Session = Depends(get_db)
):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
