import unittest
from unittest.mock import MagicMock, patch, call # Added call
from datetime import datetime, timedelta, timezone

from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError # For testing commit failures

from app.services.flash_offer_service import FlashOfferService, FlashOfferTrigger
from app.services.adult_content_service import ContentStageEnum, STAGE_DETAILS # STAGE_DETAILS for reference if not mocking _get_content_original_price
from app.services.token_service import TokenService
from app.services.age_verification_service import AgeVerificationService
from app.services.reward_service import RewardService

from app.models import FlashOffer, AdultContent, UserReward # UserReward for reward_service interaction
from app.schemas import FlashOfferResponseItem, ActiveFlashOffersResponse, FlashOfferPurchaseResponse, FlashOfferActionResponse # For type hints and structure validation

class TestFlashOfferService(unittest.TestCase):

    def setUp(self):
        self.mock_db_session = MagicMock(spec=Session)
        self.mock_token_service = MagicMock(spec=TokenService)
        self.mock_age_verification_service = MagicMock(spec=AgeVerificationService)
        self.mock_reward_service = MagicMock(spec=RewardService)

        # Assuming adult_content_service is not strictly needed or will be removed from __init__
        # If FlashOfferService constructor is updated to not require adult_content_service,
        # this can be removed. For now, providing a generic mock.
        self.mock_adult_content_service = MagicMock()

        self.flash_offer_service = FlashOfferService(
            db=self.mock_db_session,
            token_service=self.mock_token_service,
            age_verification_service=self.mock_age_verification_service,
            reward_service=self.mock_reward_service,
            adult_content_service=self.mock_adult_content_service
        )

        # Patch: DB 커밋/refresh 후 id가 None이 되지 않도록 add된 객체에 id를 명시적으로 할당
        def add_side_effect(obj):
            if isinstance(obj, FlashOffer) and obj.id is None:
                obj.id = 123  # 임의의 유효한 int

        self.mock_db_session.add.side_effect = add_side_effect

        def refresh_side_effect(obj):
            if isinstance(obj, FlashOffer) and obj.id is None:
                obj.id = 123 # Ensure ID is set if not present
        self.mock_db_session.refresh.side_effect = refresh_side_effect

    # --- Tests for create_flash_offer ---

    @patch.object(FlashOfferService, '_get_content_original_price')
    def test_create_flash_offer_success(self, mock_get_original_price):
        # Arrange
        user_id = 1
        content_id = 101
        trigger_reason = FlashOfferTrigger.GAME_FAILURE
        target_stage = ContentStageEnum.FULL
        mock_original_price = 1000

        self.mock_age_verification_service.is_user_age_verified.return_value = True
        # Mock the query for existing offers to return None (no active offer)
        self.mock_db_session.query(FlashOffer).filter().with_for_update().first.return_value = None

        mock_content = MagicMock(spec=AdultContent)
        mock_content.id = content_id
        mock_content.name = "Test Content"
        # Mock the query for content
        self.mock_db_session.query(AdultContent).filter().first.return_value = mock_content

        mock_get_original_price.return_value = mock_original_price

        # Act
        response_item = self.flash_offer_service.create_flash_offer(
            user_id, content_id, trigger_reason, target_stage
        )

        # Assert
        self.mock_age_verification_service.is_user_age_verified.assert_called_once_with(user_id)
        self.mock_db_session.add.assert_called_once()
        added_offer = self.mock_db_session.add.call_args[0][0]

        self.assertIsInstance(added_offer, FlashOffer)
        self.assertEqual(added_offer.user_id, user_id)
        self.assertEqual(added_offer.content_id, content_id)
        self.assertEqual(added_offer.target_stage_name, target_stage.value)
        self.assertEqual(added_offer.original_price, mock_original_price)
        # Assuming INITIAL_DISCOUNT_RATE = 0.3 from service file
        self.assertEqual(added_offer.discounted_price, int(mock_original_price * (1 - 0.3)))
        self.assertEqual(added_offer.trigger_reason, trigger_reason.value)
        self.assertFalse(added_offer.is_purchased)
        
        # Handle timezone-aware datetime comparison
        expected_expiry = datetime.now(timezone.utc) + timedelta(minutes=15)
        actual_expiry = added_offer.expires_at
        if actual_expiry.tzinfo is None:
            actual_expiry = actual_expiry.replace(tzinfo=timezone.utc)
        
        time_diff = abs((actual_expiry - expected_expiry).total_seconds())
        self.assertLess(time_diff, 10)  # Allow 10 seconds tolerance

        self.mock_db_session.commit.assert_called_once()
        self.mock_db_session.refresh.assert_called_once_with(added_offer)

        self.assertIsInstance(response_item, FlashOfferResponseItem)
        self.assertEqual(response_item.content_id, content_id)
        self.assertEqual(response_item.target_stage_name, target_stage.value)
        self.assertEqual(response_item.original_price, mock_original_price)

    def test_create_flash_offer_age_verification_fails(self):
        # Arrange
        self.mock_age_verification_service.is_user_age_verified.return_value = False

        # Act & Assert
        with self.assertRaisesRegex(ValueError, "Age verification required"):
            self.flash_offer_service.create_flash_offer(1, 101, FlashOfferTrigger.GAME_FAILURE)
        self.mock_db_session.add.assert_not_called()

    @patch.object(FlashOfferService, '_get_content_original_price')
    def test_create_flash_offer_content_not_found(self, mock_get_original_price):
        # Arrange
        self.mock_age_verification_service.is_user_age_verified.return_value = True
        self.mock_db_session.query(AdultContent).filter().first.return_value = None

        # Act & Assert
        with self.assertRaisesRegex(ValueError, "Content not found for flash offer"):
            self.flash_offer_service.create_flash_offer(1, 101, FlashOfferTrigger.GAME_FAILURE)
        self.mock_db_session.add.assert_not_called()

    @patch.object(FlashOfferService, '_get_content_original_price')
    def test_create_flash_offer_existing_active_offer_is_updated(self, mock_get_original_price):
        # Arrange
        user_id = 1; content_id = 101; mock_original_price = 1000
        self.mock_age_verification_service.is_user_age_verified.return_value = True

        # Mock existing offer that is still "active" by time but should be replaced
        existing_offer = MagicMock(spec=FlashOffer)
        existing_offer.user_id = user_id
        existing_offer.content_id = content_id
        existing_offer.is_purchased = False
        # Set expires_at to a timezone-aware time that implies it's active
        initial_expiry = datetime.now(timezone.utc) + timedelta(minutes=5)
        existing_offer.expires_at = initial_expiry

        self.mock_db_session.query(FlashOffer).filter().with_for_update().first.return_value = existing_offer

        mock_content = MagicMock(spec=AdultContent); mock_content.id = content_id; mock_content.name = "Test"
        self.mock_db_session.query(AdultContent).filter().first.return_value = mock_content
        mock_get_original_price.return_value = mock_original_price

        # Act
        self.flash_offer_service.create_flash_offer(user_id, content_id, FlashOfferTrigger.GAME_FAILURE)

        # Assert
        # The existing offer's expires_at should be set to now (or very close to it)
        expected_expiry = datetime.now(timezone.utc)
        time_diff = abs((existing_offer.expires_at - expected_expiry).total_seconds())
        self.assertLess(time_diff, 5)

        self.assertEqual(self.mock_db_session.add.call_count, 1) # New offer added
        # Commit for expiring old offer, commit for adding new offer
        self.assertEqual(self.mock_db_session.commit.call_count, 2)


    # --- Tests for get_active_flash_offers ---
    def test_get_active_flash_offers_exist(self):
        # Arrange
        user_id = 1
        self.mock_age_verification_service.is_user_age_verified.return_value = True

        mock_offer_1 = FlashOffer(
            id=1, user_id=user_id, content_id=101, target_stage_name="Full", 
            original_price=100, discounted_price=50, discount_rate=0.5, 
            expires_at=datetime.now(timezone.utc) + timedelta(hours=1), 
            trigger_reason="test"
        )
        mock_offer_2 = FlashOffer(
            id=2, user_id=user_id, content_id=102, target_stage_name="Partial", 
            original_price=200, discounted_price=100, discount_rate=0.5, 
            expires_at=datetime.now(timezone.utc) + timedelta(hours=1), 
            trigger_reason="test2"
        )

        self.mock_db_session.query(FlashOffer, AdultContent.name).join().filter().all.return_value = [
            (mock_offer_1, "Content 101"),
            (mock_offer_2, "Content 102")
        ]

        # Act
        response = self.flash_offer_service.get_active_flash_offers(user_id)

        # Assert
        self.assertIsInstance(response, ActiveFlashOffersResponse)
        self.assertEqual(len(response.offers), 2)
        self.assertEqual(response.offers[0].offer_id, mock_offer_1.id)
        self.assertEqual(response.offers[0].target_stage_name, "Full")
        self.assertEqual(response.offers[1].content_name, "Content 102")
        self.assertEqual(response.offers[1].target_stage_name, "Partial")

    def test_get_active_flash_offers_none_exist(self):
        self.mock_age_verification_service.is_user_age_verified.return_value = True
        self.mock_db_session.query(FlashOffer, AdultContent.name).join().filter().all.return_value = []
        response = self.flash_offer_service.get_active_flash_offers(1)
        self.assertEqual(len(response.offers), 0)

    def test_get_active_flash_offers_age_verification_fails(self):
        self.mock_age_verification_service.is_user_age_verified.return_value = False
        response = self.flash_offer_service.get_active_flash_offers(1)
        self.assertEqual(len(response.offers), 0)
        self.mock_db_session.query.assert_not_called()


    # --- Tests for process_flash_purchase ---
    def test_process_flash_purchase_success(self):
        user_id = 1; offer_id = 10; content_id = 101; target_stage_str = "Full"; discounted_price = 500
        self.mock_age_verification_service.is_user_age_verified.return_value = True

        mock_offer_db = FlashOffer(
            id=offer_id, user_id=user_id, content_id=content_id,
            target_stage_name=target_stage_str, discounted_price=discounted_price,
            is_purchased=False, expires_at=datetime.now(timezone.utc) + timedelta(hours=1),
            original_price=1000, discount_rate=0.5, trigger_reason="test"
        )
        self.mock_db_session.query(FlashOffer, AdultContent.name).join().filter().first.return_value = (mock_offer_db, "Test Content")

        response = self.flash_offer_service.process_flash_purchase(user_id, offer_id, MagicMock())

        self.mock_token_service.deduct_tokens.assert_called_once_with(user_id, discounted_price)
        self.mock_reward_service.grant_content_unlock.assert_called_once_with(
            user_id=user_id, content_id=content_id, stage_name=target_stage_str,
            source_description=f"Flash offer purchase: ID {offer_id}"
        )
        self.assertTrue(mock_offer_db.is_purchased)
        self.assertIsNotNone(mock_offer_db.purchased_at)
        self.mock_db_session.commit.assert_called_once()
        self.mock_db_session.refresh.assert_called_once_with(mock_offer_db)
        self.assertEqual(response.status, "success")

    def test_process_flash_purchase_offer_not_found(self):
        self.mock_age_verification_service.is_user_age_verified.return_value = True
        self.mock_db_session.query(FlashOffer, AdultContent.name).join().filter().first.return_value = None
        with self.assertRaisesRegex(ValueError, "Flash offer not found"):
            self.flash_offer_service.process_flash_purchase(1, 10, MagicMock())

    def test_process_flash_purchase_already_purchased(self):
        self.mock_age_verification_service.is_user_age_verified.return_value = True
        mock_offer_db = FlashOffer(
            id=10, 
            is_purchased=True, 
            expires_at=datetime.now(timezone.utc) + timedelta(hours=1)
        )
        self.mock_db_session.query(FlashOffer, AdultContent.name).join().filter().first.return_value = (mock_offer_db, "Content")
        with self.assertRaisesRegex(ValueError, "Flash offer already purchased"):
            self.flash_offer_service.process_flash_purchase(1, 10, MagicMock())

    def test_process_flash_purchase_insufficient_tokens(self):
        self.mock_age_verification_service.is_user_age_verified.return_value = True
        mock_offer_db = FlashOffer(
            id=10, 
            is_purchased=False, 
            expires_at=datetime.now(timezone.utc) + timedelta(hours=1)
        )
        self.mock_db_session.query(FlashOffer, AdultContent.name).join().filter().first.return_value = (mock_offer_db, "Content")
        self.mock_token_service.deduct_tokens.side_effect = ValueError("Insufficient tokens")
        with self.assertRaisesRegex(ValueError, "Insufficient tokens"):
            self.flash_offer_service.process_flash_purchase(1, 10, MagicMock())
        self.mock_reward_service.grant_content_unlock.assert_not_called()

    def test_process_flash_purchase_reward_service_fails_rolls_back_main_commit(self):
        user_id=1; offer_id=10; content_id=101; target_stage_str="Full"; discounted_price=500
        self.mock_age_verification_service.is_user_age_verified.return_value = True
        mock_offer_db = FlashOffer(
            id=offer_id, user_id=user_id, content_id=content_id, 
            target_stage_name=target_stage_str, discounted_price=discounted_price, 
            is_purchased=False, expires_at=datetime.now(timezone.utc) + timedelta(hours=1)
        )
        self.mock_db_session.query(FlashOffer, AdultContent.name).join().filter().first.return_value = (mock_offer_db, "Content")

        # RewardService's grant_content_unlock now includes a commit. If that commit fails, it should rollback and re-raise.
        # The process_flash_purchase service has its own commit for the offer status.
        self.mock_reward_service.grant_content_unlock.side_effect = SQLAlchemyError("Reward grant failed")

        with self.assertRaises(SQLAlchemyError):
             self.flash_offer_service.process_flash_purchase(user_id, offer_id, MagicMock())

        self.mock_token_service.deduct_tokens.assert_called_once()
        self.mock_reward_service.grant_content_unlock.assert_called_once()
        # The main commit in process_flash_purchase for the offer status should not be called if grant_content_unlock fails.
        self.mock_db_session.commit.assert_not_called()
        self.assertFalse(mock_offer_db.is_purchased) # Ensure offer status was not changed

    def test_process_flash_purchase_invalid_target_stage_name_on_offer(self):
        user_id=1; offer_id=10; invalid_stage_str="InvalidStage"
        self.mock_age_verification_service.is_user_age_verified.return_value = True
        mock_offer_db = FlashOffer(
            id=offer_id, 
            target_stage_name=invalid_stage_str, 
            is_purchased=False, 
            expires_at=datetime.now(timezone.utc) + timedelta(hours=1)
        )
        self.mock_db_session.query(FlashOffer, AdultContent.name).join().filter().first.return_value = (mock_offer_db, "Content")

        with self.assertRaisesRegex(ValueError, f"Invalid target stage '{invalid_stage_str}' configured"):
            self.flash_offer_service.process_flash_purchase(user_id, offer_id, MagicMock())
        self.mock_reward_service.grant_content_unlock.assert_not_called()

    # --- Tests for reject_or_expire_flash_offer ---
    def test_reject_or_expire_flash_offer_success_reject_active(self):
        user_id = 1; offer_id = 10
        self.mock_age_verification_service.is_user_age_verified.return_value = True
        mock_offer = FlashOffer(
            id=offer_id, 
            user_id=user_id, 
            is_purchased=False, 
            expires_at=datetime.now(timezone.utc) + timedelta(hours=1)
        )
        self.mock_db_session.query(FlashOffer).filter().first.return_value = mock_offer

        response = self.flash_offer_service.reject_or_expire_flash_offer(user_id, offer_id)

        self.mock_db_session.delete.assert_called_once_with(mock_offer)
        self.mock_db_session.commit.assert_called_once()
        self.assertEqual(response.status, "success")
        self.assertEqual(response.message, "Flash offer rejected/removed.")

    def test_reject_or_expire_flash_offer_already_expired_no_action(self):
        user_id = 1; offer_id = 10
        self.mock_age_verification_service.is_user_age_verified.return_value = True
        # Offer is expired AND not purchased
        mock_offer = FlashOffer(
            id=offer_id, 
            user_id=user_id, 
            is_purchased=False, 
            expires_at=datetime.now(timezone.utc) - timedelta(hours=1)
        )
        self.mock_db_session.query(FlashOffer).filter().first.return_value = mock_offer

        response = self.flash_offer_service.reject_or_expire_flash_offer(user_id, offer_id)

        self.mock_db_session.delete.assert_not_called()
        self.mock_db_session.commit.assert_called_once()
        self.assertEqual(response.message, "Flash offer was already expired.")

    def test_reject_or_expire_flash_offer_not_found(self):
        self.mock_age_verification_service.is_user_age_verified.return_value = True
        self.mock_db_session.query(FlashOffer).filter().first.return_value = None
        with self.assertRaisesRegex(ValueError, "Flash offer not found"):
            self.flash_offer_service.reject_or_expire_flash_offer(1,10)

    def test_reject_or_expire_flash_offer_already_purchased_fails(self):
        self.mock_age_verification_service.is_user_age_verified.return_value = True
        mock_offer = FlashOffer(id=10, is_purchased=True)
        self.mock_db_session.query(FlashOffer).filter().first.return_value = mock_offer
        with self.assertRaisesRegex(ValueError, "Cannot reject an already purchased offer"):
            self.flash_offer_service.reject_or_expire_flash_offer(1,10)


if __name__ == '__main__':
    unittest.main()
