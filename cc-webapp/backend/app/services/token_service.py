"""Token management service for user cyber tokens."""

import logging
import aiosqlite
from typing import Optional

logger = logging.getLogger(__name__)


class TokenService:
    """Service for managing user cyber tokens."""

    def __init__(self, db_path: str = "dev.db"):
        """
        Initialize token service with database path for aiosqlite.

        Args:
            db_path (str): Path to SQLite database file
        """
        self.db_path = db_path
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

    async def add_tokens(self, user_id: int, amount: int) -> int:
        """
        Add tokens to a user's balance.

        Args:
            user_id (int): User's unique identifier
            amount (int): Number of tokens to add

        Returns:
            int: Updated token balance
        """
        try:
            current_balance = await self.get_token_balance(user_id)
            new_balance = current_balance + amount
            
            async with aiosqlite.connect(self.db_path) as conn:
                # Create table if not exists (fallback for token storage)
                await conn.execute('''
                    CREATE TABLE IF NOT EXISTS user_tokens (
                        user_id INTEGER PRIMARY KEY,
                        balance INTEGER NOT NULL DEFAULT 0
                    )
                ''')
                
                # Update or insert token balance
                await conn.execute('''
                    INSERT OR REPLACE INTO user_tokens (user_id, balance)
                    VALUES (?, ?)
                ''', (user_id, new_balance))
                await conn.commit()
            
            self.user_tokens[user_id] = new_balance  # Update cache
            logger.info(f"Added {amount} tokens to user {user_id}, new balance: {new_balance}")
            return new_balance
        except Exception as exc:
            logger.error(f"Failed to add tokens for user {user_id}: {exc}")
            current_balance = await self.get_token_balance(user_id)
            return current_balance

    async def deduct_tokens(self, user_id: int, amount: int) -> Optional[int]:
        """
        Deduct tokens from a user's balance.

        Args:
            user_id (int): User's unique identifier
            amount (int): Number of tokens to deduct

        Returns:
            Optional[int]: Updated token balance or None if insufficient tokens
        """
        try:
            current_balance = await self.get_token_balance(user_id)
            if current_balance < amount:
                logger.warning(f"Insufficient tokens for user {user_id}: has {current_balance}, needs {amount}")
                return None

            new_balance = current_balance - amount
            
            async with aiosqlite.connect(self.db_path) as conn:
                # Create table if not exists
                await conn.execute('''
                    CREATE TABLE IF NOT EXISTS user_tokens (
                        user_id INTEGER PRIMARY KEY,
                        balance INTEGER NOT NULL DEFAULT 0
                    )
                ''')
                
                # Update token balance
                await conn.execute('''
                    INSERT OR REPLACE INTO user_tokens (user_id, balance)
                    VALUES (?, ?)
                ''', (user_id, new_balance))
                await conn.commit()
            
            self.user_tokens[user_id] = new_balance  # Update cache
            logger.info(f"Deducted {amount} tokens from user {user_id}, new balance: {new_balance}")
            return new_balance
        except Exception as exc:
            logger.error(f"Failed to deduct tokens for user {user_id}: {exc}")
            return None

    async def get_token_balance(self, user_id: int) -> int:
        """
        Retrieve a user's token balance.

        Args:
            user_id (int): User's unique identifier

        Returns:
            int: User's current token balance
        """
        try:
            # First check cache
            if user_id in self.user_tokens:
                return self.user_tokens[user_id]
            
            # Then check database
            async with aiosqlite.connect(self.db_path) as conn:
                # Create table if not exists
                await conn.execute('''
                    CREATE TABLE IF NOT EXISTS user_tokens (
                        user_id INTEGER PRIMARY KEY,
                        balance INTEGER NOT NULL DEFAULT 0
                    )
                ''')
                
                async with conn.execute(
                    "SELECT balance FROM user_tokens WHERE user_id = ?", 
                    (user_id,)
                ) as cursor:
                    row = await cursor.fetchone()
                    balance = row[0] if row else 100  # Default starting balance
                    
                    # Initialize user with default balance if not exists
                    if not row:
                        await conn.execute('''
                            INSERT INTO user_tokens (user_id, balance)
                            VALUES (?, ?)
                        ''', (user_id, balance))
                        await conn.commit()
                        logger.info(f"Initialized user {user_id} with {balance} tokens")
                    
                    self.user_tokens[user_id] = balance  # Update cache
                    return balance
        except Exception as exc:
            logger.error(f"Failed to retrieve token balance for user {user_id}: {exc}")
            # Return cached value or default
            return self.user_tokens.get(user_id, 100)

    async def reset_token_balance(self, user_id: int) -> int:
        """
        Reset a user's token balance to zero.

        Args:
            user_id (int): User's unique identifier

        Returns:
            int: Reset token balance (always 0)
        """
        try:
            async with aiosqlite.connect(self.db_path) as conn:
                # Create table if not exists
                await conn.execute('''
                    CREATE TABLE IF NOT EXISTS user_tokens (
                        user_id INTEGER PRIMARY KEY,
                        balance INTEGER NOT NULL DEFAULT 0
                    )
                ''')
                
                # Reset balance to 0
                await conn.execute('''
                    INSERT OR REPLACE INTO user_tokens (user_id, balance)
                    VALUES (?, 0)
                ''', (user_id,))
                await conn.commit()
            
            self.user_tokens[user_id] = 0  # Update cache
            logger.info(f"Reset token balance for user {user_id}")
            return 0
        except Exception as exc:
            logger.error(f"Failed to reset token balance for user {user_id}: {exc}")
            return 0
