import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from typing import Generator

from app.models import Base, User, UserSegment, AdultContent, UserReward
from app.main import app
from app.database import get_db

SQLALCHEMY_DATABASE_URL = "sqlite:///./test_unlock.db"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

def override_get_db() -> Generator[Session, None, None]:
    db = None
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        if db:
            db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture
def client():
    from app.main import app
    with TestClient(app) as c:
        yield c

@pytest.fixture(scope="function")
def db_session() -> Generator[Session, None, None]:
    for table in reversed(Base.metadata.sorted_tables):
        engine.execute(table.delete())
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.rollback()
        db.close()

def seed_initial_data(db: Session, user_id: int, rfm_group: str = "Whale", email_suffix: str = ""):
    test_user = db.query(User).filter_by(id=user_id).first()
    if not test_user:
        test_user = User(id=user_id, email=f"user{user_id}{email_suffix}@example.com")
        db.add(test_user)

    user_segment = db.query(UserSegment).filter_by(user_id=user_id).first()
    if not user_segment:
        user_segment = UserSegment(user_id=user_id, rfm_group=rfm_group, risk_profile="Low-Risk")
        db.add(user_segment)
    else:
        user_segment.rfm_group = rfm_group
        user_segment.risk_profile = "Low-Risk"

    stages_data = [
        {"stage": 1, "name": "Stage 1 Content", "thumbnail_url": "s1_thumb.jpg", "media_url": "s1_media.mp4", "required_segment_level": 1},
        {"stage": 2, "name": "Stage 2 Content", "thumbnail_url": "s2_thumb.jpg", "media_url": "s2_media.mp4", "required_segment_level": 2},
        {"stage": 3, "name": "Stage 3 Content", "thumbnail_url": "s3_thumb.jpg", "media_url": "s3_media.mp4", "required_segment_level": 3},
    ]
    for content_data in stages_data:
        content_item = db.query(AdultContent).filter_by(stage=content_data["stage"]).first()
        if not content_item:
            db.add(AdultContent(**content_data))

    try:
        db.commit()
    except Exception as e:
        db.rollback()
        raise e

    if test_user in db.new or test_user in db.dirty: db.refresh(test_user)
    if user_segment in db.new or user_segment in db.dirty: db.refresh(user_segment)

    return test_user

def test_unlock_stages_sequentially(client, db_session: Session):
    user = seed_initial_data(db_session, user_id=101, rfm_group="Whale", email_suffix="_seq")

    response1 = client.get(f"/api/unlock?user_id={user.id}")
    assert response1.status_code == 200, response1.text
    data1 = response1.json()
    assert data1["stage"] == 1
    assert data1["name"] == "Stage 1 Content"
    reward1 = db_session.query(UserReward).filter_by(user_id=user.id, reward_type="CONTENT_UNLOCK", reward_value="1").first()
    assert reward1 is not None

    response2 = client.get(f"/api/unlock?user_id={user.id}")
    assert response2.status_code == 200, response2.text
    data2 = response2.json()
    assert data2["stage"] == 2
    assert data2["name"] == "Stage 2 Content"
    reward2 = db_session.query(UserReward).filter_by(user_id=user.id, reward_type="CONTENT_UNLOCK", reward_value="2").first()
    assert reward2 is not None

    response3 = client.get(f"/api/unlock?user_id={user.id}")
    assert response3.status_code == 200, response3.text
    data3 = response3.json()
    assert data3["stage"] == 3
    assert data3["name"] == "Stage 3 Content"
    reward3 = db_session.query(UserReward).filter_by(user_id=user.id, reward_type="CONTENT_UNLOCK", reward_value="3").first()
    assert reward3 is not None

    response4 = client.get(f"/api/unlock?user_id={user.id}")
    assert response4.status_code == 400, response4.text
    assert "All content stages already unlocked" in response4.json()["detail"]

def test_unlock_insufficient_segment(client, db_session: Session):
    user = seed_initial_data(db_session, user_id=102, rfm_group="Low", email_suffix="_insufficient")

    response1 = client.get(f"/api/unlock?user_id={user.id}")
    assert response1.status_code == 200, response1.text
    assert response1.json()["stage"] == 1

    response2 = client.get(f"/api/unlock?user_id={user.id}")
    assert response2.status_code == 403, response2.text
    assert "User current segment level (1) does not meet the required level (2) to unlock content stage 2" in response2.json()["detail"]

def test_unlock_user_not_found(client, db_session: Session):
    response = client.get("/api/unlock?user_id=999")
    assert response.status_code == 404, response.text
    assert "존재하지 않는 사용자" in response.json()["detail"]

def test_unlock_content_stage_not_found(client, db_session: Session):
    user = seed_initial_data(db_session, user_id=103, rfm_group="Whale", email_suffix="_no_content")

    db_session.query(AdultContent).filter(AdultContent.stage > 1).delete()
    db_session.commit()

    response1 = client.get(f"/api/unlock?user_id={user.id}")
    assert response1.status_code == 200, response1.text
    assert response1.json()["stage"] == 1

    response2 = client.get(f"/api/unlock?user_id={user.id}")
    assert response2.status_code == 404, response2.text
    assert "Content for stage 2 not found" in response2.json()["detail"]
