from dataclasses import dataclass
from typing import Optional
from sqlalchemy.orm import Session
import random

from .token_service import deduct_tokens, add_tokens, get_balance
from ..repositories.game_repository import GameRepository


@dataclass
class RouletteSpinResult:
    winning_number: int
    result: str
    tokens_change: int
    balance: int
    animation: Optional[str]


class RouletteService:
    """룰렛 게임 로직을 담당하는 서비스."""

    def __init__(self, repository: GameRepository | None = None) -> None:
        self.repo = repository or GameRepository()

    def spin(self, user_id: int, bet: int, bet_type: str, value: Optional[str], db: Session) -> RouletteSpinResult:
        """룰렛 스핀 실행."""
        bet = max(1, min(bet, 50))
        deduct_tokens(user_id, bet, db)

        segment = self.repo.get_user_segment(db, user_id)
        edge_map = {"Whale": 0.05, "Medium": 0.10, "Low": 0.15}
        house_edge = edge_map.get(segment, 0.10)

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

        if payout:
            result = "win"
            animation = "win"
            add_tokens(user_id, payout, db)

        balance = get_balance(user_id, db)
        self.repo.record_action(db, user_id, "ROULETTE_SPIN", -bet)
        return RouletteSpinResult(number, result, payout - bet, balance, animation)
