from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_login_success():
    response = client.post(
        "/api/auth/login",
        json={"nickname": "testuser", "password": "password", "invite_code": "INVITE"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["access_token"] == "fake-token"
    assert data["token_type"] == "bearer"


def test_login_failure():
    response = client.post(
        "/api/auth/login",
        json={"nickname": "bad", "password": "wrong", "invite_code": "INVITE"},
    )
    assert response.status_code == 401
