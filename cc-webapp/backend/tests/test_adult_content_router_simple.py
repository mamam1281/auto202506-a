"""
Adult Content Router Tests - Simple and focused version

기본적인 엔드포인트들만 테스트하여 우선 통과시키고 점진적으로 개선
"""
import pytest
from fastapi.testclient import TestClient
from fastapi import FastAPI
from unittest.mock import Mock

from app.routers.adult_content import router


@pytest.fixture
def app():
    """테스트용 FastAPI 앱"""
    app = FastAPI()
    app.include_router(router)
    return app


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
def client(app, mock_services):
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
    app.dependency_overrides[get_db] = lambda: Mock()
    
    client = TestClient(app)
    yield client
    
    # 정리
    app.dependency_overrides.clear()


class TestHealthCheck:
    """헬스체크 테스트"""

    def test_health_check_no_auth(self):
        """헬스체크는 인증 없이 접근 가능해야 함"""
        app = FastAPI()
        app.include_router(router)
        client = TestClient(app)
        
        response = client.get("/v1/adult/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["service"] == "adult_content"


class TestBasicEndpoints:
    """기본 엔드포인트 테스트"""

    def test_gallery_endpoint_with_error_handling(self, client, mock_services):
        """갤러리 엔드포인트 - 에러 처리 확인"""
        # Mock에서 ValueError 발생시킴
        mock_services['adult_content_service'].get_gallery_for_user.side_effect = ValueError("Test error")
        
        response = client.get("/v1/adult/gallery", 
                            headers={"Authorization": "Bearer test_token"})
        # ValueError는 400으로 처리되어야 함
        assert response.status_code == 400

    def test_gallery_endpoint_success(self, client, mock_services):
        """갤러리 엔드포인트 성공 케이스"""
        mock_services['adult_content_service'].get_gallery_for_user.return_value = [
            {"id": 1, "title": "Test Content"}
        ]
        
        response = client.get("/v1/adult/gallery", 
                            headers={"Authorization": "Bearer test_token"})
        assert response.status_code == 200


class TestVIPEndpoints:
    """VIP 엔드포인트 테스트"""

    def test_get_vip_info(self, client):
        """VIP 정보 조회 테스트"""
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


class TestContentUnlock:
    """콘텐츠 언락 테스트"""

    def test_unlock_content_basic(self, client, mock_services):
        """기본 콘텐츠 언락 테스트"""
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


class TestAuthentication:
    """인증 테스트"""

    def test_auth_required_gallery(self, client):
        """갤러리는 인증이 필요함"""
        response = client.get("/v1/adult/gallery")
        # 인증 없이 접근 시 오류
        assert response.status_code in [400, 401, 422]

    def test_auth_required_vip(self, client):
        """VIP 정보는 인증이 필요함"""  
        response = client.get("/v1/adult/vip/info")
        assert response.status_code in [400, 401, 422]


class TestErrorHandling:
    """오류 처리 테스트"""

    def test_service_error_to_400(self, client, mock_services):
        """서비스 ValueError는 400으로 변환되어야 함"""
        mock_services['adult_content_service'].get_gallery_for_user.side_effect = ValueError("Service error")
        
        response = client.get("/v1/adult/gallery",
                            headers={"Authorization": "Bearer test_token"})
        assert response.status_code == 400

    def test_general_exception_to_500(self, client, mock_services):
        """일반 예외는 500으로 변환되어야 함"""
        mock_services['adult_content_service'].get_gallery_for_user.side_effect = Exception("General error")
        
        response = client.get("/v1/adult/gallery",
                            headers={"Authorization": "Bearer test_token"})
        assert response.status_code == 500


class TestSimpleWorkflow:
    """간단한 워크플로우 테스트"""

    def test_basic_workflow(self, client, mock_services):
        """기본 워크플로우: 갤러리 조회 -> VIP 정보 조회"""
        # 1. 갤러리 조회
        mock_services['adult_content_service'].get_gallery_for_user.return_value = []
        gallery_response = client.get("/v1/adult/gallery",
                                    headers={"Authorization": "Bearer test_token"})
        assert gallery_response.status_code == 200
        
        # 2. VIP 정보 조회
        vip_response = client.get("/v1/adult/vip/info",
                                headers={"Authorization": "Bearer test_token"})
        assert vip_response.status_code == 200
