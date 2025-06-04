codex/decide-on-and-update-canonical-variable-names
from datetime import datetime, timedelta
import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from jose import jwt

router = APIRouter(prefix="/auth", tags=["Auth"])

# Environment variables with canonical names
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "changeme")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
JWT_EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES", "30"))
INITIAL_CYBER_TOKENS = int(os.getenv("INITIAL_CYBER_TOKENS", "200"))

class LoginRequest(BaseModel):
    username: str
    password: str

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime, timedelta
from typing import Optional
import os
from jose import jwt, JWTError
from passlib.context import CryptContext

from ..database import get_db
from .. import models
from ..services import token_service

router = APIRouter(prefix="/auth", tags=["auth"])

SECRET_KEY = os.getenv("JWT_SECRET", "secret")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


class SignUpRequest(BaseModel):
    nickname: str
    password: str
    invite_code: str



class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

 codex/decide-on-and-update-canonical-variable-names
@router.post("/login", response_model=TokenResponse)
async def login(req: LoginRequest):
    """Simple login that issues a JWT."""
    # Placeholder authentication logic
    if not (req.username == "test" and req.password == "password"):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    expire = datetime.utcnow() + timedelta(minutes=JWT_EXPIRE_MINUTES)
    payload = {
        "sub": req.username,
        "exp": expire,
        "initial_tokens": INITIAL_CYBER_TOKENS,
    }
    token = jwt.encode(payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
    return TokenResponse(access_token=token)


class LoginRequest(BaseModel):
    nickname: str
    password: str


class VerifyInviteRequest(BaseModel):
    code: str


class UserMe(BaseModel):
    id: int
    nickname: str
    cyber_token_balance: int

    class Config:
        orm_mode = True


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def get_user_from_token(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = int(payload.get("sub"))
    except JWTError:
        raise credentials_exception
    return user_id


@router.post("/verify-invite")
async def verify_invite(req: VerifyInviteRequest, db: Session = Depends(get_db)):
    code = db.query(models.InviteCode).filter(models.InviteCode.code == req.code, models.InviteCode.is_used == False).first()
    return {"valid": bool(code)}


@router.post("/signup", response_model=TokenResponse)
async def signup(data: SignUpRequest, db: Session = Depends(get_db)):
    if db.query(models.User).filter(models.User.nickname == data.nickname).first():
        raise HTTPException(status_code=400, detail="Nickname already taken")
    invite = db.query(models.InviteCode).filter(models.InviteCode.code == data.invite_code, models.InviteCode.is_used == False).first()
    if not invite:
        raise HTTPException(status_code=400, detail="Invalid invite code")
    hashed_password = pwd_context.hash(data.password)
    user = models.User(nickname=data.nickname, password_hash=hashed_password, invite_code=data.invite_code)
    db.add(user)
    invite.is_used = True
    db.commit()
    db.refresh(user)
    token_service.add_tokens(user.id, 200)
    access_token = create_access_token({"sub": str(user.id)})
    return TokenResponse(access_token=access_token)


@router.post("/login", response_model=TokenResponse)
async def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.nickname == data.nickname).first()
    if not user or not pwd_context.verify(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    access_token = create_access_token({"sub": str(user.id)})
    return TokenResponse(access_token=access_token)


@router.get("/me", response_model=UserMe)
async def get_me(user_id: int = Depends(get_user_from_token), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

