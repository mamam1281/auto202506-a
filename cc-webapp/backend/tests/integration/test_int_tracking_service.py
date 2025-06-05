import pytest
from sqlalchemy.orm import Session
from datetime import datetime, timezone

# Models
from app.models import User, SiteVisit

# Services
from app.services.tracking_service import TrackingService

# --- Service Fixture ---

@pytest.fixture(scope="function")
def tracking_service(db_session: Session) -> TrackingService:
    """Provides a real TrackingService instance using the test DB session."""
    return TrackingService(db=db_session)

# --- Test Data Fixture ---

@pytest.fixture(scope="function")
def test_user_for_tracking(db_session: Session) -> User: # Renamed to avoid fixture collision
    """Creates a test user."""
    user = User(email="trackuser@example.com", nickname="trackuser")
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
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
    assert (datetime.now(timezone.utc) - returned_site_visit.visit_timestamp.replace(tzinfo=timezone.utc)).total_seconds() < 5


    # Assert Database State
    db_site_visit = db_session.query(SiteVisit).filter(SiteVisit.id == returned_site_visit.id).first()

    assert db_site_visit is not None
    assert db_site_visit.id == returned_site_visit.id
    assert db_site_visit.user_id == user.id
    assert db_site_visit.source == test_source
    assert db_site_visit.visit_timestamp == returned_site_visit.visit_timestamp # Timestamps should match
