from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey, Boolean # Added Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.types import JSON
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    nickname = Column(String(50), unique=True, nullable=True)
    password_hash = Column(String(255), nullable=True)
    invite_code = Column(String(6), nullable=True)
    cyber_token_balance = Column(Integer, default=200)
    created_at = Column(DateTime, default=datetime.utcnow)
    segment_label = Column(String(20), default="Low")

    actions = relationship("UserAction", back_populates="user")
    segment = relationship("UserSegment", uselist=False, back_populates="user") # One-to-one
    rewards = relationship("UserReward", back_populates="user")
    site_visits = relationship("SiteVisit", back_populates="user")
    notifications = relationship("Notification", back_populates="user") # Added for Notification

    # Relationships for new models
    flash_offers = relationship("FlashOffer", back_populates="user")
    vip_access_logs = relationship("VIPAccessLog", back_populates="user")
    age_verification_records = relationship("AgeVerificationRecord", back_populates="user")

class UserAction(Base):
    __tablename__ = "user_actions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
    action_type = Column(String, index=True, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    value = Column(Float, default=0.0) # For monetary value in RFM

    user = relationship("User", back_populates="actions")

class UserSegment(Base):
    __tablename__ = "user_segments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, index=True, nullable=False)

    # Human readable name of the segment (e.g. "Whale", "Medium")
    name = Column(String(50), nullable=True)

    rfm_group = Column(String, index=True, nullable=True) # e.g., Whale, Medium, Low
    risk_profile = Column(String, index=True, nullable=True) # e.g., High, Medium, Low (can be from other logic)
    streak_count = Column(Integer, default=0) # Example of another segmentation attribute

    # Store raw scores used for RFM segmentation so that logic can be revisited later
    recency_score = Column(Integer, default=0)
    frequency_score = Column(Integer, default=0)
    monetary_score = Column(Integer, default=0)

    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="segment")

class SiteVisit(Base):
    __tablename__ = "site_visits"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False) # Relates to User model
    source = Column(String(50), nullable=False) # e.g., "webapp", "email_link"
    visit_timestamp = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="site_visits")


class InviteCode(Base):
    __tablename__ = "invite_codes"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(6), unique=True, nullable=False, index=True)
    is_used = Column(Boolean, default=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class UserReward(Base):
    __tablename__ = "user_rewards"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
    reward_type = Column(String(50), index=True, nullable=False)  # e.g., "COIN", "BADGE", "CONTENT_UNLOCK"
    reward_value = Column(String(255), nullable=False) # Stores amount for COIN, badge name for BADGE, item_id for UNLOCK
    source_description = Column(String(255), nullable=True)  # New field for context
    awarded_at = Column(DateTime, default=datetime.utcnow, index=True)
    trigger_action_id = Column(Integer, ForeignKey("user_actions.id"), nullable=True) # Optional: link to action that triggered reward

    user = relationship("User", back_populates="rewards")
    # Optional: if you want to link a reward back to the specific action that triggered it
    # trigger_action = relationship("UserAction") # Define how UserAction relates back if needed

class AdultContent(Base):
    __tablename__ = "adult_content"

    id = Column(Integer, primary_key=True, index=True)
    stage = Column(Integer, unique=True, nullable=False, index=True) # e.g., 1, 2, 3
    name = Column(String(100), nullable=False)
    description = Column(String(255), nullable=True)
    thumbnail_url = Column(String(255), nullable=True)
    media_url = Column(String(255), nullable=True) # Video or full-res image
    # Defines the minimum segment level required to unlock this content.
    # This level is derived from UserSegment.rfm_group (e.g., Low=1, Medium=2, Whale=3).
    required_segment_level = Column(Integer, default=1, nullable=False)
    # Add any other relevant fields like 'duration', 'tags', etc.

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
    message = Column(String(500), nullable=False)
    is_sent = Column(Boolean, default=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    sent_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="notifications")

# New Models

class FlashOffer(Base):
    __tablename__ = "flash_offers"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    content_id = Column(Integer, ForeignKey("adult_content.id"), nullable=False)
    original_price = Column(Integer, nullable=False)
    discounted_price = Column(Integer, nullable=False)
    discount_rate = Column(Float, nullable=False)
    trigger_reason = Column(String(100))
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=False)
    is_purchased = Column(Boolean, default=False)
    purchased_at = Column(DateTime, nullable=True)
    target_stage_name = Column(String(50), nullable=False, default="Full") # Added field

    user = relationship("User", back_populates="flash_offers")
    adult_content = relationship("AdultContent") # Assuming one-way relationship for now

class VIPAccessLog(Base):
    __tablename__ = "vip_access_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    content_id = Column(Integer, ForeignKey("adult_content.id"), nullable=False)
    access_tier = Column(String(20))
    tokens_spent = Column(Integer)
    accessed_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="vip_access_logs")
    adult_content = relationship("AdultContent") # Assuming one-way relationship for now

class AgeVerificationRecord(Base):
    __tablename__ = "age_verification_records"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    verification_method = Column(String(50)) # "document", "phone", "ipin"
    verified_at = Column(DateTime, default=datetime.utcnow)
    verification_data = Column(JSON)  # Encrypted verification data
    is_valid = Column(Boolean, default=True)

    user = relationship("User", back_populates="age_verification_records")


class GameLog(Base):
    __tablename__ = "game_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    game_type = Column(String(50), nullable=False)
    result = Column(String(50), nullable=False)
    tokens_spent = Column(Integer, default=0)
    reward_given = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

    user = relationship("User")


class UserStreak(Base):
    __tablename__ = "user_streaks"

    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    win_streak = Column(Integer, default=0)
    loss_streak = Column(Integer, default=0)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User")


class TokenTransfer(Base):
    __tablename__ = "token_transfers"

    id = Column(Integer, primary_key=True, index=True)
    from_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    to_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    amount = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

    from_user = relationship("User", foreign_keys=[from_user_id])
    to_user = relationship("User", foreign_keys=[to_user_id])


# In User model, add the other side of the relationship if you want two-way population
# class User(Base):
#   ...
#   rewards = relationship("UserReward", back_populates="user")
#   site_visits = relationship("SiteVisit", back_populates="user")
#   notifications = relationship("Notification", back_populates="user") # This is now added above
#   flash_offers = relationship("FlashOffer", back_populates="user")
#   vip_access_logs = relationship("VIPAccessLog", back_populates="user")
#   age_verification_records = relationship("AgeVerificationRecord", back_populates="user")
#   ...


# Note for developer:
# After defining or updating models, an Alembic migration is needed:
# 1. alembic revision -m "add_notifications_table" (or a more descriptive name)
# 2. Edit the generated migration script in alembic/versions/ to ensure it correctly
#    reflects the model definitions (e.g., op.create_table(...)).
# 3. alembic upgrade head
#
# Also, ensure alembic/env.py is configured to use this Base:
# from app.models import Base # This should already be done
# target_metadata = Base.metadata # This should already be done
