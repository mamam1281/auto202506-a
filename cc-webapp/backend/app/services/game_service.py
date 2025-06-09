from typing import Optional

from sqlalchemy.orm import Session

from ..repositories.game_repository import GameRepository

from .slot_service import SlotService, SlotSpinResult
from .roulette_service import RouletteService, RouletteSpinResult
from .gacha_service import GachaService, GachaPullResult


class GameService:
    """각 게임별 서비스 클래스를 조합해 제공하는 파사드."""

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

