user_tokens = {}

def add_tokens(user_id: int, amount: int) -> int:
    """Add cyber tokens to a user and return new balance"""
    balance = user_tokens.get(user_id, 0)
    balance += amount
    user_tokens[user_id] = balance
    return balance

def deduct_tokens(user_id: int, amount: int) -> int:
    """Deduct tokens if possible, raise ValueError if insufficient"""
    balance = user_tokens.get(user_id, 0)
    if balance < amount:
        raise ValueError("Insufficient tokens")
    balance -= amount
    user_tokens[user_id] = balance
    return balance

def get_balance(user_id: int) -> int:
    return user_tokens.get(user_id, 0)
