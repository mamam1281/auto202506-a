"""Game state repository with aiosqlite persistence."""

import logging
import aiosqlite
from typing import List

logger = logging.getLogger(__name__)

# In-memory fallbacks
_streak_cache: dict[int, int] = {}
_gacha_count_cache: dict[int, int] = {}
_gacha_history_cache: dict[int, List[str]] = {}


class GameRepository:
    """Data access layer for game state using aiosqlite."""

    def __init__(self, db_path: str = "dev.db"):
        self.db_path = db_path

    def get_streak(self, user_id: int) -> int:
        """Return the current win streak for the user."""
        return _streak_cache.get(user_id, 0)

    def set_streak(self, user_id: int, value: int) -> None:
        """Persist the user's streak value."""
        _streak_cache[user_id] = value

    def get_gacha_count(self, user_id: int) -> int:
        """Get how many gacha pulls the user has performed."""
        return _gacha_count_cache.get(user_id, 0)

    def set_gacha_count(self, user_id: int, value: int) -> None:
        """Set the user's gacha pull count."""
        _gacha_count_cache[user_id] = value

    def get_gacha_history(self, user_id: int) -> List[str]:
        """Return last 10 gacha results for the user."""
        return _gacha_history_cache.get(user_id, [])

    def set_gacha_history(self, user_id: int, history: List[str]) -> None:
        """Save recent gacha history for the user."""
        _gacha_history_cache[user_id] = history

    async def get_user_segment(self, user_id: int) -> str:
        """Fetch the user's segment label from the database."""
        try:
            async with aiosqlite.connect(self.db_path) as conn:
                # Create table if not exists
                await conn.execute('''
                    CREATE TABLE IF NOT EXISTS user_segments (
                        user_id INTEGER PRIMARY KEY,
                        rfm_group TEXT DEFAULT 'Medium'
                    )
                ''')
                
                async with conn.execute(
                    "SELECT rfm_group FROM user_segments WHERE user_id = ?", 
                    (user_id,)
                ) as cursor:
                    row = await cursor.fetchone()
                    return row[0] if row else "Medium"
        except Exception as exc:
            logger.error("Error fetching user segment: %s", exc)
            return "Medium"

    async def record_action(self, user_id: int, action_type: str, value: float) -> dict:
        """Record a user action in the database."""
        try:
            async with aiosqlite.connect(self.db_path) as conn:
                # Create table if not exists
                await conn.execute('''
                    CREATE TABLE IF NOT EXISTS user_actions (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        user_id INTEGER NOT NULL,
                        action_type TEXT NOT NULL,
                        value REAL,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )
                ''')
                
                await conn.execute(
                    "INSERT INTO user_actions (user_id, action_type, value) VALUES (?, ?, ?)",
                    (user_id, action_type, value)
                )
                await conn.commit()
                
                # Return action info as dict
                return {
                    "user_id": user_id,
                    "action_type": action_type,
                    "value": value
                }
        except Exception as exc:
            logger.error("Failed to record action: %s", exc)
            raise
