"""Simple token service that persists balances to the database."""

from sqlalchemy.orm import Session

from app import models


def _sync_db_balance(db: Session, user_id: int, new_balance: int) -> None:
    """Update user's cyber token balance in the database without committing."""
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise ValueError("User not found")

    user.cyber_token_balance = new_balance
    # Use flush to push the update so callers can decide when to commit
    db.flush()


def add_tokens(db: Session, user_id: int, amount: int) -> int:
    """Add cyber tokens to a user and return the new balance.

    Caller is responsible for committing the session.
    """

    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise ValueError("User not found")

    balance = user.cyber_token_balance or 0
    balance += amount
    _sync_db_balance(db, user_id, balance)
    return balance


def deduct_tokens(db: Session, user_id: int, amount: int) -> int:
    """Deduct tokens if possible and return the remaining balance.

    Caller is responsible for committing the session.
    """

    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise ValueError("User not found")

    balance = user.cyber_token_balance or 0
    if balance < amount:
        raise ValueError("Insufficient tokens")
    balance -= amount
    _sync_db_balance(db, user_id, balance)
    return balance


def get_balance(db: Session, user_id: int) -> int:
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise ValueError("User not found")
    return user.cyber_token_balance or 0
