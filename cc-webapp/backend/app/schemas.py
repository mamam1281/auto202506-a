"""Minimal Pydantic models used in tests."""

from pydantic import BaseModel


class ContentUnlockRequest(BaseModel):
    user_id: int
    stage: int


class TokenEarnRequest(BaseModel):
    amount: int
    activity_type: str


class UnlockRequest(BaseModel):
    stage: int


class UnlockResponse(BaseModel):
    success: bool
    stage: int
    tokens_spent: int
    content_url: str | None = None
