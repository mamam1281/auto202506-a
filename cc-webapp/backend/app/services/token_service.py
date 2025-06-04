"""Token service that persists balances to both Redis and database for durability."""

import os
from datetime import datetime
from typing import Optional
from sqlalchemy.orm import Session

try:
    import redis
except Exception:  # noqa: BLE001
    redis = None

from app import models
from app.database import get_db

# Redis configuration with fallback to in-memory dictionary
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")
redis_client = None
user_tokens: dict[int, int] = {}  # In-memory fallback

if redis is not None:
    try:
        redis_client = redis.Redis.from_url(REDIS_URL, decode_responses=True)
        redis_client.ping()
    except Exception:
        redis_client = None


def _redis_key(user_id: int) -> str:
    return f"user:{user_id}:cyber_token_balance"


def _sync_db_balance(db: Session, user_id: int, new_balance: int) -> None:
    """Update user's cyber token balance in the database without committing."""
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise ValueError("User not found")

    user.cyber_token_balance = new_balance
    # Use flush to push the update so callers can decide when to commit
    db.flush()


def add_tokens(user_id: int, amount: int, db: Optional[Session] = None) -> int:
    """Add cyber tokens to a user and return the new balance.

    Updates both Redis and DB for durability. If db is provided, caller is
    responsible for committing the session.
    """
    # Update Redis or in-memory fallback
    if redis_client:
        balance = redis_client.incrby(_redis_key(user_id), amount)
    else:
        balance = user_tokens.get(user_id, 0) + amount
        user_tokens[user_id] = balance

    # Update database if session provided
    if db:
        _sync_db_balance(db, user_id, balance)

    return balance


def deduct_tokens(user_id: int, amount: int, db: Optional[Session] = None) -> int:
    """Deduct tokens if possible and return the remaining balance.

    Updates both Redis and DB for durability. If db is provided, caller is
    responsible for committing the session.
    """
    # Check and update in Redis (with optimistic locking) or memory
    if redis_client:
        key = _redis_key(user_id)
        while True:
            try:
                redis_client.watch(key)
                balance = int(redis_client.get(key) or 0)
                if balance < amount:
                    redis_client.unwatch()
                    raise ValueError("Insufficient tokens")
                new_balance = balance - amount
                pipe = redis_client.pipeline()
                pipe.multi()
                pipe.set(key, new_balance)
                pipe.execute()
                break
            except redis.WatchError:
                continue
    else:
        balance = user_tokens.get(user_id, 0)
        if balance < amount:
            raise ValueError("Insufficient tokens")
        new_balance = balance - amount
        user_tokens[user_id] = new_balance

    # Update database if session provided
    if db:
        _sync_db_balance(db, user_id, new_balance)

    return new_balance


def get_balance(user_id: int, db: Optional[Session] = None) -> int:
    """Get user's current token balance.

    Prioritizes Redis for speed but falls back to DB if needed.
    """
    # Try Redis first for speed
    if redis_client:
        val = redis_client.get(_redis_key(user_id))
        if val is not None:
            return int(val)

    # Fall back to in-memory cache
    if user_id in user_tokens:
        return user_tokens[user_id]

    # Fall back to database if provided
    if db:
        user = db.query(models.User).filter(models.User.id == user_id).first()
        if user:
            balance = user.cyber_token_balance or 0
            # Update Redis/memory for next time
            if redis_client:
                redis_client.set(_redis_key(user_id), balance)
            else:
                user_tokens[user_id] = balance
            return balance

    # Default to 0 if no balance found
    return 0


def sync_from_db(user_id: int, db: Session) -> int:
    """Sync Redis/memory balance from DB for consistency."""
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise ValueError("User not found")

    balance = user.cyber_token_balance or 0

    # Update Redis or in-memory fallback
    if redis_client:
        redis_client.set(_redis_key(user_id), balance)
    else:
        user_tokens[user_id] = balance

    return balance


def bulk_add_tokens(
    user_ids: list[int], amount: int, db: Session | None = None
) -> dict[int, int]:
    """Add tokens to multiple users in bulk."""
    results: dict[int, int] = {}
    for uid in user_ids:
        try:
            new_balance = add_tokens(uid, amount, db)
            results[uid] = new_balance
        except Exception as e:  # noqa: BLE001
            if db:
                db.rollback()
            results[uid] = None
    if db:
        db.commit()
    return results


def transfer_tokens(
    from_user_id: int, to_user_id: int, amount: int, db: Session
) -> dict:
    """Transfer tokens between users with transaction logging."""
    try:
        deduct_tokens(from_user_id, amount, db)
        add_tokens(to_user_id, amount, db)
        transfer_log = models.TokenTransfer(
            from_user_id=from_user_id,
            to_user_id=to_user_id,
            amount=amount,
            timestamp=datetime.utcnow(),
            status="COMPLETED",
        )
        db.add(transfer_log)
        db.commit()
        return {
            "from_balance": get_balance(from_user_id, db),
            "to_balance": get_balance(to_user_id, db),
            "transfer_id": transfer_log.id,
            "amount": amount,
            "timestamp": transfer_log.timestamp.isoformat(),
        }
    except Exception as e:  # noqa: BLE001
        db.rollback()
        transfer_log = models.TokenTransfer(
            from_user_id=from_user_id,
            to_user_id=to_user_id,
            amount=amount,
            timestamp=datetime.utcnow(),
            status="FAILED",
            error_message=str(e),
        )
        db.add(transfer_log)
        db.commit()
        raise


def get_token_history(
    user_id: int, limit: int = 10, db: Session | None = None
) -> list[dict]:
    """Retrieve a combined list of token history events."""
    if db is None:
        return []

    transfers_sent = (
        db.query(models.TokenTransfer)
        .filter(models.TokenTransfer.from_user_id == user_id)
        .order_by(models.TokenTransfer.timestamp.desc())
        .limit(limit)
        .all()
    )

    transfers_received = (
        db.query(models.TokenTransfer)
        .filter(models.TokenTransfer.to_user_id == user_id)
        .order_by(models.TokenTransfer.timestamp.desc())
        .limit(limit)
        .all()
    )

    game_logs = (
        db.query(models.GameLog)
        .filter(models.GameLog.user_id == user_id)
        .order_by(models.GameLog.played_at.desc())
        .limit(limit)
        .all()
    )

    all_history: list[dict] = []

    for tr in transfers_sent:
        all_history.append(
            {
                "type": "TRANSFER_SENT",
                "amount": -tr.amount,
                "timestamp": tr.timestamp,
                "details": {"to_user_id": tr.to_user_id, "status": tr.status},
            }
        )

    for tr in transfers_received:
        all_history.append(
            {
                "type": "TRANSFER_RECEIVED",
                "amount": tr.amount,
                "timestamp": tr.timestamp,
                "details": {"from_user_id": tr.from_user_id, "status": tr.status},
            }
        )

    for log in game_logs:
        all_history.append(
            {
                "type": f"GAME_{log.game_type.upper()}",
                "amount": log.net_change,
                "timestamp": log.played_at,
                "details": {
                    "game_type": log.game_type,
                    "bet_amount": log.bet_amount,
                    "win_amount": log.win_amount,
                    "result_type": log.result_type,
                },
            }
        )

    all_history.sort(key=lambda x: x["timestamp"], reverse=True)
    return all_history[:limit]
