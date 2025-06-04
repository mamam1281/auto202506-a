"""Minimal Pydantic models used in tests."""

from pydantic import BaseModel


class ContentUnlockRequest(BaseModel):
    user_id: int
    stage: int
