"""Service for handling adult content access and unlocking."""

from typing import List, Optional, Dict, Tuple, Union
from enum import Enum, auto
from datetime import datetime, timedelta

from ..schemas import (
    AdultContentGalleryItem,
    AdultContentDetail,
    ContentStageInfo,
    ContentUnlockRequestNew,
    ContentUnlockResponse,
    ContentPreviewResponse,
    UnlockHistoryItem,
    AccessUpgradeRequest,
    AccessUpgradeResponse,
    AdultContentStageBase
)
from ..models import User

class StageIndex(int, Enum):
    TEASER = 1
    BASIC = 2
    PREMIUM = 3
    VIP = 4
    PARTIAL = 5
    FULL = 6

class ContentStageEnum(str, Enum):
    TEASER = "Teaser"
    BASIC = "Basic"
    PREMIUM = "Premium"
    VIP = "VIP"
    PARTIAL = "Partial"  # For partially unlocked content
    FULL = "Full"       # For fully unlocked content

# Stage details configuration
STAGE_DETAILS = {
    ContentStageEnum.TEASER: {"cost": 0, "description": "Free preview", "index": StageIndex.TEASER, "order": StageIndex.TEASER},
    ContentStageEnum.BASIC: {"cost": 100, "description": "Basic access", "index": StageIndex.BASIC, "order": StageIndex.BASIC},
    ContentStageEnum.PREMIUM: {"cost": 500, "description": "Premium content", "index": StageIndex.PREMIUM, "order": StageIndex.PREMIUM},
    ContentStageEnum.VIP: {"cost": 1000, "description": "VIP exclusive content", "index": StageIndex.VIP, "order": StageIndex.VIP},
    ContentStageEnum.PARTIAL: {"cost": 50, "description": "Partial access", "index": StageIndex.PARTIAL, "order": StageIndex.PARTIAL},
    ContentStageEnum.FULL: {"cost": 2000, "description": "Full lifetime access", "index": StageIndex.FULL, "order": StageIndex.FULL}
}

# User segment access order configuration
USER_SEGMENT_ACCESS_ORDER = {
    "FREE": 1,    # Can access TEASER
    "BASIC": 2,   # Can access TEASER, BASIC
    "PREMIUM": 3, # Can access TEASER, BASIC, PREMIUM
    "VIP": 4,     # Can access all content levels
    "FULL": 5,    # Can access absolutely everything
    "Low": 1,     # Alias for FREE
    "Medium": 3,  # Alias for PREMIUM
    "High": 4,    # Alias for VIP
    "Whale": 5    # Alias for FULL
}

