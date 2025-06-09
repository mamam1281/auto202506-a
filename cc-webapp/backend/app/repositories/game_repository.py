import logging
from typing import List
from sqlalchemy.orm import Session
import os

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
        redis_client.ping()
    except Exception:  # noqa: BLE001
        logger.warning("Redis unavailable, falling back to in-memory cache")
        redis_client = None

# In-memory fallbacks
_streak_cache: dict[int, int] = {}
_gacha_count_cache: dict[int, int] = {}
_gacha_history_cache: dict[int, List[str]] = {}


def _streak_key(user_id: int) -> str:
    return f"user:{user_id}:streak_count"

def _gacha_count_key(user_id: int) -> str:
    return f"user:{user_id}:gacha_count"

def _gacha_history_key(user_id: int) -> str:
    return f"user:{user_id}:gacha_history"


class GameRepository:
    """Data access for game state using DB and Redis."""

    def get_streak(self, user_id: int) -> int:
        if redis_client:
            val = redis_client.get(_streak_key(user_id))
            return int(val) if val is not None else 0
        return _streak_cache.get(user_id, 0)

    def set_streak(self, user_id: int, value: int) -> None:
        if redis_client:
            redis_client.set(_streak_key(user_id), value)
        else:
            _streak_cache[user_id] = value

    def get_gacha_count(self, user_id: int) -> int:
        if redis_client:
            val = redis_client.get(_gacha_count_key(user_id))
            return int(val) if val is not None else 0
        return _gacha_count_cache.get(user_id, 0)

    def set_gacha_count(self, user_id: int, value: int) -> None:
        if redis_client:
            redis_client.set(_gacha_count_key(user_id), value)
        else:
            _gacha_count_cache[user_id] = value

    def get_gacha_history(self, user_id: int) -> List[str]:
        if redis_client:
            return redis_client.lrange(_gacha_history_key(user_id), 0, 9)
        return _gacha_history_cache.get(user_id, [])

    def set_gacha_history(self, user_id: int, history: List[str]) -> None:
        if redis_client:
            redis_client.delete(_gacha_history_key(user_id))
            if history:
                redis_client.rpush(_gacha_history_key(user_id), *history)
        else:
            _gacha_history_cache[user_id] = history

    def get_user_segment(self, db: Session, user_id: int) -> str:
        seg = db.query(models.UserSegment).filter(models.UserSegment.user_id == user_id).first()
        return seg.rfm_group if seg and seg.rfm_group else "Low"

    def record_action(self, db: Session, user_id: int, action_type: str, value: float) -> None:
        action = models.UserAction(user_id=user_id, action_type=action_type, value=value)
        db.add(action)
        db.commit()

