import pytest
from fastapi.testclient import TestClient
from jose import jwt
from unittest.mock import AsyncMock

from app.main import app
from app.websockets import chat
from app.routers import chat as chat_router

client = TestClient(app)


def create_token(user_id: int) -> str:
    return jwt.encode({"sub": str(user_id)}, chat.JWT_SECRET_KEY, algorithm=chat.JWT_ALGORITHM)


@pytest.fixture(autouse=True)
def patch_service(monkeypatch):
    mock_service = AsyncMock()
    mock_service.process_message.return_value = "hello"
    monkeypatch.setattr(chat_router, "cj_service", mock_service)
    yield mock_service


def test_chat_websocket_success(patch_service):
    token = create_token(1)
    with client.websocket_connect("/ws/chat", headers={"Authorization": f"Bearer {token}"}) as ws:
        ws.send_json({"type": "user_message", "content": "hi"})
        data = ws.receive_json()
        assert data["type"] == "ai_response"
        assert data["content"] == "hello"


def test_chat_websocket_invalid_token():
    with pytest.raises(Exception):
        with client.websocket_connect("/ws/chat", headers={"Authorization": "Bearer bad"}):
            pass


def test_chat_websocket_bad_message(patch_service):
    token = create_token(2)
    with client.websocket_connect("/ws/chat", headers={"Authorization": f"Bearer {token}"}) as ws:
        ws.send_text("notjson")
        data = ws.receive_json()
        assert data["type"] == "error"
        assert data["detail"] == "invalid_json"

