from typing import Optional

from sqlalchemy.orm import Session

from ..repositories.game_repository import GameRepository
from .user_segment_service import UserSegmentService
from .. import models
from .slot_service import SlotService, SlotSpinResult
from .roulette_service import RouletteService, RouletteSpinResult
from .gacha_service import GachaService, GachaPullResult


class SlotSpinResult:
    def __init__(self, result: str, reward: int, balance: int, streak: int, animation: Optional[str]):
        self.result = result
        self.tokens_change = reward - 2
        self.balance = balance
        self.streak = streak
        self.animation = animation



class GameService:

    def __init__(
        self,
        repository: GameRepository | None = None,
        segment_service: UserSegmentService | None = None,
    ) -> None:
        self.repo = repository or GameRepository()
        self.segment_service = segment_service

    def slot_spin(self, user_id: int, db: Session) -> SlotSpinResult:
        deduct_tokens(user_id, 2, db)

        segment_service = self.segment_service or UserSegmentService(db)
        segment = segment_service.get_segment_label(user_id)
        streak = self.repo.get_streak(user_id)

        base_prob = 0.10 + min(streak * 0.01, 0.05)
        win_prob = segment_service.adjust_probability(base_prob, segment)
        jackpot_prob = 0.01

        spin = random.random()
        result = "lose"
        reward = 0
        animation = "lose"
        if streak >= 7:
            result = "win"
            reward = 10
            animation = "force_win"
            streak = 0
        elif spin < jackpot_prob:
            result = "jackpot"
            reward = 100
            animation = "jackpot"
            streak = 0
        elif spin < jackpot_prob + win_prob:
            result = "win"
            reward = 10
            animation = "win"
            streak = 0
        else:
            streak += 1

        if reward:
            add_tokens(user_id, reward, db)

        self.repo.set_streak(user_id, streak)
        balance = get_balance(user_id, db)
        self.repo.record_action(db, user_id, "SLOT_SPIN", -2)
        return SlotSpinResult(result, reward, balance, streak, animation)

    def roulette_spin(self, user_id: int, bet: int, bet_type: str, value: Optional[str], db: Session) -> RouletteSpinResult:
        bet = max(1, min(bet, 50))
        deduct_tokens(user_id, bet, db)

        segment_service = self.segment_service or UserSegmentService(db)
        segment = segment_service.get_segment_label(user_id)
        house_edge = segment_service.get_house_edge(segment)

        number = random.randint(0, 36)
        payout = 0
        result = "lose"
        animation = "lose"

        if bet_type == "number" and value is not None:
            if number == int(value):
                payout = int(bet * 35 * (1 - house_edge))
        elif bet_type == "color" and value in {"red", "black"}:
            color_map = {"red": set(range(1, 37, 2)), "black": set(range(2, 37, 2))}
            if number != 0 and number in color_map[value]:
                payout = int(bet * (1 - house_edge))
        elif bet_type == "odd_even" and value in {"odd", "even"}:
            if number != 0 and (number % 2 == 0) == (value == "even"):
                payout = int(bet * (1 - house_edge))


    def __init__(self, repository: "GameRepository | None" = None):
        self.repo = repository or GameRepository()
        self.slot_service = SlotService(self.repo)
        self.roulette_service = RouletteService(self.repo)
        self.gacha_service = GachaService(self.repo)



    def slot_spin(self, user_id: int, db: Session) -> SlotSpinResult:
        """슬롯 게임 스핀을 실행."""
        return self.slot_service.spin(user_id, db)

    def roulette_spin(
        self,
        user_id: int,
        bet: int,
        bet_type: str,
        value: Optional[str],
        db: Session,
    ) -> RouletteSpinResult:
        """룰렛 게임 스핀 실행."""
        return self.roulette_service.spin(user_id, bet, bet_type, value, db)

    def gacha_pull(self, user_id: int, count: int, db: Session) -> GachaPullResult:
        """가챠 뽑기 실행."""
        return self.gacha_service.pull(user_id, count, db)

