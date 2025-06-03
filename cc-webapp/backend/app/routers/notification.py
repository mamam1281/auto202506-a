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


# Pydantic model for the pending notification response
class PendingNotificationResponse(BaseModel):
    message: str | None = None # Message can be null if no pending notifications
    # Consider adding notification_id if client might need to acknowledge or reference it
    # notification_id: int | None = None

@router.get(
    "/notification/pending/{user_id}",
    response_model=PendingNotificationResponse,
    tags=["notification"] # Existing tag is fine
)
async def get_pending_notification(
    user_id: int = Path(..., title="The ID of the user to check for pending notifications", ge=1),
    db: Session = Depends(get_db) # get_db is already defined in this file
):
    """
    Retrieves the oldest pending (is_sent=False) notification for a user,
    marks it as sent (is_sent=True, sent_at=utcnow), and returns its message.
    If no pending notifications, returns { "message": null }.
    """
    # First, check if user exists - good practice, though not strictly required if FK constraints handle it
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        # This check might be redundant if all notification creations ensure valid user_id
        # However, it's a safeguard.
        raise HTTPException(status_code=404, detail=f"User with id {user_id} not found.")

    # Query for the oldest pending notification for this user
    # Order by created_at to ensure FIFO for notifications
    pending_notification = db.query(models.Notification).filter(
        models.Notification.user_id == user_id,
        models.Notification.is_sent == False # SQLAlchemy uses '==' for comparison, not 'is False' for query construction
    ).order_by(models.Notification.created_at.asc()).first()

    if not pending_notification:
        return PendingNotificationResponse(message=None)

    # Mark the notification as sent
    pending_notification.is_sent = True
    pending_notification.sent_at = datetime.utcnow()

    try:
        db.commit()
        db.refresh(pending_notification)
        print(f"Notification ID {pending_notification.id} for user {user_id} marked as sent.")
    except Exception as e:
        db.rollback()
        print(f"Error marking notification {pending_notification.id} as sent for user {user_id}: {e}")
        # Depending on policy, you might re-raise or return an error response.
        # If the update fails, the client gets the message but it's not marked sent, leading to re-delivery.
        # Better to raise an error so client knows the operation wasn't fully successful.
        raise HTTPException(status_code=500, detail="Failed to update notification status in database.")

    return PendingNotificationResponse(message=pending_notification.message)

# Ensure this router is included in app/main.py:
# from .routers import notification
# app.include_router(notification.router, prefix="/api", tags=["notification"])
# This should already be done from the previous SiteVisit endpoint.
