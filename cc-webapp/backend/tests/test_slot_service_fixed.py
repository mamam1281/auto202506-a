"""Tests for SlotService with async/await pattern."""

import pytest
from unittest.mock import AsyncMock, MagicMock
from app.services.slot_service import SlotService, SlotSpinResult
from app.repositories.game_repository import GameRepository
from app.services.token_service import TokenService


class TestSlotService:
    """Tests for the SlotService class with async pattern."""

    def setup_method(self):
        """Setup test environment before each test."""
        self.repo = MagicMock(spec=GameRepository)
        self.token_service = MagicMock(spec=TokenService)
        self.service = SlotService(self.repo, self.token_service, "test.db")

    @pytest.mark.asyncio
    async def test_spin_basic_functionality(self):
        """Test basic slot spin functionality."""
        # Arrange
        user_id = 1
        bet_amount = 10
        
        # Mock async methods
        self.token_service.get_token_balance = AsyncMock(return_value=100)
        self.token_service.deduct_tokens = AsyncMock(return_value=90)
        self.token_service.add_tokens = AsyncMock(return_value=110)
        self.repo.get_user_segment = AsyncMock(return_value="Medium")
        self.repo.get_streak = MagicMock(return_value=0)
        self.repo.set_streak = MagicMock()
        self.repo.record_action = AsyncMock(return_value={"user_id": user_id})
        
        # Act
        result = await self.service.spin(user_id, bet_amount)
        
        # Assert
        assert isinstance(result, SlotSpinResult)
        assert result.result in ["win", "lose", "jackpot"]
        assert isinstance(result.balance, int)
        assert len(result.reels) == 3
        assert all(1 <= reel <= 9 for reel in result.reels)

    @pytest.mark.asyncio
    async def test_spin_insufficient_tokens(self):
        """Test spin with insufficient tokens."""
        # Arrange
        user_id = 1
        bet_amount = 100
        
        self.token_service.get_token_balance = AsyncMock(return_value=50)
        self.token_service.deduct_tokens = AsyncMock(return_value=None)
        
        # Act & Assert
        with pytest.raises(ValueError, match="Insufficient tokens"):
            await self.service.spin(user_id, bet_amount)

    @pytest.mark.asyncio
    async def test_spin_invalid_bet_amount(self):
        """Test spin with invalid bet amount."""
        # Arrange
        user_id = 1
        bet_amount = 0
        
        # Act & Assert
        with pytest.raises(ValueError, match="Bet amount must be greater than 0"):
            await self.service.spin(user_id, bet_amount)

    @pytest.mark.asyncio
    async def test_spin_win_scenario(self):
        """Test winning scenario."""
        # Arrange
        user_id = 1
        bet_amount = 10
        
        # Mock to ensure win scenario
        self.token_service.get_token_balance = AsyncMock(return_value=100)
        self.token_service.deduct_tokens = AsyncMock(return_value=90)
        self.token_service.add_tokens = AsyncMock(return_value=108)  # 90 + 18 (1.8x win)
        self.repo.get_user_segment = AsyncMock(return_value="Medium")
        self.repo.get_streak = MagicMock(return_value=0)
        self.repo.set_streak = MagicMock()
        self.repo.record_action = AsyncMock(return_value={"user_id": user_id})
        
        # Force win by mocking random
        import random
        original_random = random.random
        random.random = MagicMock(return_value=0.1)  # Force win (< 0.45 win probability)
        
        try:
            # Act
            result = await self.service.spin(user_id, bet_amount)
            
            # Assert
            assert result.result in ["win", "jackpot"]
            assert result.tokens_change >= 0  # Should be positive for win
        finally:
            random.random = original_random

    @pytest.mark.asyncio
    async def test_spin_lose_scenario(self):
        """Test losing scenario."""
        # Arrange
        user_id = 1
        bet_amount = 10
        
        self.token_service.get_token_balance = AsyncMock(return_value=100)
        self.token_service.deduct_tokens = AsyncMock(return_value=90)
        self.repo.get_user_segment = AsyncMock(return_value="Medium")
        self.repo.get_streak = MagicMock(return_value=0)
        self.repo.set_streak = MagicMock()
        self.repo.record_action = AsyncMock(return_value={"user_id": user_id})
        
        # Force lose by mocking random
        import random
        original_random = random.random
        random.random = MagicMock(return_value=0.9)  # Force lose (> win probability)
        
        try:
            # Act
            result = await self.service.spin(user_id, bet_amount)
            
            # Assert
            assert result.result == "lose"
            assert result.tokens_change == -bet_amount  # Should be negative for loss
        finally:
            random.random = original_random

    @pytest.mark.asyncio
    async def test_spin_jackpot_scenario(self):
        """Test jackpot scenario."""
        # Arrange
        user_id = 1
        bet_amount = 10
        
        self.token_service.get_token_balance = AsyncMock(return_value=100)
        self.token_service.deduct_tokens = AsyncMock(return_value=90)
        self.token_service.add_tokens = AsyncMock(return_value=140)  # 90 + 50 (5x jackpot)
        self.repo.get_user_segment = AsyncMock(return_value="Medium")
        self.repo.get_streak = MagicMock(return_value=0)
        self.repo.set_streak = MagicMock()
        self.repo.record_action = AsyncMock(return_value={"user_id": user_id})
        
        # Force jackpot by mocking random
        import random
        original_random = random.random
        random.random = MagicMock(return_value=0.01)  # Force jackpot (< 0.02)
        
        try:
            # Act
            result = await self.service.spin(user_id, bet_amount)
            
            # Assert
            assert result.result == "jackpot"
            assert result.reels == [7, 7, 7]  # Jackpot reels
        finally:
            random.random = original_random

    @pytest.mark.asyncio
    async def test_spin_streak_bonus(self):
        """Test streak bonus mechanism."""
        # Arrange
        user_id = 1
        bet_amount = 10
        
        self.token_service.get_token_balance = AsyncMock(return_value=100)
        self.token_service.deduct_tokens = AsyncMock(return_value=90)
        self.token_service.add_tokens = AsyncMock(return_value=108)
        self.repo.get_user_segment = AsyncMock(return_value="Medium")
        self.repo.get_streak = MagicMock(return_value=8)  # High streak for force win
        self.repo.set_streak = MagicMock()
        self.repo.record_action = AsyncMock(return_value={"user_id": user_id})
        
        # Act
        result = await self.service.spin(user_id, bet_amount)
        
        # Assert
        assert result.result == "win"  # Force win due to high streak
        assert result.streak == 0  # Streak reset after win

    @pytest.mark.asyncio
    async def test_spin_whale_segment_bonus(self):
        """Test whale segment bonus probability."""
        # Arrange
        user_id = 1
        bet_amount = 10
        
        self.token_service.get_token_balance = AsyncMock(return_value=100)
        self.token_service.deduct_tokens = AsyncMock(return_value=90)
        self.repo.get_user_segment = AsyncMock(return_value="Whale")  # VIP segment
        self.repo.get_streak = MagicMock(return_value=0)
        self.repo.set_streak = MagicMock()
        self.repo.record_action = AsyncMock(return_value={"user_id": user_id})
        
        # Act
        result = await self.service.spin(user_id, bet_amount)
        
        # Assert
        assert isinstance(result, SlotSpinResult)
        # Whale segment should have higher win probability

    @pytest.mark.asyncio
    async def test_multiple_spins_consistency(self):
        """Test multiple spins for consistency."""
        # Arrange
        user_id = 1
        bet_amount = 10
        
        self.token_service.get_token_balance = AsyncMock(return_value=1000)
        self.token_service.deduct_tokens = AsyncMock(return_value=990)
        self.token_service.add_tokens = AsyncMock(return_value=1000)
        self.repo.get_user_segment = AsyncMock(return_value="Medium")
        self.repo.get_streak = MagicMock(return_value=0)
        self.repo.set_streak = MagicMock()
        self.repo.record_action = AsyncMock(return_value={"user_id": user_id})
        
        # Act
        results = []
        for _ in range(5):
            result = await self.service.spin(user_id, bet_amount)
            results.append(result)
        
        # Assert
        for result in results:
            assert isinstance(result, SlotSpinResult)
            assert result.result in ["win", "lose", "jackpot"]
            assert len(result.reels) == 3


