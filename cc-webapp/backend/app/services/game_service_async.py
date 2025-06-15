from typing import Optional

from ..repositories.game_repository import GameRepository
from .slot_service import SlotService, SlotSpinResult
from .roulette_service import RouletteService, RouletteSpinResult
from .gacha_service import GachaService, GachaPullResult
from .rps_service import RPSService, RPSResult


class GameService:
    """게임 서비스 클래스: 모든 게임 기능의 통합 인터페이스 제공 (async/await).
    
    위임 패턴을 통해 구체적인 게임 로직은 각 특화된 서비스 클래스에 위임합니다.
    모든 게임 메서드가 async/await로 통일되었습니다.
    """

    def __init__(self, repository: Optional[GameRepository] = None, db_path: str = "dev.db"):
        """게임 서비스 초기화.

        Args:
            repository: 게임 레포지토리. 없으면 새로 생성됨
            db_path: SQLite 데이터베이스 파일 경로
        """
        self.repo = repository or GameRepository(db_path)
        self.slot_service = SlotService(self.repo, db_path=db_path)
        self.roulette_service = RouletteService(self.repo, db_path=db_path)
        self.gacha_service = GachaService(self.repo, db_path=db_path)
        self.rps_service = RPSService(self.repo, db_path=db_path)

    async def slot_spin(self, user_id: int, bet_amount: int) -> SlotSpinResult:
        """슬롯 머신 스핀 실행 (비동기).
        
        Args:
            user_id: 사용자 ID
            bet_amount: 베팅 금액
            
        Returns:
            SlotSpinResult: 슬롯 스핀 결과
        """
        return await self.slot_service.spin(user_id, bet_amount)

    async def gacha_pull(self, user_id: int, count: int) -> GachaPullResult:
        """가챠 뽑기 실행 (비동기).
        
        Args:
            user_id: 사용자 ID
            count: 뽑기 횟수
            
        Returns:
            GachaPullResult: 가챠 뽑기 결과
        """
        return await self.gacha_service.pull(user_id, count)

    async def rps_play(self, user_id: int, choice: str, bet_amount: int) -> RPSResult:
        """RPS (Rock-Paper-Scissors) 게임 플레이 (비동기).
        
        Args:
            user_id: 사용자 ID
            choice: 사용자 선택 (rock, paper, scissors)
            bet_amount: 베팅 금액
            
        Returns:
            RPSResult: RPS 게임 결과
        """
        return await self.rps_service.play(user_id, choice, bet_amount)

    async def roulette_spin(
        self,
        user_id: int,
        bet: int,
        bet_type: str,
        value: Optional[str],
    ) -> RouletteSpinResult:
        """룰렛 게임 스핀 실행 (비동기).
        
        Args:
            user_id: 사용자 ID
            bet: 베팅 금액
            bet_type: 베팅 타입(number, color, odd_even)
            value: 베팅 값
            
        Returns:
            RouletteSpinResult: 룰렛 스핀 결과
        """
        return await self.roulette_service.spin(user_id, bet, bet_type, value)
