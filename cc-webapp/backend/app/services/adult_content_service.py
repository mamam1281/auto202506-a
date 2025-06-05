from sqlalchemy.orm import Session, aliased, joinedload
from sqlalchemy import func, case
from app.models import User, UserSegment, AdultContent, UserReward # Assuming UserReward might store unlocks
from app.schemas import (
    AdultContentDetail, ContentStageInfo, AdultContentGalleryItem,
    ContentUnlockRequestNew, ContentUnlockResponse, UnlockHistoryItem,
    AccessUpgradeRequest, AccessUpgradeResponse, ContentPreviewResponse
) # Ensure these are the correct and fully defined schema names
from app.services.token_service import TokenService # Assuming a token service exists
from app.services.age_verification_service import AgeVerificationService # For age checks
from app.services.reward_service import RewardService # Added RewardService
from datetime import datetime, timedelta
from enum import Enum
from typing import List, Optional, Dict # Added Dict

# Define content stages and costs (could be moved to a config or DB if more dynamic)
class ContentStageEnum(Enum):
    TEASER = "Teaser"
    PARTIAL = "Partial"
    FULL = "Full"
    VIP = "VIP"

STAGE_DETAILS: Dict[ContentStageEnum, Dict[str, any]] = {
    ContentStageEnum.TEASER: {"cost": 200, "order": 1, "description": "Blurred effect + silhouette"},
    ContentStageEnum.PARTIAL: {"cost": 500, "order": 2, "description": "Partial exposure + preview"},
    ContentStageEnum.FULL: {"cost": 1000, "order": 3, "description": "Full exposure + HD quality"},
    ContentStageEnum.VIP: {"cost": 2000, "order": 4, "description": "Exclusive content + special effects"}
}

USER_SEGMENT_ACCESS_ORDER: Dict[str, int] = {
    "Low": STAGE_DETAILS[ContentStageEnum.TEASER]["order"],
    "Medium": STAGE_DETAILS[ContentStageEnum.PARTIAL]["order"],
    "Whale": STAGE_DETAILS[ContentStageEnum.VIP]["order"], # Whales can access all including VIP
    # Default or other segments can be mapped here
}

