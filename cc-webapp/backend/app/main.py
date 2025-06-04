from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from .apscheduler_jobs import start_scheduler, scheduler
from prometheus_fastapi_instrumentator import Instrumentator # ADDED IMPORT
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration
import os # For Sentry DSN from env var
from pydantic import BaseModel # For request/response models
from typing import Optional

from app.routers import (
    actions,
    gacha,
    rewards,
    unlock,
    notification,
    user_segments,
    feedback,
    adult_content,
    corporate,
    users,
)

# --- Sentry Initialization (Placeholder - should be configured properly with DSN) ---
# It's good practice to initialize Sentry as early as possible.
# The DSN should be configured via an environment variable for security and flexibility.
SENTRY_DSN = os.getenv("SENTRY_DSN", None) # Example: https://your_key@sentry.io/your_project_id
if SENTRY_DSN:
    try:
        sentry_sdk.init(
            dsn=SENTRY_DSN,
            traces_sample_rate=1.0, # Capture 100% of transactions for performance monitoring. Adjust in production.
            profiles_sample_rate=1.0, # For performance profiling. Adjust in production.
            environment=os.getenv("ENVIRONMENT", "development"), # e.g., development, staging, production
            # release="cc-webapp-backend@1.0.0" # Optional: set your release version
            # Enable FastAPI integration
            integrations=[FastApiIntegration()]
        )
        print("Sentry SDK initialized successfully.")
    except Exception as e:
        print(f"Error: Failed to initialize Sentry SDK. {e}")
else:
    print("Warning: SENTRY_DSN not found. Sentry SDK not initialized.")
# --- End Sentry Initialization Placeholder ---


app = FastAPI(
    title="Casino Club API",
    description="API for interactive mini-games and token-based reward system",
    version="0.1.0",
    docs_url="/docs",  # Swagger UI 경로
    redoc_url="/redoc"  # ReDoc 문서 경로
)

# Prometheus Instrumentation - ADDED SECTION
# This should ideally be done after app creation and before other middlewares/routers if possible,
# or at least before routers that you want to be instrumented by default.
instrumentator = Instrumentator(
    should_group_status_codes=True,    # Group status codes (2xx, 3xx, etc.)
    should_instrument_requests_inprogress=True, # Expose gauge for in-progress requests
    excluded_handlers=["/metrics"],    # Don't instrument the /metrics endpoint itself
    inprogress_labels=True,            # Add labels to in-progress metric
    # Other options are available for more detailed metrics if needed
)
instrumentator.instrument(app) # Apply instrumentation middleware
# Expose the /metrics endpoint
# include_in_schema=False to hide it from OpenAPI docs
# tags for organization if it were included in schema
instrumentator.expose(app, include_in_schema=False, endpoint="/metrics", tags=["monitoring"])


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

# Register API routers
app.include_router(actions.router, prefix="/api")
app.include_router(gacha.router, prefix="/api")
app.include_router(rewards.router, prefix="/api")
app.include_router(unlock.router, prefix="/api")
app.include_router(notification.router, prefix="/api")
app.include_router(user_segments.router, prefix="/api")
app.include_router(feedback.router, prefix="/api")
app.include_router(adult_content.router, prefix="/api")
app.include_router(corporate.router, prefix="/api")
app.include_router(users.router, prefix="/api")

# Request/Response Models
class UserLogin(BaseModel):
    """사용자 로그인 스키마"""
    user_id: str
    password: str

class LoginResponse(BaseModel):
    """로그인 응답 스키마"""
    token: str
    user_id: str
    message: Optional[str] = None

@app.post("/login", response_model=LoginResponse, tags=["Authentication"])
async def login(user: UserLogin):
    """
    사용자 로그인 엔드포인트

    - **user_id**: 사용자 ID
    - **password**: 비밀번호
    - 성공 시 JWT 토큰 반환
    """
    # 실제 로직은 추후 구현
    if user.user_id == "test" and user.password == "password":
        return {
            "token": "sample_jwt_token",
            "user_id": user.user_id,
            "message": "로그인 성공"
        }
    raise HTTPException(status_code=401, detail="인증 실패")

@app.get("/health", tags=["System"])
async def health_check():
    """
    시스템 상태 확인 엔드포인트
    
    - 서버 정상 동작 여부 확인
    - 헬스체크 용도
    """
    return {"status": "healthy"}