from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from app.schemas import (
    UserRegistration, 
    LoginRequest, 
    LoginResponse, 
    RegistrationResponse
)
from typing import Annotated
import re

router = APIRouter(prefix="/v1/auth", tags=["Authentication"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def validate_password(password: str) -> bool:
    """
    Validate password complexity:
    - Minimum 12 characters
    - Mix of uppercase, lowercase, numbers, special characters
    """
    if len(password) < 12:
        return False
    
    if not re.search(r'[A-Z]', password):
        return False
    
    if not re.search(r'[a-z]', password):
        return False
    
    if not re.search(r'\d', password):
        return False
    
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        return False
    
    return True

@router.post("/register", response_model=RegistrationResponse)
async def register_user(user: UserRegistration):
    """
    User registration endpoint with comprehensive validation
    """
    # Password complexity validation
    if not validate_password(user.password):
        raise HTTPException(
            status_code=400, 
            detail="Password does not meet complexity requirements"
        )
    
    # Age verification check
    if not user.age_verification:
        raise HTTPException(
            status_code=403, 
            detail="Age verification is required"
        )
    
    # TODO: Implement actual user creation logic
    # This is a placeholder response
    return RegistrationResponse(
        user_id="temp_user_id", 
        verification_status="pending"
    )

@router.post("/login", response_model=LoginResponse)
async def login(login_data: LoginRequest):
    """
    User login endpoint with basic authentication
    """
    # TODO: Implement actual authentication logic
    # Placeholder authentication
    if login_data.email == "example@test.com" and login_data.password == "SecurePassword123!":
        return LoginResponse(
            access_token="sample_access_token",
            refresh_token="sample_refresh_token",
            user_role="regular"
        )
    
    raise HTTPException(
        status_code=401, 
        detail="Invalid credentials"
    )

@router.post("/refresh-token")
async def refresh_token(token: Annotated[str, Depends(oauth2_scheme)]):
    """
    Token refresh endpoint
    """
    # TODO: Implement actual token refresh logic
    return {"access_token": "new_access_token"}