class AdultContentService:
    def __init__(
        self, 
        db=None, 
        token_service=None, 
        age_verification_service=None,
        reward_service=None
    ):
        self.db = db
        self.token_service = token_service
        self.age_verification_service = age_verification_service
        self.reward_service = reward_service

    def _get_user_segment_max_order(self, user_id: int) -> int:
        """Get maximum content order based on user segment."""
        # TODO: Implement actual segment logic
        return USER_SEGMENT_ACCESS_ORDER["BASIC"]

    def _get_user_unlocked_stage_order(self, user_id: int, content_id: int) -> int:
        """Get user's current unlock stage order for content."""
        # TODO: Implement actual DB query
        return StageIndex.TEASER.value

    def _get_stage_by_index(self, index: int) -> ContentStageEnum:
        """Convert stage index to enum value."""
        for stage, details in STAGE_DETAILS.items():
            if details["index"].value == index:
                return stage
        raise ValueError(f"Invalid stage index: {index}")

    def _get_index_by_stage(self, stage: Union[ContentStageEnum, str]) -> int:
        """Convert stage enum/name to index."""
        if isinstance(stage, str):
            stage = ContentStageEnum(stage)
        return STAGE_DETAILS[stage]["index"].value

    async def get_content_details(
        self, 
        content_id: int,
        user_id: int
    ) -> Optional[AdultContentDetail]:
        """Get detailed information about specific content."""
        max_order = self._get_user_segment_max_order(user_id)
        current_stage = self._get_user_unlocked_stage_order(user_id, content_id)

        stages = [
            AdultContentStageBase(
                stage_name=stage.value,
                cost=STAGE_DETAILS[stage]["cost"],
                description=STAGE_DETAILS[stage]["description"],
                is_unlocked=STAGE_DETAILS[stage]["index"].value <= current_stage
            )
            for stage in ContentStageEnum
            if STAGE_DETAILS[stage]["index"].value <= max_order
        ]

        return AdultContentDetail(
            id=content_id,
            title="Sample Content",
            description="Sample description",
            content_url="https://example.com/content",
            type=ContentStageEnum.BASIC.value,
            unlock_level=1,
            prerequisites=["age_verified"],
            stages=stages,
            user_current_access_level=current_stage
        )

    async def unlock_content_stage(
        self, 
        content_id: int,
        stage_to_unlock: Union[int, str, ContentStageEnum],
        user: User
    ) -> ContentUnlockResponse:
        """Unlock specific content stage."""
        try:
            if isinstance(stage_to_unlock, (str, ContentStageEnum)):
                stage_index = self._get_index_by_stage(stage_to_unlock)
            else:
                stage_index = stage_to_unlock

            stage = self._get_stage_by_index(stage_index)
            cost = STAGE_DETAILS[stage]["cost"]

            return ContentUnlockResponse(
                success=True,
                status="success",
                content_url="https://example.com/content",
                message="Stage unlocked successfully",
                unlocked_stage=stage_index,
                tokens_spent=cost,
                remaining_tokens=900
            )
        except (ValueError, KeyError):
            return ContentUnlockResponse(
                success=False,
                status="error",
                message="Invalid stage to unlock"
            )

    async def upgrade_access_temporarily(
        self,
        request: AccessUpgradeRequest,
        user: User
    ) -> AccessUpgradeResponse:
        """Temporarily upgrade user's access level."""
        if request.requested_level <= request.current_level:
            return AccessUpgradeResponse(
                success=False,
                new_level=request.current_level,
                status="error",
                message="Requested level must be higher than current level"
            )

        duration = timedelta(days=request.duration_days or 30)
        valid_until = datetime.now() + duration

        return AccessUpgradeResponse(
            success=True,
            new_level=request.requested_level,
            status="success",
            message="Access level upgraded successfully",
            new_segment_level=request.requested_level,
            tokens_spent=500,
            valid_until=valid_until
        )

    async def get_content_preview(
        self,
        content_id: int,
        user_id: int
    ) -> ContentPreviewResponse:
        """Get preview for content."""
        return ContentPreviewResponse(
            id=content_id,
            title="Sample Preview",
            preview_data={"thumbnail": "https://example.com/thumb.jpg"},
            unlock_requirements={"min_level": 1, "tokens": 100},
            preview_url="https://example.com/preview.jpg",
            current_stage_accessed=0
        )

    def get_content_access_level(self, user_id: int, content_id: int) -> Optional[ContentStageEnum]:
        """Get user's access level for content based on age verification, segment, and unlocks."""
        # Check age verification first
        if self.age_verification_service and not self.age_verification_service.is_user_age_verified(user_id):
            return None
        
        # Get segment and unlock levels
        segment_order = self._get_user_segment_max_order(user_id)
        unlocked_order = self._get_user_unlocked_stage_order(user_id, content_id)
        
        # Return the higher of the two
        max_order = max(segment_order, unlocked_order)
        return self._get_stage_by_index(max_order)

    def get_gallery_for_user(self, user_id: int) -> List[AdultContentGalleryItem]:
        """Get gallery content for user."""
        return []

    def get_user_unlock_history(self, user_id: int) -> List[UnlockHistoryItem]:
        """Get user's unlock history."""
        return []
