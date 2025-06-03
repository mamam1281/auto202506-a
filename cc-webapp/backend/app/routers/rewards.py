# cc-webapp/backend/app/routers/rewards.py
from fastapi import APIRouter, Depends, HTTPException, Query, Path
from sqlalchemy.orm import Session
from typing import List, Any # Any might not be needed if using specific Pydantic models
from pydantic import BaseModel
from datetime import datetime

# Assuming models and database session setup are in these locations
from .. import models # This should import UserReward and User
from ..database import SessionLocal

router = APIRouter()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic model for individual reward item in the response
class RewardItem(BaseModel):
    reward_id: int # This will map from UserReward.id
    reward_type: str
    reward_value: str # Kept as string to accommodate various types like "50" or "FIRST_CLICK_BADGE"
    awarded_at: datetime

    class Config:
        orm_mode = True # Enables conversion from SQLAlchemy model instance (Pydantic V1)
        # from_attributes = True # For Pydantic V2

# Pydantic model for the overall response
class PaginatedRewardsResponse(BaseModel):
    rewards: List[RewardItem]
    page: int
    page_size: int
    total_rewards: int # Renamed from 'total' for clarity
    total_pages: int


@router.get(
    "/users/{user_id}/rewards",
    response_model=PaginatedRewardsResponse,
    tags=["users", "rewards"]
)
async def get_user_rewards(
    user_id: int = Path(..., title="The ID of the user to get rewards for", ge=1),
    page: int = Query(1, ge=1, description="Page number, 1-indexed"),
    page_size: int = Query(20, ge=1, le=100, description="Number of items per page"),
    db: Session = Depends(get_db)
):
    """
    Retrieves a paginated list of rewards for a specific user.
    """
    # First, check if user exists (optional, but good practice for FK constraints)
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail=f"User with id {user_id} not found.")

    # Calculate offset
    offset = (page - 1) * page_size

    # Query for total count of rewards for the user
    total_rewards_count = db.query(models.UserReward).filter(models.UserReward.user_id == user_id).count()

    if total_rewards_count == 0:
        return PaginatedRewardsResponse(
            rewards=[],
            page=page,
            page_size=page_size,
            total_rewards=0,
            total_pages=0
        )

    total_pages = (total_rewards_count + page_size - 1) // page_size # Calculate total pages

    if offset >= total_rewards_count and page > 1 : # if page requested is beyond the total items
         raise HTTPException(
             status_code=404,
             detail=f"Page not found. Total items: {total_rewards_count}, total pages: {total_pages}. Requested page: {page}."
        )

    # Query for the paginated list of rewards
    rewards_query_result = db.query(models.UserReward).filter(
        models.UserReward.user_id == user_id
    ).order_by(
        models.UserReward.awarded_at.desc() # Order by most recent
    ).offset(offset).limit(page_size).all()

    # FastAPI will handle the conversion of rewards_query_result (list of UserReward SQLAlchemy objects)
    # to a list of RewardItem Pydantic objects because of `response_model` and `orm_mode=True` in RewardItem.

    return PaginatedRewardsResponse(
        rewards=rewards_query_result,
        page=page,
        page_size=page_size,
        total_rewards=total_rewards_count,
        total_pages=total_pages
    )

# Ensure this router is included in app/main.py:
# from .routers import rewards
# app.include_router(rewards.router, prefix="/api", tags=["rewards"]) # Ensure tags are appropriate
