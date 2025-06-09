from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel

from ..database import get_db
from ..services.game_service import GameService

router = APIRouter()
game_service = GameService()


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
    try:
        result = game_service.slot_spin(request.user_id, db)
    except ValueError:
        raise HTTPException(status_code=402, detail="Insufficient tokens")
    return SlotSpinResponse(
        result=result.result,
        tokens_change=result.tokens_change,
        balance=result.balance,
        streak=result.streak,
        animation=result.animation,
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
    try:
        result = game_service.roulette_spin(request.user_id, request.bet_amount, request.bet_type, request.value, db)
    except ValueError:
        raise HTTPException(status_code=402, detail="Insufficient tokens")

    return RouletteSpinResponse(
        winning_number=result.winning_number,
        result=result.result,
        tokens_change=result.tokens_change,
        balance=result.balance,
        animation=result.animation,
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


@router.post("/games/gacha-pull", response_model=GachaPullResponse, tags=["games"])
def gacha_pull(request: GachaPullRequest, db: Session = Depends(get_db)):
    try:
        result = game_service.gacha_pull(request.user_id, request.count, db)
    except ValueError:
        raise HTTPException(status_code=402, detail="Insufficient tokens")

    return GachaPullResponse(
        results=[GachaResult(rarity=r) for r in result.results],
        tokens_change=result.tokens_change,
        balance=result.balance,
    )

