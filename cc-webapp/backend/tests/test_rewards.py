import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from typing import Generator, List # List for type hinting
from datetime import datetime, timedelta, timezone # Added timezone

# Assuming Base is defined in models.py and can be imported
from app.models import Base, User, UserReward
from app.main import app
from app.database import get_db  # Original get_db dependency to override

# --- Test Database Setup ---
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_rewards.db" # In-memory SQLite for tests
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False} # Needed for SQLite
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Drop and recreate tables to ensure schema is up to date
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

def override_get_db() -> Generator[Session, None, None]:
    db = None
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        if db:
            db.close()

@pytest.fixture(autouse=True)
def override_dependency() -> Generator[None, None, None]:
    original = app.dependency_overrides.copy()
    app.dependency_overrides[get_db] = override_get_db
    yield
    app.dependency_overrides = original

client = TestClient(app)

# --- Fixture for Test Data Setup & Teardown ---
@pytest.fixture(scope="function")
def db_session() -> Generator[Session, None, None]:
    db = TestingSessionLocal()
    try:
        # Clean up tables: Delete all data from tables before each test
        for table in reversed(Base.metadata.sorted_tables):
            db.execute(table.delete())
        db.commit() # Commit the delete operations
        yield db # Provide the session to the test
    finally:
        db.rollback() # Rollback any uncommitted changes during the test
        db.close()

# --- Helper function to seed initial data ---
def seed_rewards_data(db: Session, user_id: int, num_rewards: int, email_suffix: str = "") -> List[UserReward]:
    user = db.query(User).filter_by(id=user_id).first()
    if not user:
        user = User(id=user_id, email=f"rewards_user{user_id}{email_suffix}@example.com")
        db.add(user)
        # Must commit user if it's new before adding rewards that reference it,
        # or ensure user_id in UserReward is just an int and FK is handled by DB.
        # For SQLite in-memory, committing is safer.
        try:
            db.commit()
            db.refresh(user)
        except Exception as e: # Catch potential integrity errors if user somehow exists from parallel test
            db.rollback()
            user = db.query(User).filter_by(id=user_id).first() # Try to re-fetch
            if not user: raise e # Re-raise if still not found


    rewards = []
    for i in range(num_rewards):
        # Ensure awarded_at is timezone-aware if comparing with timezone-aware datetimes from DB/Pydantic
        # For simplicity, using naive datetime.utcnow() as models also use it.
        reward_time = datetime.utcnow() - timedelta(hours=num_rewards - i)
        reward = UserReward(
            user_id=user_id,
            reward_type="COIN",
            reward_value=str(10 + i), # Example: "10", "11", ...
            awarded_at=reward_time
        )
        rewards.append(reward)
    db.add_all(rewards)
    db.commit()

    # Sort rewards by awarded_at descending to match endpoint's default order for easy comparison in tests
    rewards.sort(key=lambda r: r.awarded_at, reverse=True)
    return rewards


# --- Test Cases ---
USER_ID_FOR_REWARDS_TESTS = 201 # Define a constant for user ID

def test_get_rewards_first_page(db_session: Session):
    seeded_rewards = seed_rewards_data(db_session, user_id=USER_ID_FOR_REWARDS_TESTS, num_rewards=25, email_suffix="_pg1")

    response = client.get(f"/api/users/{USER_ID_FOR_REWARDS_TESTS}/rewards?page=1&page_size=10")
    assert response.status_code == 200, response.text
    data = response.json()

    assert len(data["rewards"]) == 10
    assert data["page"] == 1
    assert data["page_size"] == 10
    assert data["total_rewards"] == 25
    assert data["total_pages"] == 3
    assert data["rewards"][0]["reward_id"] == seeded_rewards[0].id
    assert data["rewards"][0]["reward_value"] == seeded_rewards[0].reward_value
    # Ensure datetime string format matches (Pydantic V1/V2 might differ slightly)
    # FastAPI/Pydantic usually converts datetime to ISO 8601 string.
    assert datetime.fromisoformat(data["rewards"][0]["awarded_at"].replace("Z", "+00:00")) == \
           seeded_rewards[0].awarded_at.replace(tzinfo=timezone.utc)


def test_get_rewards_second_page(db_session: Session):
    seeded_rewards = seed_rewards_data(db_session, user_id=USER_ID_FOR_REWARDS_TESTS, num_rewards=25, email_suffix="_pg2")

    response = client.get(f"/api/users/{USER_ID_FOR_REWARDS_TESTS}/rewards?page=2&page_size=10")
    assert response.status_code == 200, response.text
    data = response.json()

    assert len(data["rewards"]) == 10
    assert data["page"] == 2
    assert data["total_rewards"] == 25
    assert data["total_pages"] == 3
    assert data["rewards"][0]["reward_id"] == seeded_rewards[10].id # 11th item is at index 10

def test_get_rewards_last_page_partial(db_session: Session):
    seed_rewards_data(db_session, user_id=USER_ID_FOR_REWARDS_TESTS, num_rewards=25, email_suffix="_pg_partial")

    response = client.get(f"/api/users/{USER_ID_FOR_REWARDS_TESTS}/rewards?page=3&page_size=10")
    assert response.status_code == 200, response.text
    data = response.json()

    assert len(data["rewards"]) == 5
    assert data["page"] == 3
    assert data["total_rewards"] == 25
    assert data["total_pages"] == 3

def test_get_rewards_page_out_of_bounds(db_session: Session):
    seed_rewards_data(db_session, user_id=USER_ID_FOR_REWARDS_TESTS, num_rewards=25, email_suffix="_pg_oob")

    response = client.get(f"/api/users/{USER_ID_FOR_REWARDS_TESTS}/rewards?page=4&page_size=10")
    assert response.status_code == 404, response.text # As per endpoint logic for page > total_pages
    assert "Page not found" in response.json()["detail"]

def test_get_rewards_no_rewards(db_session: Session):
    # Ensure user exists but has no rewards
    user = User(id=USER_ID_FOR_REWARDS_TESTS, email=f"rewards_user{USER_ID_FOR_REWARDS_TESTS}_norewards@example.com")
    db_session.add(user)
    db_session.commit()

    response = client.get(f"/api/users/{USER_ID_FOR_REWARDS_TESTS}/rewards")
    assert response.status_code == 200, response.text
    data = response.json()
    assert len(data["rewards"]) == 0
    assert data["total_rewards"] == 0
    assert data["page"] == 1
    assert data["total_pages"] == 0 # (0 + 20 - 1) // 20 = 0 for 0 items

def test_get_rewards_user_not_found(db_session: Session): # db_session cleans up
    response = client.get("/api/users/9999/rewards") # Non-existent user
    assert response.status_code == 404, response.text
    assert "존재하지 않는 사용자" in response.json()["detail"]

def test_get_rewards_default_pagination(db_session: Session):
    seed_rewards_data(db_session, user_id=USER_ID_FOR_REWARDS_TESTS, num_rewards=25, email_suffix="_pg_default")

    response = client.get(f"/api/users/{USER_ID_FOR_REWARDS_TESTS}/rewards") # No page/page_size params
    assert response.status_code == 200, response.text
    data = response.json()

    assert data["page"] == 1
    assert data["page_size"] == 20 # Default page_size in endpoint
    assert len(data["rewards"]) == 20
    assert data["total_rewards"] == 25
    assert data["total_pages"] == 2 # ceil(25/20) = 2
# To run: pytest cc-webapp/backend/tests/test_rewards.py
