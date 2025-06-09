from __future__ import annotations
import logging
from typing import List, Dict, Any, Optional, Tuple # Added Tuple
from sqlalchemy.orm import Session # For DB interactions
from pydantic import BaseModel, Field # Ensure BaseModel and Field are imported

from ..emotion_models import EmotionResult, SupportedEmotion

logger = logging.getLogger(__name__)

class RecommendationCandidate(BaseModel):
    item_id: Any
    item_type: str
    score: float
    details: Optional[Dict[str, Any]] = None

class FinalRecommendation(BaseModel):
    item_id: Any
    item_type: str
    name: str
    description: Optional[str] = None
    recommendation_reason: Optional[str] = None
    adjusted_score: Optional[float] = None

class CollaborativeFilteringStrategy:
    def __init__(self, db: Optional[Session]): # Allow None for dummy
        self.db = db
        logger.info("CollaborativeFilteringStrategy initialized (dummy).")

    async def get_recommendations(self, user_id: int, limit: int = 5) -> List[RecommendationCandidate]:
        logger.info(f"Collaborative filtering (dummy) for user {user_id}, limit {limit}.")
        return [
            RecommendationCandidate(item_id=101, item_type="game", score=0.9, details={"name": "Space Adventure X"}),
            RecommendationCandidate(item_id=202, item_type="mission", score=0.8, details={"name": "Daily Quest: Collect Stars"}),
        ][:limit]

class ContentBasedStrategy:
    def __init__(self, db: Optional[Session]): # Allow None for dummy
        self.db = db
        logger.info("ContentBasedStrategy initialized (dummy).")

    async def get_recommendations(self, user_id: int, current_item_features: Optional[Dict[str, Any]] = None, limit: int = 5) -> List[RecommendationCandidate]:
        logger.info(f"Content-based filtering (dummy) for user {user_id}, limit {limit}.")
        recs = [
            RecommendationCandidate(item_id=102, item_type="game", score=0.85, details={"name": "Jungle Explorer"}),
            RecommendationCandidate(item_id=301, item_type="article", score=0.75, details={"name": "Tips for Beginners"}),
        ]
        if current_item_features and "genre" in current_item_features:
             recs.append(RecommendationCandidate(item_id=103, item_type="game", score=0.9, details={"name": f"Another {current_item_features['genre']} Game"}))
        return recs[:limit]

class EmotionAwareAdjuster:
    def __init__(self):
        logger.info("EmotionAwareAdjuster initialized (dummy).")

    async def adjust_recommendations(self, candidates: List[RecommendationCandidate], current_emotion: EmotionResult) -> List[RecommendationCandidate]:
        logger.info(f"Adjusting {len(candidates)} recommendations based on emotion: {current_emotion.emotion.value} (dummy).")
        adjusted_candidates = []
        for cand in candidates:
            new_score = cand.score
            if current_emotion.emotion == SupportedEmotion.JOY and "game" in cand.item_type: new_score += 0.1
            elif current_emotion.emotion == SupportedEmotion.SADNESS and "article" in cand.item_type: new_score += 0.15

            cand_copy = cand.model_copy(deep=True)
            cand_copy.score = min(max(new_score, 0.0), 1.0)
            adjusted_candidates.append(cand_copy)
        return sorted(adjusted_candidates, key=lambda x: x.score, reverse=True)

class RecommendationService:
    def __init__(self, db: Optional[Session]): # Allow None for dummy
        self.db = db
        self.collab_filter = CollaborativeFilteringStrategy(db)
        self.content_based = ContentBasedStrategy(db)
        self.emotion_adjuster = EmotionAwareAdjuster()
        logger.info("RecommendationService initialized with dummy strategies.")

    async def get_personalized_recommendations(
        self, user_id: int, current_emotion: EmotionResult,
        context: Optional[Dict[str, Any]] = None, limit: int = 5
    ) -> List[FinalRecommendation]:
        logger.info(f"Getting personalized recommendations for user {user_id}, emotion {current_emotion.emotion.value}.")

        collab_recs = await self.collab_filter.get_recommendations(user_id, limit=limit)
        content_recs = await self.content_based.get_recommendations(user_id, current_item_features=context, limit=limit)

        combined_candidates: Dict[Tuple[Any, str], RecommendationCandidate] = {}
        for rec_list in [collab_recs, content_recs]:
            for rec in rec_list:
                key = (rec.item_id, rec.item_type)
                if key not in combined_candidates or rec.score > combined_candidates[key].score:
                    combined_candidates[key] = rec

        unique_candidates = list(combined_candidates.values())
        adjusted_recs = await self.emotion_adjuster.adjust_recommendations(unique_candidates, current_emotion)

        final_recommendations: List[FinalRecommendation] = []
        for rec in adjusted_recs[:limit]:
            item_name = rec.details.get("name", f"{rec.item_type.capitalize()} {rec.item_id}") if rec.details else f"{rec.item_type.capitalize()} {rec.item_id}"
            description = f"A recommended {rec.item_type}."

            final_recommendations.append(
                FinalRecommendation(
                    item_id=rec.item_id, item_type=rec.item_type, name=item_name, description=description,
                    recommendation_reason=f"Emotion: {current_emotion.emotion.value}, Score: {rec.score:.2f}",
                    adjusted_score=rec.score
                ))
        logger.info(f"Returning {len(final_recommendations)} final recommendations for user {user_id}.")
        return final_recommendations
