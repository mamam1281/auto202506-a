"""Updated tests for slot machine game service with bet_amount support."""

import pytest
from unittest.mock import MagicMock, patch
import random
from sqlalchemy.orm import Session

from app.services.slot_service import SlotService, SlotSpinResult
from app.repositories.game_repository import GameRepository
from app.services.token_service import TokenService


class TestSlotServiceUpdated:
    """Updated tests for the SlotService class with bet_amount."""

    def setup_method(self):
        """Setup test environment before each test."""
        self.repo = MagicMock(spec=GameRepository)
        self.token_service = MagicMock(spec=TokenService)
        self.db = MagicMock(spec=Session)
        self.service = SlotService(repository=self.repo, token_service=self.token_service)

    def test_spin_success_with_bet_amount(self):
        """Test successful slot spin with bet amount."""
        # Arrange
        user_id = 1
        bet_amount = 10
        self.token_service.deduct_tokens.return_value = bet_amount
        self.token_service.get_token_balance.return_value = 100
        self.repo.get_user_segment.return_value = "Medium"
        self.repo.get_streak.return_value = 0
        
        # Act
        result = self.service.spin(user_id, bet_amount, self.db)
        
        # Assert
        self.token_service.deduct_tokens.assert_called_once_with(user_id, bet_amount)
        self.repo.get_user_segment.assert_called_once_with(self.db, user_id)
        self.repo.get_streak.assert_called_once_with(user_id)
        self.repo.record_action.assert_called_once()
        assert isinstance(result, SlotSpinResult)
        assert hasattr(result, 'result')
        assert hasattr(result, 'reels')
        assert len(result.reels) == 3
        assert hasattr(result, 'tokens_change')
        assert hasattr(result, 'balance')
        assert hasattr(result, 'streak')
        assert hasattr(result, 'animation')

    def test_spin_insufficient_tokens(self):
        """Test slot spin with insufficient tokens."""
        # Arrange
        user_id = 1
        bet_amount = 10
        self.token_service.deduct_tokens.return_value = None
        
        # Act & Assert
        with pytest.raises(ValueError, match="토큰이 부족합니다"):
            self.service.spin(user_id, bet_amount, self.db)

    @patch('random.random')
    def test_spin_result_win_with_reels(self, mock_random):
        """Test slot spin with a win result and reels."""
        # Arrange
        user_id = 1
        bet_amount = 10
        self.token_service.deduct_tokens.return_value = bet_amount
        self.token_service.get_token_balance.return_value = 110
        self.repo.get_user_segment.return_value = "Medium"
        self.repo.get_streak.return_value = 0
        
        # Force a win by setting random to return a value in the win range
        mock_random.return_value = 0.05
        
        # Act
        result = self.service.spin(user_id, bet_amount, self.db)
        
        # Assert
        assert result.result == "win"
        assert result.tokens_change > 0
        assert len(result.reels) == 3
        assert all(1 <= reel <= 9 for reel in result.reels)
        self.token_service.add_tokens.assert_called_once()

    def test_low_segment_coverage(self):
        """Test spin with Low segment to improve coverage."""
        # Arrange
        user_id = 1
        bet_amount = 10
        self.token_service.deduct_tokens.return_value = bet_amount
        self.token_service.get_token_balance.return_value = 90
        self.repo.get_user_segment.return_value = "Low"  # This was missing coverage
        self.repo.get_streak.return_value = 0
        
        with patch('random.random', return_value=0.5):  # Force a loss
            # Act
            result = self.service.spin(user_id, bet_amount, self.db)
            
            # Assert
            assert result.result == "lose"
            assert len(result.reels) == 3
            self.repo.get_user_segment.assert_called_once_with(self.db, user_id)