class AdultContentService:
    def __init__(self, db: Session, token_service: TokenService, age_verification_service: AgeVerificationService, reward_service: RewardService): # Added reward_service
        self.db = db
        self.token_service = token_service
        self.age_verification_service = age_verification_service
        self.reward_service = reward_service # Added reward_service

    def _get_user_segment_max_order(self, user_id: int) -> int:
        user_segment = self.db.query(UserSegment).filter(UserSegment.user_id == user_id).first()
        if not user_segment or not user_segment.rfm_group:
            # Fallback to "Low" access if segment info is missing or rfm_group is not set.
            return USER_SEGMENT_ACCESS_ORDER.get("Low", 0)

        # Check for temporary segment upgrades if UserSegment model supports it.
        # For now, assuming no temporary upgrade fields in UserSegment.
        # if user_segment.temp_rfm_group and user_segment.temp_rfm_group_expires_at and user_segment.temp_rfm_group_expires_at > datetime.utcnow():
        #     temp_order = USER_SEGMENT_ACCESS_ORDER.get(user_segment.temp_rfm_group, 0)
        #     base_order = USER_SEGMENT_ACCESS_ORDER.get(user_segment.rfm_group, 0)
        #     return max(temp_order, base_order) # Should effectively be temp_order if it's an upgrade

        return USER_SEGMENT_ACCESS_ORDER.get(user_segment.rfm_group, 0)


    def _get_user_unlocked_stage_order(self, user_id: int, content_id: int) -> int:
        # This assumes UserReward stores unlocks with reward_type = "CONTENT_UNLOCK"
        # and reward_value = "content_{content_id}_stage_{stage_name}" or similar
        # This needs to be robust. A dedicated UnlockHistory table might be better.

        highest_unlocked_order = 0
        unlocks = self.db.query(UserReward).filter(
            UserReward.user_id == user_id,
            UserReward.reward_type == "CONTENT_UNLOCK",
            UserReward.reward_value.like(f"{content_id}_%") # e.g. "123_Teaser"
        ).all()

        for unlock in unlocks:
            try:
                # Example: reward_value = "123_Partial"
                stage_name_str = unlock.reward_value.split('_')[-1]
                stage_enum = ContentStageEnum(stage_name_str)
                highest_unlocked_order = max(highest_unlocked_order, STAGE_DETAILS[stage_enum]["order"])
            except (ValueError, KeyError): # Added KeyError for STAGE_DETAILS
                # Log malformed reward_value or unknown stage
                continue
        return highest_unlocked_order

    def get_content_access_level(self, user_id: int, content_id: int) -> Optional[ContentStageEnum]:
        if not self.age_verification_service.is_user_age_verified(user_id):
            return None

        segment_max_order = self._get_user_segment_max_order(user_id)
        unlocked_stage_order = self._get_user_unlocked_stage_order(user_id, content_id)

        effective_order = max(segment_max_order, unlocked_stage_order)

        # Find the highest stage matching the effective_order
        current_stage_enum: Optional[ContentStageEnum] = None
        for stage_enum, details in sorted(STAGE_DETAILS.items(), key=lambda item: item[1]["order"], reverse=True):
            if details["order"] <= effective_order:
                current_stage_enum = stage_enum
                break
        return current_stage_enum


    def get_content_details(self, user_id: int, content_id: int) -> Optional[AdultContentDetail]:
        if not self.age_verification_service.is_user_age_verified(user_id):
            # Consider raising an HTTPException in the router layer
            # e.g., HTTPException(status_code=403, detail="Age verification required")
            return None

        content = self.db.query(AdultContent).filter(AdultContent.id == content_id).first()
        if not content:
            return None

        user_segment_max_order = self._get_user_segment_max_order(user_id)
        unlocked_stage_order = self._get_user_unlocked_stage_order(user_id, content_id)

        effective_user_order = max(user_segment_max_order, unlocked_stage_order)

        highest_accessible_stage_name: Optional[str] = None
        current_highest_order_for_naming = 0

        stage_infos: List[ContentStageInfo] = []

        for stage_enum, details in sorted(STAGE_DETAILS.items(), key=lambda item: item[1]["order"]):
            # is_unlocked means user has access to THIS stage or HIGHER through segment or purchase
            is_unlocked = details["order"] <= effective_user_order

            if is_unlocked and details["order"] > current_highest_order_for_naming:
                highest_accessible_stage_name = stage_enum.value
                current_highest_order_for_naming = details["order"]

            stage_infos.append(ContentStageInfo(
                stage_name=stage_enum.value,
                cost=details["cost"],
                description=details["description"],
                is_unlocked=is_unlocked
            ))

        return AdultContentDetail(
            id=content.id,
            name=content.name,
            description=content.description,
            stages=stage_infos,
            user_current_access_level=highest_accessible_stage_name
        )

    def unlock_content_stage(self, user_id: int, request: ContentUnlockRequestNew) -> ContentUnlockResponse:
        if not self.age_verification_service.is_user_age_verified(user_id):
            raise ValueError("Age verification required")

        content = self.db.query(AdultContent).filter(AdultContent.id == request.content_id).first()
        if not content:
            raise ValueError("Content not found")

        try:
            stage_to_unlock_enum = ContentStageEnum(request.stage_to_unlock)
        except ValueError:
            raise ValueError(f"Invalid stage to unlock: {request.stage_to_unlock}")

        stage_to_unlock_details = STAGE_DETAILS[stage_to_unlock_enum]
        target_order = stage_to_unlock_details["order"]
        cost = stage_to_unlock_details["cost"]

        user_segment_max_order = self._get_user_segment_max_order(user_id)
        unlocked_stage_order = self._get_user_unlocked_stage_order(user_id, request.content_id)

        if target_order <= unlocked_stage_order:
            # This check implies they've already purchased this or a higher stage for this specific content.
            raise ValueError("Stage already explicitly unlocked or a higher stage is unlocked.")

        if target_order <= user_segment_max_order:
            # User's segment already grants access to this stage.
            # Depending on business logic, we might prevent purchase or allow it as an explicit "pin".
            # For now, let's say if segment grants it, no explicit token purchase is needed for access.
            # However, the request is to "unlock", implying a purchase action.
            # We'll proceed with purchase, effectively making it an explicit unlock record.
            pass


        remaining_tokens = self.token_service.deduct_tokens(user_id, cost) # Raises ValueError if insufficient

        # Use RewardService to grant content unlock
        self.reward_service.grant_content_unlock(
            user_id=user_id,
            content_id=request.content_id,
            stage_name=stage_to_unlock_enum.value,
            source_description="Direct purchase"
        )

        return ContentUnlockResponse(
            status="success",
            unlocked_stage=stage_to_unlock_enum.value,
            tokens_spent=cost,
            remaining_tokens=remaining_tokens
        )

    def get_content_preview(self, user_id: int, content_id: int) -> Optional[ContentPreviewResponse]:
        if not self.age_verification_service.is_user_age_verified(user_id):
            return None

        content = self.db.query(AdultContent).filter(AdultContent.id == content_id).first()
        if not content:
            return None

        access_level_enum = self.get_content_access_level(user_id, content_id)

        preview_url = f"/previews/default_locked.jpg" # Default locked preview
        current_stage_accessed_str = "None"

        if access_level_enum: # User has some access
            current_stage_accessed_str = access_level_enum.value
            # Placeholder logic for preview URL based on access level
            if access_level_enum == ContentStageEnum.FULL or access_level_enum == ContentStageEnum.VIP:
                preview_url = content.media_url if content.media_url else f"/previews/{content_id}/full_placeholder.jpg"
            elif access_level_enum == ContentStageEnum.PARTIAL:
                 preview_url = f"/previews/{content_id}/partial_placeholder.jpg" # Placeholder
            elif access_level_enum == ContentStageEnum.TEASER:
                preview_url = content.thumbnail_url if content.thumbnail_url else f"/previews/{content_id}/teaser_placeholder.jpg"

        return ContentPreviewResponse(
            content_id=content_id,
            preview_url=preview_url,
            current_stage_accessed=current_stage_accessed_str
        )

    def get_gallery_for_user(self, user_id: int) -> List[AdultContentGalleryItem]:
        if not self.age_verification_service.is_user_age_verified(user_id):
            return []

        all_content = self.db.query(AdultContent).all()
        gallery_items: List[AdultContentGalleryItem] = []

        user_segment_max_order = self._get_user_segment_max_order(user_id)
        teaser_stage_order = STAGE_DETAILS[ContentStageEnum.TEASER]["order"]

        for content_item in all_content:
            unlocked_stage_order = self._get_user_unlocked_stage_order(user_id, content_item.id)
            effective_order = max(user_segment_max_order, unlocked_stage_order)

            highest_accessible_stage_name: Optional[str] = None
            current_highest_order_for_naming = 0

            if effective_order >= teaser_stage_order: # Only show if user has at least Teaser access
                # Determine the name of the highest accessible stage
                for stage_enum_iter, details_iter in sorted(STAGE_DETAILS.items(), key=lambda item: item[1]["order"], reverse=True):
                    if details_iter["order"] <= effective_order:
                        highest_accessible_stage_name = stage_enum_iter.value
                        break

                gallery_items.append(AdultContentGalleryItem(
                    id=content_item.id,
                    name=content_item.name,
                    thumbnail_url=content_item.thumbnail_url,
                    highest_unlocked_stage=highest_accessible_stage_name
                ))

        return gallery_items

    def get_user_unlock_history(self, user_id: int) -> List[UnlockHistoryItem]:
        if not self.age_verification_service.is_user_age_verified(user_id):
            return []

        unlock_rewards = self.db.query(UserReward).filter(
            UserReward.user_id == user_id,
            UserReward.reward_type == "CONTENT_UNLOCK",
            UserReward.reward_value.like("%_%")
        ).order_by(UserReward.awarded_at.desc()).all()

        history_items: List[UnlockHistoryItem] = []
        for reward in unlock_rewards:
            try:
                # Assuming reward_value format: "{content_id}_{stage_name}"
                parts = reward.reward_value.split('_', 1)
                if len(parts) != 2: continue # Malformed

                content_id_str, stage_name_str = parts
                content_id = int(content_id_str)

                # Validate stage_name_str against ContentStageEnum
                try:
                    stage_enum = ContentStageEnum(stage_name_str)
                except ValueError:
                    # Log invalid stage name from DB
                    continue

                content_item_name = self.db.query(AdultContent.name).filter(AdultContent.id == content_id).scalar_one_or_none()
                if not content_item_name:
                    # Log if content item referenced by UserReward not found
                    content_item_name = "Unknown Content (ID: {content_id})"

                # Tokens spent: This is an estimation as UserReward doesn't store it.
                tokens_spent = STAGE_DETAILS.get(stage_enum, {}).get("cost", 0)

                history_items.append(UnlockHistoryItem(
                    content_id=content_id,
                    content_name=content_item_name,
                    unlocked_stage=stage_enum.value,
                    unlocked_at=reward.awarded_at,
                    tokens_spent=tokens_spent
                ))
            except (ValueError, IndexError) as e:
                # Log malformed reward_value or other parsing error
                # print(f"Error processing unlock history item {reward.id}: {e}")
                continue
        return history_items

    def upgrade_access_temporarily(self, user_id: int, request: AccessUpgradeRequest) -> AccessUpgradeResponse:
        if not self.age_verification_service.is_user_age_verified(user_id):
            raise ValueError("Age verification required")

        user = self.db.query(User).filter(User.id == user_id).first()
        user_segment_model = self.db.query(UserSegment).filter(UserSegment.user_id == user_id).first()
        if not user or not user_segment_model: # Renamed user_segment to user_segment_model
            raise ValueError("User or user segment not found")

        target_segment_label = request.target_segment_level
        target_segment_order = USER_SEGMENT_ACCESS_ORDER.get(target_segment_label)
        if target_segment_order is None:
            raise ValueError(f"Invalid target segment level: {target_segment_label}")

        current_segment_rfm_group = user_segment_model.rfm_group if user_segment_model.rfm_group else "Low"
        current_segment_order = USER_SEGMENT_ACCESS_ORDER.get(current_segment_rfm_group, 0)

        if target_segment_order <= current_segment_order:
            raise ValueError(f"User is already at or above {target_segment_label} segment level (current: {current_segment_rfm_group}).")

        level_diff = target_segment_order - current_segment_order
        cost_for_upgrade = level_diff * 1000 # Example cost (1000 per level diff)
        duration_days = request.duration_days if request.duration_days is not None and request.duration_days > 0 else 7

        remaining_tokens = self.token_service.deduct_tokens(user_id, cost_for_upgrade) # Raises ValueError

        # SIMULATION: Storing temporary upgrade requires UserSegment model changes
        # (e.g., temp_rfm_group, temp_rfm_group_expires_at) and migration.
        # Also, _get_user_segment_max_order would need to check these temp fields.
        # For now, we proceed as if the operation was successful but note its simulated nature.

        # Example of what would happen with model changes:
        # user_segment_model.temp_rfm_group = target_segment_label
        # user_segment_model.temp_rfm_group_expires_at = datetime.utcnow() + timedelta(days=duration_days)
        # self.db.commit()
        # self.db.refresh(user_segment_model)

        actual_new_segment_level = target_segment_label # This would be read from user_segment_model after update
        valid_until_date = datetime.utcnow() + timedelta(days=duration_days)

        return AccessUpgradeResponse(
            status="success (simulated: model update for UserSegment needed for persistence)",
            new_segment_level=actual_new_segment_level,
            tokens_spent=cost_for_upgrade,
            valid_until=valid_until_date
        )
