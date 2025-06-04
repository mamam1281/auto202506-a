from fastapi import APIRouter, WebSocket

from app.websockets.chat import websocket_handler, manager
from app.services.cj_ai_service import CJAIService
from app.services.token_service import redis_client

router = APIRouter()

cj_service = CJAIService(redis_client or {}, manager)


@router.websocket("/ws/chat")
async def chat_ws(websocket: WebSocket) -> None:
    await websocket_handler(websocket, cj_service)
