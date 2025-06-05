"""Pydantic models for cc-webapp."""

from pydantic import BaseModel, Json
from typing import List, Optional, Any
from datetime import datetime

# Schemas for existing functionality (keeping them for now)

class ContentUnlockRequest(BaseModel): # This might be superseded or augmented by new AdultContent schemas
    user_id: int # Assuming this might be part of old system, new ones might get user from auth
    stage: int


class TokenEarnRequest(BaseModel):
    amount: int
    activity_type: str


class UnlockRequest(BaseModel): # This is likely for the old system, new one is ContentUnlockRequest
    stage: int


class UnlockResponse(BaseModel): # This is likely for the old system, new one is ContentUnlockResponse
    success: bool
    stage: int
    tokens_spent: int
    content_url: str | None = None

# 1. Base Models for New Tables (for responses and internal use)

# FlashOffer Schemas
class FlashOfferBase(BaseModel):
    user_id: int
    content_id: int
    original_price: int
    discounted_price: int
    discount_rate: float
    trigger_reason: Optional[str] = None
    is_purchased: bool = False

    class Config:
        orm_mode = True

class FlashOffer(FlashOfferBase):
    id: int
    created_at: datetime
    expires_at: datetime
    purchased_at: Optional[datetime] = None

# VIPAccessLog Schemas
class VIPAccessLogBase(BaseModel):
    user_id: int
    content_id: int
    access_tier: Optional[str] = None
    tokens_spent: Optional[int] = None

    class Config:
        orm_mode = True

class VIPAccessLog(VIPAccessLogBase):
    id: int
    accessed_at: datetime

# AgeVerificationRecord Schemas
class AgeVerificationRecordBase(BaseModel):
    user_id: int
    verification_method: Optional[str] = None
    is_valid: bool = True
    # verification_data is intentionally omitted from base and default response
    # as it's sensitive. Specific schemas can include it if needed.

    class Config:
        orm_mode = True

class AgeVerificationRecord(AgeVerificationRecordBase):
    id: int
    verified_at: datetime


# 2. Schemas for AdultContentService and adult_content router

# Content Stages & Details
class ContentStageInfo(BaseModel):
    stage_name: str  # e.g., "Teaser", "Partial", "Full", "VIP"
    cost: int
    description: Optional[str] = None
    is_unlocked: bool

class AdultContentDetail(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    stages: List[ContentStageInfo]
    user_current_access_level: Optional[str] = None # e.g. "Teaser", "Partial", "Full", "VIP", or null

# Gallery
class AdultContentGalleryItem(BaseModel):
    id: int
    name: str
    thumbnail_url: Optional[str] = None
    highest_unlocked_stage: Optional[str] = None # e.g., "Teaser", or null

class AdultContentGalleryResponse(BaseModel):
    items: List[AdultContentGalleryItem]

# Preview
# Using path params for content_id, so no specific ContentPreviewRequest needed for now.
class ContentPreviewResponse(BaseModel):
    content_id: int
    preview_url: Optional[str] = None # Or could be more complex (blurred data, etc.)
    current_stage_accessed: Optional[str] = None

# Unlock
class ContentUnlockRequestNew(BaseModel): # Renamed to avoid conflict if old ContentUnlockRequest is used elsewhere
    content_id: int
    stage_to_unlock: str  # e.g. "Teaser", "Partial", "Full", "VIP"

class ContentUnlockResponse(BaseModel):
    status: str # e.g., "success", "failed", "already_unlocked"
    unlocked_stage: Optional[str] = None
    tokens_spent: Optional[int] = None
    remaining_tokens: Optional[int] = None

# Unlock History
class UnlockHistoryItem(BaseModel):
    content_id: int
    content_name: str
    unlocked_stage: str
    unlocked_at: datetime
    tokens_spent: int

class UnlockHistoryResponse(BaseModel):
    history: List[UnlockHistoryItem]

# Access Upgrade
class AccessUpgradeRequest(BaseModel):
    target_segment_level: str  # e.g., "Medium", "Whale"
    duration_days: Optional[int] = None # For temporary upgrades

class AccessUpgradeResponse(BaseModel):
    status: str
    new_segment_level: str
    tokens_spent: Optional[int] = None
    valid_until: Optional[datetime] = None


# 3. Schemas for FlashOfferService

# Flash Offer List & Details
class FlashOfferResponseItem(BaseModel):
    offer_id: int
    content_id: int
    content_name: Optional[str] = None # Requires join
    original_price: int
    discounted_price: int
    discount_rate: float
    expires_at: datetime
    trigger_reason: Optional[str] = None

class ActiveFlashOffersResponse(BaseModel):
    offers: List[FlashOfferResponseItem]

# Flash Offer Purchase
class FlashOfferPurchaseRequest(BaseModel):
    # Assuming offer_id is in path, user_id from auth.
    # This can be an empty model if no body is needed.
    pass # Or add specific fields if user needs to send something, e.g., payment_confirmation_token

class FlashOfferPurchaseResponse(BaseModel):
    status: str # e.g., "success", "failed_insufficient_tokens", "offer_expired"
    message: str
    purchased_offer: Optional[FlashOfferResponseItem] = None # Return details of the purchased offer

# Flash Offer Deletion/Rejection
class FlashOfferActionResponse(BaseModel): # Generic for delete/reject
    status: str
    message: str


# 4. Schemas for VIPContentService

class VIPInfoResponse(BaseModel):
    user_id: int
    vip_tier: Optional[str] = None
    benefits: List[str] # List of benefit descriptions

class VIPExclusiveContentItem(BaseModel):
    id: int
    name: str
    thumbnail_url: Optional[str] = None
    description: Optional[str] = None
    # Add other VIP specific fields if any, e.g., exclusive_tags

class VIPExclusiveContentResponse(BaseModel):
    items: List[VIPExclusiveContentItem]


# 5. Schemas for AgeVerificationService

class AgeVerificationRequest(BaseModel):
    # user_id will likely come from authenticated user context, not request body
    method: str  # "document", "phone", "ipin"
    verification_data: dict  # use plain dict for tests expecting direct JSON

class AgeVerificationResponse(BaseModel):
    user_id: int
    status: str  # "verified", "pending", "failed", "not_required"
    verified_at: Optional[datetime] = None
    message: Optional[str] = None # e.g., reason for failure or success message
