from __future__ import annotations

from datetime import datetime, timedelta
from typing import Dict, List
import json

from sqlalchemy import func
from sqlalchemy.orm import Session
import redis

from app import models
from .rfm_service import RFMScore
from .token_service import get_balance


class PersonalizationService:
    """Generate game recommendations and user profile."""

    def __init__(self, db: Session, redis_client: redis.Redis):
        self.db = db
        self.redis = redis_client

    async def game_recommendations(self, score: RFMScore) -> List[Dict]:
        user_id = score.user_id
        balance = get_balance(user_id, self.db)

        last_20 = (
            self.db.query(models.UserAction.action_type, models.UserAction.value)
            .filter(
                models.UserAction.user_id == user_id,
                models.UserAction.action_type.in_(
                    ["GAME_PLAY", "GAME_WIN", "GAME_FAIL"]
                ),
            )
            .order_by(models.UserAction.timestamp.desc())
            .limit(20)
            .all()
        )
        wins = sum(1 for a in last_20 if a.action_type == "GAME_WIN")
        plays = sum(1 for a in last_20 if a.action_type == "GAME_PLAY")
        win_rate = wins / plays if plays else 0

        game_type = "slot"
        if balance < 50:
            game_type = "slot"
        elif balance < 200:
            game_type = "roulette"
        else:
            game_type = "gacha"

        reason = ""
        if score.segment == "Whale":
            reason = "high-value user"
        elif score.segment == "Low":
            reason = "low engagement"

        rec = {
            "game_type": game_type,
            "recommended_bet": min(max(int(balance * 0.1), 1), 100),
            "win_probability": win_rate,
            "expected_return": win_rate * balance * 0.1,
            "reason": reason,
        }
        return [rec]

    async def user_profile(self, score: RFMScore, ltv: Dict[str, float], churn: str) -> Dict:
        last_action = (
            self.db.query(func.max(models.UserAction.timestamp))
            .filter(models.UserAction.user_id == score.user_id)
            .scalar()
        )
        return {
            "user_id": score.user_id,
            "segment": score.segment,
            "rfm_scores": {
                "recency": score.recency_score,
                "frequency": score.frequency_score,
                "monetary": score.monetary_score,
            },
            "ltv_prediction": ltv,
            "churn_risk": churn,
            "last_activity": last_action,
        }

    async def cache_recommendations(self, user_id: int, recs: List[Dict]) -> None:
        if not self.redis:
            return
        self.redis.setex(f"recommendations:{user_id}", 3600, json.dumps(recs))
