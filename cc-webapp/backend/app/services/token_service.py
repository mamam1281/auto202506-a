"""Token management service for user cyber tokens."""

import logging
from typing import Optional

from sqlalchemy.orm import Session

from app.repositories.game_repository import GameRepository

logger = logging.getLogger(__name__)


class TokenService:
    """Service for managing user cyber tokens."""

    def __init__(self, db: Optional[Session] = None, repository: Optional[GameRepository] = None):
        """
        Initialize token service with database session and game repository.

        Args:
            db (Optional[Session]): SQLAlchemy database session
            repository (Optional[GameRepository]): Game data repository
        """
        self.db = db
        self.repository = repository or GameRepository()
        self.user_tokens: dict[int, int] = {}  # In-memory fallback

    def _token_key(self, user_id: int) -> str:
        """
        Generate a unique key for storing user token balance.

        Args:
            user_id (int): User's unique identifier

        Returns:
            str: Formatted token key
        """
        return f"user:{user_id}:cyber_token_balance"

    def add_tokens(self, user_id: int, amount: int) -> int:
        """
        Add tokens to a user's balance.

        Args:
            user_id (int): User's unique identifier
            amount (int): Number of tokens to add

        Returns:
            int: Updated token balance
        """
        try:
            current_balance = self.get_token_balance(user_id)
            new_balance = current_balance + amount
            self.repository.set_streak(user_id, new_balance)
            return new_balance
        except Exception as exc:
            logger.error(f"Failed to add tokens for user {user_id}: {exc}")
            return current_balance

    def deduct_tokens(self, user_id: int, amount: int) -> Optional[int]:
        """
        Deduct tokens from a user's balance.

        Args:
            user_id (int): User's unique identifier
            amount (int): Number of tokens to deduct

        Returns:
            Optional[int]: Updated token balance or None if insufficient tokens
        """
        try:
            current_balance = self.get_token_balance(user_id)
            if current_balance < amount:
                logger.warning(f"Insufficient tokens for user {user_id}")
                return None

            new_balance = current_balance - amount
            self.repository.set_streak(user_id, new_balance)
            return new_balance
        except Exception as exc:
            logger.error(f"Failed to deduct tokens for user {user_id}: {exc}")
            return None

    def get_token_balance(self, user_id: int) -> int:
        """
        Retrieve a user's token balance.

        Args:
            user_id (int): User's unique identifier

        Returns:
            int: User's current token balance
        """
        try:
            balance = self.repository.get_streak(user_id)
            return balance
        except Exception as exc:
            logger.error(f"Failed to retrieve token balance for user {user_id}: {exc}")
            return 0

    def reset_token_balance(self, user_id: int) -> int:
        """
        Reset a user's token balance to zero.

        Args:
            user_id (int): User's unique identifier

        Returns:
            int: Reset token balance (always 0)
        """
        try:
            self.repository.set_streak(user_id, 0)
            return 0
        except Exception as exc:
            logger.error(f"Failed to reset token balance for user {user_id}: {exc}")
            return 0
