import unittest
import asyncio
from unittest.mock import MagicMock, patch, AsyncMock
from datetime import datetime, timedelta, timezone

from app.services.flash_offer_service import FlashOfferService
from app.services.token_service import TokenService
from app.models import FlashOffer, UserReward

class TestFlashOfferService(unittest.TestCase):

    def setUp(self):
        self.mock_token_service = MagicMock(spec=TokenService)
        self.flash_offer_service = FlashOfferService(
            token_service=self.mock_token_service
        )

    def test_flash_offer_service_init(self):
        """FlashOfferService 초기화 테스트"""
        service = FlashOfferService(self.mock_token_service)
        self.assertIsNotNone(service.token_service)

    @patch('app.services.flash_offer_service.SessionLocal')
    def test_create_flash_offer_success(self, mock_session_local):
        """Flash Offer 생성 성공 테스트"""
        # Arrange
        mock_db = MagicMock()
        mock_session_local.return_value = mock_db
        
        # Mock된 FlashOffer 인스턴스
        mock_offer = MagicMock(spec=FlashOffer)
        with patch('app.services.flash_offer_service.FlashOffer', return_value=mock_offer):
            # Act
            result = asyncio.run(self.flash_offer_service.create_flash_offer(
                1, "STAGE_1_UNLOCK", 1000, 700
            ))
            
            # Assert
            mock_db.add.assert_called_once_with(mock_offer)
            mock_db.commit.assert_called_once()
            self.assertEqual(result, mock_offer)

    @patch('app.services.flash_offer_service.SessionLocal')
    def test_get_active_flash_offers_success(self, mock_session_local):
        """활성 Flash Offer 조회 테스트"""
        # Arrange
        mock_db = MagicMock()
        mock_session_local.return_value = mock_db
        
        mock_offers = [
            MagicMock(id=1, user_id=1, content_id=101, is_purchased=False),
            MagicMock(id=2, user_id=1, content_id=102, is_purchased=False)
        ]
        mock_db.query.return_value.filter.return_value.all.return_value = mock_offers
        
        # Act
        result = asyncio.run(self.flash_offer_service.get_active_flash_offers(1))
        
        # Assert
        self.assertEqual(len(result), 2)
        mock_db.query.assert_called_once()

    @patch('app.services.flash_offer_service.SessionLocal')
    def test_process_flash_purchase_success(self, mock_session_local):
        """Flash Offer 구매 처리 성공 테스트"""
        # Arrange
        mock_db = MagicMock()
        mock_session_local.return_value = mock_db
        
        mock_offer = MagicMock()
        mock_offer.id = 1
        mock_offer.user_id = 1
        mock_offer.is_purchased = False  # is_active -> is_purchased
        mock_offer.expires_at = datetime.now(timezone.utc) + timedelta(hours=1)
        mock_offer.discounted_price = 500
        mock_offer.trigger_reason = "STAGE_1_UNLOCK"  # offer_type -> trigger_reason
        
        mock_db.query.return_value.filter.return_value.first.return_value = mock_offer
        self.mock_token_service.deduct_tokens.return_value = 1500  # remaining balance
        
        # Act
        result = asyncio.run(self.flash_offer_service.process_flash_purchase(1, 1))
        
        # Assert
        self.assertTrue(result["success"])
        self.mock_token_service.deduct_tokens.assert_called_once_with(1, 500)
        mock_db.add.assert_called_once()
        mock_db.commit.assert_called_once()

    @patch('app.services.flash_offer_service.SessionLocal')
    def test_process_flash_purchase_offer_not_found(self, mock_session_local):
        """Flash Offer가 없는 경우 테스트"""
        # Arrange
        mock_db = MagicMock()
        mock_session_local.return_value = mock_db
        mock_db.query.return_value.filter.return_value.first.return_value = None
        
        # Act
        result = asyncio.run(self.flash_offer_service.process_flash_purchase(1, 999))
        
        # Assert
        self.assertFalse(result["success"])
        self.assertEqual(result["message"], "Invalid or expired offer")

    @patch('app.services.flash_offer_service.SessionLocal')
    def test_process_flash_purchase_insufficient_tokens(self, mock_session_local):
        """토큰 부족 시 테스트"""
        # Arrange
        mock_db = MagicMock()
        mock_session_local.return_value = mock_db
        
        mock_offer = MagicMock()
        mock_offer.is_active = True
        mock_offer.expires_at = datetime.now(timezone.utc) + timedelta(hours=1)
        mock_offer.discounted_price = 500
        
        mock_db.query.return_value.filter.return_value.first.return_value = mock_offer
        self.mock_token_service.deduct_tokens.side_effect = ValueError("Insufficient tokens")
        
        # Act
        result = asyncio.run(self.flash_offer_service.process_flash_purchase(1, 1))
        
        # Assert
        self.assertFalse(result["success"])
        self.assertEqual(result["message"], "Insufficient tokens")

    @patch('app.services.flash_offer_service.SessionLocal')
    def test_reject_or_expire_flash_offer_success(self, mock_session_local):
        """Flash Offer 거절/만료 처리 테스트"""
        # Arrange
        mock_db = MagicMock()
        mock_session_local.return_value = mock_db
        
        mock_offer = MagicMock()
        mock_db.query.return_value.filter.return_value.first.return_value = mock_offer
        
        # Act
        result = asyncio.run(self.flash_offer_service.reject_or_expire_flash_offer(1))
        
        # Assert
        self.assertTrue(result)
        self.assertTrue(mock_offer.is_purchased)  # is_active -> is_purchased 체크
        mock_db.commit.assert_called_once()

if __name__ == '__main__':
    unittest.main()
