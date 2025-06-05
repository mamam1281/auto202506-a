import pytest
from sqlalchemy.orm import Session
from unittest.mock import MagicMock # Still useful for mocking external services like AgeVerification
from datetime import datetime, timedelta, timezone

# Models
from app.models import User, AdultContent, FlashOffer, UserReward

# Services
from app.services.flash_offer_service import FlashOfferService, FlashOfferTrigger
from app.services.reward_service import RewardService
from app.services.token_service import TokenService # Will use a real one for this test
from app.services.age_verification_service import AgeVerificationService
from app.services.adult_content_service import ContentStageEnum # For stage names

# Schemas (mainly for request objects if needed, or response validation)
from app.schemas import FlashOfferPurchaseRequest


# --- Service Fixtures ---

@pytest.fixture(scope="function")
def age_verification_service_mock() -> MagicMock:
    """Mocks AgeVerificationService, typically returning True for is_user_age_verified."""
    mock = MagicMock(spec=AgeVerificationService)
    mock.is_user_age_verified.return_value = True
    return mock

@pytest.fixture(scope="function")
def token_service(db_session: Session) -> TokenService:
    """Provides a real TokenService instance using the test DB session."""
    # TokenService might need db_session if it directly manipulates balances stored in User model
    # or a separate token ledger table. Assuming User model has cyber_token_balance.
    return TokenService(db=db_session)

@pytest.fixture(scope="function")
def reward_service(db_session: Session) -> RewardService:
    """Provides a real RewardService instance using the test DB session."""
    return RewardService(db=db_session)

@pytest.fixture(scope="function")
def flash_offer_service(
    db_session: Session,
    token_service: TokenService,
    age_verification_service_mock: MagicMock,
    reward_service: RewardService
) -> FlashOfferService:
    """Provides a FlashOfferService instance with real DB and some mocked external services."""
    # adult_content_service is passed as a generic mock as it's not used by FlashOfferService directly
    # for price fetching (it uses _get_content_original_price which accesses STAGE_DETAILS directly).
    mock_adult_content_service = MagicMock()
    return FlashOfferService(
        db=db_session,
        token_service=token_service,
        age_verification_service=age_verification_service_mock,
        reward_service=reward_service,
        adult_content_service=mock_adult_content_service
    )

# --- Test Data Setup Fixtures ---

