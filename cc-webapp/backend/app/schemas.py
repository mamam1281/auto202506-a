"""Pydantic schemas for FastAPI request/response models."""

from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List, Dict, Union
from enum import Enum
from datetime import datetime

# Game related schemas
class GameType(str, Enum):
    SLOT = "slot"
    ROULETTE = "roulette"
    GACHA = "gacha"
    POKER = "poker"
    BLACKJACK = "blackjack"

class GameCreate(BaseModel):
    name: str
    type: GameType
    description: Optional[str] = None
    min_bet: Optional[int] = 0
    max_bet: Optional[int] = 1000
    rules: Optional[Dict] = Field(default_factory=dict)

class GameUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    min_bet: Optional[int] = None
    max_bet: Optional[int] = None
    rules: Optional[Dict] = None
    is_active: Optional[bool] = None

class GameResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    name: str
    type: GameType
    description: Optional[str]
    min_bet: int
    max_bet: int
    rules: Dict
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime]

class GameHistoryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    user_id: int
    game_id: int
    bet_amount: Optional[int]
    result: Dict
    created_at: datetime

class GameStatsResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    game_id: int
    total_plays: int
    total_wins: int
    total_losses: int
    win_rate: float
    avg_bet: Optional[float]
    total_payouts: Optional[int]
    most_active_hour: Optional[int]
    updated_at: datetime

# Adult content related schemas
class AdultContentStageBase(BaseModel):
    stage_name: str
    cost: int
    description: str
    is_unlocked: bool = False

# Removed duplicate AdultContentGalleryItem - using the one at the end of file
    name: Optional[str] = None
    thumbnail_url: Optional[str] = None
    highest_unlocked_stage: Optional[int] = None

class AdultContentDetail(BaseModel):
    id: int
    title: str
    description: str
    content_url: str
    type: str
    unlock_level: int
    prerequisites: List[str]
    name: Optional[str] = None
    stages: List[AdultContentStageBase] = Field(default_factory=list)
    user_current_access_level: Optional[int] = None

class ContentStageInfo(BaseModel):
    stage: int
    stage_to_unlock: Optional[int] = None
    requirements: Dict[str, Union[int, str]]
    rewards: Dict[str, Union[int, str]]

class ContentUnlockRequestNew(BaseModel):
    content_id: int
    stage_to_unlock: Optional[Union[int, str]] = None
    user_proof: Optional[Dict] = None

class ContentUnlockResponse(BaseModel):
    success: bool
    content_url: Optional[str] = None
    message: str
    status: str
    unlocked_stage: Optional[int] = None
    tokens_spent: Optional[int] = None
    remaining_tokens: Optional[int] = None

class UnlockHistoryItem(BaseModel):
    id: int
    content_id: int
    content_name: str
    unlocked_at: str
    stage_required: str


class UnlockHistoryResponse(BaseModel):
    history: List[UnlockHistoryItem]


class AccessUpgradeRequest(BaseModel):
    current_level: int
    requested_level: int
    payment_token: str
    target_segment_level: Optional[int] = None
    duration_days: Optional[int] = 30

class AccessUpgradeResponse(BaseModel):
    success: bool
    new_level: int
    message: str
    status: Optional[str] = None
    new_segment_level: Optional[int] = None
    tokens_spent: Optional[int] = None
    valid_until: Optional[datetime] = None

class ContentPreviewResponse(BaseModel):
    id: int
    title: str
    preview_data: Dict
    unlock_requirements: Dict
    preview_url: Optional[str] = None
    current_stage_accessed: Optional[int] = None

# Feedback related schemas
class FeedbackResponse(BaseModel):
    message: str
    suggestions: List[str]
    emotion: str
    segment: str
    success: bool = True
    recommendation: Optional[Dict] = None
    reward_suggestion: Optional[Dict] = None

# Recommendation related schemas
class FinalRecommendation(BaseModel):
    game_id: int
    game_name: str
    confidence: float
    reasons: List[str]
    rewards: Optional[Dict] = None

# Authentication related schemas
class TokenData(BaseModel):
    user_id: Optional[int] = None

class AgeVerificationRequest(BaseModel):
    user_id: int
    verification_method: str
    document_type: Optional[str] = None
    phone_number: Optional[str] = None

# Flash Offer related schemas
class FlashOfferPurchaseResponse(BaseModel):
    success: bool
    offer_id: Optional[int] = None
    tokens_purchased: Optional[int] = None
    cost: Optional[float] = None
    message: str

class FlashOfferResponseItem(BaseModel):
    id: int
    title: str
    description: str
    tokens: int
    original_price: float
    discounted_price: float
    discount_percentage: int
    expires_at: datetime
    is_available: bool = True

# VIP Content related schemas  
class VIPInfoResponse(BaseModel):
    user_id: int
    vip_tier: str  # 테스트에서 사용하는 필드명
    tier: str
    benefits: List[str]
    content_access: List[str]
    next_tier_requirements: Optional[Dict] = None

class VIPExclusiveContentItem(BaseModel):
    id: int
    name: str  # 테스트에서 사용하는 필드명
    title: str
    description: str
    content_type: str
    thumbnail_url: Optional[str] = None  # 테스트에서 사용하는 필드명
    preview_url: Optional[str] = None
    full_content_url: Optional[str] = None
    tier_required: str

class AdultContentGalleryItem(BaseModel):
    id: int
    name: str  # 테스트에서 사용하는 필드명
    title: str
    description: str
    thumbnail_url: str  # 테스트에서 사용하는 필드명
    preview_url: str
    content_type: str
    stage_required: str
    highest_unlocked_stage: Optional[str] = None  # 테스트에서 사용하는 필드명
    is_unlocked: bool = False


class AdultContentGalleryResponse(BaseModel):
    items: List[AdultContentGalleryItem]


class ActiveFlashOffersResponse(BaseModel):
    offers: List[FlashOfferResponseItem]


class FlashOfferActionResponse(BaseModel):
    success: bool
    message: str
    offer_id: Optional[int] = None


class FlashOfferPurchaseRequest(BaseModel):
    offer_id: int
    user_id: int
