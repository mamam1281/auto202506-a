"""Game-related routes and endpoints."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
import logging
from pydantic import BaseModel

from ..services.game_service import GameService
from ..auth.jwt import get_current_user
from ..models import User
from ..database import get_db


def get_game_service() -> GameService:
    """Dependency factory for GameService."""
    return GameService()


router = APIRouter(
    prefix="/api/games",
    tags=["games"],
    responses={401: {"description": "Unauthorized"}},
)


class RouletteSpinRequest(BaseModel):
    bet_type: str
    bet_amount: int
    value: Optional[str] = None


class GachaPullRequest(BaseModel):
    count: int = 1


@router.post("/slot/spin")
async def spin_slot(
    current_user: User = Depends(get_current_user),
    game_service: GameService = Depends(get_game_service),
    db: Session = Depends(get_db),
) -> dict:
    """Spin the slot machine."""
    try:
        user_id = getattr(current_user, "user_id", None)
        if user_id is None and isinstance(current_user, dict):
            user_id = current_user.get("user_id")
        result = game_service.slot_spin(int(user_id), db)
        return {
            "result": result.result,
            "tokens_change": result.tokens_change,
            "balance": result.balance,
            "streak": result.streak,
            "animation": result.animation,
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:  # noqa: BLE001
        logging.error("Slot spin error for user %s: %s", current_user, e)
        raise HTTPException(status_code=500, detail="Internal server error")


@router.post("/roulette/spin")
async def spin_roulette(
    request: RouletteSpinRequest,
    current_user: User = Depends(get_current_user),
    game_service: GameService = Depends(get_game_service),
    db: Session = Depends(get_db),
) -> dict:
    """Spin the roulette wheel."""
    try:
        user_id = getattr(current_user, "user_id", None)
        if user_id is None and isinstance(current_user, dict):
            user_id = current_user.get("user_id")
        result = game_service.roulette_spin(
            int(user_id),
            request.bet_amount,
            request.bet_type,
            request.value,
            db,
        )
        return {
            "winning_number": result.winning_number,
            "result": result.result,
            "tokens_change": result.tokens_change,
            "balance": result.balance,
            "animation": result.animation,
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:  # noqa: BLE001
        logging.error("Roulette spin error for user %s: %s", current_user, e)
        raise HTTPException(status_code=500, detail="Internal server error")


@router.post("/gacha/pull")
async def pull_gacha(
    request: GachaPullRequest,
    current_user: User = Depends(get_current_user),
    game_service: GameService = Depends(get_game_service),
    db: Session = Depends(get_db),
) -> dict:
    """Pull from gacha."""
    try:
        user_id = getattr(current_user, "user_id", None)
        if user_id is None and isinstance(current_user, dict):
            user_id = current_user.get("user_id")
        result = game_service.gacha_pull(int(user_id), request.count, db)
        return {
            "results": result.results,
            "tokens_change": result.tokens_change,
            "balance": result.balance,
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:  # noqa: BLE001
        logging.error("Gacha pull error for user %s: %s", current_user, e)
        raise HTTPException(status_code=500, detail="Internal server error")
