"""Gacha service implementation with async/await + aiosqlite."""

import os
import json
import random
import logging
import aiosqlite
from dataclasses import dataclass
from typing import List, Dict, Tuple, Optional
from sqlalchemy.orm import Session

from .token_service import TokenService
from ..repositories.game_repository import GameRepository

logger = logging.getLogger(__name__)


@dataclass
class GachaPullResult:
    """가챠 뽑기 결과 데이터."""
    results: List[str]
    tokens_change: int
    balance: int


class GachaService:
    """가챠 시스템을 담당하는 서비스 계층 (async/await + aiosqlite)."""

    def __init__(
        self, 
        repository: Optional[GameRepository] = None, 
        token_service: Optional[TokenService] = None,
        db_path: str = "dev.db"
    ) -> None:
        """Initialize GachaService with dependencies.
        
        Args:
            repository: Game repository for data access
            token_service: Token service for balance management
            db_path: Path to SQLite database file
        """
        self.repo = repository or GameRepository(db_path)
        self.token_service = token_service or TokenService(db_path)
        self.db_path = db_path
        
        # Load rarity table from environment or use default
        self.rarity_table = self._load_rarity_table()
        
        # Default reward pool (can be updated via config endpoints)
        self.reward_pool = {
            "Legendary": 10,
            "Epic": 50,
            "Rare": 200,
            "Common": 1000
        }

    def _load_rarity_table(self) -> List[Tuple[str, float]]:
        """Load rarity table from environment variable or return default.
        
        Returns:
            List of (rarity, probability) tuples
        """
        try:
            env_table = os.getenv("GACHA_RARITY_TABLE")
            if env_table:
                return json.loads(env_table)
        except (json.JSONDecodeError, ValueError) as exc:
            logger.warning(f"Failed to load custom rarity table: {exc}")
        
        # Default rarity table
        return [
            ("Legendary", 0.02),  # 2%
            ("Epic", 0.08),       # 8%
            ("Rare", 0.20),       # 20%
            ("Common", 0.70)      # 70%
        ]

    def _calculate_cost(self, count: int) -> int:
        """Calculate gacha pull cost with bulk discount.
        
        Args:
            count: Number of pulls
            
        Returns:
            Total cost in tokens
        """
        base_cost = 50  # 50 tokens per pull
        
        if count >= 10:
            # 10+ pulls get 10% discount
            return int(count * base_cost * 0.9)
        return count * base_cost

    def _determine_rarity(self, user_id: int, gacha_count: int) -> str:
        """Determine the rarity for a gacha pull with pity system.
        
        Args:
            user_id: User ID for logging
            gacha_count: Current gacha pull count for pity system
            
        Returns:
            Rarity string
        """
        # Pity system: guarantee Epic at 90 pulls, Legendary at 180
        if gacha_count >= 179:  # 180th pull guaranteed Legendary
            logger.info(f"Pity system triggered for user {user_id}: Legendary guaranteed")
            return "Legendary"
        elif gacha_count >= 89:  # 90th pull guaranteed Epic
            logger.info(f"Pity system triggered for user {user_id}: Epic guaranteed")
            return "Epic"
        
        # Normal probability-based selection
        rand_val = random.random()
        cumulative_prob = 0.0
        
        for rarity, probability in self.rarity_table:
            cumulative_prob += probability
            if rand_val <= cumulative_prob:
                # Check reward pool availability
                if self.reward_pool.get(rarity, 0) > 0:
                    return rarity
                # If not available, continue to next tier
                continue
        
        # Fallback to Common if all else fails
        return "Common"

    async def pull(self, user_id: int, count: int, db: Optional[Session] = None) -> GachaPullResult:
        """Execute gacha pulls and return results (async).
        
        Args:
            user_id: User ID
            count: Number of pulls to execute
            db: Database session (for compatibility, not used in async version)
            
        Returns:
            GachaPullResult: Pull results with balance info
            
        Raises:
            ValueError: If insufficient tokens or invalid count
        """
        if count <= 0:
            raise ValueError("Count must be greater than 0")
        
        logger.info(f"Gacha pull started: user_id={user_id}, count={count}")
        
        async with aiosqlite.connect(self.db_path) as conn:
            # Calculate cost and check tokens
            cost = self._calculate_cost(count)
            initial_balance = await self.token_service.get_token_balance(user_id)
            logger.debug(f"User {user_id} balance: {initial_balance}, cost: {cost}")
            
            # Deduct tokens
            deducted_tokens = await self.token_service.deduct_tokens(user_id, cost)
            if deducted_tokens is None:
                logger.error(f"Insufficient tokens for user {user_id}: balance={initial_balance}, required={cost}")
                raise ValueError("토큰이 부족합니다")
            
            # Get user's gacha stats for pity system
            gacha_count = self.repo.get_gacha_count(user_id)
            history = self.repo.get_gacha_history(user_id)
            
            # Execute pulls
            results = []
            for i in range(count):
                current_count = gacha_count + i
                rarity = self._determine_rarity(user_id, current_count)
                results.append(rarity)
                
                # Update reward pool
                if rarity in self.reward_pool and self.reward_pool[rarity] > 0:
                    self.reward_pool[rarity] -= 1
                
                logger.debug(f"Pull {i+1}/{count} for user {user_id}: {rarity}")
            
            # Update gacha statistics
            new_count = gacha_count + count
            new_history = (history + results)[-10:]  # Keep last 10 results
            
            self.repo.set_gacha_count(user_id, new_count)
            self.repo.set_gacha_history(user_id, new_history)
            
            # Record action in database
            await self.repo.record_action(user_id, "GACHA_PULL", -cost)
            
            # Get final balance
            final_balance = await self.token_service.get_token_balance(user_id)
            tokens_change = -cost
            
            logger.info(f"Gacha pull completed: user_id={user_id}, results={results}, tokens_change={tokens_change}")
            
            return GachaPullResult(
                results=results,
                tokens_change=tokens_change,
                balance=final_balance
            )

    def get_config(self) -> Dict:
        """Get current gacha configuration.
        
        Returns:
            Dictionary with rarity table and reward pool
        """
        return {
            "rarity_table": self.rarity_table,
            "reward_pool": self.reward_pool.copy()
        }

    def update_config(self, rarity_table: Optional[List[Tuple[str, float]]] = None, 
                     reward_pool: Optional[Dict[str, int]] = None) -> None:
        """Update gacha configuration.
        
        Args:
            rarity_table: New rarity table if provided
            reward_pool: New reward pool if provided
        """
        if rarity_table is not None:
            # Validate probabilities sum to ~1.0
            total_prob = sum(prob for _, prob in rarity_table)
            if abs(total_prob - 1.0) > 0.01:
                raise ValueError(f"Rarity probabilities must sum to 1.0, got {total_prob}")
            self.rarity_table = rarity_table
            logger.info("Rarity table updated")
        
        if reward_pool is not None:
            self.reward_pool.update(reward_pool)
            logger.info("Reward pool updated")