@pytest.fixture(scope="function")
def test_user(db_session: Session) -> User:
    """Creates a test user with an initial token balance."""
    user = User(
        email="testuser@example.com",
        nickname="testnick",
        cyber_token_balance=1000  # Initial balance for tests
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user

@pytest.fixture(scope="function")
def test_adult_content(db_session: Session) -> AdultContent:
    """Creates a test adult content item."""
    content = AdultContent(
        stage=1, # Example stage, ensure this matches usage if any
        name="Test Content Item",
        description="A piece of test content.",
        required_segment_level=1
    )
    db_session.add(content)
    db_session.commit()
    db_session.refresh(content)
    return content

@pytest.fixture(scope="function")
def test_flash_offer(
    db_session: Session, test_user: User, test_adult_content: AdultContent
) -> FlashOffer:
    """Creates a flash offer for the test user and content."""
    offer = FlashOffer(
        user_id=test_user.id,
        content_id=test_adult_content.id,
        original_price=100,  # Corresponds to STAGE_DETAILS['Full']['cost'] if not mocking _get_content_original_price
        discounted_price=50,
        discount_rate=0.5,
        trigger_reason=FlashOfferTrigger.CONTENT_ATTEMPT.value,
        target_stage_name=ContentStageEnum.FULL.value, # Target "Full" stage
        created_at=datetime.now(timezone.utc),
        expires_at=datetime.now(timezone.utc) + timedelta(hours=1),
        is_purchased=False
    )
    db_session.add(offer)
    db_session.commit()
    db_session.refresh(offer)
    return offer


# --- Integration Tests for process_flash_purchase ---

def test_process_flash_purchase_successful(
    db_session: Session,
    flash_offer_service: FlashOfferService,
    token_service: TokenService, # For verifying balance change, or direct user query
    reward_service: RewardService, # For verifying reward creation indirectly via DB query
    test_user: User,
    test_adult_content: AdultContent,
    test_flash_offer: FlashOffer, # The specific offer being purchased
    age_verification_service_mock: MagicMock
):
    """Test successful purchase of a flash offer."""
    # Arrange
    initial_token_balance = test_user.cyber_token_balance
    offer_cost = test_flash_offer.discounted_price

    # Ensure user has enough tokens (adjust if test_user fixture default is too low)
    if initial_token_balance < offer_cost:
        test_user.cyber_token_balance = offer_cost + 100 # Give enough tokens
        db_session.commit()
        db_session.refresh(test_user)
        initial_token_balance = test_user.cyber_token_balance

    age_verification_service_mock.is_user_age_verified.return_value = True

    purchase_request = FlashOfferPurchaseRequest() # Empty for now

    # Act
    response = flash_offer_service.process_flash_purchase(
        user_id=test_user.id,
        offer_id=test_flash_offer.id,
        purchase_request=purchase_request
    )

    # Assert Service Response
    assert response.status == "success"
    assert response.purchased_offer is not None
    assert response.purchased_offer.offer_id == test_flash_offer.id
    assert response.purchased_offer.content_id == test_adult_content.id

    # Assert Database State: FlashOffer
    db_session.refresh(test_flash_offer) # Refresh from DB
    assert test_flash_offer.is_purchased is True
    assert test_flash_offer.purchased_at is not None
    assert (datetime.now(timezone.utc) - test_flash_offer.purchased_at).total_seconds() < 10 # Check recent

    # Assert Database State: UserReward
    user_reward = db_session.query(UserReward).filter(
        UserReward.user_id == test_user.id,
        UserReward.reward_type == "CONTENT_UNLOCK",
        UserReward.reward_value == f"{test_adult_content.id}_{test_flash_offer.target_stage_name}",
        UserReward.source_description == f"Flash offer purchase: ID {test_flash_offer.id}"
    ).first()
    assert user_reward is not None
    assert user_reward.user_id == test_user.id

    # Assert Database State: User Token Balance
    db_session.refresh(test_user) # Refresh user from DB
    assert test_user.cyber_token_balance == initial_token_balance - offer_cost

    # Assert mock calls (if any part remained mocked, e.g. age verification)
    age_verification_service_mock.is_user_age_verified.assert_called_once_with(test_user.id)


def test_process_flash_purchase_insufficient_tokens(
    db_session: Session,
    flash_offer_service: FlashOfferService,
    test_user: User,
    test_flash_offer: FlashOffer,
    age_verification_service_mock: MagicMock
):
    """Test purchase attempt when user has insufficient tokens."""
    # Arrange
    # Set user's token balance to be less than the offer cost
    test_user.cyber_token_balance = test_flash_offer.discounted_price - 10
    if test_user.cyber_token_balance < 0: # Ensure it's not negative if price is low
        test_user.cyber_token_balance = 0
    db_session.commit()
    db_session.refresh(test_user)

    age_verification_service_mock.is_user_age_verified.return_value = True
    purchase_request = FlashOfferPurchaseRequest()

    # Act & Assert
    with pytest.raises(ValueError, match="Insufficient tokens"):
        flash_offer_service.process_flash_purchase(
            user_id=test_user.id,
            offer_id=test_flash_offer.id,
            purchase_request=purchase_request
        )

    # Assert Database State: FlashOffer should not be purchased
    db_session.refresh(test_flash_offer)
    assert test_flash_offer.is_purchased is False
    assert test_flash_offer.purchased_at is None

    # Assert Database State: No UserReward should be created
    user_reward_count = db_session.query(UserReward).filter(UserReward.user_id == test_user.id).count()
    assert user_reward_count == 0

    # Assert Database State: User token balance should be unchanged by this failed attempt
    # (TokenService's deduct_tokens should rollback if it does its own session management,
    # or not commit if it shares the session and an error is raised before main commit)
    # The current TokenService deducts and then the main service commits. If deduct raises, no commit.
    db_session.refresh(test_user) # Refresh to ensure we see the state after any potential rollback
    expected_balance = test_flash_offer.discounted_price - 10
    if expected_balance <0: expected_balance = 0
    assert test_user.cyber_token_balance == expected_balance # Balance remains as it was set for the test
