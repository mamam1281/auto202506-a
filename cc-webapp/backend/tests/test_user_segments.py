from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
import pytest # pytest is not strictly needed for these basic tests but good practice

# Adjust the import path for 'app' if your structure is different.
# This assumes 'app' is the FastAPI instance in backend/app/main.py
from app.main import app
# Import UserSegment for creating mock return values
from app.models import UserSegment

client = TestClient(app)

# Test Case 1: Whale/High-Risk, high streak
# Patch paths should correspond to where 'redis_client' and 'SessionLocal' are LOOKED UP
# in the 'user_segments.py' file.
@patch('app.routers.user_segments.redis_client')
@patch('app.routers.user_segments.SessionLocal')
def test_recommendation_whale_high_risk_high_streak(MockSessionLocal, mock_redis_client_instance):
    # Mock DB session and query
    mock_db_session = MagicMock()
    # Create a UserSegment instance to be returned by the mock query
    mock_user_segment_db_instance = UserSegment(user_id=1, rfm_group="Whale", risk_profile="High-Risk")
    mock_db_session.query(UserSegment).filter().first.return_value = mock_user_segment_db_instance

    # Configure the context manager __enter__ to return the mock_db_session
    MockSessionLocal.return_value.__enter__.return_value = mock_db_session

    # Mock Redis client's .get() method
    # The 'redis_client' in user_segments.py is the actual client instance.
    # If redis_client is None (connection failed), its methods won't be called.
    # Here, we assume redis_client is successfully initialized and is an instance.
    if mock_redis_client_instance is not None: # Check if redis_client itself was mocked (it is)
        mock_redis_client_instance.get.return_value = "10" # 10 day streak
    else:
        # This case implies that redis_client in user_segments.py is None from the start.
        # This test setup might need to ensure redis_client is not None for this path.
        # For simplicity, the patch assumes redis_client is an object we can mock methods on.
        # If testing the "redis_client is None" path, the mock needs to be None.
        pass


    response = client.get("/api/user-segments/1/recommendation")

    assert response.status_code == 200
    data = response.json()
    assert data["user_id"] == 1
    assert data["rfm_group"] == "Whale"
    assert data["risk_profile"] == "High-Risk"
    assert data["streak_count"] == 10
    # Expected: 0.75 (base) + 10 * 0.01 (streak) = 0.85
    assert data["recommended_reward_probability"] == 0.85
    assert data["recommended_time_window"] == "next 2 hours"

# Test Case 2: Medium/Low-Risk, zero streak
@patch('app.routers.user_segments.redis_client')
@patch('app.routers.user_segments.SessionLocal')
def test_recommendation_medium_low_risk_zero_streak(MockSessionLocal, mock_redis_client_instance):
    mock_db_session = MagicMock()
    mock_user_segment_db_instance = UserSegment(user_id=2, rfm_group="Medium", risk_profile="Low-Risk")
    mock_db_session.query(UserSegment).filter().first.return_value = mock_user_segment_db_instance
    MockSessionLocal.return_value.__enter__.return_value = mock_db_session

    if mock_redis_client_instance:
        mock_redis_client_instance.get.return_value = "0"

    response = client.get("/api/user-segments/2/recommendation")
    assert response.status_code == 200
    data = response.json()
    assert data["rfm_group"] == "Medium"
    assert data["risk_profile"] == "Low-Risk"
    assert data["streak_count"] == 0
    # Expected: 0.50 (base) + 0 * 0.01 = 0.50
    assert data["recommended_reward_probability"] == 0.50
    assert data["recommended_time_window"] == "next 6 hours"

# Test Case 3: Low RFM, any risk, no streak in Redis (default to 0)
@patch('app.routers.user_segments.redis_client')
@patch('app.routers.user_segments.SessionLocal')
def test_recommendation_low_rfm_no_streak_in_redis(MockSessionLocal, mock_redis_client_instance):
    mock_db_session = MagicMock()
    mock_user_segment_db_instance = UserSegment(user_id=3, rfm_group="Low", risk_profile="Medium-Risk")
    mock_db_session.query(UserSegment).filter().first.return_value = mock_user_segment_db_instance
    MockSessionLocal.return_value.__enter__.return_value = mock_db_session

    if mock_redis_client_instance:
        mock_redis_client_instance.get.return_value = None # Streak key not found

    response = client.get("/api/user-segments/3/recommendation")
    assert response.status_code == 200
    data = response.json()
    assert data["rfm_group"] == "Low"
    assert data["risk_profile"] == "Medium-Risk" # It takes the risk from DB
    assert data["streak_count"] == 0
    # Expected: 0.25 (base) + 0 * 0.01 = 0.25
    assert data["recommended_reward_probability"] == 0.25
    assert data["recommended_time_window"] == "next 24 hours"

# Test Case 4: User segment not found in DB
@patch('app.routers.user_segments.redis_client')
@patch('app.routers.user_segments.SessionLocal')
def test_recommendation_user_segment_not_found(MockSessionLocal, mock_redis_client_instance):
    mock_db_session = MagicMock()
    mock_db_session.query(UserSegment).filter().first.return_value = None # User segment not found
    MockSessionLocal.return_value.__enter__.return_value = mock_db_session

    if mock_redis_client_instance:
        mock_redis_client_instance.get.return_value = "5" # Some streak

    response = client.get("/api/user-segments/999/recommendation") # Non-existent user
    assert response.status_code == 200 # Endpoint uses defaults, doesn't 404
    data = response.json()
    assert data["rfm_group"] == "Low" # Default
    assert data["risk_profile"] == "Unknown" # Default
    assert data["streak_count"] == 5
    # Expected: 0.25 (base for Low RFM default) + 5 * 0.01 (streak) = 0.30
    assert data["recommended_reward_probability"] == 0.30
    assert data["recommended_time_window"] == "next 24 hours" # For Low RFM default

# Test Case 5: Redis client is None (simulating connection failure at startup)
@patch('app.routers.user_segments.redis_client', None) # Patch redis_client to be None
@patch('app.routers.user_segments.SessionLocal')
def test_recommendation_redis_client_none(MockSessionLocal):
    mock_db_session = MagicMock()
    mock_user_segment_db_instance = UserSegment(user_id=1, rfm_group="Whale", risk_profile="High-Risk")
    mock_db_session.query(UserSegment).filter().first.return_value = mock_user_segment_db_instance
    MockSessionLocal.return_value.__enter__.return_value = mock_db_session

    response = client.get("/api/user-segments/1/recommendation")

    assert response.status_code == 200
    data = response.json()
    assert data["user_id"] == 1
    assert data["rfm_group"] == "Whale"
    assert data["risk_profile"] == "High-Risk"
    assert data["streak_count"] == 0 # Defaults to 0 if redis_client is None
    # Expected: 0.75 (base) + 0 * 0.01 (streak) = 0.75
    assert data["recommended_reward_probability"] == 0.75
    assert data["recommended_time_window"] == "next 2 hours"

# To run these tests using pytest:
# Ensure pytest is installed: pip install pytest
# From the root of the monorepo (e.g., /app directory):
# PYTHONPATH=. pytest cc-webapp/backend/tests/test_user_segments.py
# or if backend is its own package:
# pytest cc-webapp/backend/tests/test_user_segments.py
# (PYTHONPATH might be needed if imports like 'from backend.app.main import app' are used)
