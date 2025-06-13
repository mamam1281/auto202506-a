from sqlalchemy.orm import Session
from app.models import User, UserSegment, AdultContent, VIPAccessLog
from app.schemas import VIPInfoResponse, VIPExclusiveContentItem, AdultContentGalleryItem
from app.services.age_verification_service import AgeVerificationService
from app.services.adult_content_service import AdultContentService, ContentStageEnum, STAGE_DETAILS
from datetime import datetime
from typing import List, Optional, Dict, Any

# Define VIP Tiers (could be more dynamic, e.g., from DB config)
VIP_TIERS: Dict[str, Dict[str, Any]] = {
    "Whale": {"tier_name": "Ultimate VIP", "discount_percentage": 0.15, "min_segment_order": STAGE_DETAILS[ContentStageEnum.VIP]["index"]},
    # Add other VIP tiers if they are distinct from RFM groups
    # min_segment_order indicates the access level this VIP tier inherently grants
}

class VIPContentService:
    def __init__(self, db: Session, age_verification_service: AgeVerificationService, adult_content_service: AdultContentService):
        self.db = db
        self.age_verification_service = age_verification_service
        self.adult_content_service = adult_content_service

    def _get_user_vip_details(self, user_id: int) -> Optional[Dict[str, Any]]:
        """Get VIP details for a user based on their segment."""
        user_segment = self.db.query(UserSegment).filter(UserSegment.user_id == user_id).first()
        if not user_segment:
            return None
            
        # Safely check if rfm_group exists and convert to string
        try:
            rfm_group = str(getattr(user_segment.rfm_group, 'value', user_segment.rfm_group))
        except (AttributeError, TypeError):
            return None
            
        if rfm_group in VIP_TIERS:
            return VIP_TIERS.get(rfm_group)
        return None

    def get_vip_info(self, user_id: int) -> Optional[VIPInfoResponse]:
        """Provides information about the user's VIP status and benefits."""
        if not self.age_verification_service.is_user_age_verified(user_id):
            return None

        vip_details = self._get_user_vip_details(user_id)
        if not vip_details:
            return VIPInfoResponse(
                user_id=user_id, 
                vip_tier="Non-VIP",
                tier="Non-VIP",
                benefits=["Upgrade to VIP for exclusive content and discounts!"],
                content_access=["Basic content only"]
            )

        benefits = [
            "Access to all exclusive VIP content.",
            "Special recognition and profile badge (coming soon!)."
        ]
        if 'discount_percentage' in vip_details and vip_details['discount_percentage'] > 0:
            benefits.append(f"{float(vip_details['discount_percentage'])*100:.0f}% discount on special token packs (TBD).")

        return VIPInfoResponse(
            user_id=user_id,
            vip_tier=vip_details.get("tier_name", "VIP"),
            tier=vip_details.get("tier_name", "VIP"),
            benefits=benefits,
            content_access=["All VIP exclusive content", "Priority support"]
        )

    def get_vip_exclusive_content(self, user_id: int) -> List[VIPExclusiveContentItem]:
        """Retrieves content that is exclusive to VIPs or requires VIP stage unlock."""
        if not self.age_verification_service.is_user_age_verified(user_id):
            return []

        vip_details = self._get_user_vip_details(user_id)
        if not vip_details:
            return []

        # Get all content user has access to using the correct method name
        all_accessible_content_gallery_items = self.adult_content_service.get_gallery_for_user(user_id)

        vip_exclusive_items: List[VIPExclusiveContentItem] = []
        for item in all_accessible_content_gallery_items:
            if hasattr(item, 'highest_unlocked_stage') and item.highest_unlocked_stage == ContentStageEnum.VIP.value:
                vip_exclusive_items.append(VIPExclusiveContentItem(
                    id=item.id,
                    name=getattr(item, 'name', 'VIP Content'),
                    title=getattr(item, 'title', 'VIP Content'),
                    description=getattr(item, 'description', 'Exclusive VIP content'),
                    content_type="adult",
                    thumbnail_url=getattr(item, 'thumbnail_url', None),
                    tier_required="VIP"
                ))
        return vip_exclusive_items

    def apply_vip_discount(self, user_id: int, original_price: int) -> int:
        """Applies VIP discount to an original price."""
        vip_details = self._get_user_vip_details(user_id)
        if vip_details and 'discount_percentage' in vip_details:
            discount_rate = vip_details['discount_percentage']
            if 0 < discount_rate < 1:
                discount = original_price * discount_rate
                return int(original_price - discount)
        return original_price

    def _log_vip_access(self, user_id: int, content_id: Optional[int], access_tier: str, tokens_spent: Optional[int]):
        """Logs an instance of a VIP user accessing VIP content or features."""
        if not self.age_verification_service.is_user_age_verified(user_id):
            return

        log_entry = VIPAccessLog(
            user_id=user_id,
            content_id=content_id,
            access_tier=access_tier,
            tokens_spent=tokens_spent,
            accessed_at=datetime.utcnow()
        )
        self.db.add(log_entry)
        self.db.commit()
