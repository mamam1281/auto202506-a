from fastapi import APIRouter

router = APIRouter(prefix="/v1/games", tags=["Games"])

@router.get("/slots")
async def play_slots():
    return {"message": "Slots game endpoint"}

@router.get("/roulette")
async def play_roulette():
    return {"message": "Roulette game endpoint"}

@router.get("/rps")
async def play_rps():
    return {"message": "Rock Paper Scissors endpoint"}

@router.get("/gacha")
async def play_gacha():
    return {"message": "Gacha system endpoint"}
