import unittest
from unittest.mock import MagicMock, patch, call
from datetime import datetime, timedelta

from app.services.flash_offer_service import FlashOfferService, FlashOfferTrigger, INITIAL_DISCOUNT_RATE, FLASH_OFFER_DURATION_MINUTES
from app.services.token_service import TokenService
from app.services.age_verification_service import AgeVerificationService
# STAGE_DETAILS and ContentStageEnum are imported by flash_offer_service itself.
from app.services.adult_content_service import ContentStageEnum
from app.models import User, AdultContent, FlashOffer, UserReward # UserReward for checking unlock records
from app.schemas import FlashOfferPurchaseRequest # For process_flash_purchase

class TestFlashOfferService(unittest.TestCase):

    def setUp(self):
        self.mock_db_session = MagicMock()
        self.mock_token_service = MagicMock(spec=TokenService)
        self.mock_age_verification_service = MagicMock(spec=AgeVerificationService)
        # adult_content_service is not directly used by methods in the final version of FlashOfferService,
        # as STAGE_DETAILS is imported directly for price. If it were used, it would be mocked.
        self.mock_adult_content_service = MagicMock()

        self.flash_offer_service = FlashOfferService(
            db=self.mock_db_session,
            token_service=self.mock_token_service,
            age_verification_service=self.mock_age_verification_service,
            adult_content_service=self.mock_adult_content_service
        )

        self.user_id = 1
        self.content_id = 101
        self.mock_content = AdultContent(id=self.content_id, name="Test Flash Content")

        # Default age verification to True
        self.mock_age_verification_service.is_user_age_verified.return_value = True

        self.fixed_now = datetime(2023, 1, 1, 12, 0, 0)


    @patch('app.services.flash_offer_service.datetime')
    def test_create_flash_offer_success(self, mock_datetime):
        mock_datetime.utcnow.return_value = self.fixed_now

        self.mock_db_session.query(FlashOffer).filter(...).first.return_value = None # No existing offer
        self.mock_db_session.query(AdultContent).filter(AdultContent.id == self.content_id).first.return_value = self.mock_content

        # _get_content_original_price uses STAGE_DETAILS, assuming ContentStageEnum.FULL cost is 1000
        # from app.services.adult_content_service import STAGE_DETAILS
        # original_price = STAGE_DETAILS[ContentStageEnum.FULL]["cost"] # This would be 1000
        original_price = 1000 # Hardcode for clarity based on STAGE_DETAILS[ContentStageEnum.FULL]

        response_item = self.flash_offer_service.create_flash_offer(
            user_id=self.user_id,
            content_id=self.content_id,
            trigger_reason=FlashOfferTrigger.GAME_FAILURE
        )

        self.assertIsNotNone(response_item)
        self.mock_db_session.add.assert_called_once()
        added_offer = self.mock_db_session.add.call_args[0][0]

        self.assertIsInstance(added_offer, FlashOffer)
        self.assertEqual(added_offer.user_id, self.user_id)
        self.assertEqual(added_offer.content_id, self.content_id)
        self.assertEqual(added_offer.original_price, original_price)
        self.assertEqual(added_offer.discount_rate, INITIAL_DISCOUNT_RATE)
        self.assertEqual(added_offer.discounted_price, int(original_price * (1 - INITIAL_DISCOUNT_RATE)))
        self.assertEqual(added_offer.trigger_reason, FlashOfferTrigger.GAME_FAILURE.value)
        self.assertEqual(added_offer.created_at, self.fixed_now)
        self.assertEqual(added_offer.expires_at, self.fixed_now + timedelta(minutes=FLASH_OFFER_DURATION_MINUTES))
        self.assertFalse(added_offer.is_purchased)

        self.mock_db_session.commit.assert_called_once()
        self.mock_db_session.refresh.assert_called_once_with(added_offer)

        self.assertEqual(response_item.content_name, self.mock_content.name)


    def test_create_flash_offer_not_age_verified(self):
        self.mock_age_verification_service.is_user_age_verified.return_value = False
        with self.assertRaisesRegex(ValueError, "Age verification required"):
            self.flash_offer_service.create_flash_offer(self.user_id, self.content_id, FlashOfferTrigger.GAME_FAILURE)
        self.mock_db_session.add.assert_not_called()

    def test_create_flash_offer_existing_active_offer(self):
        self.mock_db_session.query(FlashOffer).filter(...).first.return_value = MagicMock(spec=FlashOffer) # Existing offer
        with self.assertRaisesRegex(ValueError, "Active flash offer already exists"):
            self.flash_offer_service.create_flash_offer(self.user_id, self.content_id, FlashOfferTrigger.GAME_FAILURE)

    def test_get_active_flash_offers_returns_active(self):
        mock_offer_db = FlashOffer(id=1, user_id=self.user_id, content_id=self.content_id, original_price=1000,
                                discounted_price=700, discount_rate=0.3, expires_at=datetime.utcnow() + timedelta(hours=1),
                                trigger_reason="test", is_purchased=False)
        self.mock_db_session.query(FlashOffer, AdultContent.name).join(...).filter(...).all.return_value = [(mock_offer_db, "Test Content")]

        response = self.flash_offer_service.get_active_flash_offers(self.user_id)
        self.assertEqual(len(response.offers), 1)
        self.assertEqual(response.offers[0].offer_id, mock_offer_db.id)

    def test_get_active_flash_offers_not_age_verified(self):
        self.mock_age_verification_service.is_user_age_verified.return_value = False
        response = self.flash_offer_service.get_active_flash_offers(self.user_id)
        self.assertEqual(len(response.offers), 0)

    @patch('app.services.flash_offer_service.datetime')
    def test_process_flash_purchase_success(self, mock_datetime):
        mock_datetime.utcnow.return_value = self.fixed_now

        mock_db_offer = FlashOffer(
            id=1, user_id=self.user_id, content_id=self.content_id,
            original_price=1000, discounted_price=700, discount_rate=0.3,
            expires_at=self.fixed_now + timedelta(hours=1), # Not expired
            is_purchased=False, trigger_reason="test"
            # target_stage_name=ContentStageEnum.FULL.value # If model had this
        )
        self.mock_db_session.query(FlashOffer, AdultContent.name).join(...).filter(...).first.return_value = (mock_db_offer, "Test Content")

        # Mock token deduction
        self.mock_token_service.deduct_tokens.return_value = 1300 # Remaining tokens

        purchase_request = FlashOfferPurchaseRequest() # Empty as per schema
        response = self.flash_offer_service.process_flash_purchase(self.user_id, offer_id=1, purchase_request=purchase_request)

        self.assertEqual(response.status, "success")
        self.assertTrue(mock_db_offer.is_purchased)
        self.assertEqual(mock_db_offer.purchased_at, self.fixed_now)
        self.mock_token_service.deduct_tokens.assert_called_once_with(self.user_id, mock_db_offer.discounted_price)

        # Check that UserReward was created for content unlock
        self.mock_db_session.add.assert_called_once()
        added_unlock_record = self.mock_db_session.add.call_args[0][0]
        self.assertIsInstance(added_unlock_record, UserReward)
        self.assertEqual(added_unlock_record.user_id, self.user_id)
        self.assertEqual(added_unlock_record.reward_type, "CONTENT_UNLOCK")
        # Assumes FULL stage as per service logic if target_stage_name is not on FlashOffer model
        self.assertEqual(added_unlock_record.reward_value, f"{self.content_id}_{ContentStageEnum.FULL.value}")

        self.mock_db_session.commit.assert_called_once() # Should be called once for all changes
        self.mock_db_session.refresh.assert_called_once_with(mock_db_offer)
        self.assertIsNotNone(response.purchased_offer)
        self.assertEqual(response.purchased_offer.offer_id, 1)


    def test_process_flash_purchase_offer_expired(self):
        mock_db_offer = FlashOffer(id=1, user_id=self.user_id, expires_at=datetime.utcnow() - timedelta(hours=1))
        self.mock_db_session.query(FlashOffer, AdultContent.name).join(...).filter(...).first.return_value = (mock_db_offer, "Test Content")

        with self.assertRaisesRegex(ValueError, "Flash offer has expired"):
            self.flash_offer_service.process_flash_purchase(self.user_id, 1, FlashOfferPurchaseRequest())
        self.mock_token_service.deduct_tokens.assert_not_called()

    def test_process_flash_purchase_insufficient_tokens(self):
        mock_db_offer = FlashOffer(id=1, user_id=self.user_id, discounted_price=700, expires_at=datetime.utcnow() + timedelta(hours=1), is_purchased=False)
        self.mock_db_session.query(FlashOffer, AdultContent.name).join(...).filter(...).first.return_value = (mock_db_offer, "Test Content")
        self.mock_token_service.deduct_tokens.side_effect = ValueError("Insufficient tokens")

        with self.assertRaisesRegex(ValueError, "Insufficient tokens"):
            self.flash_offer_service.process_flash_purchase(self.user_id, 1, FlashOfferPurchaseRequest())
        self.assertFalse(mock_db_offer.is_purchased) # Ensure not marked purchased

    def test_reject_or_expire_flash_offer_reject_active(self):
        mock_flash_offer = FlashOffer(id=1, user_id=self.user_id, is_purchased=False, expires_at=datetime.utcnow() + timedelta(hours=1))
        self.mock_db_session.query(FlashOffer).filter(...).first.return_value = mock_flash_offer

        response = self.flash_offer_service.reject_or_expire_flash_offer(self.user_id, 1)
        self.assertEqual(response.status, "success")
        self.assertEqual(response.message, "Flash offer rejected/removed.")
        self.mock_db_session.delete.assert_called_once_with(mock_flash_offer)
        self.mock_db_session.commit.assert_called_once()

    def test_reject_or_expire_flash_offer_already_expired(self):
        mock_flash_offer = FlashOffer(id=1, user_id=self.user_id, is_purchased=False, expires_at=datetime.utcnow() - timedelta(hours=1))
        self.mock_db_session.query(FlashOffer).filter(...).first.return_value = mock_flash_offer

        response = self.flash_offer_service.reject_or_expire_flash_offer(self.user_id, 1)
        self.assertEqual(response.status, "success")
        self.assertEqual(response.message, "Flash offer was already expired.")
        self.mock_db_session.delete.assert_not_called() # Should not delete if just confirming expiry
        self.mock_db_session.commit.assert_called_once() # Commit might still be called even if no change

if __name__ == '__main__':
    unittest.main(argv=['first-arg-is-ignored'], exit=False)
```
