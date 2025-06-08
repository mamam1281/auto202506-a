# cc-webapp/backend/app/routers/gacha.py
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from typing import Dict, Any, Union # Union for Pydantic model
import logging

# Assuming these utilities and models are correctly structured
from ..utils.reward_utils import spin_gacha
from ..models import User # To verify user exists
from ..database import get_db # Original get_db from database.py
from pydantic import BaseModel

logger = logging.getLogger(__name__)
router = APIRouter()

# --- Pydantic Models ---
class GachaPullRequest(BaseModel):
    user_id: int

class GachaPullResponseItem(BaseModel):
    type: str
    amount: Union[int, None] = None      # For COIN type
    stage: Union[int, None] = None       # For CONTENT_UNLOCK type
    badge_name: Union[str, None] = None  # For BADGE type
    message: Union[str, None] = None     # Optional message from spin_gacha logic

    class Config:

        # Pydantic V2 uses ``from_attributes``. This is not strictly needed
        # here as we are creating from a dict, but is good practice if the
        # source dict could be an ORM model.
        from_attributes = True



# --- API Endpoint ---
@router.post("/gacha/pull", response_model=GachaPullResponseItem, tags=["gacha"])
async def pull_gacha_for_user(
    request_data: GachaPullRequest,
    db: Session = Depends(get_db)
):
    """
    Allows a user to pull the gacha.
    This endpoint calls the internal `spin_gacha` utility (from `app.utils.reward_utils`)
    and returns the result.

    Future enhancements not in current scope:
    - Deducting gacha currency from the user's account.
    - Directly recording the won gacha item as a UserReward (currently, frontend logs an action,
      and for CONTENT_UNLOCK, frontend calls /api/unlock).
    """
    logger.info(f"Gacha pull request received for user_id: {request_data.user_id}")

    user = db.query(User).filter(User.id == request_data.user_id).first()
    if not user:
        logger.warning(f"Gacha pull attempt by non-existent user_id: {request_data.user_id}")
        raise HTTPException(status_code=404, detail=f"User with id {request_data.user_id} not found.")

    # TODO: Implement currency deduction logic here if applicable.
    # Example:
    # if not user_has_enough_currency(user, GACHA_COST):
    #     raise HTTPException(status_code=402, detail="Insufficient currency for gacha pull.")
    # deduct_currency(user, GACHA_COST, db)

    # Call the gacha logic from reward_utils.py
    # spin_gacha is expected to return a dictionary like:
    # {"type": "COIN", "amount": N, "message": "..."}
    # {"type": "CONTENT_UNLOCK", "stage": S, "message": "..."}
    # {"type": "BADGE", "badge_name": B, "message": "..."}
    gacha_result_dict = spin_gacha(user_id=request_data.user_id, db=db)

    if not gacha_result_dict or not gacha_result_dict.get("type"):
        logger.error(f"spin_gacha function returned an invalid result for user_id {request_data.user_id}: {gacha_result_dict}")
        # This case should ideally not happen if spin_gacha is robust and always returns a dict with a type
        raise HTTPException(status_code=500, detail="Gacha spin failed to produce a valid result. Please try again.")

    logger.info(f"Gacha result for user_id {request_data.user_id}: {gacha_result_dict}")

    # The GachaPullResponseItem Pydantic model will validate the structure of gacha_result_dict.
    # If gacha_result_dict contains extra keys not defined in GachaPullResponseItem,
    # they will be excluded unless the Pydantic model's Config allows extra fields.
    # If it's missing required fields (like 'type'), Pydantic will raise a validation error
    # which FastAPI handles as a 422 Unprocessable Entity, but our check above should catch missing 'type'.
    return GachaPullResponseItem(**gacha_result_dict)
