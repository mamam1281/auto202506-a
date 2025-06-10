import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.exc import IntegrityError
from unittest.mock import Mock

from app.models import Base, User, UserAction, UserSegment
from app.repositories.game_repository import GameRepository

# Setup SQLite test database
engine = create_engine(
    "sqlite:///./test_game.db", connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

repo = GameRepository()

def get_db() -> Session:
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

@pytest.fixture()
def db_session():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.rollback()
        db.close()

def test_streak_redis(db_session):
    repo.set_streak(1, 3)
    assert repo.get_streak(1) == 3

def test_gacha_history(db_session):
    repo.set_gacha_history(1, ["A", "B"])
    assert repo.get_gacha_history(1) == ["A", "B"]

def test_get_user_segment_default(db_session):
    assert repo.get_user_segment(db_session, 999) == "Low"

def test_get_user_segment_existing(db_session):
    user = User(id=1, email="u@example.com")
    seg = UserSegment(user_id=1, rfm_group="Whale", risk_profile="low")
    db_session.add_all([user, seg])
    db_session.commit()
    assert repo.get_user_segment(db_session, 1) == "Whale"

def test_record_action_success(db_session):
    user = User(id=2, email="r@example.com")
    db_session.add(user)
    db_session.commit()
    action = repo.record_action(db_session, 2, "PLAY", 1.0)
    stored = db_session.query(UserAction).filter_by(id=action.id).first()
    assert stored is not None
    assert stored.action_type == "PLAY"

def test_record_action_failure():
    mock_session = Mock(spec=Session)
    mock_session.commit.side_effect = IntegrityError("err", None, None)
    with pytest.raises(IntegrityError):
        repo.record_action(mock_session, 1, "PLAY", 1.0)
    mock_session.rollback.assert_called_once()
