from __future__ import annotations

from dataclasses import asdict, dataclass
from datetime import datetime
from enum import Enum
import json
import logging # Added
import os
from pathlib import Path
from typing import Dict, List, Optional, Tuple, Any # 'Any' added

from ..utils.sentiment_analyzer import get_emotion_analysis, EmotionResult, SupportedEmotion # Added


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

    async def analyze_user_text(self, user_id: int, text: str, session_context: Optional[Dict[str, Any]] = None) -> Optional[EmotionResult]:
        # Ensure logger is available, e.g., self.logger or module-level logger
        # For simplicity, using module-level logger here.
        logger = logging.getLogger(__name__) # Ensure logger is defined

        if not self.redis or not self.ws_manager:
            logger.error("CJAIService: Redis client or WebSocket manager not initialized.")
            return None
        try:
            emotion_result_obj: Optional[EmotionResult] = get_emotion_analysis(text, session_context)
        except Exception as e:
            logger.exception(f"CJAIService: Error calling get_emotion_analysis for user {user_id}: {e}")
            return None

        if emotion_result_obj:
            try:
                redis_key = f"emotion_log:{user_id}:{datetime.utcnow().isoformat()}"
                self.redis.set(redis_key, emotion_result_obj.model_dump_json(), ex=3600 * 24 * 7)

                ws_payload = {
                    "type": "emotion_update", "user_id": user_id,
                    "emotion": emotion_result_obj.emotion.value,
                    "display_label": emotion_result_obj.get_display_emotion(),
                    "confidence": emotion_result_obj.confidence,
                    "language": emotion_result_obj.language.value
                }
                # Assuming self.ws_manager.broadcast exists and is awaitable
                await self.ws_manager.broadcast(ws_payload)
                logger.info(f"CJAIService: Emotion analysis for user {user_id} logged and broadcasted.")
            except Exception as e:
                logger.exception(f"CJAIService: Error logging to Redis or broadcasting for user {user_id}: {e}")
            return emotion_result_obj
        else:
            logger.warning(f"CJAIService: Emotion analysis returned no result for user {user_id}, text: '{text[:50]}...'")
            return None

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
