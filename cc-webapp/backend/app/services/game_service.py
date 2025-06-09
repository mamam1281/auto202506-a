import random
from typing import List, Optional
from sqlalchemy.orm import Session

from .token_service import deduct_tokens, add_tokens, get_balance
from ..repositories.game_repository import GameRepository
from .. import models

class SlotSpinResult:
    def __init__(self, result: str, reward: int, balance: int, streak: int, animation: Optional[str]):
        self.result = result
        self.tokens_change = reward - 2
        self.balance = balance
        self.streak = streak
        self.animation = animation


class RouletteSpinResult:
    def __init__(self, number: int, result: str, payout: int, balance: int, animation: Optional[str]):
        self.winning_number = number
        self.result = result
        self.tokens_change = payout
        self.balance = balance
        self.animation = animation


class GachaPullResult:
    def __init__(self, results: List[str], balance: int, cost: int):
        self.results = results
        self.tokens_change = -cost
        self.balance = balance


class GameService:
    def __init__(self, repository: GameRepository | None = None):
        self.repo = repository or GameRepository()

    def slot_spin(self, user_id: int, db: Session) -> SlotSpinResult:
        deduct_tokens(user_id, 2, db)

        segment = self.repo.get_user_segment(db, user_id)
        streak = self.repo.get_streak(user_id)

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

    def gacha_pull(self, user_id: int, count: int, db: Session) -> GachaPullResult:
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
        return GachaPullResult(results, balance, cost)

