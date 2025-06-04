from fastapi import FastAPI, HTTPException # Added HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .apscheduler_jobs import start_scheduler, scheduler # Import scheduler components
from prometheus_fastapi_instrumentator import Instrumentator # ADDED IMPORT
import sentry_sdk # ADDED Sentry SDK import
import os # For Sentry DSN from env var

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
            integrations=[
                from sentry_sdk.integrations.fastapi import FastApiIntegration
            ]
        )
        print("Sentry SDK initialized successfully.")
    except Exception as e:
        print(f"Error: Failed to initialize Sentry SDK. {e}")
else:
    print("Warning: SENTRY_DSN not found. Sentry SDK not initialized.")
# --- End Sentry Initialization Placeholder ---


app = FastAPI()

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

@app.get("/health", tags=["healthcheck"])
async def health():
    """
    Health check endpoint for Docker Compose and other monitoring systems.
    """
    return {"status": "healthy"}

@app.get("/")
async def root():
    return {"status": "OK"}

@app.get("/debug-sentry", tags=["debug"])
async def trigger_sentry_error():
    """
    A debug endpoint to deliberately raise an exception and test Sentry integration.
    This endpoint should ideally be removed or secured (e.g., restricted to dev environments) in production.
    """
    error_message = "This is a test exception to verify Sentry integration for cc-webapp."
    print(f"Debug: Intentionally raising an exception: {error_message}")
    try:
        # Example of a common error
        result = 1 / 0
        return {"result_should_not_be_reached": result} # Should not be reached
    except Exception as e:
        # Sentry's FastAPI integration should automatically capture unhandled exceptions
        # that result in a 500 error. Raising HTTPException might be handled differently
        # or might need explicit capture if not a standard unhandled Python exception.
        # For a clear test, just re-raising the original error is often best.
        # sentry_sdk.capture_exception(e) # Explicit capture if needed, but usually automatic
        print(f"Deliberately caused error for Sentry: {e}")
        # Re-raise the original error to let FastAPI and Sentry middleware handle it
        raise e
        # Alternatively, to show a specific message in HTTP response while still sending to Sentry:
        # raise HTTPException(status_code=500, detail=f"Sentry Test: Deliberate error occurred - {str(e)}")


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
