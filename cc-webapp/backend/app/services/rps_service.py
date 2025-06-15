from dataclasses import dataclass
from typing import Optional
from sqlalchemy.orm import Session
import random

from .token_service import TokenService
from ..repositories.game_repository import GameRepository


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

    def __init__(self, repository: GameRepository | None = None, token_service: TokenService | None = None, db: Optional[Session] = None) -> None:
        self.repo = repository or GameRepository()
        self.token_service = token_service or TokenService(db or None, self.repo)

    def play(self, user_id: int, user_choice: str, bet_amount: int, db: Session) -> RPSResult:
        """RPS 게임을 플레이하고 결과를 반환."""
        # 입력 검증
        if user_choice not in self.VALID_CHOICES:
            raise ValueError("올바르지 않은 선택입니다. rock, paper, scissors 중 하나를 선택하세요.")
        
        # 토큰 차감. 부족하면 ValueError 발생
        deducted_tokens = self.token_service.deduct_tokens(user_id, bet_amount)
        if deducted_tokens is None:
            raise ValueError("토큰이 부족합니다.")

        # 컴퓨터 선택 (랜덤)
        computer_choice = random.choice(self.VALID_CHOICES)
        
        # 게임 결과 결정
        if user_choice == computer_choice:
            result = "draw"
        elif self.WINNING_COMBINATIONS[user_choice] == computer_choice:
            result = "win"
        else:
            result = "lose"
            
        # 사용자 세그먼트에 따른 보상 조정
        segment = self.repo.get_user_segment(db, user_id)
        
        # 토큰 변화량 계산
        tokens_change = 0
        if result == "win":
            reward = bet_amount * 2  # 기본 2배 보상
            if segment == "Whale":
                reward = int(bet_amount * 2.5)  # 고래 사용자 2.5배
            elif segment == "Low":
                reward = int(bet_amount * 1.5)  # 저소비 사용자 1.5배
            
            self.token_service.add_tokens(user_id, reward)
            tokens_change = reward - bet_amount
        elif result == "draw":
            # 무승부 시 베팅 금액 환불
            self.token_service.add_tokens(user_id, bet_amount)
            tokens_change = 0
        else:  # lose
            # 패배 시 베팅 금액만 잃음
            tokens_change = -bet_amount

        # 현재 잔액 조회
        balance = self.token_service.get_token_balance(user_id)
        
        # 게임 기록
        self.repo.record_action(db, user_id, "RPS_PLAY", -bet_amount)
        
        return RPSResult(user_choice, computer_choice, result, tokens_change, balance)
