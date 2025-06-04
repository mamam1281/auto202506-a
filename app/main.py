from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from .core.config import settings

from app.routers import (
    auth,
    games,
    feedback,
    adult_content,
    corporate,
    users,
)

# Security Configuration
security = HTTPBearer()

# Initialize FastAPI Application
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Adult-oriented gamified webapp with emotion feedback",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Middleware for Frontend Integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routers
app.include_router(auth.router)
app.include_router(games.router)
app.include_router(feedback.router)
app.include_router(adult_content.router)
app.include_router(corporate.router)
app.include_router(users.router)

# Startup Event Handler
@app.on_event("startup")
async def startup_event():
    print("Codex WebApp API is starting up...")

# Optional: Health Check Endpoint
@app.get("/health", include_in_schema=False)
async def health_check():
    return {"status": "healthy"}

# Main Application Configuration
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
