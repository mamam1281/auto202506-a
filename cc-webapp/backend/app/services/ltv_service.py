from __future__ import annotations

from datetime import datetime, timedelta
from typing import Dict
import json

from sqlalchemy import func
from sqlalchemy.orm import Session
import redis

from app import models


class LTVService:
    """Simple linear-regression style LTV predictor."""

    def __init__(self, db: Session, redis_client: redis.Redis):
        self.db = db
        self.redis = redis_client

    async def predict_ltv(self, user_id: int, rfm_segment: str | None = None) -> Dict[str, float]:
        now = datetime.utcnow()
        seven_days_ago = now - timedelta(days=7)
        thirty_days_ago = now - timedelta(days=30)

        spent_7 = (
            self.db.query(func.sum(models.UserAction.value))
            .filter(
                models.UserAction.user_id == user_id,
                models.UserAction.timestamp >= seven_days_ago,
                models.UserAction.value < 0,
            )
            .scalar()
        )
        spent_7 = abs(spent_7 or 0)
        ltv_7 = spent_7 * 1.2

        session_durations = []
        actions = (
            self.db.query(models.UserAction.timestamp)
            .filter(
                models.UserAction.user_id == user_id,
                models.UserAction.timestamp >= thirty_days_ago,
            )
            .order_by(models.UserAction.timestamp)
            .all()
        )
        if actions:
            start = actions[0][0]
            last = start
            for (ts,) in actions[1:]:
                if (ts - last).total_seconds() > 1800:
                    session_durations.append((last - start).total_seconds())
                    start = ts
                last = ts
            session_durations.append((last - start).total_seconds())
        avg_session = sum(session_durations) / len(session_durations) if session_durations else 0

        ltv_30 = (ltv_7 * 4) + (avg_session / 60)
        weight = 1.0
        if rfm_segment == "Whale":
            weight = 1.5
        elif rfm_segment == "Medium":
            weight = 1.1
        ltv_90 = (ltv_30 * 3) * weight

        return {"7d": ltv_7, "30d": ltv_30, "90d": ltv_90}

    async def churn_risk(self, user_id: int) -> str:
        now = datetime.utcnow()
        last_action = (
            self.db.query(func.max(models.UserAction.timestamp))
            .filter(models.UserAction.user_id == user_id)
            .scalar()
        )
        if not last_action:
            return "critical"
        days = (now - last_action).days
        if days <= 3:
            return "low"
        if days <= 7:
            return "medium"
        if days <= 14:
            return "high"
        return "critical"

    async def cache_ltv(self, user_id: int, ltv: Dict[str, float]) -> None:
        if not self.redis:
            return
        self.redis.setex(f"ltv:{user_id}", 43200, json.dumps(ltv))
