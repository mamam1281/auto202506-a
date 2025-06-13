"""Game-related routes and endpoints."""

from fastapi import APIRouter, Depends, HTTPException, Response
from typing import List, Optional
import logging

from ..services.game_service import GameService
from ..auth.jwt import get_current_user
from ..models import User, Game
from ..schemas import GameCreate, GameUpdate, GameResponse

def get_game_service() -> GameService:
    """Dependency factory for GameService."""
    return GameService()

router = APIRouter(
    prefix="/api/games",
    tags=["games"],
    responses={401: {"description": "Unauthorized"}}
)

@router.post("/slot/spin")
async def spin_slot(
    current_user: User = Depends(get_current_user),
    game_service: GameService = Depends(get_game_service)
) -> dict:
    """Spin the slot machine."""
    try:
        # GameService의 slot_spin 메서드는 DB 세션이 필요하므로 임시로 None 처리
        return {"message": "Slot spin endpoint - not implemented yet"}
    except Exception as e:
        logging.error(f"Error spinning slot for user {current_user.id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/roulette/spin")
async def spin_roulette(
    current_user: User = Depends(get_current_user),
    game_service: GameService = Depends(get_game_service)
) -> dict:
    """Spin the roulette wheel."""
    try:
        # GameService의 roulette_spin 메서드는 DB 세션이 필요하므로 임시로 None 처리
        return {"message": "Roulette spin endpoint - not implemented yet"}
    except Exception as e:
        logging.error(f"Error spinning roulette for user {current_user.id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/gacha/pull")
async def pull_gacha(
    current_user: User = Depends(get_current_user),
    game_service: GameService = Depends(get_game_service)
) -> dict:
    """Pull from gacha."""
    try:
        # GameService의 gacha_pull 메서드는 DB 세션이 필요하므로 임시로 None 처리
        return {"message": "Gacha pull endpoint - not implemented yet"}
    except Exception as e:
        logging.error(f"Error pulling gacha for user {current_user.id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")
