from sqlalchemy.orm import Session

from app import models

class UserSegmentService:
    """Service for retrieving user segment and adjusting game probabilities."""

    SEGMENT_PROB_ADJUST = {
        "Whale": 0.02,
        "Low": -0.02,
        "Medium": 0.0,
    }

    HOUSE_EDGE = {
        "Whale": 0.05,
        "Medium": 0.10,
        "Low": 0.15,
    }

    def __init__(self, db: Session) -> None:
        self.db = db

    def get_segment_label(self, user_id: int) -> str:
        seg = (
            self.db.query(models.UserSegment)
            .filter(models.UserSegment.user_id == user_id)
            .first()
        )
        if not seg or not seg.rfm_group:
            return "Low"
        return seg.rfm_group

    def adjust_probability(self, base_prob: float, segment_label: str) -> float:
        adj = self.SEGMENT_PROB_ADJUST.get(segment_label, 0.0)
        new_prob = base_prob + adj
        return max(0.0, min(new_prob, 1.0))

    def get_house_edge(self, segment_label: str) -> float:
        return self.HOUSE_EDGE.get(segment_label, 0.10)
