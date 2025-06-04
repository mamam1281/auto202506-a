from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/auth", tags=["Authentication"])

class LoginRequest(BaseModel):
    nickname: str
    password: str
    invite_code: str

@router.post("/login")
async def login(data: LoginRequest):
    if (
        data.nickname != "testuser"
        or data.password != "password"
        or data.invite_code != "INVITE"
    ):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"access_token": "fake-token", "token_type": "bearer"}
