from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel

from sqlalchemy.orm import Session

from app.services import token_service
from app.database import get_db


class TokenEarnRequest(BaseModel):
    user_id: int
    amount: int

router = APIRouter(prefix="/v1/corporate", tags=["Corporate"])

@router.post("/tokens/earn")
async def earn_tokens(req: TokenEarnRequest, db: Session = Depends(get_db)):
    """Simulate earning cyber tokens on the corporate site"""
    if req.amount <= 0:
        raise HTTPException(status_code=400, detail="Amount must be positive")
    new_balance = token_service.add_tokens(db, req.user_id, req.amount)
    db.commit()
    return {"balance": new_balance}


@router.get("/tokens/balance")
async def get_token_balance(user_id: int, db: Session = Depends(get_db)):
    """Retrieve a user's current cyber token balance"""
    return {"balance": token_service.get_balance(db, user_id)}


