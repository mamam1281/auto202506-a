from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    Float,
    ForeignKey,
    Boolean,
    JSON,
)
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
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
    segment = relationship(
        "UserSegment", uselist=False, back_populates="user"
    )  # One-to-one
    rewards = relationship("UserReward", back_populates="user")
    site_visits = relationship("SiteVisit", back_populates="user")
    notifications = relationship(
        "Notification", back_populates="user"
    )  # Added for Notification
    streaks = relationship("UserStreak", back_populates="user")
    game_logs = relationship("GameLog", back_populates="user")
    coins = relationship("UserCoin", back_populates="user")
    items = relationship("UserItem", back_populates="user")
    sent_transfers = relationship(
        "TokenTransfer",
        foreign_keys="TokenTransfer.from_user_id",
        back_populates="from_user",
    )
    received_transfers = relationship(
        "TokenTransfer",
        foreign_keys="TokenTransfer.to_user_id",
        back_populates="to_user",
    )
    login_history = relationship("LoginHistory", back_populates="user")


class UserAction(Base):
    __tablename__ = "user_actions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
    action_type = Column(String, index=True, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    value = Column(Float, default=0.0)  # For monetary value in RFM

    user = relationship("User", back_populates="actions")


class UserSegment(Base):
    __tablename__ = "user_segments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(
        Integer, ForeignKey("users.id"), unique=True, index=True, nullable=False
    )

    rfm_group = Column(String, index=True, nullable=True)  # e.g., Whale, Medium, Low
    risk_profile = Column(
        String, index=True, nullable=True
    )  # e.g., High, Medium, Low (can be from other logic)
    streak_count = Column(
        Integer, default=0
    )  # Example of another segmentation attribute

    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="segment")


class SiteVisit(Base):
    __tablename__ = "site_visits"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(
        Integer, ForeignKey("users.id"), index=True, nullable=False
    )  # Relates to User model
    source = Column(String(50), nullable=False)  # e.g., "webapp", "email_link"
    visit_timestamp = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="site_visits")


class UserReward(Base):
    __tablename__ = "user_rewards"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
    reward_type = Column(
        String(50), index=True, nullable=False
    )  # e.g., "COIN", "BADGE", "CONTENT_UNLOCK"
    reward_value = Column(
        String(255), nullable=False
    )  # Stores amount for COIN, badge name for BADGE, item_id for UNLOCK
    awarded_at = Column(DateTime, default=datetime.utcnow, index=True)
    trigger_action_id = Column(
        Integer, ForeignKey("user_actions.id"), nullable=True
    )  # Optional: link to action that triggered reward

    user = relationship("User", back_populates="rewards")
    # Optional: if you want to link a reward back to the specific action that triggered it
    # trigger_action = relationship("UserAction") # Define how UserAction relates back if needed


class AdultContent(Base):
    __tablename__ = "adult_content"

    id = Column(Integer, primary_key=True, index=True)
    stage = Column(Integer, unique=True, nullable=False, index=True)  # e.g., 1, 2, 3
    name = Column(String(100), nullable=False)
    description = Column(String(255), nullable=True)
    thumbnail_url = Column(String(255), nullable=True)
    media_url = Column(String(255), nullable=True)  # Video or full-res image
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


class InviteCode(Base):
    """Invitation codes for new user sign-ups"""

    __tablename__ = "invite_codes"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(12), unique=True, index=True)
    created_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime)
    is_used = Column(Boolean, default=False)

    creator = relationship("User")


class UserStreak(Base):
    """연승/연패 기록"""

    __tablename__ = "user_streaks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    game_type = Column(String, nullable=False)
    current_streak = Column(Integer, default=0)
    max_win_streak = Column(Integer, default=0)
    max_lose_streak = Column(Integer, default=0)
    last_updated = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="streaks")


class GameLog(Base):
    """게임 플레이 기록"""

    __tablename__ = "game_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    game_type = Column(String, nullable=False)
    bet_amount = Column(Integer, nullable=False)
    win_amount = Column(Integer, nullable=False)
    net_change = Column(Integer, nullable=False)
    result_type = Column(String, nullable=False)
    result_details = Column(JSON, nullable=True)
    played_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="game_logs")


class UserCoin(Base):
    """사용자 게임 내 코인"""

    __tablename__ = "user_coins"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    amount = Column(Integer, nullable=False)
    source = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="coins")


class UserItem(Base):
    """사용자 보유 아이템"""

    __tablename__ = "user_items"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    item_id = Column(String, nullable=False)
    item_name = Column(String, nullable=False)
    item_type = Column(String, nullable=False)
    quantity = Column(Integer, nullable=False, default=1)
    acquired_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=True)
    used_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="items")


class TokenTransfer(Base):
    """사용자 간 토큰 전송 기록"""

    __tablename__ = "token_transfers"

    id = Column(Integer, primary_key=True, index=True)
    from_user_id = Column(Integer, ForeignKey("users.id"))
    to_user_id = Column(Integer, ForeignKey("users.id"))
    amount = Column(Integer, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    status = Column(String, nullable=False)
    error_message = Column(String, nullable=True)

    from_user = relationship(
        "User", foreign_keys=[from_user_id], back_populates="sent_transfers"
    )
    to_user = relationship(
        "User", foreign_keys=[to_user_id], back_populates="received_transfers"
    )


class LoginHistory(Base):
    """로그인 이력"""

    __tablename__ = "login_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    ip_address = Column(String, nullable=True)
    user_agent = Column(String, nullable=True)
    success = Column(Boolean, default=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="login_history")


# In User model, add the other side of the relationship if you want two-way population
# class User(Base):
#   ...
#   rewards = relationship("UserReward", back_populates="user")
#   site_visits = relationship("SiteVisit", back_populates="user")
#   notifications = relationship("Notification", back_populates="user") # This is now added above
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
