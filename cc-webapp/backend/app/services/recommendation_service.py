"""
MVP Recommendation Service - 최소 기능 구현
"""

import logging
from typing import List, Dict, Optional

logger = logging.getLogger(__name__)

class RecommendationService:
    def __init__(self, db=None):
        self.db = db
        logger.info("Recommendation Service initialized (MVP mode)")

    def get_personalized_recommendations(self, user_id: int, emotion: str = None, limit: int = 3) -> List[Dict]:
        """MVP 추천 시스템 - 기본 로직"""
        try:
            # MVP: 감정 기반 단순 추천
            recommendations = []
            
            if emotion == "excited":
                recommendations = [
                    {"game_type": "roulette", "confidence": 0.8, "reason": "고조된 감정에 적합한 게임"},
                    {"game_type": "slot", "confidence": 0.7, "reason": "연속 플레이에 좋은 게임"}
                ]
            elif emotion == "frustrated":
                recommendations = [
                    {"game_type": "slot", "confidence": 0.6, "reason": "차분한 플레이에 적합"},
                    {"game_type": "gacha", "confidence": 0.5, "reason": "기분 전환에 도움"}
                ]
            else:
                # 기본 추천
                recommendations = [
                    {"game_type": "slot", "confidence": 0.7, "reason": "인기 게임"},
                    {"game_type": "roulette", "confidence": 0.6, "reason": "추천 게임"}
                ]
            
            logger.debug(f"Generated {len(recommendations)} recommendations for user {user_id}")
            return recommendations[:limit]
            
        except Exception as e:
            logger.error(f"Error in get_personalized_recommendations: {e}")
            return [{"game_type": "slot", "confidence": 0.5, "reason": "기본 추천"}]

    def get_popular_games(self, limit: int = 5) -> List[Dict]:
        """인기 게임 목록 반환"""
        return [
            {"game_type": "slot", "popularity": 0.9},
            {"game_type": "roulette", "popularity": 0.8},
            {"game_type": "gacha", "popularity": 0.7}
        ][:limit]

    def update_user_preference(self, user_id: int, game_type: str, action: str):
        """사용자 선호도 업데이트 (MVP: 로깅만)"""
        logger.info(f"User {user_id} performed {action} on {game_type}")
