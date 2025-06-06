from sqlalchemy.orm import Session
from sqlalchemy import and_
from app.models import User, AdultContent, FlashOffer, UserReward # Added UserReward for direct unlock logging
from app.schemas import (
    FlashOfferResponseItem, ActiveFlashOffersResponse,
    FlashOfferPurchaseRequest, FlashOfferPurchaseResponse, FlashOfferActionResponse
) # Ensure these are correct schema names
from app.services.token_service import TokenService # Assumed
from app.services.age_verification_service import AgeVerificationService
from app.services.reward_service import RewardService # Added RewardService
# Import ContentStageEnum and STAGE_DETAILS directly for _get_content_original_price helper
from app.services.adult_content_service import ContentStageEnum, STAGE_DETAILS
from datetime import datetime, timedelta
from typing import List, Optional, Union # Union is not used, but kept from snippet
from enum import Enum # Added Enum

# Flash Offer Configuration
FLASH_OFFER_DURATION_MINUTES = 15
INITIAL_DISCOUNT_RATE = 0.3 # 30%

# Trigger reasons (examples)
class FlashOfferTrigger(str, Enum):
    GAME_FAILURE = "consecutive_game_failures"
    TOKEN_SHORTAGE = "token_shortage"
    CONTENT_ATTEMPT = "content_access_attempt"
    # Add more as needed

