from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timedelta
from typing import Dict, List

from sqlalchemy import func
from sqlalchemy.orm import Session
import redis
import json

from app import models


@dataclass
class RFMScore:
    user_id: int
    recency_score: int
    frequency_score: int
    monetary_score: int
    total_score: int
    segment: str
    calculated_at: datetime


class RFMService:
    """Service for calculating Recency/Frequency/Monetary scores."""

    def __init__(self, db: Session, redis_client: redis.Redis):
        self.db = db
        self.redis = redis_client

    async def calculate_user_rfm(self, user_id: int) -> RFMScore:
        """Calculate RFM score for a single user."""
        now = datetime.utcnow()
        thirty_days_ago = now - timedelta(days=30)

        last_action = (
            self.db.query(func.max(models.UserAction.timestamp))
            .filter(models.UserAction.user_id == user_id)
            .scalar()
        )
        if last_action is None:
            recency_score = 1
        else:
            days = (now - last_action).days
            if days <= 1:
                recency_score = 10
            elif days <= 7:
                recency_score = 7
            elif days <= 30:
                recency_score = 3
            else:
                recency_score = 1

        plays = (
            self.db.query(func.count(models.UserAction.id))
            .filter(
                models.UserAction.user_id == user_id,
                models.UserAction.action_type == "GAME_PLAY",
                models.UserAction.timestamp >= thirty_days_ago,
            )
            .scalar()
            or 0
        )
        avg_per_day = plays / 30.0
        if avg_per_day >= 10:
            frequency_score = 10
        elif avg_per_day >= 5:
            frequency_score = 7
        elif avg_per_day >= 1:
            frequency_score = 5
        else:
            frequency_score = 1

        spent = (
            self.db.query(func.sum(models.UserAction.value))
            .filter(
                models.UserAction.user_id == user_id,
                models.UserAction.timestamp >= thirty_days_ago,
                models.UserAction.value < 0,
            )
            .scalar()
        )
        spent = abs(spent or 0)
        if spent >= 1000:
            monetary_score = 10
        elif spent >= 500:
            monetary_score = 7
        elif spent >= 100:
            monetary_score = 5
        else:
            monetary_score = 1

        total_score = recency_score + frequency_score + monetary_score
        thresholds = await self.get_segment_thresholds()
        segment = "Low"
        if total_score >= thresholds["whale"] and monetary_score >= 8:
            segment = "Whale"
        elif total_score >= thresholds["medium"] and frequency_score >= 5:
            segment = "Medium"

        return RFMScore(
            user_id=user_id,
            recency_score=recency_score,
            frequency_score=frequency_score,
            monetary_score=monetary_score,
            total_score=total_score,
            segment=segment,
            calculated_at=now,
        )

    async def calculate_all_users_rfm(self) -> List[RFMScore]:
        """Batch calculation for all users."""
        user_ids = [u.id for u in self.db.query(models.User.id).all()]
        scores = [await self.calculate_user_rfm(uid) for uid in user_ids]
        return scores

    async def get_segment_thresholds(self) -> Dict[str, int]:
        """Compute dynamic thresholds based on distribution."""
        cached = self.redis.get("rfm:thresholds") if self.redis else None
        if cached:
            return json.loads(cached)

        totals = []
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        rows = (
            self.db.query(models.UserAction.user_id)
            .filter(models.UserAction.timestamp >= thirty_days_ago)
            .distinct()
            .all()
        )
        for (uid,) in rows:
            score = await self.calculate_user_rfm(uid)
            totals.append(score.total_score)
        if not totals:
            thresholds = {"whale": 25, "medium": 15}
        else:
            totals.sort()
            whale_index = int(len(totals) * 0.9) - 1
            medium_index = int(len(totals) * 0.6) - 1
            whale_index = max(0, whale_index)
            medium_index = max(0, medium_index)
            thresholds = {
                "whale": max(25, totals[whale_index]),
                "medium": max(15, totals[medium_index]),
            }
        if self.redis:
            self.redis.setex("rfm:thresholds", 86400, json.dumps(thresholds))
        return thresholds

    async def cache_rfm_scores(self, scores: List[RFMScore]) -> None:
        """Cache RFM scores in Redis."""
        if not self.redis:
            return
        pipe = self.redis.pipeline()
        for s in scores:
            pipe.setex(
                f"rfm:{s.user_id}",
                86400,
                json.dumps(
                    {
                        "recency": s.recency_score,
                        "frequency": s.frequency_score,
                        "monetary": s.monetary_score,
                        "total": s.total_score,
                        "segment": s.segment,
                    }
                ),
            )
        pipe.execute()
