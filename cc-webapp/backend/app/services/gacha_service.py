from dataclasses import dataclass
from typing import List
from sqlalchemy.orm import Session
import random

from .token_service import deduct_tokens, get_balance
from ..repositories.game_repository import GameRepository


@dataclass
class GachaPullResult:
    results: List[str]
    tokens_change: int
    balance: int


class GachaService:
    """가챠 뽑기 로직을 담당하는 서비스."""

    def __init__(self, repository: GameRepository | None = None) -> None:
        self.repo = repository or GameRepository()

    def pull(self, user_id: int, count: int, db: Session) -> GachaPullResult:
        """가챠 뽑기를 수행."""
        pulls = 10 if count >= 10 else 1
        cost = 450 if pulls == 10 else 50
        deduct_tokens(user_id, cost, db)

        results: List[str] = []
        current_count = self.repo.get_gacha_count(user_id)
        history = self.repo.get_gacha_history(user_id)

        rarity_table = [
            ("Legendary", 0.005),
            ("Epic", 0.045),
            ("Rare", 0.25),
            ("Common", 0.70),
        ]

        for _ in range(pulls):
            current_count += 1
            pity = current_count >= 90
            rnd = random.random()
            cumulative = 0.0
            rarity = "Common"
            for name, prob in rarity_table:
                adj_prob = prob
                if history and name in history:
                    adj_prob *= 0.5
                cumulative += adj_prob
                if rnd <= cumulative:
                    rarity = name
                    break
            if pity and rarity not in {"Epic", "Legendary"}:
                rarity = "Epic"
                current_count = 0
            results.append(rarity)
            history.insert(0, rarity)
            history = history[:10]

        self.repo.set_gacha_count(user_id, current_count)
        self.repo.set_gacha_history(user_id, history)

        balance = get_balance(user_id, db)
        self.repo.record_action(db, user_id, "GACHA_PULL", -cost)
        return GachaPullResult(results, -cost, balance)
