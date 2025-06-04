from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Dict
from datetime import datetime

from sqlalchemy.orm import Session

from app.database import get_db
from app.services.rfm_service import RFMService, RFMScore
from app.services.ltv_service import LTVService
from app.services.personalization_service import PersonalizationService

router = APIRouter(prefix="/personalization", tags=["personalization"])


def get_user_from_token() -> int:
    return 1


class GameRecommendation(BaseModel):
    game_type: str
    recommended_bet: int
    win_probability: float
    expected_return: float
    reason: str


class UserProfile(BaseModel):
    user_id: int
    segment: str
    rfm_scores: Dict[str, int]
    ltv_prediction: Dict[str, float]
    churn_risk: str
    last_activity: datetime | None


@router.get("/recommendations", response_model=List[GameRecommendation])
async def get_recommendations(
    user_id: int = Depends(get_user_from_token),
    db: Session = Depends(get_db),
):
    rfm_service = RFMService(db, None)
    ltv_service = LTVService(db, None)
    personalization = PersonalizationService(db, None)

    rfm = await rfm_service.calculate_user_rfm(user_id)
    ltv = await ltv_service.predict_ltv(user_id, rfm.segment)
    recs = await personalization.game_recommendations(rfm)
    return recs


@router.get("/profile", response_model=UserProfile)
async def get_user_profile(
    user_id: int = Depends(get_user_from_token),
    db: Session = Depends(get_db),
):
    rfm_service = RFMService(db, None)
    ltv_service = LTVService(db, None)
    personalization = PersonalizationService(db, None)

    rfm = await rfm_service.calculate_user_rfm(user_id)
    ltv = await ltv_service.predict_ltv(user_id, rfm.segment)
    churn = await ltv_service.churn_risk(user_id)
    profile = await personalization.user_profile(rfm, ltv, churn)
    return profile


@router.post("/feedback")
async def collect_feedback(
    recommendation_id: str,
    feedback_type: str,
    user_id: int = Depends(get_user_from_token),
):
    return {"status": "ok"}
