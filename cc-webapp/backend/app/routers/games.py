import random
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from .. import models
from ..services import token_service
from ..utils.reward_utils import spin_gacha

router = APIRouter(prefix="/games", tags=["games"])


@router.post("/slot")
async def play_slot(user_id: int, db: Session = Depends(get_db)):
    try:
        token_service.deduct_tokens(user_id, 2)
    except ValueError:
        raise HTTPException(status_code=402, detail="Insufficient tokens - visit corporate site")

    streak_key = f"user:{user_id}:slot_fail"
    fail_streak = 0
    if token_service.redis_client:
        fail_streak = int(token_service.redis_client.get(streak_key) or 0)
    win_chance = 0.10 + min(fail_streak * 0.02, 0.5)
    win = random.random() < win_chance
    if win:
        token_service.add_tokens(user_id, 4)
        if token_service.redis_client:
            token_service.redis_client.delete(streak_key)
    else:
        if token_service.redis_client:
            token_service.redis_client.incr(streak_key)
    balance = token_service.get_balance(user_id)
    return {"win": win, "balance": balance}


@router.post("/roulette")
async def play_roulette(user_id: int):
    try:
        token_service.deduct_tokens(user_id, 2)
    except ValueError:
        raise HTTPException(status_code=402, detail="Insufficient tokens - visit corporate site")
    win = random.random() < 0.10
    if win:
        token_service.add_tokens(user_id, 6)
    balance = token_service.get_balance(user_id)
    return {"win": win, "balance": balance}


@router.post("/gacha")
async def play_gacha(user_id: int, db: Session = Depends(get_db)):
    try:
        token_service.deduct_tokens(user_id, 50)
    except ValueError:
        raise HTTPException(status_code=402, detail="Insufficient tokens - visit corporate site")
    result = spin_gacha(user_id=user_id, db=db)
    balance = token_service.get_balance(user_id)
    result["balance"] = balance
    return result
