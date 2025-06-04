from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from app.schemas import UserProfile

router = APIRouter(prefix="/v1/users", tags=["Users"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

@router.get("/profile", response_model=UserProfile)
async def get_user_profile(token: str = Depends(oauth2_scheme)):
    """
    Retrieve user profile with authentication
    """
    # TODO: Implement actual user profile retrieval
    # Placeholder user profile
    return UserProfile(
        id="user_123",
        email="example@test.com",
        role="regular",
        achievements=[
            {"name": "First Login", "points": 10},
            {"name": "Profile Completed", "points": 20}
        ],
        current_level=2,
        total_points=30
    )
