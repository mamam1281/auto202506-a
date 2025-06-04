from fastapi import APIRouter

router = APIRouter(prefix="/v1/feedback", tags=["Feedback"])

@router.post("/")
async def send_feedback():
    return {"message": "Emotion feedback endpoint"}
