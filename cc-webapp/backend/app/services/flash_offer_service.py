from datetime import datetime, timezone, timedelta
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import and_

from app.models import FlashOffer, User, UserReward
from app.database import SessionLocal  # 올바른 import
from app.services.token_service import TokenService
import logging

logger = logging.getLogger(__name__)

class FlashOfferService:
    def __init__(self, token_service: TokenService):
        self.token_service = token_service
    
    async def create_flash_offer(
        self,
        user_id: int,
        offer_type: str,
        original_price: int,
        discounted_price: int,
        duration_minutes: int = 30
    ) -> Optional[FlashOffer]:
        """Flash Offer 생성"""
        try:
            now = datetime.now(timezone.utc)
            expires_at = now + timedelta(minutes=duration_minutes)
            
            db_session = SessionLocal()
            
            flash_offer = FlashOffer(
                user_id=user_id,
                content_id=1,  # 임시값 - 실제로는 파라미터로 받아야 함
                original_price=original_price,
                discounted_price=discounted_price,
                discount_rate=(original_price - discounted_price) / original_price,
                trigger_reason=offer_type,
                created_at=now,
                expires_at=expires_at,
                target_stage_name="Full"
            )
            
            db_session.add(flash_offer)
            db_session.commit()
            db_session.refresh(flash_offer)
            
            logger.info(f"Flash offer created for user {user_id}: {offer_type}")
            return flash_offer
            
        except Exception as e:
            logger.error(f"Failed to create flash offer: {e}")
            db_session.rollback()
            return None
        finally:
            db_session.close()
    
    async def get_active_flash_offers(self, user_id: int) -> List[FlashOffer]:
        """활성 Flash Offer 조회"""
        try:
            now = datetime.now(timezone.utc)
            db_session = SessionLocal()
            
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
        finally:
            db_session.close()
    
    async def process_flash_purchase(
        self,
        user_id: int,
        offer_id: int
    ) -> Dict[str, Any]:
        """Flash Offer 구매 처리"""
        try:
            now = datetime.now(timezone.utc)
            db_session = SessionLocal()
            
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
                return {"success": False, "message": "Invalid or expired offer"}
            
            # 토큰 차감 (실제 값으로 변환)
            price = offer.discounted_price
            remaining_balance = self.token_service.deduct_tokens(user_id, price)
            
            # Offer 상태 변경
            offer.is_purchased = True
            offer.purchased_at = now
            
            # 보상 지급
            reward = UserReward(
                user_id=user_id,
                reward_type=offer.trigger_reason
            )
            
            db_session.add(reward)
            db_session.commit()
            
            logger.info(f"Flash offer {offer_id} purchased by user {user_id}")
            return {"success": True, "reward": reward, "remaining_balance": remaining_balance}
            
        except ValueError as e:
            # 토큰 부족 등의 경우
            return {"success": False, "message": str(e)}
        except Exception as e:
            logger.error(f"Failed to process flash purchase: {e}")
            db_session.rollback()
            return {"success": False, "message": "Purchase failed"}
        finally:
            db_session.close()
    
    async def reject_or_expire_flash_offer(self, offer_id: int) -> bool:
        """Flash Offer 거절 또는 만료 처리"""
        try:
            now = datetime.now(timezone.utc)
            db_session = SessionLocal()
            
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
        finally:
            db_session.close()