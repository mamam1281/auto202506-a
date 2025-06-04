from fastapi import APIRouter

router = APIRouter(prefix="/v1/corporate", tags=["Corporate"])

@router.get("/tokens")
async def get_tokens():
    return {"message": "Corporate token flow endpoint"}
