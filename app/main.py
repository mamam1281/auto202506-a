from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi
from fastapi.security import HTTPBearer
import yaml
import os

from app.routers import auth, user, content

# Security Configuration
security = HTTPBearer()

# Initialize FastAPI Application
app = FastAPI(
    title="Codex WebApp API",
    description="Adult-oriented gamified webapp with emotion feedback",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware for Frontend Integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://staging.codexwebapp.com", "https://api.codexwebapp.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load OpenAPI Schema from YAML
def load_openapi_schema():
    schema_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "docs", "openapi.yaml")
    try:
        with open(schema_path, "r") as f:
            return yaml.safe_load(f)
    except FileNotFoundError:
        print(f"OpenAPI schema not found at {schema_path}")
        return None
    except yaml.YAMLError as e:
        print(f"Error parsing OpenAPI schema: {e}")
        return None

# Custom OpenAPI Schema Endpoint
@app.get("/openapi.json", include_in_schema=False)
async def custom_openapi():
    schema = load_openapi_schema()
    if schema is None:
        raise HTTPException(status_code=500, detail="OpenAPI schema could not be loaded")
    return schema

# Authentication Routes
@app.post("/auth/login", tags=["Authentication"])
async def login(email: str, password: str):
    # TODO: Implement actual authentication logic
    return {"message": "Login endpoint"}

@app.post("/auth/register", tags=["Authentication"])
async def register(email: str, password: str):
    # TODO: Implement user registration
    return {"message": "Registration endpoint"}

# Example Protected Route
@app.get("/user/profile", tags=["User"])
async def get_user_profile():
    # TODO: Implement user profile retrieval with authentication
    return {"message": "User profile"}

# Content Routes
@app.post("/content/unlock", tags=["Content"])
async def unlock_content(content_id: str):
    # TODO: Implement content unlocking mechanism
    return {"message": f"Attempting to unlock content {content_id}"}

# Include routers
app.include_router(auth.router)
app.include_router(user.router)
app.include_router(content.router)

# Startup Event Handler
@app.on_event("startup")
async def startup_event():
    print("Codex WebApp API is starting up...")
    schema = load_openapi_schema()
    if schema:
        print("OpenAPI schema successfully loaded")

# Optional: Health Check Endpoint
@app.get("/health", include_in_schema=False)
async def health_check():
    return {"status": "healthy"}

# Main Application Configuration
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
