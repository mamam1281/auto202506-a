import unittest
from unittest.mock import Mock, patch
from sqlalchemy.orm import Session

from app.services.rps_service import RPSService, RPSResult
from app.services.token_service import TokenService
from app.repositories.game_repository import GameRepository


class TestRPSService(unittest.TestCase):
    """RPS (Rock-Paper-Scissors) 서비스 테스트."""
    
    def setUp(self):
        """각 테스트 전에 실행되는 설정."""
        self.db = Mock(spec=Session)
        self.token_service = Mock(spec=TokenService)
        self.repo = Mock(spec=GameRepository)
        self.service = RPSService(repository=self.repo, token_service=self.token_service)
        
    def test_play_success(self):
        """정상적인 RPS 게임 플레이 테스트."""
        # Arrange
        user_id = 1
        bet_amount = 10
        user_choice = "rock"
        self.token_service.deduct_tokens.return_value = bet_amount
        self.token_service.get_token_balance.return_value = 100
        self.repo.get_user_segment.return_value = "Medium"
        
        # Act
        result = self.service.play(user_id, user_choice, bet_amount, self.db)
        
        # Assert
        assert isinstance(result, RPSResult)
        assert result.user_choice == user_choice
        assert result.computer_choice in ["rock", "paper", "scissors"]
        assert result.result in ["win", "lose", "draw"]
        assert isinstance(result.tokens_change, int)
        assert isinstance(result.balance, int)
        self.token_service.deduct_tokens.assert_called_once_with(user_id, bet_amount)
        self.repo.record_action.assert_called_once()
        
    def test_play_insufficient_tokens(self):
        """토큰 부족 시 예외 발생 테스트."""
        # Arrange
        user_id = 1
        bet_amount = 10
        user_choice = "rock"
        self.token_service.deduct_tokens.return_value = None
        
        # Act & Assert
        with self.assertRaises(ValueError) as context:
            self.service.play(user_id, user_choice, bet_amount, self.db)
        assert "토큰이 부족합니다" in str(context.exception)
        
    def test_play_invalid_choice(self):
        """잘못된 선택 시 예외 발생 테스트."""
        # Arrange
        user_id = 1
        bet_amount = 10
        user_choice = "invalid"
        self.token_service.deduct_tokens.return_value = bet_amount
        
        # Act & Assert
        with self.assertRaises(ValueError) as context:
            self.service.play(user_id, user_choice, bet_amount, self.db)
        assert "올바르지 않은 선택입니다" in str(context.exception)
        
    @patch('random.choice')
    def test_play_user_wins(self, mock_choice):
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
        result = self.service.play(user_id, user_choice, bet_amount, self.db)
        
        # Assert
        assert result.user_choice == user_choice
        assert result.computer_choice == computer_choice
        assert result.result == "win"
        assert result.tokens_change > 0  # Should win tokens
        self.token_service.add_tokens.assert_called_once()
        
    @patch('random.choice')
    def test_play_user_loses(self, mock_choice):
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
        result = self.service.play(user_id, user_choice, bet_amount, self.db)
        
        # Assert
        assert result.user_choice == user_choice
        assert result.computer_choice == computer_choice
        assert result.result == "lose"
        assert result.tokens_change == -bet_amount  # Only loses bet
        self.token_service.add_tokens.assert_not_called()
        
    @patch('random.choice')
    def test_play_draw(self, mock_choice):
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
        result = self.service.play(user_id, user_choice, bet_amount, self.db)
        
        # Assert
        assert result.user_choice == user_choice
        assert result.computer_choice == computer_choice
        assert result.result == "draw"
        assert result.tokens_change == 0  # No change in draw
        self.token_service.add_tokens.assert_called_once_with(user_id, bet_amount)  # Refund bet
        
    def test_play_whale_segment_bonus(self):
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
            result = self.service.play(user_id, user_choice, bet_amount, self.db)
            
            # Assert
            assert result.result == "win"
            # Whale users should get better rewards
            assert result.tokens_change >= bet_amount * 1.5  # At least 1.5x multiplier
            
    def test_play_low_segment_penalty(self):
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
            result = self.service.play(user_id, user_choice, bet_amount, self.db)
            
            # Assert
            assert result.result == "win"
            # Low users should get lower rewards
            assert result.tokens_change < bet_amount * 2  # Less than normal multiplier


class TestRPSFairness(unittest.TestCase):
    """RPS 공정성 테스트."""
    
    def setUp(self):
        """각 테스트 전에 실행되는 설정."""
        self.db = Mock(spec=Session)
        self.token_service = Mock(spec=TokenService)
        self.repo = Mock(spec=GameRepository)
        self.service = RPSService(repository=self.repo, token_service=self.token_service)
        
    def test_win_rate_fairness(self):
        """승률 공정성 테스트 - 대략 33% 승률이어야 함."""
        # This is a statistical test so we simulate many games
        user_id = 1
        bet_amount = 10
        games = 1000
        wins = 0
        
        # Setup mocks
        self.token_service.deduct_tokens.return_value = bet_amount
        self.token_service.get_token_balance.return_value = 1000
        self.repo.get_user_segment.return_value = "Medium"
        
        # Simulate many games
        for _ in range(games):
            result = self.service.play(user_id, "rock", bet_amount, self.db)
            if result.result == "win":
                wins += 1
                
        win_rate = wins / games
        
        # Win rate should be around 0.33 (1/3) in a fair game
        assert 0.25 <= win_rate <= 0.40, f"Win rate {win_rate} is outside expected range"


if __name__ == '__main__':
    unittest.main()
