import pytest
from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone
import time # For ensuring distinct created_at times if needed
from unittest.mock import patch  # Added patch import

# Models
from app.models import User, Notification

# Services
from app.services.notification_service import NotificationService

# --- Service Fixture ---

@pytest.fixture(scope="function")
def notification_service(db_session: Session) -> NotificationService:
    """Provides a real NotificationService instance using the test DB session."""
    return NotificationService(db=db_session)

# --- Test Data Fixture ---

@pytest.fixture(scope="function")
def test_user_for_notif(db_session: Session) -> User:
    """Creates a test user."""
    user = User(email="notifuser@example.com", nickname="notifuser")
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user

# --- Integration Tests for NotificationService ---

def test_create_and_get_oldest_pending_notification(
    db_session: Session,
    notification_service: NotificationService,
    test_user_for_notif: User
):
    """Test creating a notification and then retrieving it."""
    # Arrange
    user = test_user_for_notif
    test_message = "Hello, integration test!"

    # Act (Create)
    created_notification = notification_service.create_notification(
        user_id=user.id,
        message=test_message
    )
    db_session.flush() # Ensure ID is available if not refreshed by service, though current service does refresh

    # Assert Database State (after create)
    db_notification_after_create = db_session.query(Notification).filter(Notification.id == created_notification.id).first()

    assert db_notification_after_create is not None
    assert db_notification_after_create.id == created_notification.id
    assert db_notification_after_create.user_id == user.id
    assert db_notification_after_create.message == test_message
    assert db_notification_after_create.is_sent is False
    assert db_notification_after_create.sent_at is None
    assert (datetime.now(timezone.utc) - db_notification_after_create.created_at).total_seconds() < 5

    # Act (Get)
    retrieved_notification = notification_service.get_oldest_pending_notification(user_id=user.id)

    # Assert retrieved object matches
    assert retrieved_notification is not None
    assert retrieved_notification.id == created_notification.id
    assert retrieved_notification.message == test_message
    assert retrieved_notification.is_sent is True # Should be marked as sent by the service method
    assert retrieved_notification.sent_at is not None
    assert (datetime.now(timezone.utc) - retrieved_notification.sent_at).total_seconds() < 5


    # Assert Database State (after get)
    db_session.refresh(db_notification_after_create) # Refresh to get updates made by get_oldest_pending_notification
    assert db_notification_after_create.is_sent is True
    assert db_notification_after_create.sent_at is not None


def test_get_oldest_pending_notification_none_exist(
    notification_service: NotificationService,
    test_user_for_notif: User
):
    """Test retrieving when no pending notifications exist for the user."""
    # Arrange
    user = test_user_for_notif

    # Act
    retrieved_notification = notification_service.get_oldest_pending_notification(user_id=user.id)

    # Assert
    assert retrieved_notification is None


def test_get_oldest_pending_notification_multiple_get_oldest(
    db_session: Session,
    notification_service: NotificationService,
    test_user_for_notif: User
):
    """Test retrieving multiple notifications in correct order."""
    # Arrange
    user = test_user_for_notif
    message1 = "First notification (oldest)"
    message2 = "Second notification (newer)"

    # Create notifications with a slight delay to ensure distinct created_at
    # if model's default is not precise enough or tests run too fast.
    # However, service's create_notification sets created_at=datetime.utcnow()
    # so if calls are distinct, times should be too. Forcing it for robustness:

    with patch('app.services.notification_service.datetime') as mock_dt_create:
        # Mock datetime.utcnow() for create_notification
        mock_dt_create.utcnow.return_value = datetime.now(timezone.utc) - timedelta(seconds=10)
        notif1 = notification_service.create_notification(user_id=user.id, message=message1)

        mock_dt_create.utcnow.return_value = datetime.now(timezone.utc) - timedelta(seconds=5)
        notif2 = notification_service.create_notification(user_id=user.id, message=message2)

    # Act & Assert - First call
    retrieved_notif1 = notification_service.get_oldest_pending_notification(user_id=user.id)
    assert retrieved_notif1 is not None
    assert retrieved_notif1.id == notif1.id
    assert retrieved_notif1.message == message1
    assert retrieved_notif1.is_sent is True

    # Assert DB state for notif1
    db_session.refresh(notif1)
    assert notif1.is_sent is True

    # Act & Assert - Second call
    retrieved_notif2 = notification_service.get_oldest_pending_notification(user_id=user.id)
    assert retrieved_notif2 is not None
    assert retrieved_notif2.id == notif2.id
    assert retrieved_notif2.message == message2
    assert retrieved_notif2.is_sent is True

    # Assert DB state for notif2
    db_session.refresh(notif2)
    assert notif2.is_sent is True

    # Act & Assert - Third call (should be None)
    retrieved_notif3 = notification_service.get_oldest_pending_notification(user_id=user.id)
    assert retrieved_notif3 is None
