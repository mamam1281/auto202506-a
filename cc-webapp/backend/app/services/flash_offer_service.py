from datetime import datetime, timezone, timedelta
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import and_

from app.models import FlashOffer, User, UserReward
from app.schemas import FlashOfferPurchaseResponse, FlashOfferResponseItem
from app.services.token_service import TokenService
from app.services.age_verification_service import AgeVerificationService
from app.services.reward_service import RewardService
from app.services.adult_content_service import AdultContentService, ContentStageEnum
from enum import Enum
import logging

logger = logging.getLogger(__name__)

class FlashOfferTrigger(Enum):
    """Enumerates reasons a flash offer may be created."""

    GAME_FAILURE = "GAME_FAILURE"
    STAGE_UNLOCK = "STAGE_UNLOCK"
    VIP_UPGRADE = "VIP_UPGRADE"

class FlashOfferService:
    def __init__(
        self,
        db: Session,
        token_service: TokenService,
        age_verification_service: AgeVerificationService,
        reward_service: RewardService,
        adult_content_service: AdultContentService,
    ):
        self.db = db
        self.token_service = token_service
        self.age_verification_service = age_verification_service
        self.reward_service = reward_service
        self.adult_content_service = adult_content_service
    
    def create_flash_offer(
        self,
        user_id: int,
        content_id: int,
        trigger_reason: FlashOfferTrigger,
        target_stage: ContentStageEnum,
        original_price: Optional[int] = None,
        discounted_price: Optional[int] = None,
        duration_minutes: int = 30,
    ) -> Optional[FlashOffer]:
        """Flash Offer 생성"""
        try:
            now = datetime.now(timezone.utc)
            expires_at = now + timedelta(minutes=duration_minutes)

            db_session = self.db

            flash_offer = FlashOffer(
                user_id=user_id,
                content_id=content_id,
                original_price=original_price or 1000,
                discounted_price=discounted_price or 700,
                discount_rate=(
                    (original_price or 1000) - (discounted_price or 700)
                )
                / (original_price or 1000),
                trigger_reason=trigger_reason.value,
                created_at=now,
                expires_at=expires_at,
                target_stage_name=target_stage.value,
            )
            
            db_session.add(flash_offer)
            db_session.commit()
            db_session.refresh(flash_offer)
            
            logger.info(
                f"Flash offer created for user {user_id}: {trigger_reason.value}"
            )
            return flash_offer
            
        except Exception as e:
            logger.error(f"Failed to create flash offer: {e}")
            db_session.rollback()
            return None
    
    def get_active_flash_offers(self, user_id: int) -> List[FlashOffer]:
        """활성 Flash Offer 조회"""
        try:
            now = datetime.now(timezone.utc)
            db_session = self.db
            
            offers = db_session.query(FlashOffer).filter(
                and_(
                    FlashOffer.user_id == user_id,
                    FlashOffer.is_purchased == False,
                    FlashOffer.expires_at > now
                )
            ).all()
            
            return offers
            
        except Exception as e:
            logger.error(f"Failed to get active flash offers: {e}")
            return []
    
    def process_flash_purchase(
        self,
        user_id: int,
        offer_id: int,
        purchase_request: Optional[Any] = None,
    ) -> FlashOfferPurchaseResponse:
        """Flash Offer 구매 처리"""
        try:
            now = datetime.now(timezone.utc)
            db_session = self.db
            
            # Flash Offer 조회
            offer = db_session.query(FlashOffer).filter(
                and_(
                    FlashOffer.id == offer_id,
                    FlashOffer.user_id == user_id,
                    FlashOffer.is_purchased == False,
                    FlashOffer.expires_at > now
                )
            ).first()
            
            if not offer:
                return FlashOfferPurchaseResponse(
                    status="failed",
                    message="Invalid or expired offer",
                )
            
            # 토큰 차감 (실제 값으로 변환)
            price = offer.discounted_price
            remaining_balance = self.token_service.deduct_tokens(user_id, price)
            
            # Offer 상태 변경
            offer.is_purchased = True
            offer.purchased_at = now
            
            # 보상 지급
            reward = UserReward(
                user_id=user_id,
                reward_type=offer.trigger_reason,
                reward_value=str(offer.content_id),
            )
            
            db_session.add(reward)
            db_session.commit()

            logger.info(f"Flash offer {offer_id} purchased by user {user_id}")
            return FlashOfferPurchaseResponse(
                status="success",
                message="purchased",
                purchased_offer=FlashOfferResponseItem(
                    offer_id=offer.id,
                    content_id=offer.content_id,
                    content_name=None,
                    original_price=offer.original_price,
                    discounted_price=offer.discounted_price,
                    discount_rate=offer.discount_rate,
                    expires_at=offer.expires_at,
                    trigger_reason=offer.trigger_reason,
                    target_stage_name=offer.target_stage_name,
                ),
            )
            
        except ValueError as e:
            # 토큰 부족 등의 경우
            return FlashOfferPurchaseResponse(status="failed", message=str(e))
        except Exception as e:
            logger.error(f"Failed to process flash purchase: {e}")
            db_session.rollback()
            return FlashOfferPurchaseResponse(status="failed", message="Purchase failed")
    
    def reject_or_expire_flash_offer(self, offer_id: int) -> bool:
        """Flash Offer 거절 또는 만료 처리"""
        try:
            now = datetime.now(timezone.utc)
            db_session = self.db
            
            offer = db_session.query(FlashOffer).filter(
                FlashOffer.id == offer_id
            ).first()
            
            if offer:
                offer.is_purchased = True  # 거절/만료 시에도 purchased로 마킹
                offer.rejected_at = now
                db_session.commit()
                logger.info(f"Flash offer {offer_id} rejected/expired")
                return True
            
            return False
            
        except Exception as e:
            logger.error(f"Failed to reject/expire flash offer: {e}")
            db_session.rollback()
            return False
