from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False) # Example field
    created_at = Column(DateTime, default=datetime.utcnow)

    actions = relationship("UserAction", back_populates="user")
    segment = relationship("UserSegment", uselist=False, back_populates="user") # One-to-one

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

    rfm_group = Column(String, index=True, nullable=True) # e.g., Whale, Medium, Low
    risk_profile = Column(String, index=True, nullable=True) # e.g., High, Medium, Low (can be from other logic)
    streak_count = Column(Integer, default=0) # Example of another segmentation attribute

    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="segment")

class SiteVisit(Base):
    __tablename__ = "site_visits"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False) # Relates to User model
    source = Column(String(50), nullable=False) # e.g., "webapp", "email_link"
    visit_timestamp = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="site_visits")


# In User model, add the other side of the relationship if you want two-way population
# class User(Base):
#   ...
#   site_visits = relationship("SiteVisit", back_populates="user")
#   ...


# Note for developer:
# After defining or updating models, an Alembic migration is needed:
# 1. alembic revision -m "create_site_visits_table" (or a more descriptive name like "add_site_visit_model")
# 2. Edit the generated migration script in alembic/versions/ to ensure it correctly
#    reflects the model definitions (e.g., op.create_table(...)).
# 3. alembic upgrade head
#
# Also, ensure alembic/env.py is configured to use this Base:
# from app.models import Base # This should already be done
# target_metadata = Base.metadata # This should already be done
