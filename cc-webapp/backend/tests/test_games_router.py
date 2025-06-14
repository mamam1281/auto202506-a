"""Tests for games.py router."""

import pytest
from fastapi.testclient import TestClient
from fastapi import FastAPI, Depends
from unittest.mock import MagicMock, patch
from sqlalchemy.orm import Session

from app.routers.games import router, GameService, get_game_service
from app.services.slot_service import SlotSpinResult
from app.services.roulette_service import RouletteSpinResult
from app.services.gacha_service import GachaPullResult


@pytest.fixture
def app():
    """Create test FastAPI app with games router."""
    app = FastAPI()
    app.include_router(router)
    return app


@pytest.fixture
def client(app):
    """Create test client for FastAPI app."""
    return TestClient(app)


@pytest.fixture
def mock_current_user():
    """Mock the current_user dependency."""
    return {"user_id": 123}


@pytest.fixture
def mock_db():
    """Mock the database session dependency."""
    return MagicMock(spec=Session)


@pytest.fixture
def mock_game_service():
    """Mock the GameService dependency."""
    return MagicMock(spec=GameService)


@pytest.fixture
def app_with_mocks(app, mock_current_user, mock_db, mock_game_service):
    """Set up FastAPI app with all dependencies mocked."""
    
    async def override_get_current_user():
        return mock_current_user
    
    def override_get_db():
        return mock_db
    
    def override_get_game_service():
        return mock_game_service
    
    # Import the actual dependencies
    from app.auth.jwt import get_current_user
    from app.database import get_db
    
    app.dependency_overrides = {
        get_current_user: override_get_current_user,
        get_db: override_get_db,
        get_game_service: override_get_game_service,
    }
    
    return app, mock_current_user, mock_db, mock_game_service


@pytest.fixture
def client_with_mocks(app_with_mocks):
    """Create test client with mocked dependencies."""
    app, *_ = app_with_mocks
    return TestClient(app)


def test_spin_slot_success(client_with_mocks, app_with_mocks):
    """Test successful slot spin."""
    _, _, _, mock_game_service = app_with_mocks
    
    # Setup mock response
    mock_result = MagicMock(spec=SlotSpinResult)
    mock_result.result = "win"
    mock_result.tokens_change = 8
    mock_result.balance = 108
    mock_result.streak = 0
    mock_result.animation = "win"
    
    mock_game_service.slot_spin.return_value = mock_result
    
    # Make request
    response = client_with_mocks.post("/api/games/slot/spin")
    
    # Check response
    assert response.status_code == 200
    data = response.json()
    assert data["result"] == "win"
    assert data["tokens_change"] == 8
    assert data["balance"] == 108
    assert data["streak"] == 0
    assert data["animation"] == "win"
    
    # Verify service was called correctly
    mock_game_service.slot_spin.assert_called_once()


def test_spin_slot_error(client_with_mocks, app_with_mocks):
    """Test slot spin with error."""
    _, _, _, mock_game_service = app_with_mocks
    
    # Setup mock to raise exception
    mock_game_service.slot_spin.side_effect = ValueError("Insufficient tokens")
    
    # Make request
    response = client_with_mocks.post("/api/games/slot/spin")
    
    # Check response
    assert response.status_code == 400
    data = response.json()
    assert data["detail"] == "Insufficient tokens"


def test_spin_slot_server_error(client_with_mocks, app_with_mocks):
    """Test slot spin with server error."""
    _, _, _, mock_game_service = app_with_mocks
    
    # Setup mock to raise exception
    mock_game_service.slot_spin.side_effect = Exception("Database error")
    
    # Make request
    response = client_with_mocks.post("/api/games/slot/spin")
    
    # Check response
    assert response.status_code == 500
    data = response.json()
    assert data["detail"] == "Internal server error"


def test_spin_roulette_success(client_with_mocks, app_with_mocks):
    """Test successful roulette spin."""
    _, _, _, mock_game_service = app_with_mocks
    
    # Setup mock response
    mock_result = MagicMock(spec=RouletteSpinResult)
    mock_result.winning_number = 7
    mock_result.result = "win"
    mock_result.tokens_change = 10
    mock_result.balance = 110
    mock_result.animation = "win"
    
    mock_game_service.roulette_spin.return_value = mock_result
    
    # Make request
    response = client_with_mocks.post(
        "/api/games/roulette/spin", 
        json={"bet_type": "number", "bet_amount": 10, "value": "7"}
    )
    
    # Check response
    assert response.status_code == 200
    data = response.json()
    assert data["winning_number"] == 7
    assert data["result"] == "win"
    assert data["tokens_change"] == 10
    assert data["balance"] == 110
    assert data["animation"] == "win"
    
    # Verify service was called correctly
    mock_game_service.roulette_spin.assert_called_once_with(123, 10, "number", "7", mock_game_service.roulette_spin.call_args[0][4])


def test_spin_roulette_error(client_with_mocks, app_with_mocks):
    """Test roulette spin with error."""
    _, _, _, mock_game_service = app_with_mocks
    
    # Setup mock to raise exception
    mock_game_service.roulette_spin.side_effect = ValueError("Invalid bet type")
    
    # Make request
    response = client_with_mocks.post(
        "/api/games/roulette/spin", 
        json={"bet_type": "invalid", "bet_amount": 10}
    )
    
    # Check response
    assert response.status_code == 400
    data = response.json()
    assert data["detail"] == "Invalid bet type"


def test_pull_gacha_success(client_with_mocks, app_with_mocks):
    """Test successful gacha pull."""
    _, _, _, mock_game_service = app_with_mocks
    
    # Setup mock response
    mock_result = MagicMock(spec=GachaPullResult)
    mock_result.results = [
        {"rarity": "SSR", "item_id": 101, "name": "Legendary Sword"},
        {"rarity": "R", "item_id": 202, "name": "Common Shield"}
    ]
    mock_result.tokens_change = -20
    mock_result.balance = 80
    
    mock_game_service.gacha_pull.return_value = mock_result
    
    # Make request
    response = client_with_mocks.post("/api/games/gacha/pull", json={"count": 2})
    
    # Check response
    assert response.status_code == 200
    data = response.json()
    assert len(data["results"]) == 2
    assert data["results"][0]["rarity"] == "SSR"
    assert data["tokens_change"] == -20
    assert data["balance"] == 80
    
    # Verify service was called correctly
    mock_game_service.gacha_pull.assert_called_once_with(123, 2, mock_game_service.gacha_pull.call_args[0][2])


def test_pull_gacha_error(client_with_mocks, app_with_mocks):
    """Test gacha pull with error."""
    _, _, _, mock_game_service = app_with_mocks
    
    # Setup mock to raise exception
    mock_game_service.gacha_pull.side_effect = ValueError("Invalid count")
    
    # Make request
    response = client_with_mocks.post("/api/games/gacha/pull", json={"count": 0})
    
    # Check response
    assert response.status_code == 400
    data = response.json()
    assert data["detail"] == "Invalid count"


def test_pull_gacha_server_error(client_with_mocks, app_with_mocks):
    """Test gacha pull with server error."""
    _, _, _, mock_game_service = app_with_mocks
    
    # Setup mock to raise exception
    mock_game_service.gacha_pull.side_effect = Exception("Database error")
    
    # Make request
    response = client_with_mocks.post("/api/games/gacha/pull", json={"count": 1})
    
    # Check response
    assert response.status_code == 500
    data = response.json()
    assert data["detail"] == "Internal server error"
