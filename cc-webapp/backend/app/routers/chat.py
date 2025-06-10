"""WebSocket chat router and message handling."""

from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session

from app.database import get_db
from app.repositories.game_repository import GameRepository
from app.services.cj_ai_service import CJAIService
from app.services.token_service import TokenService
from app.websockets.chat import WebSocketManager

router = APIRouter()
manager = WebSocketManager()


@router.websocket("/ws/chat")
async def websocket_endpoint(
    websocket: WebSocket,
    db: Session = Depends(get_db)
):
    """
    WebSocket endpoint for real-time chat interactions.

    Args:
        websocket (WebSocket): Incoming WebSocket connection
        db (Session): Database session
    """
    await websocket.accept()
    repository = GameRepository()
    token_service = TokenService(db, repository)
    cj_service = CJAIService(token_service, manager)

    try:
        while True:
            data = await websocket.receive_text()
            # Process chat message and generate response
            response = await cj_service.process_chat_message(data)
            await websocket.send_text(response)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
