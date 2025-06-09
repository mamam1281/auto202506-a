"""Game state repository with Redis and DB persistence."""

import logging
import os
from typing import List

from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

try:
    import redis
except Exception:  # noqa: BLE001
    redis = None

from .. import models

logger = logging.getLogger(__name__)

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")
redis_client = None
if redis is not None:
    try:
        redis_client = redis.Redis.from_url(REDIS_URL, decode_responses=True)
        if redis_client:  # Added null check before ping
            redis_client.ping()
            logger.info("Connected to Redis at %s", REDIS_URL)
    except Exception as exc:  # noqa: BLE001
        logger.exception("Redis unavailable: %s. Falling back to in-memory cache", exc)
        redis_client = None

# In-memory fallbacks
_streak_cache: dict[int, int] = {}
_gacha_count_cache: dict[int, int] = {}
_gacha_history_cache: dict[int, List[str]] = {}


def _streak_key(user_id: int) -> str:
    """Redis key for a user's streak count."""
    return f"user:{user_id}:streak_count"

def _gacha_count_key(user_id: int) -> str:
    """Redis key for how many gacha pulls a user made."""
    return f"user:{user_id}:gacha_count"

def _gacha_history_key(user_id: int) -> str:
    """Redis key for storing a user's last 10 gacha results."""
    return f"user:{user_id}:gacha_history"


class GameRepository:
    """Data access layer for game state using DB and Redis."""

    def get_streak(self, user_id: int) -> int:
        """Return the current win streak for the user."""
        if redis_client:
            val = redis_client.get(_streak_key(user_id))
            return int(val) if val is not None else 0
        return _streak_cache.get(user_id, 0)

    def set_streak(self, user_id: int, value: int) -> None:
        """Persist the user's streak value."""
        if redis_client:
            redis_client.set(_streak_key(user_id), value)
        else:
            _streak_cache[user_id] = value

    def get_gacha_count(self, user_id: int) -> int:
        """Get how many gacha pulls the user has performed."""
        if redis_client:
            val = redis_client.get(_gacha_count_key(user_id))
            return int(val) if val is not None else 0
        return _gacha_count_cache.get(user_id, 0)

    def set_gacha_count(self, user_id: int, value: int) -> None:
        """Set the user's gacha pull count."""
        if redis_client:
            redis_client.set(_gacha_count_key(user_id), value)
        else:
            _gacha_count_cache[user_id] = value

    def get_gacha_history(self, user_id: int) -> List[str]:
        """Return last 10 gacha results for the user."""
        if redis_client:
            return redis_client.lrange(_gacha_history_key(user_id), 0, 9)
        return _gacha_history_cache.get(user_id, [])

    def set_gacha_history(self, user_id: int, history: List[str]) -> None:
        """Save recent gacha history for the user."""
        if redis_client:
            redis_client.delete(_gacha_history_key(user_id))
            if history:
                redis_client.rpush(_gacha_history_key(user_id), *history)
        else:
            _gacha_history_cache[user_id] = history

    def get_user_segment(self, db: Session, user_id: int) -> str:
        """Fetch the user's segment label from the database."""
        try:
            seg = (
                db.query(models.UserSegment)
                .filter(models.UserSegment.user_id == user_id)
                .first()
            )
            return "Low" if seg is None or seg.rfm_group is None else str(seg.rfm_group)
        except SQLAlchemyError as exc:
            logger.error("Error fetching user segment: %s", exc)
            db.rollback()
            return "Low"

    def record_action(self, db: Session, user_id: int, action_type: str, value: float) -> models.UserAction:
        """Record a user action in the database."""
        action = models.UserAction(user_id=user_id, action_type=action_type, value=value)
        try:
            db.add(action)
            db.commit()
            db.refresh(action)
            return action
        except SQLAlchemyError as exc:
            logger.error("Failed to record action: %s", exc)
            db.rollback()
            raise
