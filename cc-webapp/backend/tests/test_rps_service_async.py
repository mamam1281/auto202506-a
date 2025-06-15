import pytest
from unittest.mock import AsyncMock, patch

from app.services.rps_service import RPSService, RPSResult
from app.services.token_service import TokenService
from app.repositories.game_repository import GameRepository


@pytest.mark.asyncio
class TestRPSServiceAsync:
    """RPS (Rock-Paper-Scissors) 서비스 비동기 테스트."""
    
    def setup_method(self):
        """각 테스트 전에 실행되는 설정."""
        self.token_service = AsyncMock(spec=TokenService)
        self.repo = AsyncMock(spec=GameRepository)
        self.service = RPSService(repository=self.repo, token_service=self.token_service)
        
    async def test_play_success(self):
        """정상적인 RPS 게임 플레이 테스트."""
        # Arrange
        user_id = 1
        bet_amount = 10
        user_choice = "rock"
        self.token_service.deduct_tokens.return_value = bet_amount
        self.token_service.get_token_balance.return_value = 100
        self.repo.get_user_segment.return_value = "Medium"
        
        # Act
        result = await self.service.play(user_id, user_choice, bet_amount)
        
        # Assert
        assert isinstance(result, RPSResult)
        assert result.user_choice == user_choice
        assert result.computer_choice in ["rock", "paper", "scissors"]
        assert result.result in ["win", "lose", "draw"]
        assert isinstance(result.tokens_change, int)
        assert isinstance(result.balance, int)
        self.token_service.deduct_tokens.assert_called_once_with(user_id, bet_amount)
        self.repo.record_action.assert_called_once()

    async def test_play_insufficient_tokens(self):
        """토큰 부족 시 예외 발생 테스트."""
        # Arrange
        user_id = 1
        bet_amount = 10
        user_choice = "rock"
        self.token_service.deduct_tokens.return_value = None
        
        # Act & Assert
        with pytest.raises(ValueError) as exc_info:
            await self.service.play(user_id, user_choice, bet_amount)
        assert "Insufficient tokens" in str(exc_info.value)
        
    async def test_play_invalid_choice(self):
        """잘못된 선택 시 예외 발생 테스트."""
        # Arrange
        user_id = 1
        bet_amount = 10
        user_choice = "invalid"
        
        # Act & Assert
        with pytest.raises(ValueError) as exc_info:
            await self.service.play(user_id, user_choice, bet_amount)
        assert "Invalid choice" in str(exc_info.value)

    @patch('random.choice')
    async def test_play_user_wins(self, mock_choice):
        """사용자 승리 시나리오 테스트."""
        # Arrange
        user_id = 1
        bet_amount = 10
        user_choice = "rock"
        computer_choice = "scissors"  # rock beats scissors
        mock_choice.return_value = computer_choice
        self.token_service.deduct_tokens.return_value = bet_amount
        self.token_service.get_token_balance.return_value = 120
        self.repo.get_user_segment.return_value = "Medium"
        
        # Act
        result = await self.service.play(user_id, user_choice, bet_amount)
        
        # Assert
        assert result.result == "win"
        assert result.tokens_change > 0  # 승리 시 토큰 증가
        assert result.computer_choice == computer_choice

    @patch('random.choice')
    async def test_play_user_loses(self, mock_choice):
        """사용자 패배 시나리오 테스트."""
        # Arrange
        user_id = 1
        bet_amount = 10
        user_choice = "rock"
        computer_choice = "paper"  # paper beats rock
        mock_choice.return_value = computer_choice
        self.token_service.deduct_tokens.return_value = bet_amount
        self.token_service.get_token_balance.return_value = 90
        self.repo.get_user_segment.return_value = "Medium"
        
        # Act
        result = await self.service.play(user_id, user_choice, bet_amount)
        
        # Assert
        assert result.result == "lose"
        assert result.tokens_change == 0  # 패배 시 토큰 변화 없음 (이미 차감됨)
        assert result.computer_choice == computer_choice

    @patch('random.choice')
    async def test_play_draw(self, mock_choice):
        """무승부 시나리오 테스트."""
        # Arrange
        user_id = 1
        bet_amount = 10
        user_choice = "rock"
        computer_choice = "rock"  # same choice = draw
        mock_choice.return_value = computer_choice
        self.token_service.deduct_tokens.return_value = bet_amount
        self.token_service.get_token_balance.return_value = 100
        self.repo.get_user_segment.return_value = "Medium"
        
        # Act
        result = await self.service.play(user_id, user_choice, bet_amount)
        
        # Assert
        assert result.result == "draw"
        assert result.tokens_change == bet_amount  # 무승부 시 토큰 환불
        assert result.computer_choice == computer_choice

    async def test_play_whale_segment_bonus(self):
        """고래 사용자 보너스 테스트."""
        # Arrange
        user_id = 1
        bet_amount = 10
        user_choice = "rock"
        self.token_service.deduct_tokens.return_value = bet_amount
        self.token_service.get_token_balance.return_value = 120
        self.repo.get_user_segment.return_value = "Whale"
        
        # Mock a win scenario
        with patch('random.choice', return_value="scissors"):  # rock beats scissors
            # Act
            result = await self.service.play(user_id, user_choice, bet_amount)
            
            # Assert - Whale 사용자는 보너스를 받아야 함
            assert result.result == "win"
            assert result.tokens_change >= bet_amount * 2  # 최소 2배 보상

    async def test_play_low_segment_penalty(self):
        """저소비 사용자 페널티 테스트."""
        # Arrange
        user_id = 1
        bet_amount = 10
        user_choice = "rock"
        self.token_service.deduct_tokens.return_value = bet_amount
        self.token_service.get_token_balance.return_value = 110
        self.repo.get_user_segment.return_value = "Low"
        
        # Mock a win scenario
        with patch('random.choice', return_value="scissors"):  # rock beats scissors
            # Act
            result = await self.service.play(user_id, user_choice, bet_amount)
            
            # Assert - Low 사용자는 페널티를 받아야 함
            assert result.result == "win"
            assert result.tokens_change < bet_amount * 2  # 표준 보상보다 적음


@pytest.mark.asyncio
class TestRPSFairnessAsync:
    """RPS 공정성 테스트."""
    
    def setup_method(self):
        """각 테스트 전에 실행되는 설정."""
        self.token_service = AsyncMock(spec=TokenService)
        self.repo = AsyncMock(spec=GameRepository)
        self.service = RPSService(repository=self.repo, token_service=self.token_service)

    async def test_win_rate_fairness(self):
        """승률 공정성 테스트 - 대략 33% 승률이어야 함."""
        # This is a statistical test so we simulate many games
        user_id = 1
        bet_amount = 10
        games = 100  # 속도를 위해 1000에서 100으로 줄임
        wins = 0
        
        # Setup mocks
        self.token_service.deduct_tokens.return_value = bet_amount
        self.token_service.get_token_balance.return_value = 1000
        self.repo.get_user_segment.return_value = "Medium"
        
        # Simulate many games
        for _ in range(games):
            result = await self.service.play(user_id, "rock", bet_amount)
            if result.result == "win":
                wins += 1
                
        win_rate = wins / games
        # Allow some variance (25% - 45% is reasonable for 100 games)
        assert 0.25 <= win_rate <= 0.45, f"Win rate {win_rate:.2%} is outside expected range"
