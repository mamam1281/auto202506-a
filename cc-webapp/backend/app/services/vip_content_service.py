from sqlalchemy.orm import Session
from app.models import User, UserSegment, AdultContent, VIPAccessLog # Ensure AdultContent is appropriate for VIP items
from app.schemas import VIPInfoResponse, VIPExclusiveContentItem # Ensure these are correct schema names
# If VIP-exclusive content is a subset of AdultContent, use AdultContentGalleryItem or a similar schema.
from app.services.age_verification_service import AgeVerificationService
from app.services.adult_content_service import AdultContentService, ContentStageEnum, STAGE_DETAILS # For content access and stage defs
from datetime import datetime
from typing import List, Optional, Dict # Added Dict

# Define VIP Tiers (could be more dynamic, e.g., from DB config)
VIP_TIERS: Dict[str, Dict[str, any]] = {
    "Whale": {"tier_name": "Ultimate VIP", "discount_percentage": 0.15, "min_segment_order": STAGE_DETAILS[ContentStageEnum.VIP]["order"]},
    # Add other VIP tiers if they are distinct from RFM groups
    # min_segment_order indicates the access level this VIP tier inherently grants
}

class VIPContentService:
    def __init__(self, db: Session, age_verification_service: AgeVerificationService, adult_content_service: AdultContentService):
        self.db = db
        self.age_verification_service = age_verification_service
        self.adult_content_service = adult_content_service # To leverage content fetching and access logic

    def _get_user_vip_details(self, user_id: int) -> Optional[Dict[str, any]]:
        # This method assumes UserSegment.rfm_group is the source of VIP status.
        user_segment = self.db.query(UserSegment).filter(UserSegment.user_id == user_id).first()
        if user_segment and user_segment.rfm_group in VIP_TIERS:
            # Additionally, ensure the user's segment actually grants VIP level access
            # This check might be redundant if VIP_TIERS is strictly for 'Whale' which implies VIP access order.
            # user_segment_order = self.adult_content_service._get_user_segment_max_order(user_id)
            # required_vip_order = VIP_TIERS[user_segment.rfm_group].get("min_segment_order", STAGE_DETAILS[ContentStageEnum.VIP]["order"])
            # if user_segment_order >= required_vip_order:
            #     return VIP_TIERS[user_segment.rfm_group]
            return VIP_TIERS[user_segment.rfm_group] # Simplified: if rfm_group in VIP_TIERS, they are VIP.
        return None

    def get_vip_info(self, user_id: int) -> Optional[VIPInfoResponse]:
        '''
        Provides information about the user's VIP status and benefits.
        '''
        if not self.age_verification_service.is_user_age_verified(user_id):
            # Or raise error to be handled by router
            return None

        vip_details = self._get_user_vip_details(user_id)
        if not vip_details:
            return VIPInfoResponse(user_id=user_id, vip_tier="Non-VIP", benefits=[
                "Upgrade to VIP for exclusive content and discounts!"
            ])

        benefits = [
            f"Access to all exclusive VIP content.",
            f"Special recognition and profile badge (coming soon!)."
        ]
        if 'discount_percentage' in vip_details and vip_details['discount_percentage'] > 0:
            benefits.append(f"{float(vip_details['discount_percentage'])*100:.0f}% discount on special token packs (TBD).")

        return VIPInfoResponse(
            user_id=user_id,
            vip_tier=vip_details.get("tier_name", "VIP"),
            benefits=benefits
        )

    def get_vip_exclusive_content(self, user_id: int) -> List[VIPExclusiveContentItem]:
        '''
        Retrieves content that is exclusive to VIPs or requires VIP stage unlock.
        '''
        if not self.age_verification_service.is_user_age_verified(user_id):
            return []

        vip_details = self._get_user_vip_details(user_id)
        if not vip_details:
            # Not a VIP by this service's definition (e.g. not 'Whale' if VIP_TIERS only includes 'Whale')
            return []

        # Get all content user has access to.
        # AdultContentService.get_gallery_for_user already filters by user's overall permissions.
        all_accessible_content_gallery_items = self.adult_content_service.get_gallery_for_user(user_id)

        vip_exclusive_items: List[VIPExclusiveContentItem] = []
        for item in all_accessible_content_gallery_items:
            # A content item is considered "VIP exclusive" for this list if:
            # 1. The user's highest access to it is the VIP stage.
            # OR
            # 2. The content itself could be flagged as VIP only (requires model change: AdultContent.is_vip_exclusive)
            # For now, we use the former: if their highest unlocked stage for this item is VIP.
            if item.highest_unlocked_stage == ContentStageEnum.VIP.value:

                # Fetch description if needed for VIPExclusiveContentItem schema (optional field)
                # content_db = self.db.query(AdultContent.description).filter(AdultContent.id == item.id).first()
                # description = content_db.description if content_db else None

                vip_exclusive_items.append(VIPExclusiveContentItem(
                    id=item.id,
                    name=item.name,
                    thumbnail_url=item.thumbnail_url,
                    description=None # Or fetch if necessary: description
                ))

                # Log access only if they are actively viewing/interacting, not just listing.
                # Logging here might be too frequent. Moved to specific actions.
                # self._log_vip_access(user_id, item.id, ContentStageEnum.VIP.value, 0)
        return vip_exclusive_items


    def apply_vip_discount(self, user_id: int, original_price: int) -> int:
        '''
        Applies VIP discount to an original price.
        Returns the discounted price.
        '''
        # No age verification needed for just a price calculation if it's a general utility.
        # However, the context where this is called (e.g. purchase) should be age-verified.

        vip_details = self._get_user_vip_details(user_id)
        if vip_details and 'discount_percentage' in vip_details:
            discount_rate = vip_details['discount_percentage']
            if 0 < discount_rate < 1: # Ensure discount rate is valid
                discount = original_price * discount_rate
                return int(original_price - discount)
        return original_price

    def _log_vip_access(self, user_id: int, content_id: Optional[int], access_tier: str, tokens_spent: Optional[int]):
        '''
        Logs an instance of a VIP user accessing VIP content or features.
        '''
        if not self.age_verification_service.is_user_age_verified(user_id): # Check age before logging
            # Or handle silently, but good to be consistent
            # print("Attempted to log VIP access for non-age-verified user.")
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
        # self.db.refresh(log_entry) # If ID is needed post-insert

    # Example method showing logging and discount application:
    def purchase_vip_feature_or_content(self, user_id: int, content_id_for_log: Optional[int], feature_name: str, base_cost: int):
        if not self.age_verification_service.is_user_age_verified(user_id):
            raise ValueError("Age verification required")

        vip_details = self._get_user_vip_details(user_id)
        if not vip_details:
            raise ValueError("User is not a VIP, cannot access this feature/content purchase path.")

        final_cost = self.apply_vip_discount(user_id, base_cost)

        # Assume TokenService handles deduction and raises error if insufficient
        # self.token_service.deduct_tokens(user_id, final_cost)

        # Log this specific VIP action
        self._log_vip_access(user_id, content_id_for_log, feature_name, final_cost)

        return {"status": f"{feature_name} accessed/purchased by VIP", "final_cost": final_cost, "original_cost": base_cost}
