from dataclasses import dataclass
from typing import List, Dict, Tuple, Optional
import random
import os
import json
import logging
import aiosqlite

from .token_service import TokenService
from ..repositories.game_repository import GameRepository

logger = logging.getLogger(__name__)


@dataclass
class GachaPullResult:
    results: List[str]
    tokens_change: int
    balance: int


class GachaService:
    """가챠 뽑기 로직을 담당하는 서비스 (async/await + aiosqlite).

    확률 테이블과 보상 풀은 환경 변수에서 로드되며, 런타임에 갱신할 수 있습니다.
    """

    DEFAULT_RARITY_TABLE: list[tuple[str, float]] = [
        ("Legendary", 0.005),
        ("Epic", 0.045),
        ("Rare", 0.25),
        ("Common", 0.70),
    ]

    def __init__(self, repository: GameRepository | None = None, token_service: TokenService | None = None, db_path: str = "dev.db") -> None:
        self.repo = repository or GameRepository(db_path)
        self.token_service = token_service or TokenService(db_path)
        self.db_path = db_path
        self.rarity_table = self._load_rarity_table()
        self.reward_pool = self._load_reward_pool()

    def _load_rarity_table(self) -> List[Tuple[str, float]]:
        """환경 변수에서 확률 테이블을 로드"""
        table_json = os.getenv("GACHA_RARITY_TABLE")
        if table_json:
            try:
                data = json.loads(table_json)
                return [(str(name), float(prob)) for name, prob in data]
            except Exception as e:  # noqa: BLE001
                logger.error("Invalid GACHA_RARITY_TABLE: %s", e)
        return self.DEFAULT_RARITY_TABLE.copy()

    def _load_reward_pool(self) -> Dict[str, int]:
        """환경 변수에서 보상 풀 정보를 로드"""
        pool_json = os.getenv("GACHA_REWARD_POOL")
        if pool_json:
            try:
                data = json.loads(pool_json)
                return {str(k): int(v) for k, v in data.items()}
            except Exception as e:  # noqa: BLE001
                self.logger.error("Invalid GACHA_REWARD_POOL: %s", e)
        # 기본 풀은 무한으로 간주
        return {}

    def get_config(self) -> dict:
        """현재 설정 정보를 반환"""
        return {"rarity_table": self.rarity_table, "reward_pool": self.reward_pool}

    def update_config(self, *, rarity_table: List[Tuple[str, float]] | None = None, reward_pool: Dict[str, int] | None = None) -> None:
        """확률 테이블 및 보상 풀을 업데이트"""
        if rarity_table is not None:
            self.rarity_table = rarity_table
        if reward_pool is not None:
            self.reward_pool = reward_pool    async def pull(self, user_id: int, count: int) -> GachaPullResult:
        """가챠 뽑기를 수행 (비동기)."""
        logger.info(f"Gacha pull started: user_id={user_id}, count={count}")
        
        # 입력 검증
        if count <= 0:
            logger.warning(f"Invalid pull count from user {user_id}: {count}")
            raise ValueError("Pull count must be greater than 0")
            
        pulls = 10 if count >= 10 else 1
        cost = 450 if pulls == 10 else 50
        
        async with aiosqlite.connect(self.db_path) as conn:
            # 토큰 차감
            logger.info(f"Deducting {cost} tokens from user {user_id}")
            initial_balance = await self.token_service.get_token_balance(user_id)
            
            deducted_tokens = await self.token_service.deduct_tokens(user_id, cost)
            if deducted_tokens is None:
                logger.error(f"Insufficient tokens for user {user_id}: balance={initial_balance}, required={cost}")
                raise ValueError("Insufficient tokens")

            results: List[str] = []
            current_count = self.repo.get_gacha_count(user_id)
            history = self.repo.get_gacha_history(user_id)
            rarity_table = self.rarity_table

            for _ in range(pulls):
                current_count += 1
                pity = current_count >= 90
                rnd = random.random()
                cumulative = 0.0
                rarity = "Common"
                
                for name, prob in rarity_table:
                    adj_prob = prob
                    if history and name in history:
                        adj_prob *= 0.5
                    cumulative += adj_prob
                    if rnd <= cumulative:
                        rarity = name
                        break
                        
                if pity and rarity not in {"Epic", "Legendary"}:
                    rarity = "Epic"
                    current_count = 0
                    
                if self.reward_pool:
                    available = self.reward_pool.get(rarity, 0)
                    if available <= 0:
                        rarity = "Common"
                    else:
                        self.reward_pool[rarity] = available - 1
                        
                results.append(rarity)
                history.insert(0, rarity)
                history = history[:10]

            # 가챠 상태 업데이트
            self.repo.set_gacha_count(user_id, current_count)
            self.repo.set_gacha_history(user_id, history)

            # 현재 잔액 조회 및 기록
            balance = await self.token_service.get_token_balance(user_id)
            await self.repo.record_action(user_id, "GACHA_PULL", -cost)
            
            logger.debug(f"User {user_id} gacha results: {results}, balance: {balance}")
            logger.info(f"Gacha pull completed: user_id={user_id}, results={len(results)} items, cost={cost}")
            
            return GachaPullResult(results, -cost, balance)
        return GachaPullResult(results, -cost, balance)
