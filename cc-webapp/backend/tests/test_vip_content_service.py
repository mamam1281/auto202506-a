import unittest
from unittest.mock import MagicMock, patch
from datetime import datetime

from app.services.vip_content_service import VIPContentService, VIP_TIERS
from app.services.age_verification_service import AgeVerificationService
from app.services.adult_content_service import AdultContentService, ContentStageEnum # For STAGE_DETAILS if needed by AdultContentService mocks
from app.models import User, UserSegment, VIPAccessLog, AdultContent # AdultContent for content_id
from app.schemas import VIPExclusiveContentItem, AdultContentGalleryItem # AdultContentGalleryItem for mocking adult_content_service

class TestVIPContentService(unittest.TestCase):

    def setUp(self):
        self.mock_db_session = MagicMock()
        self.mock_age_verification_service = MagicMock(spec=AgeVerificationService)
        self.mock_adult_content_service = MagicMock(spec=AdultContentService)

        self.vip_content_service = VIPContentService(
            db=self.mock_db_session,
            age_verification_service=self.mock_age_verification_service,
            adult_content_service=self.mock_adult_content_service
        )

        self.user_id = 1
        self.vip_user_id = 2 # User who is VIP
        self.content_id = 101

        # Default age verification to True
        self.mock_age_verification_service.is_user_age_verified.return_value = True

        # Mock UserSegments
        self.mock_non_vip_segment = UserSegment(user_id=self.user_id, rfm_group="Medium")
        self.mock_vip_segment = UserSegment(user_id=self.vip_user_id, rfm_group="Whale") # Whale is a VIP tier

    def test_get_user_vip_details_is_vip(self):
        self.mock_db_session.query(UserSegment).filter(UserSegment.user_id == self.vip_user_id).first.return_value = self.mock_vip_segment
        details = self.vip_content_service._get_user_vip_details(self.vip_user_id)
        self.assertIsNotNone(details)
        self.assertEqual(details["tier_name"], VIP_TIERS["Whale"]["tier_name"])

    def test_get_user_vip_details_not_vip(self):
        self.mock_db_session.query(UserSegment).filter(UserSegment.user_id == self.user_id).first.return_value = self.mock_non_vip_segment
        details = self.vip_content_service._get_user_vip_details(self.user_id)
        self.assertIsNone(details) # Not in VIP_TIERS

    def test_get_vip_info_user_is_vip(self):
        self.mock_db_session.query(UserSegment).filter(UserSegment.user_id == self.vip_user_id).first.return_value = self.mock_vip_segment

        vip_info = self.vip_content_service.get_vip_info(self.vip_user_id)
        self.assertIsNotNone(vip_info)
        self.assertEqual(vip_info.user_id, self.vip_user_id)
        self.assertEqual(vip_info.vip_tier, VIP_TIERS["Whale"]["tier_name"])
        self.assertTrue(len(vip_info.benefits) > 0)

    def test_get_vip_info_user_not_vip(self):
        self.mock_db_session.query(UserSegment).filter(UserSegment.user_id == self.user_id).first.return_value = self.mock_non_vip_segment

        vip_info = self.vip_content_service.get_vip_info(self.user_id)
        self.assertIsNotNone(vip_info)
        self.assertEqual(vip_info.user_id, self.user_id)
        self.assertEqual(vip_info.vip_tier, "Non-VIP")
        self.assertEqual(len(vip_info.benefits), 1) # Should have the "Upgrade to VIP..." message

    def test_get_vip_info_not_age_verified(self):
        self.mock_age_verification_service.is_user_age_verified.return_value = False
        vip_info = self.vip_content_service.get_vip_info(self.user_id)
        self.assertIsNone(vip_info) # Service returns None if not age verified

    def test_get_vip_exclusive_content_is_vip(self):
        # User is VIP
        self.mock_db_session.query(UserSegment).filter(UserSegment.user_id == self.vip_user_id).first.return_value = self.mock_vip_segment

        # Mock adult_content_service.get_gallery_for_user to return some items
        mock_gallery_items = [
            AdultContentGalleryItem(id=101, name="VIP Content 1", thumbnail_url="vip1.jpg", highest_unlocked_stage=ContentStageEnum.VIP.value),
            AdultContentGalleryItem(id=102, name="Regular Content", thumbnail_url="reg1.jpg", highest_unlocked_stage=ContentStageEnum.FULL.value),
            AdultContentGalleryItem(id=103, name="VIP Content 2", thumbnail_url="vip2.jpg", highest_unlocked_stage=ContentStageEnum.VIP.value),
        ]
        self.mock_adult_content_service.get_gallery_for_user.return_value = mock_gallery_items

        exclusive_content = self.vip_content_service.get_vip_exclusive_content(self.vip_user_id)

        self.assertEqual(len(exclusive_content), 2) # Should filter to only VIP stage items
        self.assertEqual(exclusive_content[0].id, 101)
        self.assertEqual(exclusive_content[1].id, 103)
        self.mock_adult_content_service.get_gallery_for_user.assert_called_once_with(self.vip_user_id)


    def test_get_vip_exclusive_content_not_vip(self):
        self.mock_db_session.query(UserSegment).filter(UserSegment.user_id == self.user_id).first.return_value = self.mock_non_vip_segment
        exclusive_content = self.vip_content_service.get_vip_exclusive_content(self.user_id)
        self.assertEqual(len(exclusive_content), 0) # Not VIP, should get no exclusive content
        self.mock_adult_content_service.get_gallery_for_user.assert_not_called() # Should short-circuit

    def test_get_vip_exclusive_content_not_age_verified(self):
        self.mock_age_verification_service.is_user_age_verified.return_value = False
        exclusive_content = self.vip_content_service.get_vip_exclusive_content(self.user_id)
        self.assertEqual(len(exclusive_content), 0)
        self.mock_adult_content_service.get_gallery_for_user.assert_not_called()

    def test_apply_vip_discount_is_vip(self):
        self.mock_db_session.query(UserSegment).filter(UserSegment.user_id == self.vip_user_id).first.return_value = self.mock_vip_segment
        original_price = 1000
        discount_rate = VIP_TIERS["Whale"]["discount_percentage"]
        expected_discounted_price = int(original_price * (1 - discount_rate))

        discounted_price = self.vip_content_service.apply_vip_discount(self.vip_user_id, original_price)
        self.assertEqual(discounted_price, expected_discounted_price)

    def test_apply_vip_discount_not_vip(self):
        self.mock_db_session.query(UserSegment).filter(UserSegment.user_id == self.user_id).first.return_value = self.mock_non_vip_segment
        original_price = 1000
        discounted_price = self.vip_content_service.apply_vip_discount(self.user_id, original_price)
        self.assertEqual(discounted_price, original_price) # No discount

    @patch('app.services.vip_content_service.datetime')
    def test_log_vip_access(self, mock_datetime):
        mock_now = datetime(2023, 1, 1, 12, 0, 0)
        mock_datetime.utcnow.return_value = mock_now

        self.vip_content_service._log_vip_access(user_id=self.vip_user_id, content_id=self.content_id,
                                                 access_tier="Test VIP Feature", tokens_spent=50)

        self.mock_db_session.add.assert_called_once()
        added_log = self.mock_db_session.add.call_args[0][0]
        self.assertIsInstance(added_log, VIPAccessLog)
        self.assertEqual(added_log.user_id, self.vip_user_id)
        self.assertEqual(added_log.content_id, self.content_id)
        self.assertEqual(added_log.access_tier, "Test VIP Feature")
        self.assertEqual(added_log.tokens_spent, 50)
        self.assertEqual(added_log.accessed_at, mock_now)
        self.mock_db_session.commit.assert_called_once()

    def test_log_vip_access_not_age_verified(self):
        self.mock_age_verification_service.is_user_age_verified.return_value = False
        self.vip_content_service._log_vip_access(user_id=self.vip_user_id, content_id=self.content_id,
                                                 access_tier="Test VIP Feature", tokens_spent=50)
        self.mock_db_session.add.assert_not_called()


if __name__ == '__main__':
    unittest.main(argv=['first-arg-is-ignored'], exit=False)
