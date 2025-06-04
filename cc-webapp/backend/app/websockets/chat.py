from __future__ import annotations

import json
import os
from datetime import datetime
from jose import jwt, JWTError
from fastapi import WebSocket, WebSocketDisconnect

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "changeme")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")


class ConnectionManager:
    def __init__(self) -> None:
        self.active_connections: dict[int, list[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, user_id: int) -> None:
        await websocket.accept()
        self.active_connections.setdefault(user_id, []).append(websocket)

    def disconnect(self, websocket: WebSocket, user_id: int) -> None:
        conns = self.active_connections.get(user_id, [])
        if websocket in conns:
            conns.remove(websocket)
        if not conns and user_id in self.active_connections:
            del self.active_connections[user_id]

    async def send_personal(self, user_id: int, message: dict) -> None:
        for ws in self.active_connections.get(user_id, []):
            await ws.send_json(message)

    async def broadcast(self, message: dict) -> None:
        for user_id in list(self.active_connections.keys()):
            await self.send_personal(user_id, message)


manager = ConnectionManager()


async def authenticate_websocket(websocket: WebSocket) -> int | None:
    token = websocket.headers.get("Authorization")
    if not token or not token.startswith("Bearer "):
        return None
    token = token.split(" ", 1)[1]
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        return int(payload.get("sub"))
    except JWTError:
        return None


async def websocket_handler(websocket: WebSocket, cj_service) -> None:
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
                continue
            if msg.get("type") == "user_message":
                content = msg.get("content", "")
                response = await cj_service.process_message(user_id, content)
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
