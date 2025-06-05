import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from typing import Generator

# Assuming Base is defined in models.py and can be imported
# Adjust path if Base is elsewhere (e.g., database.py)
from app.models import Base, User, UserSegment, AdultContent, UserReward
from app.main import app
from app.database import get_db  # Original get_db dependency to override

# --- Test Database Setup ---
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_unlock.db" # In-memory SQLite for tests
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False} # Needed for SQLite
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create tables in the in-memory database before any tests run
# This should ideally run once, but for simplicity here, it's module-level.
# For more robust test separation, consider pytest fixtures for table creation/dropping.
Base.metadata.create_all(bind=engine)


def override_get_db() -> Generator[Session, None, None]:
    """
    Dependency override for FastAPI to use a test database session.
    """
    db = None
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        if db:
            db.close()

# Apply the dependency override to the FastAPI app instance
app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

# --- Fixture for Test Data Setup & Teardown ---
@pytest.fixture(scope="function") # Changed to function scope for cleaner tests
def db_session() -> Generator[Session, None, None]:
    """
    Pytest fixture to provide a database session for each test function
    and handle cleanup.
    """
    # Clean up tables: Delete all data from tables before each test
    # This ensures tests are independent.
    for table in reversed(Base.metadata.sorted_tables):
        engine.execute(table.delete())

    db = TestingSessionLocal()
    try:
        yield db # Provide the session to the test
    finally:
        db.rollback() # Rollback any uncommitted changes after test
        db.close()


# --- Helper function to seed initial data ---
def seed_initial_data(db: Session, user_id: int, rfm_group: str = "Whale", email_suffix: str = ""):
    """
    Seeds initial data for a test user, their segment, and adult content stages.
    """
    # User
    test_user = db.query(User).filter_by(id=user_id).first()
    if not test_user:
        test_user = User(id=user_id, email=f"user{user_id}{email_suffix}@example.com")
        db.add(test_user)

    # UserSegment
    user_segment = db.query(UserSegment).filter_by(user_id=user_id).first()
    if not user_segment:
        user_segment = UserSegment(user_id=user_id, rfm_group=rfm_group, risk_profile="Low-Risk")
        db.add(user_segment)
    else: # Update if exists, useful if fixture scope changes or for re-seeding specific parts
        user_segment.rfm_group = rfm_group
        user_segment.risk_profile = "Low-Risk"


    # AdultContent for stages 1-3 (ensure they are not duplicated if called multiple times)
    stages_data = [
        {"stage": 1, "name": "Stage 1 Content", "thumbnail_url": "s1_thumb.jpg", "media_url": "s1_media.mp4", "required_segment_level": 1},
        {"stage": 2, "name": "Stage 2 Content", "thumbnail_url": "s2_thumb.jpg", "media_url": "s2_media.mp4", "required_segment_level": 2},
        {"stage": 3, "name": "Stage 3 Content", "thumbnail_url": "s3_thumb.jpg", "media_url": "s3_media.mp4", "required_segment_level": 3},
    ]
    for content_data in stages_data:
        content_item = db.query(AdultContent).filter_by(stage=content_data["stage"]).first()
        if not content_item:
            db.add(AdultContent(**content_data))

    try:
        db.commit()
    except Exception as e:
        db.rollback()
        raise e

    # Refresh objects to get their current state from DB (e.g., auto-increment IDs)
    if test_user in db.new or test_user in db.dirty: db.refresh(test_user) # only if added/changed
    if user_segment in db.new or user_segment in db.dirty: db.refresh(user_segment)

    return test_user


# --- Test Cases ---
def test_unlock_stages_sequentially(db_session: Session):
    user = seed_initial_data(db_session, user_id=101, rfm_group="Whale", email_suffix="_seq")

    # 1st Unlock: Stage 1
    response1 = client.get(f"/api/unlock?user_id={user.id}")
    assert response1.status_code == 200, response1.text
    data1 = response1.json()
    assert data1["stage"] == 1
    assert data1["name"] == "Stage 1 Content"
    reward1 = db_session.query(UserReward).filter_by(user_id=user.id, reward_type="CONTENT_UNLOCK", reward_value="1").first()
    assert reward1 is not None

    # 2nd Unlock: Stage 2
    response2 = client.get(f"/api/unlock?user_id={user.id}")
    assert response2.status_code == 200, response2.text
    data2 = response2.json()
    assert data2["stage"] == 2
    assert data2["name"] == "Stage 2 Content"
    reward2 = db_session.query(UserReward).filter_by(user_id=user.id, reward_type="CONTENT_UNLOCK", reward_value="2").first()
    assert reward2 is not None

    # 3rd Unlock: Stage 3
    response3 = client.get(f"/api/unlock?user_id={user.id}")
    assert response3.status_code == 200, response3.text
    data3 = response3.json()
    assert data3["stage"] == 3
    assert data3["name"] == "Stage 3 Content"
    reward3 = db_session.query(UserReward).filter_by(user_id=user.id, reward_type="CONTENT_UNLOCK", reward_value="3").first()
    assert reward3 is not None

    # 4th Attempt: All unlocked
    response4 = client.get(f"/api/unlock?user_id={user.id}")
    assert response4.status_code == 400, response4.text
    assert "All content stages already unlocked" in response4.json()["detail"]


def test_unlock_insufficient_segment(db_session: Session):
    user = seed_initial_data(db_session, user_id=102, rfm_group="Low", email_suffix="_insufficient")

    # Unlock Stage 1 (Low rfm_group (level 1) meets AdultContent stage 1 required_segment_level 1)
    response1 = client.get(f"/api/unlock?user_id={user.id}")
    assert response1.status_code == 200, response1.text
    assert response1.json()["stage"] == 1

    # Attempt Unlock Stage 2 (Low rfm_group (level 1) DOES NOT meet AdultContent stage 2 required_segment_level 2)
    response2 = client.get(f"/api/unlock?user_id={user.id}")
    assert response2.status_code == 403, response2.text
    assert "User current segment level (1) does not meet the required level (2) to unlock content stage 2" in response2.json()["detail"]
    # Note: The exact error message detail was refined based on expected output from the endpoint.


def test_unlock_user_not_found(db_session: Session): # db_session fixture will clean tables
    response = client.get("/api/unlock?user_id=999") # Non-existent user
    assert response.status_code == 404, response.text
    assert "존재하지 않는 사용자" in response.json()["detail"]


def test_unlock_content_stage_not_found(db_session: Session):
    user = seed_initial_data(db_session, user_id=103, rfm_group="Whale", email_suffix="_no_content")

    # Remove stage 2 and 3 content for this test
    db_session.query(AdultContent).filter(AdultContent.stage > 1).delete()
    db_session.commit()

    # Unlock Stage 1 - should succeed
    response1 = client.get(f"/api/unlock?user_id={user.id}")
    assert response1.status_code == 200, response1.text
    assert response1.json()["stage"] == 1

    # Attempt to unlock Stage 2 - should fail as content for stage 2 doesn't exist
    response2 = client.get(f"/api/unlock?user_id={user.id}")
    assert response2.status_code == 404, response2.text # Endpoint should return 404 if specific stage content missing
    assert "Content for stage 2 not found" in response2.json()["detail"]

# To run: pytest cc-webapp/backend/tests/test_unlock.py
# (Ensure __init__.py files are in place in tests/ and app/ subdirectories)
# (Ensure all models are imported or defined for Base.metadata.create_all)
# (Ensure PYTHONPATH is set up if running from a root directory, e.g. `PYTHONPATH=. pytest ...`)
