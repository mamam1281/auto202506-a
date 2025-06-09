"""Roulette game service."""

from dataclasses import dataclass
from typing import Optional
from sqlalchemy.orm import Session
import random
import logging

from .token_service import deduct_tokens, add_tokens, get_balance
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
    """룰렛 게임 로직을 담당하는 서비스."""

    def __init__(self, repository: GameRepository | None = None) -> None:
        self.repo = repository or GameRepository()

    def spin(
        self,
        user_id: int,
        bet: int,
        bet_type: str,
        value: Optional[str],
        db: Session,
    ) -> RouletteSpinResult:
        """룰렛 스핀을 실행하고 결과를 반환한다.

        Parameters
        ----------
        user_id: int
            사용자 ID
        bet: int
            베팅 금액(1~50 사이로 제한)
        bet_type: str
            'number', 'color', 'odd_even' 중 하나
        value: Optional[str]
            베팅 값 (숫자 또는 색상 등)
        db: Session
            데이터베이스 세션

        Returns
        -------
        RouletteSpinResult
            스핀 결과 데이터

        Raises
        ------
        ValueError
            토큰이 부족한 경우
        """

        bet = max(1, min(bet, 50))
        logger.info("룰렛 스핀 시작 user=%s bet=%s type=%s value=%s", user_id, bet, bet_type, value)

        try:
            deduct_tokens(user_id, bet, db)
        except ValueError as exc:
            logger.warning("토큰 차감 실패: %s", exc)
            raise

        segment = self.repo.get_user_segment(db, user_id)
        edge_map = {"Whale": 0.05, "Medium": 0.10, "Low": 0.15}
        house_edge = edge_map.get(segment, 0.10)

        number = random.randint(0, 36)
        payout = 0
        result = "lose"
        animation = "lose"

        # 스트릭 정보 (연패 시 승률 보정)
        streak = self.repo.get_streak(user_id)

        if bet_type == "number" and value is not None:
            if number == int(value):
                payout = int(bet * 35 * (1 - house_edge))
                if number == 0:
                    # 0번 적중은 잭팟으로 처리
                    payout = int(bet * 50 * (1 - house_edge))
                    animation = "jackpot"
        elif bet_type == "color" and value in {"red", "black"}:
            color_map = {"red": set(range(1, 37, 2)), "black": set(range(2, 37, 2))}
            if number != 0 and number in color_map[value]:
                payout = int(bet * (1 - house_edge))
        elif bet_type == "odd_even" and value in {"odd", "even"}:
            if number != 0 and (number % 2 == 0) == (value == "even"):
                payout = int(bet * (1 - house_edge))

        if payout:
            result = "win" if animation != "jackpot" else "jackpot"
            animation = animation if animation != "lose" else "win"
            add_tokens(user_id, payout, db)
            streak = 0
        else:
            streak += 1

        balance = get_balance(user_id, db)
        self.repo.set_streak(user_id, streak)
        self.repo.record_action(db, user_id, "ROULETTE_SPIN", -bet)

        logger.info(
            "스핀 결과 user=%s number=%s result=%s payout=%s streak=%s", user_id, number, result, payout, streak
        )

        return RouletteSpinResult(number, result, payout - bet, balance, animation)
