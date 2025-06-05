import pytest
from sqlalchemy.orm import Session
from unittest.mock import MagicMock, patch # For mocking helper methods within AdultContentService
from datetime import datetime, timezone

# Models
from app.models import User, AdultContent, UserReward, UserSegment

# Services
from app.services.adult_content_service import AdultContentService, ContentStageEnum, STAGE_DETAILS
from app.services.reward_service import RewardService
from app.services.token_service import TokenService
from app.services.age_verification_service import AgeVerificationService

# Schemas
from app.schemas import ContentUnlockRequestNew, ContentUnlockResponse

# --- Service Fixtures ---

@pytest.fixture(scope="function")
def age_verification_service_mock() -> MagicMock:
    mock = MagicMock(spec=AgeVerificationService)
    mock.is_user_age_verified.return_value = True # Default to verified
    return mock

@pytest.fixture(scope="function")
def token_service(db_session: Session) -> TokenService:
    return TokenService(db=db_session)

@pytest.fixture(scope="function")
def reward_service(db_session: Session) -> RewardService:
    return RewardService(db=db_session)

@pytest.fixture(scope="function")
def adult_content_service(
    db_session: Session,
    token_service: TokenService,
    age_verification_service_mock: MagicMock,
    reward_service: RewardService
) -> AdultContentService:
    return AdultContentService(
        db=db_session,
        token_service=token_service,
        age_verification_service=age_verification_service_mock,
        reward_service=reward_service
    )

# --- Test Data Setup Fixtures (can also use fixtures from conftest or other integration files if structured) ---

@pytest.fixture(scope="function")
def test_user_for_unlock(db_session: Session) -> User: # Renamed to avoid potential fixture name collision
    user = User(email="unlockuser@example.com", nickname="unlocker", cyber_token_balance=2000)
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    # Create a basic UserSegment for this user, defaulting to "Low" or no specific RFM group initially
    # This helps _get_user_segment_max_order to run without erroring if it expects a segment.
    segment = UserSegment(user_id=user.id, rfm_group="Low") # Default to Low for predictability
    db_session.add(segment)
    db_session.commit()
    return user

@pytest.fixture(scope="function")
def test_adult_content_for_unlock(db_session: Session) -> AdultContent: # Renamed
    content = AdultContent(stage=1, name="Unlockable Content", description="Content for unlock test", required_segment_level=1)
    db_session.add(content)
    db_session.commit()
    db_session.refresh(content)
    return content

# --- Integration Tests for unlock_content_stage ---

@patch.object(AdultContentService, '_get_user_segment_max_order', return_value=0) # No segment access
@patch.object(AdultContentService, '_get_user_unlocked_stage_order', return_value=0) # No prior unlock
def test_unlock_content_stage_successful(
    mock_get_unlocked_order, # Mocks are passed bottom-up if stacked like this
    mock_get_segment_order,
    db_session: Session,
    adult_content_service: AdultContentService,
    test_user_for_unlock: User,
    test_adult_content_for_unlock: AdultContent,
    age_verification_service_mock: MagicMock
):
    """Test successful content stage unlock."""
    # Arrange
    user = test_user_for_unlock
    content = test_adult_content_for_unlock
    stage_to_unlock = ContentStageEnum.PARTIAL # Choose a stage to unlock
    stage_cost = STAGE_DETAILS[stage_to_unlock]['cost']

    # Ensure user has enough tokens
    if user.cyber_token_balance < stage_cost:
        user.cyber_token_balance = stage_cost + 100
        db_session.commit()
        db_session.refresh(user)
    initial_token_balance = user.cyber_token_balance

    request = ContentUnlockRequestNew(content_id=content.id, stage_to_unlock=stage_to_unlock.value)
    age_verification_service_mock.is_user_age_verified.return_value = True # Already default, but explicit

    # Act
    response = adult_content_service.unlock_content_stage(user_id=user.id, request=request)

    # Assert Service Response
    assert isinstance(response, ContentUnlockResponse)
    assert response.status == "success"
    assert response.unlocked_stage == stage_to_unlock.value
    assert response.tokens_spent == stage_cost
    assert response.remaining_tokens == initial_token_balance - stage_cost

    # Assert Database State: UserReward
    user_reward = db_session.query(UserReward).filter(
        UserReward.user_id == user.id,
        UserReward.reward_type == "CONTENT_UNLOCK",
        UserReward.reward_value == f"{content.id}_{stage_to_unlock.value}",
        UserReward.source_description == "Direct purchase"
    ).first()
    assert user_reward is not None
    assert user_reward.user_id == user.id

    # Assert Database State: User Token Balance
    db_session.refresh(user)
    assert user.cyber_token_balance == initial_token_balance - stage_cost

    # Assert mocks for helper methods were called as expected
    mock_get_segment_order.assert_called_once_with(user.id)
    mock_get_unlocked_order.assert_called_once_with(user.id, content.id)


