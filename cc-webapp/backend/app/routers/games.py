"""Game-related routes and endpoints."""

from fastapi import APIRouter, Depends, HTTPException, Response
from typing import List, Optional
import logging

from ..services.game_service import GameService
from ..auth.jwt import get_current_user
from ..models import User, Game
from ..schemas import GameCreate, GameUpdate, GameResponse

router = APIRouter(
    prefix="/api/games",
    tags=["games"],
    responses={401: {"description": "Unauthorized"}}
)

@router.get("/", response_model=List[GameResponse])
async def list_games(
    skip: int = 0,
    limit: int = 10,
    current_user: User = Depends(get_current_user),
    game_service: GameService = Depends()
) -> List[GameResponse]:
    """List available games with pagination."""
    try:
        games = game_service.get_games(skip=skip, limit=limit)
        return [GameResponse.from_orm(game) for game in games]
    except Exception as e:
        logging.error(f"Error listing games: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/{game_id}", response_model=GameResponse)
async def get_game(
    game_id: int,
    current_user: User = Depends(get_current_user),
    game_service: GameService = Depends()
) -> GameResponse:
    """Get specific game details."""
    try:
        game = game_service.get_game_by_id(game_id)
        if not game:
            raise HTTPException(status_code=404, detail="Game not found")
        return GameResponse.from_orm(game)
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error fetching game {game_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/play/{game_id}")
async def play_game(
    game_id: int,
    bet_amount: Optional[int] = None,
    current_user: User = Depends(get_current_user),
    game_service: GameService = Depends()
) -> dict:
    """Play a game with optional betting."""
    try:
        result = game_service.play_game(
            user_id=current_user.id,
            game_id=game_id,
            bet_amount=bet_amount
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logging.error(f"Error playing game {game_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/history/{user_id}", response_model=List[dict])
async def get_game_history(
    user_id: int,
    skip: int = 0,
    limit: int = 10,
    current_user: User = Depends(get_current_user),
    game_service: GameService = Depends()
) -> List[dict]:
    """Get user's game history."""
    if current_user.id != user_id:
        raise HTTPException(
            status_code=403,
            detail="Not authorized to view this user's history"
        )
    
    try:
        history = game_service.get_user_game_history(
            user_id=user_id,
            skip=skip,
            limit=limit
        )
        return history
    except Exception as e:
        logging.error(f"Error fetching game history for user {user_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/stats/{game_id}")
async def get_game_stats(
    game_id: int,
    current_user: User = Depends(get_current_user),
    game_service: GameService = Depends()
) -> dict:
    """Get game statistics."""
    try:
        stats = game_service.get_game_stats(game_id)
        if not stats:
            raise HTTPException(status_code=404, detail="Game stats not found")
        return stats
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error fetching game stats for {game_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")
