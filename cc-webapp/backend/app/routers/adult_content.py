from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from app.schemas import ContentUnlockRequest
from app.services import token_service

router = APIRouter(prefix="/v1/adult", tags=["AdultContent"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

@router.post("/unlock")
async def unlock_content(
    content_request: ContentUnlockRequest, 
    token: str = Depends(oauth2_scheme)
):
    """Unlock adult content using cyber tokens"""
    stage_costs = {1: 200, 2: 500, 3: 1000}
    cost = stage_costs.get(content_request.stage)
    if not cost:
        raise HTTPException(status_code=404, detail="Invalid stage")

    try:
        remaining = token_service.deduct_tokens(content_request.user_id, cost)
    except ValueError:
        raise HTTPException(status_code=402, detail="Insufficient cyber tokens")

    return {
        "status": "success",
        "stage": content_request.stage,
        "remaining_tokens": remaining,
    }

