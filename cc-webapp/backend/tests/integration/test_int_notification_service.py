import pytest
from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone
import time # For ensuring distinct created_at times if needed
from unittest.mock import patch  # Added patch import

# Models
from app.models import User, Notification

# Services
from app.services.notification_service import NotificationService

# --- Helper Functions (exported for other test files) ---

def make_timezone_aware(dt):
    """Convert naive datetime to timezone-aware datetime (UTC)."""
    if dt is None:
        return None
    if dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt

def safe_time_diff(dt1, dt2):
    """Safely calculate time difference between two datetimes, handling timezone issues."""
    dt1_aware = make_timezone_aware(dt1)
    dt2_aware = make_timezone_aware(dt2)
    return (dt1_aware - dt2_aware).total_seconds()

def setup_user_tokens_for_integration(user_id: int, token_amount: int = 1000):
    """
    Helper function to set up tokens for a user in integration tests.
    Can be imported by other test files to solve token insufficiency issues.
    
    Usage in other test files:
    from tests.integration.test_int_notification_service import setup_user_tokens_for_integration
    """
    try:
        from app.services.token_service import TokenService
        token_service = TokenService()
        # Try different methods to set tokens based on the actual TokenService implementation
        if hasattr(token_service, 'add_tokens'):
            token_service.add_tokens(user_id, token_amount)
        elif hasattr(token_service, 'set_user_tokens'):
            token_service.set_user_tokens(user_id, token_amount)
        elif hasattr(token_service, 'user_tokens') and isinstance(token_service.user_tokens, dict):
            token_service.user_tokens[user_id] = token_amount
        else:
            # If no known method exists, try to initialize a user_tokens dict
            if not hasattr(token_service, 'user_tokens'):
                token_service.user_tokens = {}
            token_service.user_tokens[user_id] = token_amount
        return True
    except (ImportError, AttributeError) as e:
        print(f"Warning: Could not set up tokens for user {user_id}: {e}")
        return False

# --- Service Fixture ---

@pytest.fixture(scope="function")
def notification_service(db_session: Session) -> NotificationService:
    """Provides a real NotificationService instance using the test DB session."""
    return NotificationService(db=db_session)

# --- Test Data Fixture ---

@pytest.fixture(scope="function")
def test_user_for_notif(db_session: Session) -> User:
    """Creates a test user with sufficient tokens."""
    user = User(email="notifuser@example.com", nickname="notifuser")
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    
    # Add sufficient tokens for integration tests
    setup_user_tokens_for_integration(user.id, 1000)
    
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
    
    # Handle timezone-aware comparison for created_at
    time_diff = safe_time_diff(datetime.now(timezone.utc), db_notification_after_create.created_at)
    assert time_diff < 10, f"Created notification should be recent. Time diff: {time_diff}"

    # Act (Get)
    retrieved_notification = notification_service.get_oldest_pending_notification(user_id=user.id)

    # Assert retrieved object matches
    assert retrieved_notification is not None
    assert retrieved_notification.id == created_notification.id
    assert retrieved_notification.message == test_message
    assert retrieved_notification.is_sent is True # Should be marked as sent by the service method
    assert retrieved_notification.sent_at is not None
    
    # Handle timezone-aware comparison for sent_at
    sent_time_diff = safe_time_diff(datetime.now(timezone.utc), retrieved_notification.sent_at)
    assert sent_time_diff < 10, f"Sent notification should be recent. Time diff: {sent_time_diff}"

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
        # Mock datetime.utcnow() for create_notification - use timezone-aware datetime
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
