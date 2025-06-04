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

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

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
