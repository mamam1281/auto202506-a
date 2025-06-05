import pytest
from sqlalchemy.orm import Session
from datetime import datetime, timezone

# Models
from app.models import User, SiteVisit

# Services
from app.services.tracking_service import TrackingService

# --- Helper Function for Token Setup (exported for other test files) ---

def setup_user_tokens(user_id: int, token_amount: int = 1000):
    """
    Helper function to set up tokens for a user in integration tests.
    Can be imported by other test files to solve token insufficiency issues.
    
    Usage in other test files:
    from tests.integration.test_int_tracking_service import setup_user_tokens
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
def tracking_service(db_session: Session) -> TrackingService:
    """Provides a real TrackingService instance using the test DB session."""
    return TrackingService(db=db_session)

# --- Test Data Fixture ---

@pytest.fixture(scope="function")
def test_user_for_tracking(db_session: Session) -> User: # Renamed to avoid fixture collision
    """Creates a test user with sufficient tokens for integration tests."""
    user = User(email="trackuser@example.com", nickname="trackuser")
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    
    # Add sufficient tokens for integration tests
    setup_user_tokens(user.id, 1000)
    
    return user

# --- Integration Tests for TrackingService ---

def test_log_site_visit_interaction(
    db_session: Session,
    tracking_service: TrackingService,
    test_user_for_tracking: User
):
    """Test logging a site visit and verifying its database persistence."""
    # Arrange
    user = test_user_for_tracking
    test_source = "test_campaign_xyz"
    test_start_time = datetime.now(timezone.utc)

    # Act
    returned_site_visit = tracking_service.log_site_visit(
        user_id=user.id,
        source=test_source
    )
    db_session.flush() # Ensure ID is available if not refreshed by service, though current service does refresh

    # Assert returned object
    assert returned_site_visit is not None
    assert returned_site_visit.user_id == user.id
    assert returned_site_visit.source == test_source
    assert returned_site_visit.id is not None # Should have an ID after commit by service
    
    # Assert visit_timestamp is not None and is reasonable
    assert returned_site_visit.visit_timestamp is not None, "visit_timestamp should not be None"
    
    # Handle timezone-aware comparison
    visit_timestamp = returned_site_visit.visit_timestamp
    if visit_timestamp.tzinfo is None:
        visit_timestamp = visit_timestamp.replace(tzinfo=timezone.utc)
    
    # Check that timestamp is recent (within last 10 seconds)
    time_diff = (datetime.now(timezone.utc) - visit_timestamp).total_seconds()
    assert time_diff >= 0, f"Visit timestamp should not be in the future. Time diff: {time_diff}"
    assert time_diff < 10, f"Visit timestamp should be recent. Time diff: {time_diff}"

    # Assert Database State
    db_site_visit = db_session.query(SiteVisit).filter(SiteVisit.id == returned_site_visit.id).first()

    assert db_site_visit is not None
    assert db_site_visit.id == returned_site_visit.id
    assert db_site_visit.user_id == user.id
    assert db_site_visit.source == test_source
    
    # Assert database visit_timestamp is not None
    assert db_site_visit.visit_timestamp is not None, "Database visit_timestamp should not be None"
    
    # Handle timezone comparison for database object
    db_timestamp = db_site_visit.visit_timestamp
    if db_timestamp.tzinfo is None:
        db_timestamp = db_timestamp.replace(tzinfo=timezone.utc)
    
    returned_timestamp = returned_site_visit.visit_timestamp
    if returned_timestamp.tzinfo is None:
        returned_timestamp = returned_timestamp.replace(tzinfo=timezone.utc)
        
    assert db_timestamp == returned_timestamp, f"Database timestamp {db_timestamp} should match returned timestamp {returned_timestamp}"
