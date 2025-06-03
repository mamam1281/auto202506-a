# cc-webapp/backend/app/routers/notification.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime

# Assuming models and database session setup are in these locations
from .. import models # This will import the new SiteVisit model
# Assuming database.py defines SessionLocal correctly
from ..database import SessionLocal

# Pydantic model for request body
class SiteVisitCreate(BaseModel):
    user_id: int
    source: str

# Pydantic model for response
class SiteVisitResponse(BaseModel):
    id: int
    user_id: int
    source: str
    visit_timestamp: datetime

    class Config:
        orm_mode = True # For Pydantic v1/SQLAlchemy compatibility (use from_attributes = True for Pydantic v2)

router = APIRouter()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/notify/site_visit", status_code=201, response_model=SiteVisitResponse)
async def log_site_visit(visit_data: SiteVisitCreate, db: Session = Depends(get_db)):
    """
    Logs a visit to an external corporate site.
    """
    db_site_visit = models.SiteVisit(
        user_id=visit_data.user_id,
        source=visit_data.source,
        # visit_timestamp is handled by default in the model
    )
    db.add(db_site_visit)
    db.commit()
    db.refresh(db_site_visit)
    print(f"Logged site visit for user {visit_data.user_id} from source {visit_data.source}")
    return db_site_visit

# Ensure this router is included in app/main.py:
# from .routers import notification
# app.include_router(notification.router, prefix="/api", tags=["notification"])
