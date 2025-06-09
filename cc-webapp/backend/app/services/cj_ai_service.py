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

logger = logging.getLogger(__name__)

class ResponseType(Enum):
    GREETING = "greeting"
    GAME_ENCOURAGEMENT = "game_encouragement"
    WIN_CELEBRATION = "win_celebration"
    LOSS_COMFORT = "loss_comfort"
    GENERAL_CHAT = "general_chat"

@dataclass
class ChatContext:
    user_id: int
    recent_messages: List[str]
    game_session: Optional[Dict] = None
    emotion_history: List[str] = None

@dataclass
class CJResponse:
    message: str
    response_type: ResponseType
    emotion_detected: Optional[str] = None
    confidence: float = 0.0
    suggestions: List[str] = None

class CJAIService:
    def __init__(self, redis_client=None, websocket_manager=None):
        self.redis_client = redis_client
        self.websocket_manager = websocket_manager
        self.response_templates = self._load_response_templates()
        logger.info("CJ AI Service initialized")

    def _load_response_templates(self) -> Dict[str, List[str]]:
        """Load response templates from file or return defaults"""
        templates_path = Path(__file__).parent.parent / "data" / "response_templates.json"
        
        if templates_path.exists():
            with open(templates_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        
        # Default templates if file doesn't exist
        return {
            "greeting": [
                "안녕하세요! CJ입니다. 오늘 기분은 어떠세요? 🎰",
                "반갑습니다! 재미있는 게임 한판 어떠세요? 🎲",
                "CJ와 함께 즐거운 시간 보내요! 😊"
            ],
            "excited": [
                "우와! 정말 좋으시겠어요! 🎉",
                "이 기세를 몰아 한 판 더 어떠세요? 🔥",
                "축하합니다! 대박이네요! 🌟"
            ],
            "frustrated": [
                "괜찮아요, 다음에는 분명 좋은 결과가 있을 거예요! 💪",
                "운은 돌고 돕니다. 조금만 더 화이팅! 🍀",
                "힘내세요! CJ가 응원하고 있어요! 😊"
            ],
            "curious": [
                "궁금한 게 있으시면 언제든 물어보세요! 🤔",
                "더 알고 싶으시군요! 설명드릴게요 📚",
                "좋은 질문이에요! 자세히 말씀드릴게요 💡"
            ],
            "general": [
                "네, 말씀해 주세요! 😊",
                "어떤 게임이 재미있을까요? 🎮",
                "CJ와 함께 즐거운 시간 보내요! ✨"
            ]
        }

    async def analyze_and_respond(self, user_id: int, message: str, context: Optional[ChatContext] = None) -> CJResponse:
        """Analyze user message and generate appropriate response"""
        try:
            # Enhanced emotion analysis with context
            emotion_result = get_emotion_analysis(message, context=asdict(context) if context else None)
            
            # Generate response based on emotion
            response_message = self._generate_response(emotion_result, context)
            
            # Create response object
            cj_response = CJResponse(
                message=response_message,
                response_type=self._determine_response_type(emotion_result.emotion),
                emotion_detected=emotion_result.emotion,
                confidence=emotion_result.confidence,
                suggestions=self._generate_suggestions(emotion_result.emotion, context)
            )
            
            # Store interaction for learning
            await self._store_interaction(user_id, message, cj_response)
            
            logger.info(f"CJ response generated for user {user_id}: {emotion_result.emotion} ({emotion_result.confidence:.2f})")
            return cj_response
            
        except Exception as e:
            logger.error(f"Error in analyze_and_respond: {e}")
            return CJResponse(
                message="죄송해요, 잠시 문제가 있었어요. 다시 말씀해 주세요! 😅",
                response_type=ResponseType.GENERAL_CHAT,
                confidence=0.0
            )

    def _generate_response(self, emotion_result: EmotionResult, context: Optional[ChatContext] = None) -> str:
        """Generate response based on emotion and context"""
        emotion = emotion_result.emotion
        templates = self.response_templates.get(emotion, self.response_templates["general"])
        
        # Simple template selection (can be enhanced later)
        import random
        base_response = random.choice(templates)
        
        # Add context-aware modifications (basic implementation)
        if context and context.game_session:
            game_type = context.game_session.get("game_type")
            if game_type and emotion == "excited":
                base_response += f" {game_type}에서 좋은 결과가 있길 바라요!"
        
        return base_response

    def _determine_response_type(self, emotion: str) -> ResponseType:
        """Determine response type based on emotion"""
        emotion_to_type = {
            "excited": ResponseType.WIN_CELEBRATION,
            "frustrated": ResponseType.LOSS_COMFORT,
            "angry": ResponseType.LOSS_COMFORT,
            "sad": ResponseType.LOSS_COMFORT,
            "curious": ResponseType.GENERAL_CHAT,
            "tired": ResponseType.GAME_ENCOURAGEMENT,
            "neutral": ResponseType.GENERAL_CHAT
        }
        return emotion_to_type.get(emotion, ResponseType.GENERAL_CHAT)

    def _generate_suggestions(self, emotion: str, context: Optional[ChatContext] = None) -> List[str]:
        """Generate game suggestions based on emotion"""
        suggestions = []
        
        if emotion == "excited":
            suggestions = ["룰렛 한 번 더 도전해보세요!", "슬롯머신에서 행운을 시험해보세요!"]
        elif emotion == "frustrated":
            suggestions = ["잠시 휴식을 취해보세요", "다른 게임을 시도해보세요"]
        elif emotion == "curious":
            suggestions = ["게임 규칙을 확인해보세요", "확률 정보를 살펴보세요"]
        else:
            suggestions = ["어떤 게임을 해보고 싶으세요?"]
            
        return suggestions

    async def _store_interaction(self, user_id: int, message: str, response: CJResponse):
        """Store interaction for learning and analytics"""
        try:
            interaction_data = {
                "user_id": user_id,
                "timestamp": datetime.now().isoformat(),
                "user_message": message,
                "emotion_detected": response.emotion_detected,
                "confidence": response.confidence,
                "response_type": response.response_type.value,
                "response_message": response.message
            }
            
            # Store in Redis with TTL (basic implementation)
            if self.redis_client:
                key = f"cj_interaction:{user_id}:{datetime.now().timestamp()}"
                await self.redis_client.setex(key, 86400, json.dumps(interaction_data))  # 24h TTL
            else:
                logger.debug("Redis client not available, skipping interaction storage")
            
        except Exception as e:
            logger.warning(f"Failed to store interaction: {e}")

    async def get_user_emotion_history(self, user_id: int, limit: int = 10) -> List[Dict]:
        """Get user's recent emotion history"""
        try:
            if not self.redis_client:
                logger.debug("Redis client not available, returning empty history")
                return []
                
            pattern = f"cj_interaction:{user_id}:*"
            keys = await self.redis_client.keys(pattern)
            
            interactions = []
            for key in sorted(keys)[-limit:]:
                data = await self.redis_client.get(key)
                if data:
                    interactions.append(json.loads(data))
            
            return interactions
            
        except Exception as e:
            logger.error(f"Error getting emotion history: {e}")
            return []

    async def send_websocket_message(self, user_id: int, message: str):
        """Send message via WebSocket"""
        try:
            if self.websocket_manager:
                await self.websocket_manager.send_personal_message(message, user_id)
            else:
                logger.debug("WebSocket manager not available, skipping message send")
        except Exception as e:
            logger.warning(f"Failed to send WebSocket message to user {user_id}: {e}")
