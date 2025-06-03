from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Configure CORS
origins = [
    "http://localhost:3000",  # Assuming Next.js runs on port 3000
    # Add other origins if needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"status": "OK"}

# Placeholder for including routers (to be implemented later)
# from .routers import users, actions, rewards, feedback, unlock, user_segments, notification # noqa
# app.include_router(users.router, prefix="/api")
# app.include_router(actions.router, prefix="/api")
# app.include_router(rewards.router, prefix="/api")
# app.include_router(feedback.router, prefix="/api")
# app.include_router(unlock.router, prefix="/api")
# app.include_router(user_segments.router, prefix="/api")
# app.include_router(notification.router, prefix="/api")
