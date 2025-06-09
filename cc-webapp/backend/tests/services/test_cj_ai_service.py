import json
import os
import pytest
import asyncio
from unittest.mock import AsyncMock, MagicMock, patch
from datetime import datetime

from app.services.cj_ai_service import CJAIService, ChatContext, CJResponse, ResponseType
from app.utils.sentiment_analyzer import EmotionResult


@pytest.fixture
def ai_service():
    # 테스트용 가짜 Redis 클라이언트와 웹소켓 매니저 생성
    mock_redis = AsyncMock()
    mock_websocket = AsyncMock()
    service = CJAIService(redis_client=mock_redis, websocket_manager=mock_websocket)
    return service


@pytest.mark.asyncio
async def test_analyze_and_respond(ai_service):
    # 테스트 데이터 설정
    user_id = 123
    message = "오늘 게임에서 이겼어요!"
    context = ChatContext(user_id=user_id, recent_messages=["안녕하세요"])

    # get_emotion_analysis 함수 모킹
    emotion_result = EmotionResult(emotion="excited", confidence=0.85, details={})
    with patch('app.services.cj_ai_service.get_emotion_analysis', return_value=emotion_result):
        # 메소드 호출
        response = await ai_service.analyze_and_respond(user_id, message, context)

    # 검증
    assert isinstance(response, CJResponse)
    assert response.emotion_detected == "excited"
    assert response.confidence == 0.85
    assert response.response_type == ResponseType.WIN_CELEBRATION


@pytest.mark.asyncio
async def test_store_interaction(ai_service):
    # 테스트 데이터
    user_id = 456
    message = "게임이 너무 어려워요"
    response = CJResponse(
        message="괜찮아요, 다음에는 분명 좋은 결과가 있을 거예요!",
        response_type=ResponseType.LOSS_COMFORT,
        emotion_detected="frustrated",
        confidence=0.75
    )

    # 메소드 호출
    await ai_service._store_interaction(user_id, message, response)

    # Redis setex 호출 검증
    ai_service.redis_client.setex.assert_called_once()
    # 첫 번째 인자는 동적으로 생성되므로 키 패턴만 확인
    args, _ = ai_service.redis_client.setex.call_args
    assert args[0].startswith(f"cj_interaction:{user_id}:")
    # TTL 검증
    assert args[1] == 86400  # 24시간
    # 저장된 데이터 검증
    stored_data = json.loads(args[2])
    assert stored_data["user_id"] == user_id
    assert stored_data["user_message"] == message
    assert stored_data["emotion_detected"] == "frustrated"


@pytest.mark.asyncio
async def test_get_user_emotion_history(ai_service):
    # 테스트 데이터 설정
    user_id = 789
    limit = 5
    
    # Redis 응답 모킹
    keys = [f"cj_interaction:{user_id}:{i}".encode() for i in range(10)]
    ai_service.redis_client.keys.return_value = keys
    
    # 각 키에 대한 값 모킹
    async def mock_get(key):
        # 키에서 타임스탬프 부분 추출
        timestamp = key.decode().split(':')[2]
        mock_data = {
            "user_id": user_id,
            "timestamp": f"2023-01-0{timestamp}T12:00:00",
            "emotion_detected": "excited" if int(timestamp) % 2 == 0 else "frustrated",
        }
        return json.dumps(mock_data)
    
    ai_service.redis_client.get.side_effect = mock_get
    
    # 메소드 호출
    history = await ai_service.get_user_emotion_history(user_id, limit)
    
    # 검증
    assert len(history) == limit
    # keys 메소드가 올바른 패턴으로 호출되었는지 확인
    ai_service.redis_client.keys.assert_called_once_with(f"cj_interaction:{user_id}:*")
    # 최신 5개만 반환했는지 확인 (마지막 5개)
    assert all(history[i]["user_id"] == user_id for i in range(limit))


@pytest.mark.asyncio
async def test_get_user_emotion_history_no_redis(ai_service):
    # Redis 클라이언트가 없는 경우 테스트
    ai_service.redis_client = None
    result = await ai_service.get_user_emotion_history(123)
    assert result == []


@pytest.mark.asyncio
async def test_send_websocket_message(ai_service):
    # 테스트 데이터
    user_id = 999
    message = "테스트 메시지"
    
    # 메소드 호출
    await ai_service.send_websocket_message(user_id, message)
    
    # 검증
    ai_service.websocket_manager.send_personal_message.assert_called_once_with(
        message, user_id
    )


@pytest.mark.asyncio
async def test_send_websocket_message_no_manager(ai_service):
    # 웹소켓 매니저가 없는 경우 테스트
    ai_service.websocket_manager = None
    # 예외가 발생하지 않고 정상적으로 실행되는지 확인
    await ai_service.send_websocket_message(123, "테스트")
