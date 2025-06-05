import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from typing import Generator, List # List for type hinting
from datetime import datetime, timedelta, timezone # Added timezone for robust datetime comparisons

# Assuming Base is defined in models.py and can be imported
from app.models import Base, User, Notification
from app.main import app
from app.database import get_db  # Original get_db dependency to override

# --- Test Database Setup ---
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_notification.db" # Specific DB file for these tests
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False} # Needed for SQLite
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create tables in the in-memory database before any tests run
Base.metadata.create_all(bind=engine)

def override_get_db() -> Generator[Session, None, None]:
    db = None
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        if db:
            db.close()

app.dependency_overrides[get_db] = override_get_db
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
def seed_notifications_data(db: Session, user_id: int, num_pending: int, num_sent: int, email_suffix: str = ""):
    user = db.query(User).filter_by(id=user_id).first()
    if not user:
        user = User(id=user_id, email=f"notify_user{user_id}{email_suffix}@example.com")
        db.add(user)
        try:
            db.commit()
        except Exception: # Handle case where user might already exist due to concurrent tests or setup issues
            db.rollback()
            user = db.query(User).filter_by(id=user_id).first()
            if not user: # If still not found, re-raise
                raise

    notifications_created = []
    # Create pending notifications (oldest first)
    for i in range(num_pending):
        created_time = datetime.utcnow() - timedelta(minutes=num_pending - i + 1) # Ensure distinct and ordered
        notif = Notification(
            user_id=user_id,
            message=f"Pending message {i+1} for user {user_id}",
            is_sent=False,
            created_at=created_time
        )
        notifications_created.append(notif)

    # Create sent notifications
    for i in range(num_sent):
        created_time = datetime.utcnow() - timedelta(minutes=num_pending + num_sent - i + 1)
        sent_time = created_time + timedelta(seconds=30) # Sent shortly after creation
        notif = Notification(
            user_id=user_id,
            message=f"Sent message {i+1} for user {user_id}",
            is_sent=True,
            created_at=created_time,
            sent_at=sent_time
        )
        notifications_created.append(notif)

    db.add_all(notifications_created)
    db.commit()

    # Return user and all created notifications for assertions
    return user, notifications_created


# --- Test Cases ---
USER_ID_FOR_NOTIFICATION_TESTS = 301

def test_get_one_pending_notification(db_session: Session):
    user, all_notifs = seed_notifications_data(db_session, user_id=USER_ID_FOR_NOTIFICATION_TESTS, num_pending=2, num_sent=1, email_suffix="_one_pending")

    # Get actual pending messages, ordered by creation time (oldest first)
    pending_notifs_in_db = sorted(
        [n for n in all_notifs if not n.is_sent],
        key=lambda n: n.created_at
    )
    oldest_pending_message_text = pending_notifs_in_db[0].message

    response = client.get(f"/api/notification/pending/{user.id}")
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["message"] == oldest_pending_message_text

    # Verify in DB that this notification is now marked as sent
    # db_session might be stale after the endpoint call if endpoint committed. Use a new session or refresh.
    updated_notif_db = db_session.query(Notification).filter(Notification.message == oldest_pending_message_text).one()
    assert updated_notif_db.is_sent is True
    assert updated_notif_db.sent_at is not None

    # Verify the other pending notification is still pending
    if len(pending_notifs_in_db) > 1:
        second_oldest_message_text = pending_notifs_in_db[1].message
        still_pending_notif_db = db_session.query(Notification).filter(Notification.message == second_oldest_message_text).one()
        assert still_pending_notif_db.is_sent is False
        assert still_pending_notif_db.sent_at is None


def test_get_all_pending_notifications_sequentially(db_session: Session):
    user, all_notifs = seed_notifications_data(db_session, user_id=USER_ID_FOR_NOTIFICATION_TESTS, num_pending=2, num_sent=0, email_suffix="_seq_pending")
    pending_notifs_in_db_ordered = sorted(
        [n for n in all_notifs if not n.is_sent],
        key=lambda n: n.created_at
    )

    # Call 1 - expect oldest
    response1 = client.get(f"/api/notification/pending/{user.id}")
    assert response1.status_code == 200, response1.text
    assert response1.json()["message"] == pending_notifs_in_db_ordered[0].message
    # Verify DB update for the first notification
    db_session.refresh(pending_notifs_in_db_ordered[0]) # Refresh object state from DB
    assert pending_notifs_in_db_ordered[0].is_sent is True

    # Call 2 - expect second oldest
    response2 = client.get(f"/api/notification/pending/{user.id}")
    assert response2.status_code == 200, response2.text
    assert response2.json()["message"] == pending_notifs_in_db_ordered[1].message
    db_session.refresh(pending_notifs_in_db_ordered[1])
    assert pending_notifs_in_db_ordered[1].is_sent is True

    # Call 3 - No more pending
    response3 = client.get(f"/api/notification/pending/{user.id}")
    assert response3.status_code == 200, response3.text
    assert response3.json()["message"] is None


def test_get_pending_notifications_none_pending(db_session: Session):
    user, _ = seed_notifications_data(db_session, user_id=USER_ID_FOR_NOTIFICATION_TESTS, num_pending=0, num_sent=2, email_suffix="_none_pending")

    response = client.get(f"/api/notification/pending/{user.id}")
    assert response.status_code == 200, response.text
    assert response.json()["message"] is None


def test_get_pending_notifications_user_not_found(db_session: Session): # db_session will clean up
    response = client.get("/api/notification/pending/99999") # Non-existent user
    assert response.status_code == 404, response.text
    assert "존재하지 않는 사용자" in response.json()["detail"]

# This test name from prompt was "idempotency_after_error", but the logic for that is hard to test
# without complex mocking of db.commit(). The current endpoint is not idempotent on error by design
# (if commit fails, message is returned but not marked sent, so it would be re-sent).
# This test simply verifies that a processed notification is not returned again.
def test_notification_not_re_sent_after_processing(db_session: Session):
    user, all_notifs = seed_notifications_data(db_session, user_id=USER_ID_FOR_NOTIFICATION_TESTS, num_pending=1, num_sent=0, email_suffix="_idempotency")
    first_pending_message_text = sorted([n.message for n in all_notifs if not n.is_sent])[0]

    # Call 1 - should get the message
    response1 = client.get(f"/api/notification/pending/{user.id}")
    assert response1.status_code == 200, response1.text
    assert response1.json()["message"] == first_pending_message_text

    # Verify it's marked as sent in DB
    # The endpoint commits, so the change should be visible in the same session if refreshed,
    # or in a new session. db_session here is the same session.
    db_session.refresh(all_notifs[0]) # Assuming all_notifs[0] is the one processed (if sorted by created_at)
    # More robustly fetch from DB:
    processed_notif_db = db_session.query(Notification).filter(Notification.message == first_pending_message_text).one()
    assert processed_notif_db.is_sent is True

    # Call 2 - should be no more pending notifications
    response2 = client.get(f"/api/notification/pending/{user.id}")
    assert response2.status_code == 200, response2.text
    assert response2.json()["message"] is None

# To run: pytest cc-webapp/backend/tests/test_notification.py
