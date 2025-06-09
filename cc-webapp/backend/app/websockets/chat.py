"""WebSocket chat handler and connection manager."""

from __future__ import annotations

import json
import os
from datetime import datetime
from jose import jwt, JWTError
from fastapi import WebSocket, WebSocketDisconnect
import logging

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "changeme")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")

logger = logging.getLogger(__name__)


class ConnectionManager:
    """Manage active WebSocket connections per user."""

    def __init__(self) -> None:
        self.active_connections: dict[int, list[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, user_id: int) -> None:
        """Accept the WebSocket and track connection."""
        await websocket.accept()
        self.active_connections.setdefault(user_id, []).append(websocket)

    def disconnect(self, websocket: WebSocket, user_id: int) -> None:
        """Remove a WebSocket from tracking."""
        conns = self.active_connections.get(user_id, [])
        if websocket in conns:
            conns.remove(websocket)
        if not conns and user_id in self.active_connections:
            del self.active_connections[user_id]

    async def send_personal(self, user_id: int, message: dict) -> None:
        """Send a message to all sockets of a user."""
        for ws in list(self.active_connections.get(user_id, [])):
            try:
                await ws.send_json(message)
            except Exception as exc:  # noqa: BLE001
                logger.warning("Failed to send message to user %s: %s", user_id, exc)
                self.disconnect(ws, user_id)

    async def broadcast(self, message: dict) -> None:
        """Broadcast a message to every connected user."""
        for user_id in list(self.active_connections.keys()):
            await self.send_personal(user_id, message)


manager = ConnectionManager()


async def authenticate_websocket(websocket: WebSocket) -> int | None:
    """Validate JWT from headers and return user id."""
    token = websocket.headers.get("Authorization")
    if not token or not token.startswith("Bearer "):
        return None
    token = token.split(" ", 1)[1]
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        return int(payload.get("sub"))
    except JWTError as exc:
        logger.warning("WebSocket auth failed: %s", exc)
        return None


async def websocket_handler(websocket: WebSocket, cj_service) -> None:
    """Handle an authenticated WebSocket connection."""
    user_id = await authenticate_websocket(websocket)
    if user_id is None:
        await websocket.close(code=1008)
        return

    await manager.connect(websocket, user_id)
    try:
        while True:
            data = await websocket.receive_text()
            try:
                msg = json.loads(data)
            except json.JSONDecodeError:
                await websocket.send_json({"type": "error", "detail": "invalid_json"})
                continue

            if msg.get("type") != "user_message" or "content" not in msg:
                await websocket.send_json({"type": "error", "detail": "bad_format"})
                continue

            content = msg.get("content", "")
            try:
                response = await cj_service.process_message(user_id, content)
            except Exception as exc:  # noqa: BLE001
                logger.exception("AI service error: %s", exc)
                await websocket.send_json({"type": "error", "detail": "internal"})
                continue

            await manager.send_personal(
                user_id,
                {
                    "type": "ai_response",
                    "content": response,
                    "timestamp": datetime.utcnow().isoformat(),
                },
            )
    except WebSocketDisconnect:
        manager.disconnect(websocket, user_id)
    except Exception as exc:  # noqa: BLE001
        logger.exception("Unexpected error: %s", exc)
        manager.disconnect(websocket, user_id)

