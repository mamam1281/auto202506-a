from __future__ import annotations

from dataclasses import asdict, dataclass
from datetime import datetime
from enum import Enum
import json
import os
from pathlib import Path
from typing import Dict, List, Optional, Tuple


class EmotionState(Enum):
    VERY_NEGATIVE = "very_negative"
    NEGATIVE = "negative"
    NEUTRAL = "neutral"
    POSITIVE = "positive"
    VERY_POSITIVE = "very_positive"


@dataclass
class ConversationContext:
    user_id: int
    session_id: str
    messages: List[Dict]
    current_emotion: EmotionState
    game_context: Dict
    risk_flags: List[str]


class CJAIService:
    """Casino-Club AI service handling conversation and emotion."""

    def __init__(self, redis_client, websocket_manager) -> None:
        self.redis = redis_client
        self.ws_manager = websocket_manager
        self.emotion_keywords = self.load_emotion_keywords()
        self.response_templates = self.load_response_templates()

    def _data_path(self, filename: str) -> Path:
        base = Path(__file__).resolve().parent.parent / "data"
        return base / filename

    def load_emotion_keywords(self) -> Dict:
        path = self._data_path("emotion_keywords.json")
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)

    def load_response_templates(self) -> Dict:
        path = self._data_path("cj_response_templates.json")
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)

    async def process_message(self, user_id: int, message: str) -> str:
        """Process incoming user message and return AI response."""
        key = f"chat:{user_id}"
        raw = self.redis.get(key)
        if raw:
            data = json.loads(raw)
            data["current_emotion"] = EmotionState(
                data.get("current_emotion", "neutral")
            )
            context = ConversationContext(**data)
        else:
            context = ConversationContext(
                user_id=user_id,
                session_id=str(user_id),
                messages=[],
                current_emotion=EmotionState.NEUTRAL,
                game_context={},
                risk_flags=[],
            )

        emotion_state, score = await self.analyze_emotion(message, context.game_context)
        context.current_emotion = emotion_state
        context.messages.append(
            {
                "role": "user",
                "content": message,
                "timestamp": datetime.utcnow().isoformat(),
                "emotion_score": score,
            }
        )
        context.messages = context.messages[-10:]
        response = await self.generate_response(context)
        context.messages.append(
            {
                "role": "ai",
                "content": response,
                "timestamp": datetime.utcnow().isoformat(),
                "emotion_score": 0,
            }
        )
        self.redis.set(key, json.dumps(asdict(context), ensure_ascii=False))
        await self.check_admin_intervention(context)
        return response

    async def analyze_emotion(
        self, message: str, game_context: Dict
    ) -> Tuple[EmotionState, int]:
        text = message.lower()
        score = 0
        for level, words in self.emotion_keywords.get("positive_keywords", {}).items():
            for w in words:
                if w in text:
                    score += {"low": 1, "medium": 3, "high": 5}[level]
        for level, words in self.emotion_keywords.get("negative_keywords", {}).items():
            for w in words:
                if w in text:
                    score -= {"low": 1, "medium": 3, "high": 5}[level]
        if score >= 6:
            state = EmotionState.VERY_POSITIVE
        elif score >= 1:
            state = EmotionState.POSITIVE
        elif score <= -6:
            state = EmotionState.VERY_NEGATIVE
        elif score <= -1:
            state = EmotionState.NEGATIVE
        else:
            state = EmotionState.NEUTRAL
        return state, score

    async def generate_response(self, context: ConversationContext) -> str:
        emotion = context.current_emotion
        if emotion in (EmotionState.VERY_POSITIVE, EmotionState.POSITIVE):
            return "좋은 기세네요! 계속 도전해보세요!"
        if emotion in (EmotionState.NEGATIVE, EmotionState.VERY_NEGATIVE):
            return "힘내세요! 잠시 휴식해도 좋아요."
        return "무엇을 도와드릴까요?"

    async def check_admin_intervention(self, context: ConversationContext) -> bool:
        if "consecutive_loss" in context.risk_flags and context.current_emotion in (
            EmotionState.NEGATIVE,
            EmotionState.VERY_NEGATIVE,
        ):
            await self.notify_admin(context.user_id, context)
            return True
        return False

    async def notify_admin(self, user_id: int, context: ConversationContext) -> None:
        message = {
            "type": "admin_alert",
            "user_id": user_id,
            "reason": "risk_detected",
        }
        await self.ws_manager.broadcast(message)
