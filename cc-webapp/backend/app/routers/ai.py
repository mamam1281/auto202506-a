"""
MVP AI Router - 최소 감정 분석 API
"""

import logging
from typing import Dict, Optional

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel

from app.services.cj_ai_service import CJAIService
from app.services.recommendation_service import RecommendationService
from app.services.emotion_feedback_service import EmotionFeedbackService
from app.utils.sentiment_analyzer import get_emotion_analysis

logger = logging.getLogger(__name__)

router = APIRouter()

# Request/Response models
class EmotionAnalysisRequest(BaseModel):
    user_id: int
    text: str
    context: Optional[Dict] = None

class EmotionAnalysisResponse(BaseModel):
    success: bool
    data: Dict
    message: str = "Success"

class FeedbackRequest(BaseModel):
    user_id: int
    emotion: str
    segment: str = "Medium"
    context: Optional[Dict] = None

@router.post("/analyze", response_model=EmotionAnalysisResponse)
async def analyze_emotion(request: EmotionAnalysisRequest):
    """MVP 감정 분석 엔드포인트"""
    try:
        # 기본 감정 분석
        emotion_result = get_emotion_analysis(request.text, request.context)
        
        response_data = {
            "emotion": emotion_result.emotion,
            "score": emotion_result.score,
            "confidence": emotion_result.confidence,
            "language": emotion_result.language,
            "user_id": request.user_id
        }
        
        logger.info(f"Emotion analysis completed for user {request.user_id}: {emotion_result.emotion}")
        
        return EmotionAnalysisResponse(
            success=True,
            data=response_data
        )
        
    except Exception as e:
        logger.error(f"Emotion analysis failed: {e}")
        raise HTTPException(status_code=500, detail="Emotion analysis failed")

@router.get("/recommend/personalized")
async def get_personalized_recommendations(user_id: int, emotion: Optional[str] = None):
    """MVP 개인화 추천 엔드포인트"""
    try:
        service = RecommendationService()
        recommendations = service.get_personalized_recommendations(user_id, emotion)
        
        return {
            "success": True,
            "data": {
                "recommendations": recommendations,
                "user_id": user_id
            }
        }
        
    except Exception as e:
        logger.error(f"Recommendation failed: {e}")
        raise HTTPException(status_code=500, detail="Recommendation failed")

@router.post("/feedback/generate")
async def generate_feedback(request: FeedbackRequest):
    """MVP 피드백 생성 엔드포인트"""
    try:
        service = EmotionFeedbackService()
        feedback = service.generate_feedback(request.emotion, request.segment, request.context)
        animation_meta = service.get_animation_meta(request.emotion)
        
        return {
            "success": True,
            "data": {
                "feedback": feedback,
                "animation_meta": animation_meta,
                "user_id": request.user_id,
                "emotion": request.emotion,
                "segment": request.segment
            }
        }
        
    except Exception as e:
        logger.error(f"Feedback generation failed: {e}")
        raise HTTPException(status_code=500, detail="Feedback generation failed")

@router.get("/templates")
async def get_response_templates():
    """응답 템플릿 조회"""
    try:
        service = EmotionFeedbackService()
        return {
            "success": True,
            "data": {
                "templates": service.feedback_templates,
                "total_count": len(service.feedback_templates)
            }
        }
    except Exception as e:
        logger.error(f"Template retrieval failed: {e}")
        raise HTTPException(status_code=500, detail="Template retrieval failed")
