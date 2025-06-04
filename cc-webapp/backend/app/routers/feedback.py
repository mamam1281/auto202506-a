from fastapi import APIRouter

router = APIRouter()


@router.post("/feedback")
async def create_feedback():
    return {"message": "Feedback endpoint stub"}
