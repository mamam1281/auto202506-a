from dataclasses import dataclass
from typing import Optional
import random
import logging
import aiosqlite

from .token_service import TokenService
from ..repositories.game_repository import GameRepository

logger = logging.getLogger(__name__)


@dataclass
class RPSResult:
    user_choice: str
    computer_choice: str
    result: str  # "win", "lose", "draw"
    tokens_change: int
    balance: int


class RPSService:
    """RPS (Rock-Paper-Scissors) 게임 로직을 담당하는 서비스 계층."""
    
    VALID_CHOICES = ["rock", "paper", "scissors"]
    WINNING_COMBINATIONS = {
        "rock": "scissors",
        "paper": "rock", 
        "scissors": "paper"
    }

    def __init__(self, repository: GameRepository | None = None, token_service: TokenService | None = None, db_path: str = "dev.db") -> None:
        self.repo = repository or GameRepository(db_path)
        self.token_service = token_service or TokenService(db_path)
        self.db_path = db_path

    async def play(self, user_id: int, user_choice: str, bet_amount: int) -> RPSResult:
        """RPS 게임을 플레이하고 결과를 반환."""
        logger.info(f"RPS game started: user_id={user_id}, choice={user_choice}, bet_amount={bet_amount}")
        
        # 입력 검증
        if user_choice not in self.VALID_CHOICES:
            logger.warning(f"Invalid choice from user {user_id}: {user_choice}")
            raise ValueError("올바르지 않은 선택입니다. rock, paper, scissors 중 하나를 선택하세요.")
        
        if bet_amount <= 0:
            logger.warning(f"Invalid bet amount from user {user_id}: {bet_amount}")
            raise ValueError("베팅 금액은 0보다 커야 합니다.")
        
        async with aiosqlite.connect(self.db_path) as conn:
            # 토큰 차감. 부족하면 ValueError 발생
            initial_balance = await self.token_service.get_token_balance(user_id)
            logger.debug(f"User {user_id} initial balance: {initial_balance}, bet: {bet_amount}")
            
            deducted_tokens = await self.token_service.deduct_tokens(user_id, bet_amount)
            if deducted_tokens is None:
                logger.error(f"Insufficient tokens for user {user_id}: balance={initial_balance}, required={bet_amount}")
                raise ValueError("토큰이 부족합니다.")

            # 컴퓨터 선택 (랜덤)
            computer_choice = random.choice(self.VALID_CHOICES)
            logger.debug(f"Computer choice: {computer_choice}")
            
            # 게임 결과 결정
            if user_choice == computer_choice:
                result = "draw"
            elif self.WINNING_COMBINATIONS[user_choice] == computer_choice:
                result = "win"
            else:
                result = "lose"
                
            logger.info(f"Game result: user={user_choice}, computer={computer_choice}, result={result}")
                
            # 사용자 세그먼트에 따른 보상 조정 (비동기 버전)
            segment = await self.repo.get_user_segment(user_id)
            logger.debug(f"User {user_id} segment: {segment}")
            
            # 토큰 변화량 계산
            tokens_change = 0
            if result == "win":
                reward = bet_amount * 2  # 기본 2배 보상
                if segment == "Whale":
                    reward = int(bet_amount * 2.5)  # 고래 사용자 2.5배
                elif segment == "Low":
                    reward = int(bet_amount * 1.5)  # 저소비 사용자 1.5배
                
                await self.token_service.add_tokens(user_id, reward)
                tokens_change = reward - bet_amount
                logger.info(f"User {user_id} won: reward={reward}, net_change={tokens_change}")
            elif result == "draw":
                # 무승부 시 베팅 금액 환불
                await self.token_service.add_tokens(user_id, bet_amount)
                tokens_change = 0
                logger.info(f"User {user_id} draw: bet refunded")
            else:  # lose
                # 패배 시 베팅 금액만 잃음
                tokens_change = -bet_amount
                logger.info(f"User {user_id} lost: lost={bet_amount}")

            # 현재 잔액 조회
            balance = await self.token_service.get_token_balance(user_id)
            
            # 게임 기록 (비동기 버전)
            await self.repo.record_action(user_id, "RPS_PLAY", -bet_amount)
            logger.debug(f"Game action recorded for user {user_id}")
            
            logger.info(f"RPS game completed: user_id={user_id}, result={result}, tokens_change={tokens_change}, balance={balance}")
            
            return RPSResult(user_choice, computer_choice, result, tokens_change, balance)
