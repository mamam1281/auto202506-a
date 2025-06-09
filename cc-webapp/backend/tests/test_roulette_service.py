import unittest
from unittest.mock import MagicMock, patch
from sqlalchemy.orm import Session

from app.services.roulette_service import RouletteService, RouletteSpinResult
from app.repositories.game_repository import GameRepository


class TestRouletteService(unittest.TestCase):
    def setUp(self):
        self.mock_db = MagicMock(spec=Session)
        self.repo = MagicMock(spec=GameRepository)
        self.service = RouletteService(repository=self.repo)

    @patch("app.services.roulette_service.deduct_tokens")
    @patch("app.services.roulette_service.add_tokens")
    @patch("app.services.roulette_service.get_balance", return_value=150)
    @patch("app.services.roulette_service.random.randint", return_value=7)
    def test_spin_win_number(self, m_rand, m_balance, m_add, m_deduct):
        """숫자 베팅 승리 시 동작을 검증."""
        self.repo.get_user_segment.return_value = "Medium"
        self.repo.get_streak.return_value = 0

        result = self.service.spin(1, 10, "number", "7", self.mock_db)

        self.assertIsInstance(result, RouletteSpinResult)
        self.assertEqual(result.result, "win")
        self.assertGreater(result.tokens_change, -10)
        m_add.assert_called_once()
        self.repo.set_streak.assert_called_once_with(1, 0)

    @patch("app.services.roulette_service.deduct_tokens")
    @patch("app.services.roulette_service.add_tokens")
    @patch("app.services.roulette_service.get_balance", return_value=100)
    @patch("app.services.roulette_service.random.randint", return_value=8)
    def test_spin_lose_increments_streak(self, m_rand, m_balance, m_add, m_deduct):
        """패배 시 스트릭 증가 여부를 확인."""
        self.repo.get_user_segment.return_value = "Medium"
        self.repo.get_streak.return_value = 1

        result = self.service.spin(1, 10, "number", "7", self.mock_db)

        self.assertEqual(result.result, "lose")
        self.assertEqual(result.tokens_change, -10)
        self.repo.set_streak.assert_called_once_with(1, 2)

    @patch("app.services.roulette_service.deduct_tokens")
    @patch("app.services.roulette_service.add_tokens")
    @patch("app.services.roulette_service.get_balance", return_value=200)
    @patch("app.services.roulette_service.random.randint", return_value=0)
    def test_spin_jackpot(self, m_rand, m_balance, m_add, m_deduct):
        """0번에 베팅하여 잭팟이 발생하는 경우."""
        self.repo.get_user_segment.return_value = "Medium"
        self.repo.get_streak.return_value = 0

        result = self.service.spin(1, 10, "number", "0", self.mock_db)

        self.assertEqual(result.result, "jackpot")
        self.assertGreater(result.tokens_change, 0)
        m_add.assert_called_once()
        self.repo.set_streak.assert_called_once_with(1, 0)

    @patch("app.services.roulette_service.deduct_tokens", side_effect=ValueError)
    def test_spin_insufficient_tokens(self, m_deduct):
        """토큰 부족 시 예외 발생 여부."""
        with self.assertRaises(ValueError):
            self.service.spin(1, 5, "color", "red", self.mock_db)


if __name__ == "__main__":
    unittest.main()
