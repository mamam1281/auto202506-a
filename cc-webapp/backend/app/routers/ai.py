from fastapi import APIRouter, Depends, HTTPException, Body
from typing import Optional, Dict, Any
import logging # Ensure logging is imported

# Assuming EmotionResult is the Pydantic model from emotion_models.py
from ..emotion_models import EmotionResult, BaseModel # BaseModel might be needed for AIAnalysisRequest
from pydantic import Field # Field is used in AIAnalysisRequest

# Services and other dependencies
from ..services.cj_ai_service import CJAIService

# --- Start of Dummy/Placeholder Dependencies for Subtask ---
class DummyRedisForRouter:
    def get(self, name): logging.debug(f"DummyRedis GET: {name}"); return None
    def set(self, name, value, ex=None): logging.debug(f"DummyRedis SET: {name} VAL: {value[:100]}...")
    def publish(self, channel, message): logging.debug(f"DummyRedis PUBLISH: {channel} MSG: {message}")

class DummyWebsocketManagerForRouter:
    async def broadcast(self, message: dict): logging.debug(f"DummyWebsocketManager BROADCAST: {message}")
# --- End of Dummy/Placeholder Dependencies ---

class AIAnalysisRequest(BaseModel):
    user_id: int
    text: str = Field(..., min_length=1)
    context: Optional[Dict[str, Any]] = None

router = APIRouter(prefix="/ai", tags=["AI Analysis"])
logger = logging.getLogger(__name__) # Module-level logger for the router

# Dependency function (placeholder for real DI)
async def get_cj_ai_service_dependency():
    try:
        # from ..services.cj_ai_service import CJAIService # Already imported above
        dummy_redis = DummyRedisForRouter()
        dummy_ws_manager = DummyWebsocketManagerForRouter()
        # Configure logging at least to INFO for messages from CJAIService to appear if it also uses logging
        # logging.basicConfig(level=logging.INFO) # Avoid reconfiguring if already set globally
        return CJAIService(redis_client=dummy_redis, websocket_manager=dummy_ws_manager)
    except ImportError:
        logger.error("Failed to import CJAIService for router dependency.")
        return None
    except Exception as e:
        logger.error(f"Error creating CJAIService dependency: {e}", exc_info=True)
        return None

@router.post("/analyze", response_model=Optional[EmotionResult],
             summary="Analyze User Text for Emotion",
             description="Receives user text, performs emotion analysis, logs the result, and broadcasts it via WebSocket.")
async def analyze_text_emotion(
    request_data: AIAnalysisRequest = Body(...),
    cj_service: Optional[CJAIService] = Depends(get_cj_ai_service_dependency)
):
    if not cj_service:
        logger.error("AI Service dependency failed, service is unavailable.")
        raise HTTPException(status_code=503, detail="AI Service is unavailable due to an internal configuration error.")

    try:
        emotion_result = await cj_service.analyze_user_text(
            user_id=request_data.user_id,
            text=request_data.text,
            session_context=request_data.context
        )
    except Exception as e:
        logger.exception(f"Unhandled error during AI analysis router call for user {request_data.user_id}")
        raise HTTPException(status_code=500, detail="An unexpected error occurred during AI analysis.")

    if not emotion_result:
        # Log this specific case in the router as well for traceability
        logger.warning(f"Emotion analysis for user {request_data.user_id} text '{request_data.text[:50]}...' yielded no result from service.")
        raise HTTPException(status_code=400, detail="Failed to analyze emotion. Input might be invalid or analysis yielded no conclusive result.")

    return emotion_result
