from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
codex/게임-시스템-구현---슬롯머신,-룰렛,-가챠
from typing import List, Optional
import random
import logging
from pydantic import BaseModel

from ..database import get_db
from .. import models
from ..services import token_service

try:
    import redis
except Exception:  # noqa: BLE001
    redis = None

logger = logging.getLogger(__name__)
router = APIRouter()

REDIS_URL = "redis://localhost:6379/0"
redis_client = None
if redis is not None:
    try:
        redis_client = redis.Redis.from_url(REDIS_URL, decode_responses=True)
        redis_client.ping()
    except Exception:  # noqa: BLE001
        logger.warning("Redis unavailable, streaks will be stored in memory")
        redis_client = None

# In-memory fallback for streak counts
streak_cache: dict[int, int] = {}

def _streak_key(user_id: int) -> str:
    return f"user:{user_id}:streak_count"


def get_streak(user_id: int) -> int:
    if redis_client:
        val = redis_client.get(_streak_key(user_id))
        return int(val) if val is not None else 0
    return streak_cache.get(user_id, 0)


def set_streak(user_id: int, value: int) -> None:
    if redis_client:
        redis_client.set(_streak_key(user_id), value)
    else:
        streak_cache[user_id] = value


def get_user_segment(db: Session, user_id: int) -> str:
    seg = db.query(models.UserSegment).filter(models.UserSegment.user_id == user_id).first()
    return seg.rfm_group if seg and seg.rfm_group else "Low"


class SlotSpinRequest(BaseModel):
    user_id: int

class SlotSpinResponse(BaseModel):
    result: str
    tokens_change: int
    balance: int
    streak: int
    animation: Optional[str]


@router.post("/games/slot-spin", response_model=SlotSpinResponse, tags=["games"])
def slot_spin(request: SlotSpinRequest, db: Session = Depends(get_db)):
    user_id = request.user_id
    try:
        token_service.deduct_tokens(user_id, 2, db)
    except ValueError:
        raise HTTPException(status_code=402, detail="Insufficient tokens")

    segment = get_user_segment(db, user_id)
    streak = get_streak(user_id)
    win_prob = 0.10 + min(streak * 0.01, 0.05)
    if segment == "Whale":
        win_prob += 0.02
    elif segment == "Low":
        win_prob -= 0.02
    jackpot_prob = 0.01

    spin = random.random()
    result = "lose"
    reward = 0
    animation = "lose"
    if streak >= 7:
        result = "win"
        reward = 10
        animation = "force_win"
        streak = 0
    elif spin < jackpot_prob:
        result = "jackpot"
        reward = 100
        animation = "jackpot"
        streak = 0
    elif spin < jackpot_prob + win_prob:
        result = "win"
        reward = 10
        animation = "win"
        streak = 0
    else:
        streak += 1

    if reward:
        token_service.add_tokens(user_id, reward, db)

    set_streak(user_id, streak)

    balance = token_service.get_balance(user_id, db)

    action = models.UserAction(user_id=user_id, action_type="SLOT_SPIN", value=-2)
    db.add(action)
    db.commit()

    return SlotSpinResponse(
        result=result,
        tokens_change=reward - 2,
        balance=balance,
        streak=streak,
        animation=animation,
    )


class RouletteSpinRequest(BaseModel):
    user_id: int
    bet_amount: int
    bet_type: str
    value: Optional[str] = None

class RouletteSpinResponse(BaseModel):
    winning_number: int
    result: str
    tokens_change: int
    balance: int
    animation: Optional[str]


@router.post("/games/roulette-spin", response_model=RouletteSpinResponse, tags=["games"])
def roulette_spin(request: RouletteSpinRequest, db: Session = Depends(get_db)):
    user_id = request.user_id
    bet = max(1, min(request.bet_amount, 50))
    try:
        token_service.deduct_tokens(user_id, bet, db)
    except ValueError:
        raise HTTPException(status_code=402, detail="Insufficient tokens")

    segment = get_user_segment(db, user_id)
    edge_map = {"Whale": 0.05, "Medium": 0.10, "Low": 0.15}
    house_edge = edge_map.get(segment, 0.10)

    number = random.randint(0, 36)
    result = "lose"
    payout = 0
    animation = "lose"

    if request.bet_type == "number" and request.value is not None:
        if number == int(request.value):
            payout = int(bet * 35 * (1 - house_edge))
    elif request.bet_type == "color" and request.value in {"red", "black"}:
        color_map = {
            "red": set(range(1, 37, 2)),
            "black": set(range(2, 37, 2)),
        }
        if number != 0 and number in color_map[request.value]:
            payout = int(bet * (1 - house_edge))
    elif request.bet_type == "odd_even" and request.value in {"odd", "even"}:
        if number != 0 and (number % 2 == 0) == (request.value == "even"):
            payout = int(bet * (1 - house_edge))

    if payout:
        result = "win"
        animation = "win"
        token_service.add_tokens(user_id, payout, db)

    balance = token_service.get_balance(user_id, db)

    action = models.UserAction(user_id=user_id, action_type="ROULETTE_SPIN", value=-bet)
    db.add(action)
    db.commit()

    return RouletteSpinResponse(
        winning_number=number,
        result=result,
        tokens_change=payout - bet,
        balance=balance,
        animation=animation,
    )


class GachaPullRequest(BaseModel):
    user_id: int
    count: int = 1

class GachaResult(BaseModel):
    rarity: str

class GachaPullResponse(BaseModel):
    results: List[GachaResult]
    tokens_change: int
    balance: int


RARITY_TABLE = [
    ("Legendary", 0.005),
    ("Epic", 0.045),
    ("Rare", 0.25),
    ("Common", 0.70),
]

def _gacha_count_key(user_id: int) -> str:
    return f"user:{user_id}:gacha_count"

def _gacha_history_key(user_id: int) -> str:
    return f"user:{user_id}:gacha_history"


@router.post("/games/gacha-pull", response_model=GachaPullResponse, tags=["games"])
def gacha_pull(request: GachaPullRequest, db: Session = Depends(get_db)):
    user_id = request.user_id
    pulls = 10 if request.count >= 10 else 1
    cost = 450 if pulls == 10 else 50
    try:
        token_service.deduct_tokens(user_id, cost, db)
    except ValueError:
        raise HTTPException(status_code=402, detail="Insufficient tokens")

    results: List[GachaResult] = []

    count_key = _gacha_count_key(user_id)
    history_key = _gacha_history_key(user_id)
    current_count = int(redis_client.get(count_key) or 0) if redis_client else 0

    history = []
    if redis_client:
        history = redis_client.lrange(history_key, 0, 9)

    for _ in range(pulls):
        current_count += 1
        pity = current_count >= 90
        rnd = random.random()
        cumulative = 0.0
        rarity = "Common"
        for name, prob in RARITY_TABLE:
            adj_prob = prob
            if history and name in history:
                adj_prob *= 0.5
            cumulative += adj_prob
            if rnd <= cumulative:
                rarity = name
                break
        if pity and rarity not in {"Epic", "Legendary"}:
            rarity = "Epic"
            current_count = 0
        results.append(GachaResult(rarity=rarity))
        history.insert(0, rarity)
        history = history[:10]

    if redis_client:
        redis_client.set(count_key, current_count)
        if history:
            redis_client.delete(history_key)
            redis_client.rpush(history_key, *history)

    balance = token_service.get_balance(user_id, db)

    action = models.UserAction(user_id=user_id, action_type="GACHA_PULL", value=-cost)
    db.add(action)
    db.commit()

    return GachaPullResponse(results=results, tokens_change=-cost, balance=balance)

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

