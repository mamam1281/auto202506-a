from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import random
from pydantic import BaseModel

from app.database import get_db
from app.services import token_service
from app.utils.reward_utils import spin_gacha
from app.routers.auth import get_user_from_token
from app import models

router = APIRouter(prefix="/games", tags=["games"])


class GameResponse(BaseModel):
    outcome: str
    reward: int | None = None
    balance: int
    win_probability: float
    win_streak: int
    loss_streak: int


@router.post("/slot", response_model=GameResponse)
def play_slot(
    user_id: int = Depends(get_user_from_token),
    db: Session = Depends(get_db),
):
    try:
        balance = token_service.deduct_tokens(user_id, 2, db=db)
    except ValueError:
        raise HTTPException(status_code=402, detail="Insufficient tokens")

    streak = db.query(models.UserStreak).filter(models.UserStreak.user_id == user_id).first()
    if not streak:
        streak = models.UserStreak(user_id=user_id)
        db.add(streak)
        db.flush()

    win_prob = min(0.10 + 0.05 * streak.loss_streak, 0.40)
    if random.random() < win_prob:
        reward = random.randint(5, 20)
        token_service.add_tokens(user_id, reward, db=db)
        streak.win_streak += 1
        streak.loss_streak = 0
        outcome = "win"
    else:
        reward = None
        streak.loss_streak += 1
        streak.win_streak = 0
        outcome = "lose"

    log = models.GameLog(
        user_id=user_id,
        game_type="slot",
        result=outcome,
        tokens_spent=2,
        reward_given=str(reward) if reward else None,
    )
    db.add(log)
    db.commit()
    balance = token_service.get_balance(user_id, db=db)
    return GameResponse(
        outcome=outcome,
        reward=reward,
        balance=balance,
        win_probability=win_prob,
        win_streak=streak.win_streak,
        loss_streak=streak.loss_streak,
    )


@router.post("/roulette", response_model=GameResponse)
def play_roulette(
    user_id: int = Depends(get_user_from_token),
    db: Session = Depends(get_db),
):
    try:
        balance = token_service.deduct_tokens(user_id, 2, db=db)
    except ValueError:
        raise HTTPException(status_code=402, detail="Insufficient tokens")

    streak = db.query(models.UserStreak).filter(models.UserStreak.user_id == user_id).first()
    if not streak:
        streak = models.UserStreak(user_id=user_id)
        db.add(streak)
        db.flush()

    win_prob = min(0.10 + 0.05 * streak.loss_streak, 0.40)
    if random.random() < win_prob:
        choices = [5, 10, 20, 50]
        weights = [0.5, 0.3, 0.15, 0.05]
        reward = random.choices(choices, weights=weights)[0]
        token_service.add_tokens(user_id, reward, db=db)
        streak.win_streak += 1
        streak.loss_streak = 0
        outcome = "win"
    else:
        reward = None
        streak.loss_streak += 1
        streak.win_streak = 0
        outcome = "lose"

    log = models.GameLog(
        user_id=user_id,
        game_type="roulette",
        result=outcome,
        tokens_spent=2,
        reward_given=str(reward) if reward else None,
    )
    db.add(log)
    db.commit()
    balance = token_service.get_balance(user_id, db=db)
    return GameResponse(
        outcome=outcome,
        reward=reward,
        balance=balance,
        win_probability=win_prob,
        win_streak=streak.win_streak,
        loss_streak=streak.loss_streak,
    )


class GachaResponse(BaseModel):
    type: str
    amount: int | None = None
    stage: int | None = None
    badge_name: str | None = None
    message: str | None = None
    balance: int


@router.post("/gacha", response_model=GachaResponse)
def play_gacha(
    user_id: int = Depends(get_user_from_token),
    db: Session = Depends(get_db),
):
    try:
        token_service.deduct_tokens(user_id, 50, db=db)
    except ValueError:
        raise HTTPException(status_code=402, detail="Insufficient tokens")

    result = spin_gacha(user_id=user_id, db=db)

    log = models.GameLog(
        user_id=user_id,
        game_type="gacha",
        result=result.get("type"),
        tokens_spent=50,
        reward_given=str(result.get("amount") or result.get("stage") or result.get("badge_name")),
    )
    db.add(log)
    db.commit()

    if result.get("type") == "COIN" and result.get("amount"):
        token_service.add_tokens(user_id, int(result["amount"]), db=db)
        db.commit()

    balance = token_service.get_balance(user_id, db=db)
    result["balance"] = balance
    return result
