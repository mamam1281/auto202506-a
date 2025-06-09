import unittest
from unittest.mock import MagicMock, patch
from sqlalchemy.orm import Session

from app.services.slot_service import SlotService, SlotSpinResult
from app.repositories.game_repository import GameRepository


class TestSlotService(unittest.TestCase):
    def setUp(self):
        self.mock_db = MagicMock(spec=Session)
        self.repo = MagicMock(spec=GameRepository)
        self.service = SlotService(repository=self.repo)

    @patch("app.services.slot_service.deduct_tokens")
    @patch("app.services.slot_service.add_tokens")
    @patch("app.services.slot_service.get_balance", return_value=100)
    @patch("app.services.slot_service.random.random", return_value=0.99)
    def test_spin_lose(self, m_rand, m_balance, m_add, m_deduct):
        self.repo.get_user_segment.return_value = "Low"
        self.repo.get_streak.return_value = 0

        result = self.service.spin(1, self.mock_db)

        self.assertIsInstance(result, SlotSpinResult)
        self.assertEqual(result.result, "lose")
        self.assertEqual(result.tokens_change, -2)
        self.repo.set_streak.assert_called_once_with(1, 1)
        self.repo.record_action.assert_called_once()

    @patch("app.services.slot_service.deduct_tokens")
    @patch("app.services.slot_service.add_tokens")
    @patch("app.services.slot_service.get_balance", return_value=120)
    @patch("app.services.slot_service.random.random", return_value=0.0)
    def test_spin_jackpot(self, m_rand, m_balance, m_add, m_deduct):
        self.repo.get_user_segment.return_value = "Medium"
        self.repo.get_streak.return_value = 0

        result = self.service.spin(1, self.mock_db)

        self.assertEqual(result.result, "jackpot")
        self.assertEqual(result.tokens_change, 98)
        m_add.assert_called_once_with(1, 100, self.mock_db)

    @patch("app.services.slot_service.deduct_tokens", side_effect=ValueError)
    def test_spin_insufficient_tokens(self, m_deduct):
        with self.assertRaises(ValueError):
            self.service.spin(1, self.mock_db)


if __name__ == "__main__":
    unittest.main()
