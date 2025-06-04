import os
try:
    import redis
except Exception:  # noqa: BLE001
    redis = None

user_tokens: dict[int, int] = {}

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")
redis_client = None
if redis is not None:
    try:
        redis_client = redis.Redis.from_url(REDIS_URL, decode_responses=True)
        redis_client.ping()
    except Exception:
        redis_client = None

def _redis_key(user_id: int) -> str:
    return f"user:{user_id}:cyber_token_balance"


def add_tokens(user_id: int, amount: int) -> int:
    """Add cyber tokens to a user and return new balance."""
    if redis_client:
        return redis_client.incrby(_redis_key(user_id), amount)
    balance = user_tokens.get(user_id, 0) + amount
    user_tokens[user_id] = balance
    return balance


def deduct_tokens(user_id: int, amount: int) -> int:
    """Deduct tokens if possible, raise ValueError if insufficient."""
    if redis_client:
        key = _redis_key(user_id)
        while True:
            try:
                redis_client.watch(key)
                balance = int(redis_client.get(key) or 0)
                if balance < amount:
                    redis_client.unwatch()
                    raise ValueError("Insufficient tokens")
                pipe = redis_client.pipeline()
                pipe.multi()
                pipe.set(key, balance - amount)
                pipe.execute()
                return balance - amount
            except redis.WatchError:
                continue
    balance = user_tokens.get(user_id, 0)
    if balance < amount:
        raise ValueError("Insufficient tokens")
    balance -= amount
    user_tokens[user_id] = balance
    return balance


def get_balance(user_id: int) -> int:
    if redis_client:
        val = redis_client.get(_redis_key(user_id))
        return int(val) if val is not None else 0
    return user_tokens.get(user_id, 0)
