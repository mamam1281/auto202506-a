import unittest
from unittest.mock import MagicMock, patch, call
from datetime import datetime, timedelta, timezone

from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from app.services.adult_content_service import (
    AdultContentService,
    ContentStageEnum,
    STAGE_DETAILS,
    USER_SEGMENT_ACCESS_ORDER
)
from app.services.token_service import TokenService
from app.services.age_verification_service import AgeVerificationService
from app.services.reward_service import RewardService

from app.models import User, UserSegment, AdultContent, UserReward
from app.schemas import (
    AdultContentDetail, ContentStageInfo, ContentUnlockRequestNew,
    ContentUnlockResponse, UnlockHistoryItem, AccessUpgradeRequest,
    AccessUpgradeResponse, ContentPreviewResponse, AdultContentGalleryItem
)

class TestAdultContentService(unittest.TestCase):

    def setUp(self):
        self.mock_db_session = MagicMock(spec=Session)
        self.mock_token_service = MagicMock(spec=TokenService)
        self.mock_age_verification_service = MagicMock(spec=AgeVerificationService)
        self.mock_reward_service = MagicMock(spec=RewardService)

        self.adult_content_service = AdultContentService(
            db=self.mock_db_session,
            token_service=self.mock_token_service,
            age_verification_service=self.mock_age_verification_service,
            reward_service=self.mock_reward_service
        )

    # --- Test _get_user_segment_max_order ---
    def test_get_user_segment_max_order_valid_segment(self):
        user_id = 1
        mock_segment = UserSegment(user_id=user_id, rfm_group="Medium")
        self.mock_db_session.query(UserSegment).filter(UserSegment.user_id == user_id).first.return_value = mock_segment
        expected_order = USER_SEGMENT_ACCESS_ORDER["Medium"]
        actual_order = self.adult_content_service._get_user_segment_max_order(user_id)
        self.assertEqual(actual_order, expected_order)

    def test_get_user_segment_max_order_no_segment(self):
        user_id = 1
        self.mock_db_session.query(UserSegment).filter(UserSegment.user_id == user_id).first.return_value = None
        expected_order = USER_SEGMENT_ACCESS_ORDER["Low"]
        actual_order = self.adult_content_service._get_user_segment_max_order(user_id)
        self.assertEqual(actual_order, expected_order)

    def test_get_user_segment_max_order_segment_no_rfm_group(self):
        user_id = 1
        mock_segment = UserSegment(user_id=user_id, rfm_group=None)
        self.mock_db_session.query(UserSegment).filter(UserSegment.user_id == user_id).first.return_value = mock_segment
        expected_order = USER_SEGMENT_ACCESS_ORDER["Low"]
        actual_order = self.adult_content_service._get_user_segment_max_order(user_id)
        self.assertEqual(actual_order, expected_order)

    # --- Test _get_user_unlocked_stage_order ---
    def test_get_user_unlocked_stage_order_has_unlocks(self):
        user_id = 1; content_id = 101
        unlock_partial = UserReward(user_id=user_id, reward_type="CONTENT_UNLOCK", reward_value=f"{content_id}_{ContentStageEnum.PARTIAL.value}")
        unlock_teaser = UserReward(user_id=user_id, reward_type="CONTENT_UNLOCK", reward_value=f"{content_id}_{ContentStageEnum.TEASER.value}")
        self.mock_db_session.query(UserReward).filter.return_value.all.return_value = [unlock_partial, unlock_teaser]
        expected_order = STAGE_DETAILS[ContentStageEnum.PARTIAL]["order"]
        actual_order = self.adult_content_service._get_user_unlocked_stage_order(user_id, content_id)
        self.assertEqual(actual_order, expected_order)

    def test_get_user_unlocked_stage_order_no_unlocks(self):
        user_id = 1; content_id = 101
        self.mock_db_session.query(UserReward).filter.return_value.all.return_value = []
        actual_order = self.adult_content_service._get_user_unlocked_stage_order(user_id, content_id)
        self.assertEqual(actual_order, 0)

    def test_get_user_unlocked_stage_order_malformed_reward_value(self):
        user_id = 1; content_id = 101
        unlock_malformed = UserReward(user_id=user_id, reward_type="CONTENT_UNLOCK", reward_value=f"{content_id}_WrongStage")
        unlock_good = UserReward(user_id=user_id, reward_type="CONTENT_UNLOCK", reward_value=f"{content_id}_{ContentStageEnum.TEASER.value}")
        self.mock_db_session.query(UserReward).filter.return_value.all.return_value = [unlock_malformed, unlock_good]
        expected_order = STAGE_DETAILS[ContentStageEnum.TEASER]["order"]
        actual_order = self.adult_content_service._get_user_unlocked_stage_order(user_id, content_id)
        self.assertEqual(actual_order, expected_order)

    # --- Test get_content_access_level ---
    @patch.object(AdultContentService, '_get_user_segment_max_order')
    @patch.object(AdultContentService, '_get_user_unlocked_stage_order')
    def test_get_content_access_level_age_verified_segment_higher(self, mock_unlocked_order, mock_segment_order):
        user_id = 1; content_id = 101
        self.mock_age_verification_service.is_user_age_verified.return_value = True
        mock_segment_order.return_value = STAGE_DETAILS[ContentStageEnum.FULL]["order"]
        mock_unlocked_order.return_value = STAGE_DETAILS[ContentStageEnum.PARTIAL]["order"]
        access_level = self.adult_content_service.get_content_access_level(user_id, content_id)
        self.assertEqual(access_level, ContentStageEnum.FULL)

    @patch.object(AdultContentService, '_get_user_segment_max_order')
    @patch.object(AdultContentService, '_get_user_unlocked_stage_order')
    def test_get_content_access_level_age_verified_unlock_higher(self, mock_unlocked_order, mock_segment_order):
        user_id = 1; content_id = 101
        self.mock_age_verification_service.is_user_age_verified.return_value = True
        mock_segment_order.return_value = STAGE_DETAILS[ContentStageEnum.TEASER]["order"]
        mock_unlocked_order.return_value = STAGE_DETAILS[ContentStageEnum.VIP]["order"]
        access_level = self.adult_content_service.get_content_access_level(user_id, content_id)
        self.assertEqual(access_level, ContentStageEnum.VIP)

    def test_get_content_access_level_age_not_verified(self):
        user_id = 1; content_id = 101
        self.mock_age_verification_service.is_user_age_verified.return_value = False
        access_level = self.adult_content_service.get_content_access_level(user_id, content_id)
        self.assertIsNone(access_level)

    # --- Test get_content_details ---
    @patch.object(AdultContentService, '_get_user_segment_max_order')
    @patch.object(AdultContentService, '_get_user_unlocked_stage_order')
    def test_get_content_details_success(self, mock_unlocked_order, mock_segment_order):
        user_id = 1; content_id = 101
        self.mock_age_verification_service.is_user_age_verified.return_value = True
        mock_content_db = AdultContent(id=content_id, name="Test Content", description="A test")
        self.mock_db_session.query(AdultContent).filter(AdultContent.id == content_id).first.return_value = mock_content_db
        mock_segment_order.return_value = STAGE_DETAILS[ContentStageEnum.PARTIAL]["order"]
        mock_unlocked_order.return_value = STAGE_DETAILS[ContentStageEnum.TEASER]["order"]
        details = self.adult_content_service.get_content_details(user_id, content_id)
        self.assertIsInstance(details, AdultContentDetail)
        self.assertEqual(details.id, content_id)
        self.assertEqual(details.user_current_access_level, ContentStageEnum.PARTIAL.value)
        self.assertEqual(len(details.stages), len(STAGE_DETAILS))

    def test_get_content_details_age_not_verified(self):
        self.mock_age_verification_service.is_user_age_verified.return_value = False
        details = self.adult_content_service.get_content_details(1, 101)
        self.assertIsNone(details)

    def test_get_content_details_content_not_found(self):
        self.mock_age_verification_service.is_user_age_verified.return_value = True
        self.mock_db_session.query(AdultContent).filter(AdultContent.id == 101).first.return_value = None
        details = self.adult_content_service.get_content_details(1, 101)
        self.assertIsNone(details)

    # --- Test unlock_content_stage ---
    @patch.object(AdultContentService, '_get_user_segment_max_order')
    @patch.object(AdultContentService, '_get_user_unlocked_stage_order')
    def test_unlock_content_stage_success(self, mock_unlocked_order, mock_segment_order):
        user_id = 1; content_id = 101
        stage_to_unlock = ContentStageEnum.FULL
        request = ContentUnlockRequestNew(content_id=content_id, stage_to_unlock=stage_to_unlock.value)
        self.mock_age_verification_service.is_user_age_verified.return_value = True
        self.mock_db_session.query(AdultContent).filter(AdultContent.id == content_id).first.return_value = MagicMock(spec=AdultContent, id=content_id)
        mock_segment_order.return_value = STAGE_DETAILS[ContentStageEnum.TEASER]["order"]
        mock_unlocked_order.return_value = STAGE_DETAILS[ContentStageEnum.PARTIAL]["order"]
        cost_for_full = STAGE_DETAILS[ContentStageEnum.FULL]["cost"]
        self.mock_token_service.deduct_tokens.return_value = 1000
        response = self.adult_content_service.unlock_content_stage(user_id, request)
        self.mock_token_service.deduct_tokens.assert_called_once_with(user_id, cost_for_full)
        self.mock_reward_service.grant_content_unlock.assert_called_once_with(
            user_id=user_id, content_id=content_id, stage_name=stage_to_unlock.value,
            source_description="Direct purchase"
        )
        self.assertEqual(response.status, "success")

    def test_unlock_content_stage_age_verification_fails(self):
        self.mock_age_verification_service.is_user_age_verified.return_value = False
        request = ContentUnlockRequestNew(content_id=101, stage_to_unlock=ContentStageEnum.FULL.value)
        with self.assertRaisesRegex(ValueError, "Age verification required"):
            self.adult_content_service.unlock_content_stage(1, request)

    def test_unlock_content_stage_content_not_found(self):
        user_id = 1
        self.mock_age_verification_service.is_user_age_verified.return_value = True
        self.mock_db_session.query(AdultContent).filter(AdultContent.id == 101).first.return_value = None
        request = ContentUnlockRequestNew(content_id=101, stage_to_unlock=ContentStageEnum.FULL.value)
        with self.assertRaisesRegex(ValueError, "Content not found"):
            self.adult_content_service.unlock_content_stage(user_id, request)

    def test_unlock_content_stage_invalid_stage_name(self):
        user_id = 1
        self.mock_age_verification_service.is_user_age_verified.return_value = True
        self.mock_db_session.query(AdultContent).filter(AdultContent.id == 101).first.return_value = MagicMock(spec=AdultContent)
        request = ContentUnlockRequestNew(content_id=101, stage_to_unlock="INVALID_STAGE_NAME")
        with self.assertRaisesRegex(ValueError, "Invalid stage to unlock: INVALID_STAGE_NAME"):
            self.adult_content_service.unlock_content_stage(user_id, request)

    @patch.object(AdultContentService, '_get_user_unlocked_stage_order')
    def test_unlock_content_stage_already_explicitly_unlocked(self, mock_unlocked_order):
        user_id = 1; content_id = 101
        # Arrange - Mock user segment with required attributes
        mock_user_segment = MagicMock()
        mock_user_segment.rfm_group = "Whale"  # Add missing attribute
        mock_user_segment.risk_profile = "High-Risk"  # Add missing attribute
        mock_user_segment.name = "Whale"  # Add missing attribute
        
        # Configure mock queries
        self.mock_db_session.query().filter().first.return_value = mock_user_segment
        
        # Mock existing user reward
        mock_existing_reward = MagicMock()
        mock_existing_reward.reward_value = "101_FULL"
        self.mock_db_session.query().filter().first.side_effect = [mock_user_segment, mock_existing_reward]
        
        # Act & Assert
        with self.assertRaisesRegex(ValueError, "Content stage already unlocked"):
            self.adult_content_service.unlock_content_stage(user_id=1, content_id=101, target_stage="FULL")

    @patch.object(AdultContentService, '_get_user_segment_max_order')
    @patch.object(AdultContentService, '_get_user_unlocked_stage_order')
    def test_unlock_content_stage_already_accessible_by_segment_allows_purchase(
        self, mock_unlocked_order, mock_segment_order
    ):
        user_id = 1; content_id = 101
        stage_to_unlock = ContentStageEnum.PARTIAL
        request = ContentUnlockRequestNew(content_id=content_id, stage_to_unlock=stage_to_unlock.value)
        self.mock_age_verification_service.is_user_age_verified.return_value = True
        self.mock_db_session.query(AdultContent).filter(AdultContent.id == content_id).first.return_value = MagicMock(spec=AdultContent, id=content_id)
        mock_segment_order.return_value = STAGE_DETAILS[ContentStageEnum.FULL]["order"]
        mock_unlocked_order.return_value = STAGE_DETAILS[ContentStageEnum.TEASER]["order"]
        cost_for_partial = STAGE_DETAILS[ContentStageEnum.PARTIAL]["cost"]
        self.mock_token_service.deduct_tokens.return_value = 1000
        response = self.adult_content_service.unlock_content_stage(user_id, request)
        self.mock_token_service.deduct_tokens.assert_called_once_with(user_id, cost_for_partial)
        self.mock_reward_service.grant_content_unlock.assert_called_once()
        self.assertEqual(response.status, "success")

    @patch.object(AdultContentService, '_get_user_segment_max_order')
    @patch.object(AdultContentService, '_get_user_unlocked_stage_order')
    def test_unlock_content_stage_insufficient_tokens(self, mock_unlocked_order, mock_segment_order):
        user_id = 1; content_id = 101
        stage_to_unlock = ContentStageEnum.FULL
        request = ContentUnlockRequestNew(content_id=content_id, stage_to_unlock=stage_to_unlock.value)
        self.mock_age_verification_service.is_user_age_verified.return_value = True
        self.mock_db_session.query(AdultContent).filter(AdultContent.id == content_id).first.return_value = MagicMock(spec=AdultContent, id=content_id)
        mock_segment_order.return_value = STAGE_DETAILS[ContentStageEnum.TEASER]["order"]
        mock_unlocked_order.return_value = STAGE_DETAILS[ContentStageEnum.PARTIAL]["order"]
        self.mock_token_service.deduct_tokens.side_effect = ValueError("Insufficient tokens")
        with self.assertRaisesRegex(ValueError, "Insufficient tokens"):
            self.adult_content_service.unlock_content_stage(user_id, request)
        self.mock_reward_service.grant_content_unlock.assert_not_called()

    @patch.object(AdultContentService, '_get_user_segment_max_order')
    @patch.object(AdultContentService, '_get_user_unlocked_stage_order')
    def test_unlock_content_stage_reward_service_fails(self, mock_unlocked_order, mock_segment_order):
        user_id = 1; content_id = 101
        stage_to_unlock = ContentStageEnum.FULL
        request = ContentUnlockRequestNew(content_id=content_id, stage_to_unlock=stage_to_unlock.value)
        self.mock_age_verification_service.is_user_age_verified.return_value = True
        self.mock_db_session.query(AdultContent).filter(AdultContent.id == content_id).first.return_value = MagicMock(spec=AdultContent, id=content_id)
        mock_segment_order.return_value = STAGE_DETAILS[ContentStageEnum.TEASER]["order"]
        mock_unlocked_order.return_value = STAGE_DETAILS[ContentStageEnum.PARTIAL]["order"]
        cost_for_full = STAGE_DETAILS[ContentStageEnum.FULL]["cost"]
        self.mock_token_service.deduct_tokens.return_value = 1000
        self.mock_reward_service.grant_content_unlock.side_effect = SQLAlchemyError("Reward grant failed")
        with self.assertRaises(SQLAlchemyError):
            self.adult_content_service.unlock_content_stage(user_id, request)
        self.mock_token_service.deduct_tokens.assert_called_once_with(user_id, cost_for_full)
        self.mock_reward_service.grant_content_unlock.assert_called_once()

    # --- Test get_content_preview ---
    @patch.object(AdultContentService, 'get_content_access_level')
    def test_get_content_preview_success(self, mock_get_access_level):
        user_id = 1; content_id = 101
        self.mock_age_verification_service.is_user_age_verified.return_value = True
        mock_content_db = AdultContent(id=content_id, name="Preview Content", thumbnail_url="thumb.jpg", media_url="media.mp4")
        self.mock_db_session.query(AdultContent).filter(AdultContent.id == content_id).first.return_value = mock_content_db

        mock_get_access_level.return_value = ContentStageEnum.FULL
        response_full = self.adult_content_service.get_content_preview(user_id, content_id)
        self.assertEqual(response_full.preview_url, "media.mp4")
        self.assertEqual(response_full.current_stage_accessed, ContentStageEnum.FULL.value)

        mock_get_access_level.return_value = ContentStageEnum.TEASER
        response_teaser = self.adult_content_service.get_content_preview(user_id, content_id)
        self.assertEqual(response_teaser.preview_url, "thumb.jpg")
        self.assertEqual(response_teaser.current_stage_accessed, ContentStageEnum.TEASER.value)

        mock_get_access_level.return_value = None
        response_none = self.adult_content_service.get_content_preview(user_id, content_id)
        self.assertEqual(response_none.preview_url, "/previews/default_locked.jpg")
        self.assertEqual(response_none.current_stage_accessed, "None")

    def test_get_content_preview_age_not_verified(self):
        self.mock_age_verification_service.is_user_age_verified.return_value = False
        response = self.adult_content_service.get_content_preview(1, 101)
        self.assertIsNone(response)

    def test_get_content_preview_content_not_found(self):
        self.mock_age_verification_service.is_user_age_verified.return_value = True
        self.mock_db_session.query(AdultContent).filter(AdultContent.id == 101).first.return_value = None
        response = self.adult_content_service.get_content_preview(1, 101)
        self.assertIsNone(response)

    # --- Test get_gallery_for_user ---
    @patch.object(AdultContentService, '_get_user_segment_max_order')
    @patch.object(AdultContentService, '_get_user_unlocked_stage_order')
    def test_get_gallery_for_user_success(self, mock_unlocked_order, mock_segment_order):
        user_id = 1
        self.mock_age_verification_service.is_user_age_verified.return_value = True
        content1 = AdultContent(id=101, name="Content 1", thumbnail_url="c1.jpg")
        content2 = AdultContent(id=102, name="Content 2", thumbnail_url="c2.jpg")
        content3 = AdultContent(id=103, name="Content 3", thumbnail_url="c3.jpg")
        self.mock_db_session.query(AdultContent).all.return_value = [content1, content2, content3]
        mock_segment_order.return_value = STAGE_DETAILS[ContentStageEnum.TEASER]["order"]
        def unlocked_order_side_effect(uid, cid):
            if cid == 101: return STAGE_DETAILS[ContentStageEnum.PARTIAL]["order"]
            if cid == 102: return 0
            if cid == 103: return 0
            return 0
        mock_unlocked_order.side_effect = unlocked_order_side_effect
        teaser_stage_order = STAGE_DETAILS[ContentStageEnum.TEASER]["order"]
        gallery = self.adult_content_service.get_gallery_for_user(user_id)

        # Determine expected items based on teaser_stage_order being potentially > 0
        expected_item_count = 0
        if STAGE_DETAILS[ContentStageEnum.PARTIAL]["order"] >= teaser_stage_order: expected_item_count +=1
        if STAGE_DETAILS[ContentStageEnum.TEASER]["order"] >= teaser_stage_order: expected_item_count +=1 # For content2, effective is Teaser
        if max(mock_segment_order.return_value, 0) >= teaser_stage_order: expected_item_count +=1 # for content3, effective is Teaser

        self.assertEqual(len(gallery), expected_item_count)
        # Further checks for specific item content if needed

    def test_get_gallery_for_user_age_not_verified(self):
        self.mock_age_verification_service.is_user_age_verified.return_value = False
        gallery = self.adult_content_service.get_gallery_for_user(1)
        self.assertEqual(gallery, [])

    # --- Test get_user_unlock_history ---
    @patch("app.services.adult_content_service.UserSegment")
    @patch("app.services.adult_content_service.User")
    def test_get_user_unlock_history_success(self, MockUser, MockUserSegment):
        user_id = 1
        self.mock_age_verification_service.is_user_age_verified.return_value = True
        now = datetime.now(timezone.utc)
        reward1 = UserReward(user_id=user_id, reward_type="CONTENT_UNLOCK", reward_value="101_Full", awarded_at=now - timedelta(days=1))
        reward2 = UserReward(user_id=user_id, reward_type="CONTENT_UNLOCK", reward_value="102_Partial", awarded_at=now)
        reward_malformed1 = UserReward(user_id=user_id, reward_type="CONTENT_UNLOCK", reward_value="103_InvalidStageName", awarded_at=now)
        reward_malformed2 = UserReward(user_id=user_id, reward_type="CONTENT_UNLOCK", reward_value="juststring", awarded_at=now)
        self.mock_db_session.query(UserReward).filter.return_value.order_by.return_value.all.return_value = [reward2, reward1, reward_malformed1, reward_malformed2]
        mock_user_segment = MockUserSegment()
        mock_user_segment.rfm_group = "Low"
        self.mock_db_session.query(UserSegment).filter(UserSegment.user_id == user_id).first.return_value = mock_user_segment
        # Mock for scalar_one_or_none
        def mock_scalar_one_or_none(*args, **kwargs): # Signature changed
            if args and isinstance(args[0], MagicMock): # Crude check if it's the query leading to UserSegment
                # Check if it's the query for UserSegment by looking at filter conditions if possible
                # For simplicity, assume this call is for UserSegment if it's not User
                # This part might need more specific conditions based on actual query structure
                if "user_id" in str(args[0].filter.call_args): # Example check
                    return mock_user_segment
            return None # Default or for other scalar_one_or_none calls

        self.mock_db_session.execute.return_value.scalar_one_or_none.side_effect = mock_scalar_one_or_none
        history = self.adult_content_service.get_user_unlock_history(user_id)
        self.assertEqual(len(history), 2)
        self.assertEqual(history[0].content_id, 102); self.assertEqual(history[1].content_id, 101)

    def test_get_user_unlock_history_age_not_verified(self):
        self.mock_age_verification_service.is_user_age_verified.return_value = False
        history = self.adult_content_service.get_user_unlock_history(1)
        self.assertEqual(history, [])

    # --- Test upgrade_access_temporarily ---
    def test_upgrade_access_temporarily_success_simulated(self):
        user_id = 1
        request = AccessUpgradeRequest(target_segment_level="Medium", duration_days=7)
        self.mock_age_verification_service.is_user_age_verified.return_value = True
        self.mock_db_session.query(User).filter(User.id == user_id).first.return_value = MagicMock(spec=User)
        # Current segment is "Low"
        # UserSegment mock 추가 (rfm_group 속성 포함)
        mock_user_segment = MagicMock(spec=UserSegment)
        mock_user_segment.rfm_group = "Low"
        self.mock_db_session.query(UserSegment).filter(UserSegment.user_id == user_id).first.return_value = mock_user_segment

        # Cost: Medium (order 2) - Low (order 1) = 1 level diff * 1000 = 1000
        expected_cost = (USER_SEGMENT_ACCESS_ORDER["Medium"] - USER_SEGMENT_ACCESS_ORDER["Low"]) * 1000
        self.mock_token_service.deduct_tokens.return_value = 500 # Remaining tokens

        response = self.adult_content_service.upgrade_access_temporarily(user_id, request)

        self.mock_token_service.deduct_tokens.assert_called_once_with(user_id, expected_cost)
        self.assertTrue(response.status.startswith("success (simulated"))
        self.assertEqual(response.new_segment_level, "Medium")
        self.assertEqual(response.tokens_spent, expected_cost)
        self.assertIsNotNone(response.valid_until)
        # Verify no actual commit to UserSegment model (as it's simulated)
        self.mock_db_session.commit.assert_not_called()

    def test_upgrade_access_temporarily_age_fails(self):
        request = AccessUpgradeRequest(target_segment_level="Medium")
        self.mock_age_verification_service.is_user_age_verified.return_value = False
        with self.assertRaisesRegex(ValueError, "Age verification required"):
            self.adult_content_service.upgrade_access_temporarily(1, request)

    def test_upgrade_access_temporarily_user_not_found(self, MockUser, MockUserSegment, MockUserAdultContentSetting):
        user_id = 999  # Non-existent user
        request = AccessUpgradeRequest(target_segment_level="Medium")
        self.mock_age_verification_service.is_user_age_verified.return_value = True
        self.mock_db_session.query(User).filter(User.id == user_id).first.return_value = None
        # Ensure UserSegment query also returns None if User is not found
        self.mock_db_session.query(UserSegment).filter(UserSegment.user_id == user_id).first.return_value = None
        with self.assertRaisesRegex(ValueError, "User or user segment not found"):
            self.adult_content_service.upgrade_access_temporarily(1, request)

    def test_upgrade_access_temporarily_invalid_target_segment(self):
        request = AccessUpgradeRequest(target_segment_level="INVALID_SEGMENT")
        self.mock_age_verification_service.is_user_age_verified.return_value = True
        self.mock_db_session.query(User).filter().first.return_value = MagicMock(spec=User)
        self.mock_db_session.query(UserSegment).filter().first.return_value = MagicMock(spec=UserSegment, rfm_group="Low")
        with self.assertRaisesRegex(ValueError, "Invalid target segment level: INVALID_SEGMENT"):
            self.adult_content_service.upgrade_access_temporarily(1, request)

    def test_upgrade_access_temporarily_already_at_or_above_target(self):
        request = AccessUpgradeRequest(target_segment_level="Medium")
        self.mock_age_verification_service.is_user_age_verified.return_value = True
        self.mock_db_session.query(User).filter().first.return_value = MagicMock(spec=User)
        self.mock_db_session.query(UserSegment).filter().first.return_value = MagicMock(spec=UserSegment, rfm_group="Whale") # User is Whale
        with self.assertRaisesRegex(ValueError, "User is already at or above Medium segment level"):
            self.adult_content_service.upgrade_access_temporarily(1, request)

    def test_upgrade_access_temporarily_insufficient_tokens(self):
        request = AccessUpgradeRequest(target_segment_level="Medium")
        self.mock_age_verification_service.is_user_age_verified.return_value = True
        self.mock_db_session.query(User).filter().first.return_value = MagicMock(spec=User)
        self.mock_db_session.query(UserSegment).filter().first.return_value = MagicMock(spec=UserSegment, rfm_group="Low")
        self.mock_token_service.deduct_tokens.side_effect = ValueError("Not enough tokens")
        with self.assertRaisesRegex(ValueError, "Not enough tokens"):
            self.adult_content_service.upgrade_access_temporarily(1, request)


if __name__ == '__main__':
    unittest.main()
