"""Roulette game service with async/await + aiosqlite."""

import random
import logging
import aiosqlite
from dataclasses import dataclass
from typing import Optional

from .token_service import TokenService
from ..repositories.game_repository import GameRepository

logger = logging.getLogger(__name__)


@dataclass
class RouletteSpinResult:
    """룰렛 스핀 결과 데이터."""

    winning_number: int
    result: str
    tokens_change: int
    balance: int
    animation: Optional[str]


class RouletteService:
    """룰렛 게임 로직을 담당하는 서비스 (async/await + aiosqlite)."""

    def __init__(self, repository: Optional[GameRepository] = None, 
                 token_service: Optional[TokenService] = None, 
                 db_path: str = "dev.db") -> None:
        """Initialize RouletteService with dependencies.
        
        Args:
            repository: Game repository for data access
            token_service: Token service for balance management
            db_path: Path to SQLite database file
        """
        self.repo = repository or GameRepository(db_path)
        self.token_service = token_service or TokenService(db_path)
        self.db_path = db_path

    async def spin(
        self,
        user_id: int,
        bet: int,
        bet_type: str,
        value: Optional[str],
    ) -> RouletteSpinResult:
        """룰렛 스핀을 실행하고 결과를 반환 (비동기).

        Args:
            user_id: 사용자 ID
            bet: 베팅 금액(1~50 사이로 제한)
            bet_type: 'number', 'color', 'odd_even' 중 하나
            value: 베팅 값 (숫자 또는 색상 등)

        Returns:
            RouletteSpinResult: 스핀 결과 데이터

        Raises:
            ValueError: 토큰이 부족한 경우
        """
        bet = max(1, min(bet, 50))
        logger.info("룰렛 스핀 시작 user=%s bet=%s type=%s value=%s", user_id, bet, bet_type, value)
        
        async with aiosqlite.connect(self.db_path) as conn:
            # 토큰 차감
            initial_balance = await self.token_service.get_token_balance(user_id)
            logger.debug(f"User {user_id} initial balance: {initial_balance}, bet: {bet}")
            
            deducted_tokens = await self.token_service.deduct_tokens(user_id, bet)
            if deducted_tokens is None:
                logger.error(f"Insufficient tokens for user {user_id}: balance={initial_balance}, required={bet}")
                raise ValueError("토큰이 부족합니다.")

            # 사용자 세그먼트 조회
            segment = await self.repo.get_user_segment(user_id)
            logger.debug(f"User {user_id} segment: {segment}")
            
            # 하우스 엣지 (세그먼트별 다른 확률)
            edge_map = {"Whale": 0.05, "Medium": 0.10, "Low": 0.15}
            house_edge = edge_map.get(segment, 0.10)

            # 룰렛 스핀 (0-36)
            number = random.randint(0, 36)
            payout = 0
            result = "lose"
            animation = "lose"

            # 연패 정보 조회 (동기 메서드)
            streak = self.repo.get_streak(user_id)

            # 베팅 타입별 처리
            if bet_type == "number" and value is not None:
                if number == int(value):
                    payout = int(bet * 35 * (1 - house_edge))
                    if number == 0:
                        # 0번 적중은 잭팟으로 처리
                        payout = int(bet * 50 * (1 - house_edge))
                        animation = "jackpot"
            elif bet_type == "color" and value in {"red", "black"}:
                # 실제 룰렛에서의 색상 매핑
                red_numbers = {1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36}
                black_numbers = {2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35}
                
                color_map = {"red": red_numbers, "black": black_numbers}
                if number != 0 and number in color_map[value]:
                    payout = int(bet * 2 * (1 - house_edge))
            elif bet_type == "odd_even" and value in {"odd", "even"}:
                if number != 0 and (number % 2 == 0) == (value == "even"):
                    payout = int(bet * 2 * (1 - house_edge))

            # 승패 처리
            if payout > 0:
                result = "win" if animation != "jackpot" else "jackpot"
                animation = animation if animation != "lose" else "win"
                await self.token_service.add_tokens(user_id, payout)
                new_streak = 0
                logger.info(f"User {user_id} won: payout={payout}, result={result}")
            else:
                new_streak = streak + 1
                logger.info(f"User {user_id} lost, streak: {new_streak}")

            # 최종 잔액 조회
            balance = await self.token_service.get_token_balance(user_id)
            
            # 연패 정보 업데이트
            self.repo.set_streak(user_id, new_streak)
            
            # 게임 기록
            await self.repo.record_action(user_id, "ROULETTE_SPIN", -bet)

            tokens_change = payout - bet
            logger.info(
                "스핀 결과 user=%s number=%s result=%s payout=%s streak=%s", 
                user_id, number, result, payout, new_streak
            )

            return RouletteSpinResult(number, result, tokens_change, balance, animation)
