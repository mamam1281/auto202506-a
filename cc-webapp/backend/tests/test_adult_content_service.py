import unittest
from unittest.mock import MagicMock, patch, PropertyMock, call
from datetime import datetime, timedelta

from app.services.adult_content_service import AdultContentService, ContentStageEnum, STAGE_DETAILS, USER_SEGMENT_ACCESS_ORDER
from app.services.token_service import TokenService
from app.services.age_verification_service import AgeVerificationService
from app.models import User, UserSegment, AdultContent, UserReward
from app.schemas import ContentUnlockRequestNew, AccessUpgradeRequest, AdultContentGalleryItem

class TestAdultContentService(unittest.TestCase):

    def setUp(self):
        self.mock_db_session = MagicMock()
        self.mock_token_service = MagicMock(spec=TokenService)
        self.mock_age_verification_service = MagicMock(spec=AgeVerificationService)

        self.adult_content_service = AdultContentService(
            db=self.mock_db_session,
            token_service=self.mock_token_service,
            age_verification_service=self.mock_age_verification_service
        )

        # Common test data
        self.user_id = 1
        self.content_id = 101
        self.mock_user = User(id=self.user_id, email="test@example.com")
        self.mock_content = AdultContent(id=self.content_id, name="Test Content", stage=3,
                                         thumbnail_url="thumb.jpg", media_url="media.mp4")

        # Default age verification to True for most tests, can be overridden
        self.mock_age_verification_service.is_user_age_verified.return_value = True

    def test_get_user_segment_max_order_whale(self):
        mock_segment = UserSegment(user_id=self.user_id, rfm_group="Whale")
        self.mock_db_session.query(UserSegment).filter(UserSegment.user_id == self.user_id).first.return_value = mock_segment
        order = self.adult_content_service._get_user_segment_max_order(self.user_id)
        self.assertEqual(order, USER_SEGMENT_ACCESS_ORDER["Whale"])

    def test_get_user_segment_max_order_low_default(self):
        self.mock_db_session.query(UserSegment).filter(UserSegment.user_id == self.user_id).first.return_value = None
        order = self.adult_content_service._get_user_segment_max_order(self.user_id)
        self.assertEqual(order, USER_SEGMENT_ACCESS_ORDER["Low"])

    def test_get_user_unlocked_stage_order_multiple_unlocks(self):
        unlock_rewards = [
            UserReward(user_id=self.user_id, reward_type="CONTENT_UNLOCK", reward_value=f"{self.content_id}_Teaser"),
            UserReward(user_id=self.user_id, reward_type="CONTENT_UNLOCK", reward_value=f"{self.content_id}_Partial"),
        ]
        self.mock_db_session.query(UserReward).filter(...).all.return_value = unlock_rewards
        order = self.adult_content_service._get_user_unlocked_stage_order(self.user_id, self.content_id)
        self.assertEqual(order, STAGE_DETAILS[ContentStageEnum.PARTIAL]["order"])

    def test_get_user_unlocked_stage_order_no_unlocks(self):
        self.mock_db_session.query(UserReward).filter(...).all.return_value = []
        order = self.adult_content_service._get_user_unlocked_stage_order(self.user_id, self.content_id)
        self.assertEqual(order, 0)

    def test_get_content_access_level_not_age_verified(self):
        self.mock_age_verification_service.is_user_age_verified.return_value = False
        level = self.adult_content_service.get_content_access_level(self.user_id, self.content_id)
        self.assertIsNone(level)
        self.mock_age_verification_service.is_user_age_verified.assert_called_once_with(self.user_id)

    def test_get_content_access_level_segment_access(self):
        # User is "Medium" segment, no specific unlocks for this content
        mock_segment = UserSegment(user_id=self.user_id, rfm_group="Medium")
        self.mock_db_session.query(UserSegment).filter(UserSegment.user_id == self.user_id).first.return_value = mock_segment
        self.mock_db_session.query(UserReward).filter(...).all.return_value = [] # No specific unlocks

        level = self.adult_content_service.get_content_access_level(self.user_id, self.content_id)
        self.assertEqual(level, ContentStageEnum.PARTIAL) # Medium segment gets Partial access

    def test_get_content_details_success(self):
        self.mock_db_session.query(AdultContent).filter(AdultContent.id == self.content_id).first.return_value = self.mock_content

        # Assume user is "Low" segment, has purchased "Partial" for this content
        mock_segment = UserSegment(user_id=self.user_id, rfm_group="Low")
        self.mock_db_session.query(UserSegment).filter(UserSegment.user_id == self.user_id).first.return_value = mock_segment
        unlock_rewards = [UserReward(user_id=self.user_id, reward_type="CONTENT_UNLOCK", reward_value=f"{self.content_id}_Partial")]
        self.mock_db_session.query(UserReward).filter(...).all.return_value = unlock_rewards

        details = self.adult_content_service.get_content_details(self.user_id, self.content_id)

        self.assertIsNotNone(details)
        self.assertEqual(details.id, self.content_id)
        self.assertEqual(details.name, "Test Content")
        self.assertEqual(details.user_current_access_level, ContentStageEnum.PARTIAL.value) # Higher of Low segment (Teaser) and Partial unlock

        # Check stages
        self.assertEqual(len(details.stages), len(STAGE_DETAILS))
        teaser_stage_info = next(s for s in details.stages if s.stage_name == ContentStageEnum.TEASER.value)
        partial_stage_info = next(s for s in details.stages if s.stage_name == ContentStageEnum.PARTIAL.value)
        full_stage_info = next(s for s in details.stages if s.stage_name == ContentStageEnum.FULL.value)

        self.assertTrue(teaser_stage_info.is_unlocked) # Low segment access
        self.assertTrue(partial_stage_info.is_unlocked) # Purchased
        self.assertFalse(full_stage_info.is_unlocked)


    def test_unlock_content_stage_success(self):
        self.mock_db_session.query(AdultContent).filter(AdultContent.id == self.content_id).first.return_value = self.mock_content

        # User is "Low" segment, no prior unlocks for this content
        mock_segment = UserSegment(user_id=self.user_id, rfm_group="Low")
        self.mock_db_session.query(UserSegment).filter(UserSegment.user_id == self.user_id).first.return_value = mock_segment
        self.mock_db_session.query(UserReward).filter(...).all.return_value = []

        self.mock_token_service.deduct_tokens.return_value = 5000 # Remaining tokens

        unlock_request = ContentUnlockRequestNew(content_id=self.content_id, stage_to_unlock=ContentStageEnum.PARTIAL.value)

        with patch('app.services.adult_content_service.datetime') as mock_datetime:
            mock_datetime.utcnow.return_value = datetime(2023,1,1)
            response = self.adult_content_service.unlock_content_stage(self.user_id, unlock_request)

        self.assertEqual(response.status, "success")
        self.assertEqual(response.unlocked_stage, ContentStageEnum.PARTIAL.value)
        self.assertEqual(response.tokens_spent, STAGE_DETAILS[ContentStageEnum.PARTIAL]["cost"])
        self.mock_token_service.deduct_tokens.assert_called_once_with(self.user_id, STAGE_DETAILS[ContentStageEnum.PARTIAL]["cost"])
        self.mock_db_session.add.assert_called_once()
        added_object = self.mock_db_session.add.call_args[0][0]
        self.assertIsInstance(added_object, UserReward)
        self.assertEqual(added_object.reward_value, f"{self.content_id}_{ContentStageEnum.PARTIAL.value}")
        self.mock_db_session.commit.assert_called_once()

    def test_unlock_content_stage_insufficient_tokens(self):
        self.mock_db_session.query(AdultContent).filter(AdultContent.id == self.content_id).first.return_value = self.mock_content
        mock_segment = UserSegment(user_id=self.user_id, rfm_group="Low")
        self.mock_db_session.query(UserSegment).filter(UserSegment.user_id == self.user_id).first.return_value = mock_segment
        self.mock_db_session.query(UserReward).filter(...).all.return_value = []

        self.mock_token_service.deduct_tokens.side_effect = ValueError("Insufficient tokens")

        unlock_request = ContentUnlockRequestNew(content_id=self.content_id, stage_to_unlock=ContentStageEnum.PARTIAL.value)

        with self.assertRaisesRegex(ValueError, "Insufficient tokens"):
            self.adult_content_service.unlock_content_stage(self.user_id, unlock_request)
        self.mock_db_session.add.assert_not_called()


    def test_get_gallery_for_user_filters_by_teaser_access(self):
        content1 = AdultContent(id=1, name="Content 1", thumbnail_url="t1.jpg") # User has Teaser access
        content2 = AdultContent(id=2, name="Content 2", thumbnail_url="t2.jpg") # User has NO access
        all_content_db = [content1, content2]
        self.mock_db_session.query(AdultContent).all.return_value = all_content_db

        # User is "Low" (Teaser access by default for content1 if its req_segment_level allows)
        # and has no specific unlocks for content2
        mock_segment_low = UserSegment(user_id=self.user_id, rfm_group="Low")
        self.mock_db_session.query(UserSegment).filter(UserSegment.user_id == self.user_id).first.return_value = mock_segment_low

        # Mock _get_user_unlocked_stage_order:
        # For content1, let's say no specific unlocks, so relies on segment (Teaser order = 1)
        # For content2, no specific unlocks, relies on segment (Teaser order = 1, but let's say content2 itself requires higher base access)
        # This part is tricky because actual filtering depends on AdultContent.required_segment_level too.
        # The gallery method itself re-calculates effective_order.

        # Let's simplify: assume _get_user_unlocked_stage_order returns 0 for both (no specific purchases)
        # and _get_user_segment_max_order returns Teaser access level (order 1)
        with patch.object(self.adult_content_service, '_get_user_unlocked_stage_order', return_value=0), \
             patch.object(self.adult_content_service, '_get_user_segment_max_order', return_value=STAGE_DETAILS[ContentStageEnum.TEASER]["order"]):

            gallery_items = self.adult_content_service.get_gallery_for_user(self.user_id)

            # Expecting only content1 if its effective_order >= Teaser order.
            # If content2 also meets Teaser by segment, it would also be included.
            # The test logic in get_gallery_for_user is "if effective_order >= STAGE_DETAILS[ContentStageEnum.TEASER]["order"]"
            # So both should be included if segment gives Teaser access to both.
            self.assertEqual(len(gallery_items), 2)
            self.assertEqual(gallery_items[0].id, content1.id)
            self.assertEqual(gallery_items[0].highest_unlocked_stage, ContentStageEnum.TEASER.value)
            self.assertEqual(gallery_items[1].id, content2.id)
            self.assertEqual(gallery_items[1].highest_unlocked_stage, ContentStageEnum.TEASER.value)


    def test_get_user_unlock_history_simple(self):
        mock_reward = UserReward(user_id=self.user_id, reward_type="CONTENT_UNLOCK",
                                 reward_value=f"{self.content_id}_Full", awarded_at=datetime.utcnow())
        self.mock_db_session.query(UserReward).filter(...).order_by(...).all.return_value = [mock_reward]
        self.mock_db_session.query(AdultContent.name).filter(AdultContent.id == self.content_id).scalar_one_or_none.return_value = "Test Content Name"

        history = self.adult_content_service.get_user_unlock_history(self.user_id)
        self.assertEqual(len(history), 1)
        self.assertEqual(history[0].content_id, self.content_id)
        self.assertEqual(history[0].content_name, "Test Content Name")
        self.assertEqual(history[0].unlocked_stage, ContentStageEnum.FULL.value)
        self.assertEqual(history[0].tokens_spent, STAGE_DETAILS[ContentStageEnum.FULL]["cost"])


    def test_upgrade_access_temporarily_simulated_success(self):
        self.mock_db_session.query(User).filter(User.id == self.user_id).first.return_value = self.mock_user
        mock_segment = UserSegment(user_id=self.user_id, rfm_group="Low") # Current segment
        self.mock_db_session.query(UserSegment).filter(UserSegment.user_id == self.user_id).first.return_value = mock_segment

        self.mock_token_service.deduct_tokens.return_value = 1000 # Remaining tokens

        upgrade_request = AccessUpgradeRequest(target_segment_level="Medium", duration_days=7)

        with patch('app.services.adult_content_service.datetime') as mock_datetime:
            fixed_now = datetime(2023,1,1)
            mock_datetime.utcnow.return_value = fixed_now
            response = self.adult_content_service.upgrade_access_temporarily(self.user_id, upgrade_request)

        self.assertIn("success (simulated", response.status)
        self.assertEqual(response.new_segment_level, "Medium")

        expected_cost = (USER_SEGMENT_ACCESS_ORDER["Medium"] - USER_SEGMENT_ACCESS_ORDER["Low"]) * 1000
        self.assertEqual(response.tokens_spent, expected_cost)
        self.mock_token_service.deduct_tokens.assert_called_once_with(self.user_id, expected_cost)
        self.assertEqual(response.valid_until, fixed_now + timedelta(days=7))
        # self.mock_db_session.commit.assert_called_once() # Not called in simulated version

if __name__ == '__main__':
    unittest.main(argv=['first-arg-is-ignored'], exit=False)
