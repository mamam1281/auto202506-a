from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .apscheduler_jobs import start_scheduler, scheduler # Import scheduler components

app = FastAPI()

@app.on_event("startup")
async def startup_event():
    print("FastAPI startup event: Initializing job scheduler...")
    start_scheduler() # Corrected to call the function
    print("FastAPI startup event: Job scheduler initialization process started.")

@app.on_event("shutdown")
async def shutdown_event():
    print("FastAPI shutdown event: Shutting down scheduler...")
    if scheduler.running:
        scheduler.shutdown(wait=False) # wait=False for async scheduler
    print("FastAPI shutdown event: Scheduler shut down.")

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
from .routers import actions, notification, user_segments, rewards, unlock, gacha # users, feedback # noqa # Added gacha
# app.include_router(users.router, prefix="/api")
app.include_router(actions.router, prefix="/api", tags=["actions"])
app.include_router(rewards.router, prefix="/api", tags=["rewards"])
# app.include_router(feedback.router, prefix="/api")
app.include_router(unlock.router, prefix="/api", tags=["unlock"])
app.include_router(user_segments.router, prefix="/api", tags=["user_segments"])
app.include_router(notification.router, prefix="/api", tags=["notification"])
app.include_router(gacha.router, prefix="/api", tags=["gacha"]) # Added gacha router