class FlashOfferService:
    def __init__(self, db: Session, token_service: TokenService,
                 age_verification_service: AgeVerificationService,
                 reward_service: RewardService, # Added reward_service
                 adult_content_service: object): # adult_content_service is not used directly in methods, so object type
        self.db = db
        self.token_service = token_service
        self.age_verification_service = age_verification_service
        self.reward_service = reward_service # Added reward_service
        # self.adult_content_service = adult_content_service # Not directly used in the final logic provided

    def _get_content_original_price(self, content_id: int, stage: ContentStageEnum) -> Optional[int]:
        '''
        Helper to get original price for a content stage.
        Uses STAGE_DETAILS directly from AdultContentService.
        '''
        if stage in STAGE_DETAILS:
            return STAGE_DETAILS[stage]["cost"]
        return None

    def create_flash_offer(self, user_id: int, content_id: int,
                           trigger_reason: FlashOfferTrigger,
                           target_stage: ContentStageEnum = ContentStageEnum.FULL,
                           custom_discount_rate: Optional[float] = None
                           ) -> Optional[FlashOfferResponseItem]:
        if not self.age_verification_service.is_user_age_verified(user_id):
            raise ValueError("Age verification required") # Raise error to be handled by router

        existing_offer = (
            self.db.query(FlashOffer)
            .filter(
                FlashOffer.user_id == user_id,
                FlashOffer.content_id == content_id,
                FlashOffer.is_purchased.is_(False),
                FlashOffer.expires_at > datetime.utcnow(),
            )
            .with_for_update()
            .first()
        )
        if existing_offer:
            existing_offer.expires_at = datetime.utcnow()
            self.db.commit()

        content = self.db.query(AdultContent).filter(AdultContent.id == content_id).first()
        if not content:
            raise ValueError("Content not found for flash offer")

        original_price = self._get_content_original_price(content_id, target_stage)
        if original_price is None:
            raise ValueError(f"Could not determine original price for content {content_id}, stage {target_stage.value}")

        discount_rate = custom_discount_rate if custom_discount_rate is not None and 0 < custom_discount_rate < 1 else INITIAL_DISCOUNT_RATE
        discounted_price = int(original_price * (1 - discount_rate))
        expires_at = datetime.utcnow() + timedelta(minutes=FLASH_OFFER_DURATION_MINUTES)

        db_flash_offer = FlashOffer(
            user_id=user_id,
            content_id=content_id,
            target_stage_name=target_stage.value, # Save the target stage name
            original_price=original_price,
            discounted_price=discounted_price,
            discount_rate=discount_rate,
            trigger_reason=trigger_reason.value,
            created_at=datetime.utcnow(),
            expires_at=expires_at,
            is_purchased=False
        )
        self.db.add(db_flash_offer)
        self.db.commit()
        self.db.refresh(db_flash_offer)

        return FlashOfferResponseItem(
            offer_id=db_flash_offer.id,
            content_id=db_flash_offer.content_id,
            content_name=content.name,
            original_price=db_flash_offer.original_price,
            discounted_price=db_flash_offer.discounted_price,
            discount_rate=db_flash_offer.discount_rate,
            expires_at=db_flash_offer.expires_at,
            trigger_reason=db_flash_offer.trigger_reason,
            target_stage_name=db_flash_offer.target_stage_name # Include in response
        )

    def get_active_flash_offers(self, user_id: int) -> ActiveFlashOffersResponse:
        if not self.age_verification_service.is_user_age_verified(user_id):
            return ActiveFlashOffersResponse(offers=[])

        now = datetime.utcnow()
        active_offers_db = self.db.query(FlashOffer, AdultContent.name) \
            .join(AdultContent, FlashOffer.content_id == AdultContent.id) \
            .filter(
                FlashOffer.user_id == user_id,
                FlashOffer.is_purchased == False,
                FlashOffer.expires_at > now
            ).all()

        offer_items = []
        for offer, content_name in active_offers_db:
            offer_items.append(FlashOfferResponseItem(
                offer_id=offer.id,
                content_id=offer.content_id,
                content_name=content_name,
                original_price=offer.original_price,
                discounted_price=offer.discounted_price,
                discount_rate=offer.discount_rate,
                expires_at=offer.expires_at,
                trigger_reason=offer.trigger_reason,
                target_stage_name=offer.target_stage_name # Include in response
            ))
        return ActiveFlashOffersResponse(offers=offer_items)

    def process_flash_purchase(self, user_id: int, offer_id: int, purchase_request: FlashOfferPurchaseRequest) -> FlashOfferPurchaseResponse:
        if not self.age_verification_service.is_user_age_verified(user_id):
            raise ValueError("Age verification required")

        now = datetime.utcnow()
        # Fetch offer and related content name in one go
        offer_data = self.db.query(FlashOffer, AdultContent.name) \
            .join(AdultContent, FlashOffer.content_id == AdultContent.id) \
            .filter(FlashOffer.id == offer_id, FlashOffer.user_id == user_id) \
            .first()

        if not offer_data:
            raise ValueError("Flash offer not found or does not belong to user")

        db_offer, content_name = offer_data

        if db_offer.is_purchased:
            raise ValueError("Flash offer already purchased")
        if db_offer.expires_at <= now:
            raise ValueError("Flash offer has expired")

        self.token_service.deduct_tokens(user_id, db_offer.discounted_price) # Raises ValueError if insufficient

        db_offer.is_purchased = True
        db_offer.purchased_at = now

        # Unlock content using the target_stage_name stored in the offer
        try:
            target_stage_for_unlock = ContentStageEnum(db_offer.target_stage_name)
        except ValueError:
            # Log error: Invalid stage name stored on offer
            # This case should ideally not happen if data is validated on creation
            raise ValueError(f"Invalid target stage '{db_offer.target_stage_name}' configured for the offer ID {db_offer.id}.")

        # Use RewardService to grant content unlock
        self.reward_service.grant_content_unlock(
            user_id=user_id,
            content_id=db_offer.content_id,
            stage_name=target_stage_for_unlock.value, # Use the determined enum member's value
            source_description=f"Flash offer purchase: ID {db_offer.id}"
            # awarded_at can be omitted to use default datetime.utcnow() in reward_service
        )

        try:
            # Note: reward_service.grant_content_unlock already commits.
            # If process_flash_purchase needs to be more atomic with other DB changes
            # then grant_content_unlock might need a flag to skip commit,
            # or the Session object could be shared and committed here.
            # For now, assuming grant_content_unlock's commit is acceptable.
            # If UserReward was added in this session before grant_content_unlock,
            # then this commit would be redundant or could conflict if not handled well.
            # However, UserReward is no longer directly added here.
            self.db.commit() # Commit changes to db_offer (is_purchased, purchased_at)
            self.db.refresh(db_offer)
        except Exception as e:
            self.db.rollback()
            # Log this error critically.
            raise ValueError(f"Failed to finalize flash purchase: {str(e)}")

        purchased_offer_details = FlashOfferResponseItem(
            offer_id=db_offer.id, content_id=db_offer.content_id, content_name=content_name,
            original_price=db_offer.original_price, discounted_price=db_offer.discounted_price,
            discount_rate=db_offer.discount_rate, expires_at=db_offer.expires_at,
            trigger_reason=db_offer.trigger_reason,
            target_stage_name=db_offer.target_stage_name # Include in response
        )

        return FlashOfferPurchaseResponse(
            status="success",
            message="Flash offer purchased and content unlocked.",
            purchased_offer=purchased_offer_details
        )

    def reject_or_expire_flash_offer(self, user_id: int, offer_id: int) -> FlashOfferActionResponse:
        if not self.age_verification_service.is_user_age_verified(user_id):
            raise ValueError("Age verification required")

        flash_offer = self.db.query(FlashOffer).filter(
            FlashOffer.id == offer_id,
            FlashOffer.user_id == user_id
        ).first()

        if not flash_offer:
            raise ValueError("Flash offer not found or access denied")

        if flash_offer.is_purchased:
            raise ValueError("Cannot reject an already purchased offer")

        message: str
        if flash_offer.expires_at <= datetime.utcnow() and not flash_offer.is_purchased:
            # Offer is expired and wasn't purchased. Could delete or just acknowledge.
            # self.db.delete(flash_offer) # Optional: clean up expired offers
            message = "Flash offer was already expired."
        else: # User explicitly rejects it before expiry, or system clears an active one
            self.db.delete(flash_offer)
            message = "Flash offer rejected/removed."

        self.db.commit()
        return FlashOfferActionResponse(status="success", message=message)

    # Progressive discounts and urgency notifications are complex features
    # that would typically involve more components (background tasks, notification service)
    # and are outside the scope of this initial service implementation.