@patch.object(AdultContentService, '_get_user_segment_max_order', return_value=0)
@patch.object(AdultContentService, '_get_user_unlocked_stage_order', return_value=0)
def test_unlock_content_stage_insufficient_tokens(
    mock_get_unlocked_order,
    mock_get_segment_order,
    db_session: Session,
    adult_content_service: AdultContentService,
    test_user_for_unlock: User,
    test_adult_content_for_unlock: AdultContent,
    age_verification_service_mock: MagicMock
):
    """Test content stage unlock when user has insufficient tokens."""
    # Arrange
    user = test_user_for_unlock
    content = test_adult_content_for_unlock
    stage_to_unlock = ContentStageEnum.FULL # A costly stage
    stage_cost = STAGE_DETAILS[stage_to_unlock]['cost']

    # Set user's token balance to be less than the required cost
    user.cyber_token_balance = stage_cost - 10
    if user.cyber_token_balance < 0: user.cyber_token_balance = 0
    db_session.commit()
    db_session.refresh(user)
    initial_insufficient_balance = user.cyber_token_balance

    request = ContentUnlockRequestNew(content_id=content.id, stage_to_unlock=stage_to_unlock.value)
    age_verification_service_mock.is_user_age_verified.return_value = True

    # Act & Assert
    with pytest.raises(ValueError, match="Insufficient tokens"):
        adult_content_service.unlock_content_stage(user_id=user.id, request=request)

    # Assert Database State: No UserReward created
    user_reward_count = db_session.query(UserReward).filter(UserReward.user_id == user.id).count()
    assert user_reward_count == 0

    # Assert Database State: User token balance remains the insufficient amount
    db_session.refresh(user)
    assert user.cyber_token_balance == initial_insufficient_balance


@patch.object(AdultContentService, '_get_user_segment_max_order', return_value=0)
@patch.object(AdultContentService, '_get_user_unlocked_stage_order') # Patched here
def test_unlock_content_stage_already_unlocked_explicitly(
    mock_get_unlocked_order, # The mock for _get_user_unlocked_stage_order
    mock_get_segment_order,
    db_session: Session,
    adult_content_service: AdultContentService,
    test_user_for_unlock: User,
    test_adult_content_for_unlock: AdultContent,
    age_verification_service_mock: MagicMock
):
    """Test content stage unlock when the stage (or higher) is already explicitly unlocked."""
    # Arrange
    user = test_user_for_unlock
    content = test_adult_content_for_unlock
    stage_to_unlock = ContentStageEnum.PARTIAL

    # Simulate that 'PARTIAL' stage is already unlocked by its order value
    mock_get_unlocked_order.return_value = STAGE_DETAILS[ContentStageEnum.PARTIAL]["order"]

    request = ContentUnlockRequestNew(content_id=content.id, stage_to_unlock=stage_to_unlock.value)
    age_verification_service_mock.is_user_age_verified.return_value = True
    initial_token_balance = user.cyber_token_balance # Store before potential changes

    # Act & Assert
    with pytest.raises(ValueError, match="Stage already explicitly unlocked or a higher stage is unlocked."):
        adult_content_service.unlock_content_stage(user_id=user.id, request=request)

    # Assert Database State: No new UserReward created
    # Assuming no prior rewards for this specific test setup beyond what's mocked for order
    user_reward_count = db_session.query(UserReward).filter(
        UserReward.user_id == user.id,
        UserReward.reward_value == f"{content.id}_{stage_to_unlock.value}"
    ).count()
    assert user_reward_count == 0 # No new one should be created

    # Assert Database State: User token balance should be unchanged
    db_session.refresh(user)
    assert user.cyber_token_balance == initial_token_balance
