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
        self.repo.get_user_segment.return_value = "Medium"
        result = self.service.spin(1, 10, "number", "7", self.mock_db)

        self.assertIsInstance(result, RouletteSpinResult)
        self.assertEqual(result.result, "win")
        self.assertGreater(result.tokens_change, -10)
        m_add.assert_called_once()

    @patch("app.services.roulette_service.deduct_tokens", side_effect=ValueError)
    def test_spin_insufficient_tokens(self, m_deduct):
        with self.assertRaises(ValueError):
            self.service.spin(1, 5, "color", "red", self.mock_db)


if __name__ == "__main__":
    unittest.main()
