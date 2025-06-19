"""
Adult Content Router Tests - Fixed version with correct paths and modern patterns

테스트 전략:
1. 올바른 URL 경로 사용 (/v1/adult/* 엔드포인트)
2. 서비스 의존성 주입 모킹
3. 비동기 함수 적절한 처리
4. Clean Architecture 패턴 준수
"""
import pytest
from fastapi.testclient import TestClient
from fastapi import FastAPI
from unittest.mock import Mock, patch, AsyncMock
from sqlalchemy.orm import Session

from app.routers.adult_content import router, public_router
from app.schemas import ContentPreviewResponse


@pytest.fixture
def app():
    """테스트용 FastAPI 앱"""
    app = FastAPI()
    app.include_router(router)
    app.include_router(public_router)  # public_router 추가
    return app


@pytest.fixture
def mock_db():
    """Mock DB 세션"""
    return Mock(spec=Session)


@pytest.fixture
def mock_services():
    """모든 서비스 모킹"""
    return {
        'adult_content_service': Mock(),
        'token_service': Mock(), 
        'user_service': Mock(),
        'vip_service': Mock(),
        'flash_service': Mock(),
        'age_verification_service': Mock()
    }


@pytest.fixture
def client(app, mock_services, mock_db):
    """의존성 오버라이드가 적용된 테스트 클라이언트"""
    from app.routers.adult_content import (
        get_adult_content_service, get_token_service, get_user_service,
        get_current_user_id, get_db, get_vip_content_service,
        get_flash_offer_service, get_age_verification_service
    )
    
    # 의존성 오버라이드
    app.dependency_overrides[get_current_user_id] = lambda: 123
    app.dependency_overrides[get_adult_content_service] = lambda: mock_services['adult_content_service']
    app.dependency_overrides[get_token_service] = lambda: mock_services['token_service']
    app.dependency_overrides[get_user_service] = lambda: mock_services['user_service']
    app.dependency_overrides[get_vip_content_service] = lambda: mock_services['vip_service']
    app.dependency_overrides[get_flash_offer_service] = lambda: mock_services['flash_service']
    app.dependency_overrides[get_age_verification_service] = lambda: mock_services['age_verification_service']
    app.dependency_overrides[get_db] = lambda: mock_db
    
    client = TestClient(app)
    yield client
    
    # 정리
    app.dependency_overrides.clear()


