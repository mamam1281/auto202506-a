from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.schemas import ContentUnlockRequest
from app.services import token_service
from app.database import get_db
from app.models import UserSegment

router = APIRouter(prefix="/v1/adult", tags=["AdultContent"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

@router.post("/unlock")
async def unlock_content(
    stage: int,
    user_id: int,
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme),
):
    """Unlock adult content using cyber tokens"""
    stage_costs = {1: 200, 2: 500, 3: 1000}
    cost = stage_costs.get(stage)
    if cost is None:
        raise HTTPException(status_code=404, detail="Invalid stage")

    segment = db.query(UserSegment).filter(UserSegment.user_id == user_id).first()
    level_map = {"Low": 1, "Medium": 2, "High": 2, "Whale": 3}
    user_level = level_map.get(segment.rfm_group if segment else "Low", 1)
    if user_level < stage:
        raise HTTPException(status_code=403, detail="Segment level too low")

    try:
        remaining = token_service.deduct_tokens(user_id, cost)
    except ValueError:
        raise HTTPException(status_code=402, detail="Insufficient cyber tokens")

    return {
        "status": "success",
        "stage": stage,
        "remaining_tokens": remaining,
    }

