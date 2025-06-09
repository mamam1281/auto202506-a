"""
Pytest configuration and shared fixtures for emotion analysis tests
"""

import pytest
import os
import asyncio
from unittest.mock import Mock, AsyncMock
from typing import Generator, Dict, Any

# Set test environment variables
os.environ.update({
    "TESTING": "true",
    "DATABASE_URL": "sqlite:///./test.db",
    "REDIS_URL": "redis://localhost:6379/1",
    "SENTIMENT_MODEL_PATH": "/test/models/sentiment_test.bin",
    "EMOTION_CONFIDENCE_THRESHOLD": "0.7",
    "LLM_FALLBACK_ENABLED": "true",
    "RESPONSE_TEMPLATE_COUNT": "50",
    "LOG_LEVEL": "DEBUG"
})

@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for the test session."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

@pytest.fixture
def mock_database_session():
    """Mock database session for testing"""
    mock_session = Mock()
    mock_session.add = Mock()
    mock_session.commit = Mock()
    mock_session.rollback = Mock()
    mock_session.query = Mock()
    mock_session.close = Mock()
    return mock_session

@pytest.fixture
def mock_redis_client():
    """Mock Redis client for testing"""
    mock_redis = Mock()
    mock_redis.get = Mock(return_value=None)
    mock_redis.set = Mock(return_value=True)
    mock_redis.hget = Mock(return_value=None)
    mock_redis.hset = Mock(return_value=True)
    mock_redis.hgetall = Mock(return_value={})
    mock_redis.hincrby = Mock(return_value=1)
    mock_redis.expire = Mock(return_value=True)
    mock_redis.ping = Mock(return_value=True)
    return mock_redis

@pytest.fixture
def sample_emotions() -> Dict[str, Any]:
    """Sample emotion data for testing"""
    return {
        "excited": {
            "emotion": "excited",
            "score": 0.85,
            "confidence": 0.92,
            "language": "korean",
            "keywords": ["대박", "기뻐", "좋아", "와우"]
        },
        "frustrated": {
            "emotion": "frustrated",
            "score": 0.75,
            "confidence": 0.88,
            "language": "korean",
            "keywords": ["짜증", "안돼", "답답", "화나"]
        },
        "curious": {
            "emotion": "curious",
            "score": 0.70,
            "confidence": 0.80,
            "language": "english",
            "keywords": ["what", "how", "why", "curious"]
        }
    }

@pytest.fixture
def sample_user_data() -> Dict[str, Any]:
    """Sample user data for testing"""
    return {
        "user_id": 1,
        "nickname": "test_user",
        "segment": "Medium",
        "tokens": 1000,
        "recent_games": ["slot", "roulette"],
        "win_streak": 3,
        "total_sessions": 50,
        "avg_session_duration": 1800
    }

@pytest.fixture
def sample_game_context() -> Dict[str, Any]:
    """Sample game context for testing"""
    return {
        "game_type": "slot",
        "result": "win",
        "bet_amount": 10,
        "win_amount": 50,
        "consecutive_losses": 0,
        "session_duration": 1200,
        "timestamp": "2025-01-01T10:00:00Z"
    }

@pytest.fixture
def mock_sentiment_model():
    """Mock sentiment analysis model"""
    mock_model = Mock()
    mock_model.predict = Mock(return_value={
        "emotion": "excited",
        "confidence": 0.9,
        "probabilities": {
            "excited": 0.9,
            "frustrated": 0.05,
            "neutral": 0.05
        }
    })
    mock_model.is_loaded = True
    return mock_model

@pytest.fixture
def mock_llm_client():
    """Mock LLM client for fallback testing"""
    mock_llm = AsyncMock()
    mock_llm.generate_response = AsyncMock(return_value={
        "emotion": "excited",
        "confidence": 0.95,
        "reasoning": "User expressed strong positive sentiment",
        "suggested_response": "That's fantastic! Keep up the momentum!"
    })
    mock_llm.is_available = True
    mock_llm.cost_per_request = 0.001
    return mock_llm

@pytest.fixture
def mock_websocket():
    """Mock WebSocket connection for real-time testing"""
    mock_ws = AsyncMock()
    mock_ws.send_text = AsyncMock()
    mock_ws.receive_text = AsyncMock(return_value='{"type": "ping"}')
    mock_ws.close = AsyncMock()
    mock_ws.accept = AsyncMock()
    return mock_ws

@pytest.fixture
def auth_token() -> str:
    """Mock JWT authentication token"""
    return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test_token"

@pytest.fixture
def auth_headers(auth_token) -> Dict[str, str]:
    """Authentication headers for API requests"""
    return {
        "Authorization": f"Bearer {auth_token}",
        "Content-Type": "application/json"
    }

@pytest.fixture(autouse=True)
def cleanup_test_data():
    """Cleanup test data after each test"""
    yield
    # Cleanup logic here
    # For example, clear test database tables, Redis cache, etc.
    pass

@pytest.fixture
def feedback_templates() -> Dict[str, Any]:
    """Sample feedback templates for testing"""
    return {
        "excited_win_medium": {
            "korean": "축하합니다! 이 기세를 몰아 다른 게임도 도전해보세요! 🎉",
            "english": "Congratulations! Ride this momentum and try other games! 🎉",
            "animation": {"type": "celebration", "duration": 3000}
        },
        "frustrated_loss_medium": {
            "korean": "괜찮아요! 게임은 운이 따라야 하는 거예요. 조금 쉬어가는 것도 좋을 것 같아요 😊",
            "english": "It's okay! Games require luck. Maybe take a short break? 😊",
            "animation": {"type": "comfort", "duration": 2000}
        },
        "curious_neutral": {
            "korean": "궁금한 게 있으시군요! 언제든 물어보세요 🤔",
            "english": "You seem curious! Feel free to ask anything 🤔",
            "animation": {"type": "thinking", "duration": 1500}
        }
    }

@pytest.fixture
def recommendation_strategies() -> Dict[str, Any]:
    """Sample recommendation strategies for testing"""
    return {
        "collaborative": {
            "description": "Based on similar users' preferences",
            "confidence_boost": 0.1,
            "suitable_for": ["Whale", "Medium"]
        },
        "content_based": {
            "description": "Based on game features and user history",
            "confidence_boost": 0.05,
            "suitable_for": ["Low", "New"]
        },
        "hybrid": {
            "description": "Combination of collaborative and content-based",
            "confidence_boost": 0.15,
            "suitable_for": ["Whale", "Medium", "VIP"]
        }
    }

# Performance testing fixtures
@pytest.fixture
def performance_test_data():
    """Data for performance testing"""
    return {
        "concurrent_users": 100,
        "max_response_time": 0.5,  # 500ms
        "min_success_rate": 0.95,  # 95%
        "cache_hit_ratio_target": 0.8  # 80%
    }

# Environment-specific fixtures
@pytest.fixture
def test_environment_overrides():
    """Environment variable overrides for testing"""
    return {
        "EMOTION_CONFIDENCE_THRESHOLD": "0.8",
        "LLM_FALLBACK_MODEL": "gpt-3.5-turbo",
        "RECOMMENDATION_CACHE_TTL": "1800",
        "FEEDBACK_TEMPLATE_CACHE_TTL": "3600",
        "MAX_CONCURRENT_ANALYSES": "50"
    }
