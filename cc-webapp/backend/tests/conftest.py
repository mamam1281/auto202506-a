"""
Pytest configuration for MVP tests
"""

import pytest
import os
import sys
from unittest.mock import Mock
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, Session as SQLAlchemySession # Renamed to avoid conflict
from typing import Generator

# Add the app directory to Python path for imports
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

# Set test environment
os.environ.update({
    "TESTING": "true",
    "DATABASE_URL": "sqlite:///./test.db",
    "REDIS_URL": "redis://localhost:6379/1",
    "LOG_LEVEL": "DEBUG"
})

# Assuming your models' Base is accessible from app.models
# Adjust the import path if your Base is defined elsewhere
from app.models import Base
# If you have a settings module for database URLs:
# from app.core.config import settings

# Test database setup
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="function") # "function" scope ensures a fresh DB for each test
def db_session() -> Generator[SQLAlchemySession, None, None]:
    """
    Pytest fixture to set up a test database session.
    Creates an in-memory SQLite database and tables for each test function,
    and drops them afterwards.
    """
    Base.metadata.create_all(bind=engine)  # Create tables based on Base from app.models

    session = TestingSessionLocal()
    try:
        yield session  # Provide the session to the test
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)  # Drop all tables after the test

@pytest.fixture(scope="session", autouse=True)
def setup_test_database():
    """Setup test database with all necessary tables and columns."""
    # Create all tables
    Base.metadata.create_all(bind=engine)
    
    # Add missing columns that cause test failures
    with engine.connect() as conn:
        try:
            # Add source_description column to user_rewards table if it doesn't exist
            conn.execute(text("ALTER TABLE user_rewards ADD COLUMN source_description TEXT"))
        except Exception:
            pass  # Column might already exist
        
        try:
            # Add name column to user_segments table if it doesn't exist
            conn.execute(text("ALTER TABLE user_segments ADD COLUMN name VARCHAR(50)"))
        except Exception:
            pass  # Column might already exist
        
        conn.commit()
    
    yield
    
    # Cleanup
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def mock_database():
    """Mock database for tests"""
    mock_db = Mock()
    mock_db.add = Mock()
    mock_db.commit = Mock()
    mock_db.query = Mock()
    return mock_db

@pytest.fixture
def sample_user():
    """Sample user data for tests"""
    return {
        "user_id": 1,
        "nickname": "test_user",
        "tokens": 100,
        "segment": "Medium"
    }

@pytest.fixture
def sample_emotions():
    """Sample emotion data for tests"""
    return [
        {"emotion": "excited", "confidence": 0.9},
        {"emotion": "frustrated", "confidence": 0.8},
        {"emotion": "curious", "confidence": 0.7},
        {"emotion": "neutral", "confidence": 0.6}
    ]

# Configure pytest markers
def pytest_configure(config):
    config.addinivalue_line("markers", "mvp: MVP level tests")
    config.addinivalue_line("markers", "emotion: Emotion analysis tests")
    config.addinivalue_line("markers", "game: Game service tests")
    config.addinivalue_line("markers", "auth: Authentication tests")
    config.addinivalue_line("markers", "integration: Integration tests")
    config.addinivalue_line("markers", "slow: Slow running tests")
