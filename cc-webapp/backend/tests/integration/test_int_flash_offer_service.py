import pytest
from sqlalchemy.orm import Session
from datetime import datetime, timezone, timedelta

# Models
from app.models import User, FlashOffer, AdultContent

# Services
from app.services.flash_offer_service import FlashOfferService, FlashOfferTrigger
from app.services.token_service import TokenService
from app.services.age_verification_service import AgeVerificationService
from app.services.reward_service import RewardService
from app.services.adult_content_service import AdultContentService, ContentStageEnum

# Import token setup helper
from tests.integration.test_int_notification_service import setup_user_tokens_for_integration

# --- Service Fixtures ---

@pytest.fixture(scope="function")
def token_service() -> TokenService:
    """Provides a TokenService instance."""
    return TokenService()

@pytest.fixture(scope="function")
def age_verification_service(db_session: Session) -> AgeVerificationService:
    """Provides an AgeVerificationService instance."""
    return AgeVerificationService(db=db_session)

@pytest.fixture(scope="function")
def reward_service(db_session: Session) -> RewardService:
    """Provides a RewardService instance."""
    return RewardService(db=db_session)

@pytest.fixture(scope="function")
def adult_content_service(
    db_session: Session,
    token_service: TokenService,
    age_verification_service: AgeVerificationService,
    reward_service: RewardService
) -> AdultContentService:
    """Provides an AdultContentService instance."""
    return AdultContentService(
        db=db_session,
        token_service=token_service,
        age_verification_service=age_verification_service,
        reward_service=reward_service
    )

@pytest.fixture(scope="function")
def flash_offer_service(
    db_session: Session,
    token_service: TokenService,
    age_verification_service: AgeVerificationService,
    reward_service: RewardService,
    adult_content_service: AdultContentService
) -> FlashOfferService:
    """Provides a real FlashOfferService instance using the test DB session."""
    return FlashOfferService(
        db=db_session,
        token_service=token_service,
        age_verification_service=age_verification_service,
        reward_service=reward_service,
        adult_content_service=adult_content_service
    )

# --- Test Data Fixtures ---

@pytest.fixture(scope="function")
def test_user_for_flash_offer(db_session: Session, age_verification_service: AgeVerificationService) -> User:
    """Creates a test user with sufficient tokens and age verification for integration tests."""
    user = User(email="flashuser@example.com", nickname="flashuser")
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    
    # Add sufficient tokens for integration tests (more tokens for flash offers)
    setup_user_tokens_for_integration(user.id, 2000)
    
    # Add age verification for the user
    from app.schemas import AgeVerificationRequest
    verification_request = AgeVerificationRequest(
        method="phone",  # Phone method sets is_valid to True
        verification_data={"phone_number": "+1234567890"}
    )
    age_verification_service.record_verification(user.id, verification_request)
    
    return user

@pytest.fixture(scope="function")
def test_adult_content_for_flash(db_session: Session) -> AdultContent:
    """Creates test adult content for flash offers."""
    content = AdultContent(
        name="Flash Test Content",
        stage=1,
        thumbnail_url="flash_test.jpg",
        media_url="flash_test.mp4",
        required_segment_level=1
    )
    db_session.add(content)
    db_session.commit()
    db_session.refresh(content)
    return content

# --- Integration Tests for FlashOfferService ---

def test_process_flash_purchase_successful(
    db_session: Session,
    flash_offer_service: FlashOfferService,
    test_user_for_flash_offer: User,
    test_adult_content_for_flash: AdultContent
):
    """Test successful flash offer purchase."""
    # Arrange
    user = test_user_for_flash_offer
    content = test_adult_content_for_flash
    
    # Create a flash offer first
    offer = FlashOffer(
        user_id=user.id,
        content_id=content.id,
        target_stage_name=ContentStageEnum.FULL.value,
        original_price=1000,
        discounted_price=700,
        discount_rate=0.3,
        trigger_reason=FlashOfferTrigger.GAME_FAILURE.value,
        is_purchased=False,
        expires_at=datetime.now(timezone.utc) + timedelta(hours=1)
    )
    db_session.add(offer)
    db_session.commit()
    db_session.refresh(offer)
    
    # Act
    from app.schemas import FlashOfferPurchaseRequest
    purchase_request = FlashOfferPurchaseRequest(offer_id=offer.id)
    
    result = flash_offer_service.process_flash_purchase(
        user_id=user.id,
        offer_id=offer.id,
        purchase_request=purchase_request
    )
    
    # Assert
    assert result is not None
    assert result.status == "success"
    
    # Verify offer is marked as purchased
    db_session.refresh(offer)
    assert offer.is_purchased is True
    assert offer.purchased_at is not None

def test_create_flash_offer_integration(
    db_session: Session,
    flash_offer_service: FlashOfferService,
    test_user_for_flash_offer: User,
    test_adult_content_for_flash: AdultContent
):
    """Test creating a flash offer."""
    # Arrange
    user = test_user_for_flash_offer
    content = test_adult_content_for_flash
    
    # Act
    result = flash_offer_service.create_flash_offer(
        user_id=user.id,
        content_id=content.id,
        trigger_reason=FlashOfferTrigger.GAME_FAILURE,
        target_stage=ContentStageEnum.FULL
    )
    
    # Assert
    assert result is not None
    assert result.content_id == content.id
    assert result.target_stage_name == ContentStageEnum.FULL.value
    assert result.original_price > 0
    assert result.discounted_price < result.original_price
