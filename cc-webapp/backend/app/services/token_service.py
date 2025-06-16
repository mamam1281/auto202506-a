"""Token management service for user cyber tokens."""

import logging
from typing import Optional

from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from app.repositories.game_repository import GameRepository
from app.models import User

logger = logging.getLogger(__name__)


class TokenService:
    """Service for managing user cyber tokens with real DB persistence."""

    def __init__(self, db: Optional[Session] = None, repository: Optional[GameRepository] = None):
        """
        Initialize token service with database session and game repository.

        Args:
            db (Optional[Session]): SQLAlchemy database session
            repository (Optional[GameRepository]): Game data repository
        """
        self.db = db
        self.repository = repository or GameRepository()

    def add_tokens(self, user_id: int, amount: int) -> int:
        """
        Add tokens to a user's balance in the database.

        Args:
            user_id (int): User's unique identifier
            amount (int): Number of tokens to add

        Returns:
            int: Updated token balance
        """
        if not self.db:
            logger.error("Database session not available")
            return 0
            
        try:
            user = self.db.query(User).filter(User.id == user_id).first()
            if not user:
                logger.error(f"User {user_id} not found")
                return 0
                
            current_balance = getattr(user, 'cyber_token_balance', 0) or 0
            new_balance = current_balance + amount
            setattr(user, 'cyber_token_balance', new_balance)
            self.db.commit()
            self.db.refresh(user)
            
            logger.info(f"Added {amount} tokens to user {user_id}, new balance: {new_balance}")
            return new_balance
            
        except SQLAlchemyError as exc:
            logger.error(f"Failed to add tokens for user {user_id}: {exc}")
            self.db.rollback()
            return self.get_token_balance(user_id)

    def deduct_tokens(self, user_id: int, amount: int) -> Optional[int]:
        """
        Deduct tokens from a user's balance in the database.

        Args:
            user_id (int): User's unique identifier
            amount (int): Number of tokens to deduct

        Returns:
            Optional[int]: Updated token balance or None if insufficient tokens
        """
        if not self.db:
            logger.error("Database session not available")
            return None
            
        try:
            user = self.db.query(User).filter(User.id == user_id).first()
            if not user:
                logger.error(f"User {user_id} not found")
                return None
                
            current_balance = getattr(user, 'cyber_token_balance', 0) or 0
            if current_balance < amount:
                logger.warning(f"Insufficient tokens for user {user_id}: {current_balance} < {amount}")
                return None

            new_balance = current_balance - amount
            setattr(user, 'cyber_token_balance', new_balance)
            self.db.commit()
            self.db.refresh(user)
            
            logger.info(f"Deducted {amount} tokens from user {user_id}, new balance: {new_balance}")
            return new_balance
            
        except SQLAlchemyError as exc:
            logger.error(f"Failed to deduct tokens for user {user_id}: {exc}")
            self.db.rollback()
            return None

    def get_token_balance(self, user_id: int) -> int:
        """
        Retrieve a user's token balance from the database.

        Args:
            user_id (int): User's unique identifier

        Returns:
            int: User's current token balance
        """
        if not self.db:
            logger.error("Database session not available")
            return 0
            
        try:
            user = self.db.query(User).filter(User.id == user_id).first()
            if not user:
                logger.error(f"User {user_id} not found")
                return 0
                
            balance = getattr(user, 'cyber_token_balance', 0) or 0
            return balance
            
        except SQLAlchemyError as exc:
            logger.error(f"Failed to retrieve token balance for user {user_id}: {exc}")
            return 0

    def reset_token_balance(self, user_id: int) -> int:
        """
        Reset a user's token balance to zero in the database.

        Args:
            user_id (int): User's unique identifier

        Returns:
            int: Reset token balance (always 0)
        """
        if not self.db:
            logger.error("Database session not available")
            return 0
            
        try:
            user = self.db.query(User).filter(User.id == user_id).first()
            if not user:
                logger.error(f"User {user_id} not found")
                return 0
                
            setattr(user, 'cyber_token_balance', 0)
            self.db.commit()
            self.db.refresh(user)
            
            logger.info(f"Reset token balance for user {user_id}")
            return 0
            
        except SQLAlchemyError as exc:
            logger.error(f"Failed to reset token balance for user {user_id}: {exc}")
            self.db.rollback()
            return 0
