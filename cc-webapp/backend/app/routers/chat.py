"""WebSocket-based chat implementation with CJ AI service integration."""

from fastapi import APIRouter, WebSocket, Depends, HTTPException
from typing import Dict, Optional
import logging

from ..services.cj_ai_service import CJAIService
from ..auth.jwt import get_current_user
from ..models import User

router = APIRouter(
    prefix="/api/chat",
    tags=["chat"],
    responses={401: {"description": "Unauthorized"}},
)

# In-memory storage for active connections
active_connections: Dict[int, WebSocket] = {}

@router.websocket("/ws/{user_id}")
async def chat_websocket(
    websocket: WebSocket,
    user_id: int,
    cj_service: CJAIService = Depends(),
    current_user: User = Depends(get_current_user)
):
    """WebSocket endpoint for real-time chat."""
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized for this user_id")
        
    try:
        await websocket.accept()
        active_connections[user_id] = websocket
        
        while True:
            data = await websocket.receive_text()
            
            # Process message with CJ AI Service
            response = await cj_service.analyze_and_respond(
                user_id=user_id,
                text=data
            )
            
            await websocket.send_text(response)
            
    except Exception as e:
        logging.error(f"WebSocket error for user {user_id}: {str(e)}")
        
    finally:
        if user_id in active_connections:
            del active_connections[user_id]

@router.get("/status/{user_id}")
async def get_connection_status(
    user_id: int,
    current_user: User = Depends(get_current_user)
) -> dict:
    """Check if user has an active WebSocket connection."""
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized for this user_id")
        
    is_connected = user_id in active_connections
    return {
        "user_id": user_id,
        "connected": is_connected,
        "connection_count": len(active_connections)
    }