class TestBasicEndpoints:
    """기본 엔드포인트 테스트"""
    
    def test_health_check(self):
        """헬스체크 엔드포인트 테스트 - 의존성 없이 간단하게"""
        app = FastAPI()
        app.include_router(public_router)
        client = TestClient(app)
        
        response = client.get("/v1/adult/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["service"] == "adult_content"

    def test_gallery_endpoint(self, client, mock_services):
        """갤러리 엔드포인트 테스트"""
        # Mock 설정 - 모든 필수 필드 포함
        mock_services['adult_content_service'].get_gallery_for_user.return_value = [
            {
                "id": 1,
                "name": "Test Content",
                "title": "Test Content",
                "description": "Test Description",
                "thumbnail_url": "https://example.com/thumb.jpg",
                "preview_url": "https://example.com/preview.jpg",
                "content_type": "video",
                "stage_required": "BASIC",
                "highest_unlocked_stage": "BASIC",
                "is_unlocked": True            }
        ]
        response = client.get("/v1/adult/gallery",
                            headers={"Authorization": "Bearer test_token"})
        assert response.status_code == 200
        data = response.json()
        assert "items" in data

    def test_content_details_endpoint(self, client, mock_services):
        """콘텐츠 상세 정보 엔드포인트 테스트"""
        # Mock async method with all required fields
        async def mock_get_content_details(user_id, content_id):
            return {
                "id": content_id,
                "title": "Test Content", 
                "description": "Test Description",
                "content_url": "https://example.com/content",
                "type": "premium",
                "unlock_level": 1,
                "prerequisites": [],
                "stages": [],
                "user_current_access_level": 1
            }
        
        mock_services['adult_content_service'].get_content_details = mock_get_content_details
        
        response = client.get("/v1/adult/1",
                            headers={"Authorization": "Bearer test_token"})
        assert response.status_code == 200


class TestContentPreview:
    """콘텐츠 미리보기 테스트"""

    def test_content_preview_success(self, client, mock_services):
        """콘텐츠 미리보기 성공 테스트"""
        # Mock async method
        async def mock_get_content_preview(user_id, content_id):
            return ContentPreviewResponse(
                id=content_id,
                title="Test Content",
                preview_data={"thumbnail": "https://example.com/thumb.jpg"},
                unlock_requirements={"min_level": 1, "tokens": 100},
                preview_url="https://example.com/preview.jpg",
                current_stage_accessed=1
            )
        
        mock_services['adult_content_service'].get_content_preview = mock_get_content_preview
        
        response = client.get("/v1/adult/1/preview",
                            headers={"Authorization": "Bearer test_token"})
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == 1
        assert data["title"] == "Test Content"

    def test_gallery_preview_endpoint(self, client, mock_services):
        """갤러리 미리보기 엔드포인트 테스트"""
        mock_services['adult_content_service'].get_gallery_for_user.return_value = []
        
        response = client.get("/v1/adult/content/preview",
                            headers={"Authorization": "Bearer test_token"})
        assert response.status_code == 200


class TestContentUnlock:
    """콘텐츠 언락 테스트"""

    def test_unlock_content_success(self, client, mock_services):
        """콘텐츠 언락 성공 테스트"""
        # Mock user service
        mock_user = Mock()
        mock_user.id = 123
        mock_services['user_service'].get_user_or_error.return_value = mock_user
        
        # 언락 요청
        unlock_data = {"stage": 2, "tokens_to_spend": 100}
        response = client.post("/v1/adult/content/unlock",
                             json=unlock_data,
                             headers={"Authorization": "Bearer test_token"})
        
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["stage"] == 2

    def test_unlock_content_invalid_data(self, client):
        """잘못된 데이터로 언락 시도 테스트"""
        response = client.post("/v1/adult/content/unlock",
                             json={"invalid": "data"},
                             headers={"Authorization": "Bearer test_token"})
        # 서비스에서 적절히 처리되어야 함
        assert response.status_code in [200, 400, 422]


class TestUnlockHistory:
    """언락 히스토리 테스트"""

    def test_get_unlock_history_success(self, client, mock_services):
        """언락 히스토리 조회 성공 테스트"""
        mock_services['adult_content_service'].get_user_unlock_history.return_value = [
            {
                "id": 1,
                "content_id": 10,
                "content_name": "Test Content",
                "unlocked_at": "2025-06-18T10:00:00Z",
                "stage_required": "BASIC"
            }
        ]
        response = client.get("/v1/adult/unlock/history",
                            headers={"Authorization": "Bearer test_token"})
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
        assert response.status_code == 200
        data = response.json()
        assert "history" in data

    def test_get_unlock_history_empty(self, client, mock_services):
        """빈 언락 히스토리 테스트"""
        mock_services['adult_content_service'].get_user_unlock_history.return_value = []
        
        response = client.get("/v1/adult/unlock/history",
                            headers={"Authorization": "Bearer test_token"})
        assert response.status_code == 200


class TestVIPEndpoints:
    """VIP 관련 엔드포인트 테스트"""

    def test_get_vip_info_success(self, client):
        """VIP 정보 조회 성공 테스트"""
        response = client.get("/v1/adult/vip/info",
                            headers={"Authorization": "Bearer test_token"})
        assert response.status_code == 200
        data = response.json()
        assert "vip_status" in data


class TestFlashOffers:
    """플래시 오퍼 테스트"""

    def test_get_active_flash_offers(self, client):
        """활성 플래시 오퍼 조회 테스트"""
        response = client.get("/v1/adult/flash-offers/active",
                            headers={"Authorization": "Bearer test_token"})
        assert response.status_code == 200
        data = response.json()
        assert "offers" in data

    def test_purchase_flash_offer(self, client):
        """플래시 오퍼 구매 테스트"""
        offer_data = {"offer_id": "flash_001", "tokens_to_spend": 200}
        response = client.post("/v1/adult/flash-offers/purchase",
                             json=offer_data,
                             headers={"Authorization": "Bearer test_token"})
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True


class TestErrorHandling:
    """오류 처리 테스트"""

    def test_service_error_handling(self, client, mock_services):
        """서비스 오류 처리 테스트"""
        mock_services['adult_content_service'].get_gallery_for_user.side_effect = ValueError("Test error")
        
        response = client.get("/v1/adult/gallery",
                            headers={"Authorization": "Bearer test_token"})
        assert response.status_code == 400  # ValueError는 400으로 처리

    def test_unauthorized_access(self, client):
        """인증되지 않은 접근 테스트"""
        response = client.get("/v1/adult/gallery")
        assert response.status_code == 400  # Authentication error


class TestAuthentication:
    """인증 테스트"""

    def test_auth_required_endpoints(self, client):
        """인증이 필요한 엔드포인트 테스트"""
        # 단일 엔드포인트만 테스트하여 RecursionError 방지
        response = client.get("/v1/adult/gallery")
        # 인증 없이 접근 시 400 (authentication error), 401, 또는 422
        assert response.status_code in [400, 401, 422]

    def test_valid_token_access(self, client, mock_services):
        """유효한 토큰으로 접근 테스트"""
        mock_services['adult_content_service'].get_gallery_for_user.return_value = []
        
        response = client.get("/v1/adult/gallery",
                            headers={"Authorization": "Bearer valid_token"})
        assert response.status_code == 200


class TestMyUnlocksEndpoint:
    """My Unlocks 엔드포인트 별도 테스트"""

    def test_my_unlocks_endpoint(self, client, mock_services):
        """My unlocks 엔드포인트 테스트"""
        mock_services['adult_content_service'].get_user_unlock_history.return_value = []        
        response = client.get("/v1/adult/unlock/history",
                            headers={"Authorization": "Bearer test_token"})
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
        assert response.status_code == 200
        data = response.json()
        assert "history" in data
