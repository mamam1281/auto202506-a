import unittest
from unittest.mock import MagicMock

from app.services.user_segment_service import UserSegmentService
from app.models import UserSegment

class TestUserSegmentService(unittest.TestCase):
    def setUp(self):
        self.mock_db = MagicMock()
        self.service = UserSegmentService(db=self.mock_db)

    def test_get_segment_label_default(self):
        self.mock_db.query.return_value.filter.return_value.first.return_value = None
        label = self.service.get_segment_label(1)
        self.assertEqual(label, "Low")

    def test_get_segment_label_existing(self):
        seg = UserSegment(user_id=1, rfm_group="Whale")
        self.mock_db.query.return_value.filter.return_value.first.return_value = seg
        self.assertEqual(self.service.get_segment_label(1), "Whale")

    def test_adjust_probability(self):
        self.assertAlmostEqual(self.service.adjust_probability(0.1, "Whale"), 0.12)
        self.assertAlmostEqual(self.service.adjust_probability(0.1, "Low"), 0.08)
        self.assertAlmostEqual(self.service.adjust_probability(0.1, "Other"), 0.1)

    def test_get_house_edge(self):
        self.assertEqual(self.service.get_house_edge("Whale"), 0.05)
        self.assertEqual(self.service.get_house_edge("Low"), 0.15)
        self.assertEqual(self.service.get_house_edge("Other"), 0.10)

if __name__ == "__main__":
    unittest.main()
