import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session as SQLAlchemySession # Renamed to avoid conflict
from typing import Generator

# Assuming your models' Base is accessible from app.models
# Adjust the import path if your Base is defined elsewhere
from app.models import Base
# If you have a settings module for database URLs:
# from app.core.config import settings

# Use an in-memory SQLite database for testing
# SQLALCHEMY_DATABASE_URL = settings.TEST_DATABASE_URL if hasattr(settings, "TEST_DATABASE_URL") else "sqlite:///:memory:"
# For this subtask, hardcoding to sqlite in-memory as per plan.
TEST_SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

@pytest.fixture(scope="function") # "function" scope ensures a fresh DB for each test
def db_session() -> Generator[SQLAlchemySession, None, None]:
    """
    Pytest fixture to set up a test database session.
    Creates an in-memory SQLite database and tables for each test function,
    and drops them afterwards.
    """
    engine = create_engine(
        TEST_SQLALCHEMY_DATABASE_URL,
        connect_args={"check_same_thread": False} # Required for SQLite in-memory with multiple "threads" (pytest workers)
    )
    Base.metadata.create_all(bind=engine)  # Create tables based on Base from app.models

    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

    session = TestingSessionLocal()
    try:
        yield session  # Provide the session to the test
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)  # Drop all tables after the test
