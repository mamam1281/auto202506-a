from sqlalchemy.orm import Session
from app import models

class UserService:
    """Utility service for common user lookups."""

    def __init__(self, db: Session) -> None:
        self.db = db

    def get_user_or_error(self, user_id: int) -> models.User:
        user = self.db.query(models.User).filter(models.User.id == user_id).first()
        if not user:
            raise ValueError("존재하지 않는 사용자")
        return user
