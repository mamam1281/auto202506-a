from dataclasses import dataclass
from typing import Optional
from sqlalchemy.orm import Session
import random

from .token_service import TokenService
from ..repositories.game_repository import GameRepository


@dataclass
class SlotSpinResult:
    result: str
    reels: list[int]
    tokens_change: int
    balance: int
    streak: int
    animation: Optional[str]


class SlotService:
    """슬롯 머신 로직을 담당하는 서비스 계층."""

    def __init__(self, repository: GameRepository | None = None, token_service: TokenService | None = None, db: Optional[Session] = None) -> None:
        self.repo = repository or GameRepository()
        self.token_service = token_service or TokenService(db or None, self.repo)

    def spin(self, user_id: int, bet_amount: int, db: Session) -> SlotSpinResult:
        """슬롯 스핀을 실행하고 결과를 반환."""
        # 토큰 차감. 부족하면 ValueError 발생
        deducted_tokens = self.token_service.deduct_tokens(user_id, bet_amount)
        if deducted_tokens is None:
            raise ValueError("토큰이 부족합니다.")

        segment = self.repo.get_user_segment(db, user_id)
        streak = self.repo.get_streak(user_id)

        # 기본 승리 확률과 잭팟 확률 설정
        win_prob = 0.10 + min(streak * 0.01, 0.05)
        if segment == "Whale":
            win_prob += 0.02
        elif segment == "Low":
            win_prob -= 0.02
        jackpot_prob = 0.01

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
            reward = 10
            animation = "force_win"
            streak = 0
        elif spin < jackpot_prob:
            # 잭팟 (모든 릴이 7)
            reels = [7, 7, 7]
            result = "jackpot"
            reward = 100
            animation = "jackpot"
            streak = 0
        elif spin < jackpot_prob + win_prob:
            # 일반 승리 (2개 이상 같은 숫자)
            same_number = random.randint(1, 9)
            reels = [same_number, same_number, random.randint(1, 9)]
            result = "win"
            reward = 10
            animation = "win"
            streak = 0
        else:
            streak += 1

        if reward:
            self.token_service.add_tokens(user_id, reward)

        self.repo.set_streak(user_id, streak)
        balance = self.token_service.get_token_balance(user_id)
        self.repo.record_action(db, user_id, "SLOT_SPIN", -bet_amount)
        return SlotSpinResult(result, reels, reward - bet_amount, balance, streak, animation)
