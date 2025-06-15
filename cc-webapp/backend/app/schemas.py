"""Pydantic schemas for FastAPI request/response models."""

from pydantic import BaseModel, Field, validator
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
    RPS = "rps"
    QUIZ = "quiz"

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

    class Config:
        from_attributes = True

class GameHistoryResponse(BaseModel):
    id: int
    user_id: int
    game_id: int
    bet_amount: Optional[int]
    result: Dict
    created_at: datetime

    class Config:
        from_attributes = True

class GameStatsResponse(BaseModel):
    game_id: int
    total_plays: int
    total_wins: int
    total_losses: int
    win_rate: float
    avg_bet: Optional[float]
    total_payouts: Optional[int]
    most_active_hour: Optional[int]
    updated_at: datetime

    class Config:
        from_attributes = True

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


# Quiz related schemas
class QuizDifficulty(str, Enum):
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"


class QuizCategory(str, Enum):
    GENERAL = "general"
    SCIENCE = "science"
    HISTORY = "history"
    SPORTS = "sports"
    ENTERTAINMENT = "entertainment"


class QuizOptionCreate(BaseModel):
    option_text: str
    is_correct: bool
    order_index: int


class QuizOptionResponse(BaseModel):
    id: int
    option_text: str
    is_correct: bool = Field(exclude=True)  # Don't reveal correct answer by default
    order_index: int

    class Config:
        from_attributes = True


class QuizOptionWithAnswer(QuizOptionResponse):
    is_correct: bool = Field(exclude=False)  # Include correct answer for results


class QuizQuestionCreate(BaseModel):
    question_text: str
    question_type: str = "multiple_choice"
    points: int = 10
    order_index: int
    options: List[QuizOptionCreate]


class QuizQuestionResponse(BaseModel):
    id: int
    question_text: str
    question_type: str
    points: int
    order_index: int
    options: List[QuizOptionResponse]

    class Config:
        from_attributes = True


class QuizQuestionWithAnswers(BaseModel):
    id: int
    question_text: str
    question_type: str
    points: int
    order_index: int
    options: List[QuizOptionWithAnswer]

    class Config:
        from_attributes = True


class QuizCreate(BaseModel):
    title: str
    description: Optional[str] = None
    category: QuizCategory
    difficulty: QuizDifficulty
    questions: List[QuizQuestionCreate]


class QuizResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    category: str
    difficulty: str
    is_active: bool
    created_at: datetime
    questions: List[QuizQuestionResponse]

    class Config:
        from_attributes = True


class QuizListResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    category: str
    difficulty: str
    question_count: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class QuizSessionStart(BaseModel):
    quiz_id: int
    bet_amount: int = 0


class QuizSessionResponse(BaseModel):
    id: int
    quiz_id: int
    status: str
    score: int
    total_questions: int
    correct_answers: int
    time_spent_seconds: int
    bet_amount: int
    reward_amount: int
    started_at: datetime
    completed_at: Optional[datetime]

    class Config:
        from_attributes = True


class QuizAnswerSubmit(BaseModel):
    question_id: int
    selected_option_id: int


class QuizAnswerResponse(BaseModel):
    question_id: int
    selected_option_id: int
    is_correct: bool
    correct_option_id: int
    points_earned: int

    class Config:
        from_attributes = True


class QuizSessionComplete(BaseModel):
    session_id: int
    final_score: int
    correct_answers: int
    total_questions: int
    time_spent_seconds: int
    reward_amount: int
    new_balance: int

    class Config:
        from_attributes = True