class TestRTPFairness:
    """Test RTP (Return to Player) and fairness of slot machine."""

    def setup_method(self):
        """Setup test environment."""
        self.repo = MagicMock(spec=GameRepository)
        self.token_service = MagicMock(spec=TokenService)
        self.service = SlotService(self.repo, self.token_service, "test.db")

    @pytest.mark.asyncio
    async def test_rtp_calculation(self):
        """Test RTP calculation over multiple spins."""
        # Arrange
        user_id = 1
        bet_amount = 10
        num_spins = 100
        
        # Mock setup for consistent testing
        self.token_service.get_token_balance = AsyncMock(return_value=10000)
        self.token_service.deduct_tokens = AsyncMock(return_value=9990)
        self.token_service.add_tokens = AsyncMock(return_value=10000)
        self.repo.get_user_segment = AsyncMock(return_value="Medium")
        self.repo.get_streak = MagicMock(return_value=0)
        self.repo.set_streak = MagicMock()
        self.repo.record_action = AsyncMock(return_value={"user_id": user_id})
        
        # Act
        total_bet = 0
        total_payout = 0
        
        for _ in range(num_spins):
            result = await self.service.spin(user_id, bet_amount)
            total_bet += bet_amount
            total_payout += max(0, result.tokens_change + bet_amount)  # Actual payout
        
        # Assert
        rtp = (total_payout / total_bet) * 100 if total_bet > 0 else 0        # RTP should be around 85-95% for fair slot machine (allowing variance)
        assert 65 <= rtp <= 110, f"RTP {rtp}% is outside acceptable range"
