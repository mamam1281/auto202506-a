from dataclasses import dataclass
from typing import Optional
import random
import logging
import aiosqlite

from .token_service import TokenService
from ..repositories.game_repository import GameRepository

logger = logging.getLogger(__name__)


@dataclass
class SlotSpinResult:
    result: str
    reels: list[int]
    tokens_change: int
    balance: int
    streak: int
    animation: Optional[str]


class SlotService:
    """슬롯 머신 로직을 담당하는 서비스 계층 (async/await + aiosqlite)."""

    def __init__(self, repository: GameRepository | None = None, token_service: TokenService | None = None, db_path: str = "dev.db") -> None:
        self.repo = repository or GameRepository(db_path)
        self.token_service = token_service or TokenService(db_path)
        self.db_path = db_path

    async def spin(self, user_id: int, bet_amount: int) -> SlotSpinResult:
        """슬롯 스핀을 실행하고 결과를 반환 (비동기)."""
        logger.info(f"Slot spin started: user_id={user_id}, bet_amount={bet_amount}")
        
        # 입력 검증
        if bet_amount <= 0:
            logger.warning(f"Invalid bet amount from user {user_id}: {bet_amount}")
            raise ValueError("Bet amount must be greater than 0.")

        async with aiosqlite.connect(self.db_path) as conn:
            # 토큰 차감
            initial_balance = await self.token_service.get_token_balance(user_id)
            logger.debug(f"User {user_id} initial balance: {initial_balance}, bet: {bet_amount}")
            
            deducted_tokens = await self.token_service.deduct_tokens(user_id, bet_amount)
            if deducted_tokens is None:
                logger.error(f"Insufficient tokens for user {user_id}: balance={initial_balance}, required={bet_amount}")
                raise ValueError("Insufficient tokens")            # 사용자 세그먼트와 연패 정보 조회
            segment = await self.repo.get_user_segment(user_id)
            streak = self.repo.get_streak(user_id)  # 동기 메서드
            logger.debug(f"User {user_id} segment: {segment}, streak: {streak}")

            # 기본 승리 확률과 잭팟 확률 설정 (RTP ~90% 목표)
            win_prob = 0.40 + min(streak * 0.01, 0.05)  # 기본 40% 승리 확률
            if segment == "Whale":
                win_prob += 0.05
            elif segment == "Low":
                win_prob -= 0.05

            jackpot_prob = 0.02  # 잭팟 확률 2%
            spin = random.random()
            result = "lose"
            reward = 0
            animation = "lose"

            # 릴 결과 생성 (1-9 숫자)
            reels = [random.randint(1, 9) for _ in range(3)]

            if streak >= 7:
                # 연패 보상으로 강제 승리 (모든 릴이 같은 숫자)
                same_number = random.randint(1, 9)
                reels = [same_number, same_number, same_number]
                result = "win"
                reward = int(bet_amount * 1.8)  # 베팅 금액의 1.8배
                animation = "force_win"
                new_streak = 0
                logger.info(f"Force win for user {user_id} after {streak} losses")
            elif spin < jackpot_prob:
                # 잭팟 (모든 릴이 7)
                reels = [7, 7, 7]
                result = "jackpot"
                reward = bet_amount * 5  # 베팅 금액의 5배
                animation = "jackpot"
                new_streak = 0
                logger.info(f"Jackpot win for user {user_id}!")
            elif spin < jackpot_prob + win_prob:
                # 일반 승리 (2개 이상 같은 숫자)
                same_number = random.randint(1, 9)
                reels = [same_number, same_number, random.randint(1, 9)]
                result = "win"
                reward = int(bet_amount * 1.8)  # 베팅 금액의 1.8배
                animation = "win"
                new_streak = 0
                logger.info(f"Regular win for user {user_id}")
            else:
                new_streak = streak + 1
                logger.info(f"User {user_id} lost, streak: {new_streak}")

            # 보상 지급
            if reward > 0:
                await self.token_service.add_tokens(user_id, reward)
                logger.debug(f"Reward {reward} tokens added to user {user_id}")            # 연패 정보 업데이트
            self.repo.set_streak(user_id, new_streak)  # 동기 메서드

            # 현재 잔액 조회
            balance = await self.token_service.get_token_balance(user_id)

            # 게임 기록
            await self.repo.record_action(user_id, "SLOT_SPIN", -bet_amount)
            logger.debug(f"Slot action recorded for user {user_id}")

            tokens_change = reward - bet_amount
            logger.info(f"Slot spin completed: user_id={user_id}, result={result}, tokens_change={tokens_change}, balance={balance}")

            return SlotSpinResult(result, reels, tokens_change, balance, new_streak, animation)
