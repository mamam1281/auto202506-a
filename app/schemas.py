from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from enum import Enum

class UserRole(str, Enum):
    REGULAR = "regular"
    PREMIUM = "premium"
    CREATOR = "creator"
    ADMIN = "admin"

class UserRegistration(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=12)
    age_verification: bool = Field(...)
    marketing_consent: Optional[bool] = False

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class LoginResponse(BaseModel):
    access_token: str
    refresh_token: str
    user_role: UserRole

class UserProfile(BaseModel):
    id: str
    email: str
    role: UserRole
    achievements: List[dict] = []
    current_level: int = 1
    total_points: int = 0

class RegistrationResponse(BaseModel):
    user_id: str
    verification_status: str = "pending"

class ContentUnlockRequest(BaseModel):
    content_id: str
