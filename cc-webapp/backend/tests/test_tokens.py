import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from typing import Generator

from app.models import Base, User, UserSegment
from app.main import app
from app.database import get_db

SQLALCHEMY_DATABASE_URL = "sqlite:///./test_tokens.db"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base.metadata.create_all(bind=engine)


def override_get_db() -> Generator[Session, None, None]:
    db = None
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        if db:
            db.close()

client = TestClient(app)


@pytest.fixture(scope="function")
def db_session() -> Generator[Session, None, None]:
    previous_override = app.dependency_overrides.get(get_db)
    app.dependency_overrides[get_db] = override_get_db
    db = TestingSessionLocal()
    try:
        for table in reversed(Base.metadata.sorted_tables):
            db.execute(table.delete())
        db.commit()
        yield db
    finally:
        db.rollback()
        db.close()
        if previous_override is not None:
            app.dependency_overrides[get_db] = previous_override
        else:
            app.dependency_overrides.pop(get_db, None)


def test_earn_tokens_commits_balance(db_session: Session):
    user = User(id=1, email="token_user@example.com")
    db_session.add(user)
    db_session.commit()

    response = client.post(
        "/api/v1/corporate/tokens/earn",
        json={"user_id": user.id, "amount": 50},
    )
    assert response.status_code == 200, response.text

    db_session.refresh(user)
    assert user.cyber_token_balance == 250


def test_deduct_tokens_commits_balance(db_session: Session):
    user = User(id=2, email="deduct@example.com", cyber_token_balance=500)
    segment = UserSegment(user_id=user.id, rfm_group="Whale")
    db_session.add_all([user, segment])
    db_session.commit()

    response = client.post(
        "/api/v1/adult/unlock",
        params={"stage": 1, "user_id": user.id},
        headers={"Authorization": "Bearer test"},
    )
    assert response.status_code == 200, response.text

    db_session.refresh(user)
    assert user.cyber_token_balance == 300

