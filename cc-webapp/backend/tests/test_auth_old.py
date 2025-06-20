import pytest
from fastapi.testclient import TestClient
from app.main import app

@pytest.fixture
def client():
    # FIX: app import moved to module level, TestClient(app) as positional argument only
    with TestClient(app) as c:
        yield c

def test_login_success(client):
    response = client.post(
        "/api/auth/login",
        json={"nickname": "testuser", "password": "password", "invite_code": "INVITE"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["access_token"] == "fake-token"
    assert data["token_type"] == "bearer"

def test_login_failure(client):
    response = client.post(
        "/api/auth/login",
        json={"nickname": "bad", "password": "wrong", "invite_code": "INVITE"},
    )
    assert response.status_code == 401
