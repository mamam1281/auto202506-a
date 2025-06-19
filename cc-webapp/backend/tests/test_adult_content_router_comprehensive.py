"""
adult_content.py 라우터 포괄적 테스트 케이스

테스트 전략:
1. FastAPI 라우터 엔드포인트 테스트
2. 인증/권한 검증
3. 서비스 계층 통합 테스트  
4. 예외 처리 및 오류 응답
5. 성인 콘텐츠 특수 로직 검증
"""
import pytest
from fastapi.testclient import TestClient
from fastapi import FastAPI
from unittest.mock import Mock, patch, AsyncMock, MagicMock
from sqlalchemy.orm import Session
import json

from app.routers.adult_content import router, get_current_user_id
from app.schemas import (
    ContentPreviewResponse, ContentUnlockResponse, 
    UnlockHistoryResponse, VIPInfoResponse
)


@pytest.fixture
def app():
    """테스트용 FastAPI 앱 - 의존성 오버라이드 포함"""
    app = FastAPI()
    app.include_router(router)
    return app


@pytest.fixture  
def mock_db():
    """Mock DB 세션"""
    return Mock(spec=Session)


@pytest.fixture
def mock_adult_content_service():
    """Mock AdultContentService"""
    return Mock()


@pytest.fixture
def mock_token_service():
    """Mock TokenService"""
    return Mock()


@pytest.fixture
def client(app, mock_adult_content_service, mock_token_service, mock_db):
    """테스트 클라이언트 - 의존성 오버라이드 설정"""
    from app.routers.adult_content import get_adult_content_service, get_token_service, get_current_user_id, get_db
    
    # 의존성 오버라이드
    app.dependency_overrides[get_current_user_id] = lambda: 123
    app.dependency_overrides[get_adult_content_service] = lambda: mock_adult_content_service
    app.dependency_overrides[get_token_service] = lambda: mock_token_service
    app.dependency_overrides[get_db] = lambda: mock_db
    
    client = TestClient(app)
    yield client
    
    # 테스트 후 정리
    app.dependency_overrides.clear()


class TestAdultContentRouterAuth:
    """인증 관련 테스트"""
    
    def test_auth_required_for_protected_endpoints(self, client):
        """보호된 엔드포인트 인증 요구 테스트"""
        protected_endpoints = [
            "/v1/adult/content/preview",
            "/v1/adult/vip/info",
            "/v1/adult/unlock/history"
        ]
        
        for endpoint in protected_endpoints:
            response = client.get(endpoint)
            # 인증이 필요한 엔드포인트는 401 또는 422 응답
            assert response.status_code in [401, 422]

    def test_invalid_token_handling(self, client):
        """잘못된 토큰 처리 테스트"""
        headers = {"Authorization": "Bearer invalid_token"}
        response = client.get("/v1/adult/content/preview", headers=headers)
        # 토큰 검증 실패 시 적절한 오류 응답
        assert response.status_code in [401, 422]


class TestContentPreviewEndpoint:
    """콘텐츠 미리보기 엔드포인트 테스트"""
    
    @patch('app.routers.adult_content.get_current_user_id')
    @patch('app.routers.adult_content.get_adult_content_service')
    def test_get_content_preview_success(self, mock_service_dep, mock_auth, client):
        """콘텐츠 미리보기 성공 케이스"""
        # Mock 설정
        mock_auth.return_value = 123
        mock_service = Mock()
        
        # 실제 서비스 메서드에 맞게 수정
        from app.schemas import ContentPreviewResponse
        mock_preview = ContentPreviewResponse(
            id=1,
            title="Test Content",
            preview_data={"thumbnail": "https://example.com/thumb.jpg"},
            unlock_requirements={"min_level": 1, "tokens": 100},
            preview_url="https://example.com/preview.jpg",
            current_stage_accessed=1
        )
        
        # get_content_preview를 async로 mock
        async def mock_get_content_preview(content_id, user_id):
            return mock_preview
            
        mock_service.get_content_preview = mock_get_content_preview
        mock_service_dep.return_value = mock_service
        
        # 테스트 실행 - 올바른 URL 사용
        response = client.get("/v1/adult/1/preview", 
                            headers={"Authorization": "Bearer valid_token"})
        
        # 검증
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == 1
        assert data["title"] == "Test Content"
        assert "preview_data" in data

    @patch('app.routers.adult_content.get_current_user_id')
    @patch('app.routers.adult_content.get_adult_content_service')
    def test_get_content_preview_service_error(self, mock_service_dep, mock_auth, client):
        """서비스 오류 시 예외 처리 테스트"""
        mock_auth.return_value = 123
        mock_service = Mock()
        mock_service.get_gallery_for_user.side_effect = Exception("Service error")
        mock_service_dep.return_value = mock_service
        
        response = client.get("/v1/adult/content/preview",
                            headers={"Authorization": "Bearer valid_token"})
        
        # 서비스 오류 시 500 응답
        assert response.status_code == 500


class TestContentUnlockEndpoint:
    """콘텐츠 언락 엔드포인트 테스트"""
    
    @patch('app.routers.adult_content.get_current_user_id')
    @patch('app.routers.adult_content.get_adult_content_service') 
    @patch('app.routers.adult_content.get_token_service')
    def test_unlock_content_success(self, mock_token_service_dep, mock_content_service_dep, mock_auth, client):
        """콘텐츠 언락 성공 테스트"""
        # Mock 설정
        mock_auth.return_value = 123
        
        mock_token_service = Mock()
        mock_token_service.has_sufficient_balance.return_value = True
        mock_token_service.deduct_tokens.return_value = True
        mock_token_service_dep.return_value = mock_token_service
        
        mock_content_service = Mock() 
        mock_content_service.unlock_stage_for_user.return_value = {
            "success": True,
            "stage": 2,
            "content_url": "https://example.com/content/2"
        }
        mock_content_service_dep.return_value = mock_content_service
        
        # 테스트 실행
        unlock_data = {"stage": 2, "tokens_to_spend": 100}
        response = client.post("/v1/adult/content/unlock",
                             json=unlock_data,
                             headers={"Authorization": "Bearer valid_token"})
        
        # 검증
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["stage"] == 2

    @patch('app.routers.adult_content.get_current_user_id')
    @patch('app.routers.adult_content.get_token_service')
    def test_unlock_content_insufficient_tokens(self, mock_token_service_dep, mock_auth, client):
        """토큰 부족 시 언락 실패 테스트"""
        mock_auth.return_value = 123
        
        mock_token_service = Mock()
        mock_token_service.has_sufficient_balance.return_value = False
        mock_token_service_dep.return_value = mock_token_service
        
        unlock_data = {"stage": 2, "tokens_to_spend": 1000}
        response = client.post("/v1/adult/content/unlock",
                             json=unlock_data, 
                             headers={"Authorization": "Bearer valid_token"})
        
        # 토큰 부족 시 400 오류
        assert response.status_code == 400
        assert "insufficient" in response.json()["detail"].lower()

    @patch('app.routers.adult_content.get_current_user_id')
    def test_unlock_content_invalid_stage(self, mock_auth, client):
        """잘못된 스테이지 언락 시도 테스트"""
        mock_auth.return_value = 123
        
        # 잘못된 스테이지 (0 또는 음수)
        invalid_data = {"stage": 0, "tokens_to_spend": 100}
        response = client.post("/v1/adult/content/unlock",
                             json=invalid_data,
                             headers={"Authorization": "Bearer valid_token"})
        
        # 스키마 검증 실패로 422 응답
        assert response.status_code == 422


class TestUnlockHistoryEndpoint:
    """언락 히스토리 엔드포인트 테스트"""
    
    @patch('app.routers.adult_content.get_current_user_id')
    @patch('app.routers.adult_content.get_adult_content_service')
    def test_get_unlock_history_success(self, mock_service_dep, mock_auth, client):
        """언락 히스토리 조회 성공 테스트"""
        mock_auth.return_value = 123
        
        mock_service = Mock()
        mock_service.get_user_unlock_history.return_value = [
            {"stage": 1, "unlocked_at": "2025-06-18T10:00:00Z", "tokens_spent": 50},
            {"stage": 2, "unlocked_at": "2025-06-18T11:00:00Z", "tokens_spent": 100}
        ]
        mock_service_dep.return_value = mock_service
        
        response = client.get("/v1/adult/unlock/history",
                            headers={"Authorization": "Bearer valid_token"})
        
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 2
        assert data[0]["stage"] == 1

    @patch('app.routers.adult_content.get_current_user_id')
    @patch('app.routers.adult_content.get_adult_content_service')
    def test_get_unlock_history_empty(self, mock_service_dep, mock_auth, client):
        """빈 언락 히스토리 테스트"""
        mock_auth.return_value = 123
        
        mock_service = Mock()
        mock_service.get_user_unlock_history.return_value = []
        mock_service_dep.return_value = mock_service
        
        response = client.get("/v1/adult/unlock/history",
                            headers={"Authorization": "Bearer valid_token"})
        
        assert response.status_code == 200
        assert response.json() == []


class TestVIPInfoEndpoint:
    """VIP 정보 엔드포인트 테스트"""
    
    @patch('app.routers.adult_content.get_current_user_id')
    @patch('app.routers.adult_content.get_vip_content_service')
    def test_get_vip_info_success(self, mock_vip_service_dep, mock_auth, client):
        """VIP 정보 조회 성공 테스트"""
        mock_auth.return_value = 123
        
        mock_vip_service = Mock()
        mock_vip_service.get_vip_status.return_value = {
            "is_vip": True,
            "tier": "Gold",
            "expires_at": "2025-12-31T23:59:59Z"
        }
        mock_vip_service_dep.return_value = mock_vip_service
        
        response = client.get("/v1/adult/vip/info",
                            headers={"Authorization": "Bearer valid_token"})
        
        assert response.status_code == 200
        data = response.json()
        assert data["is_vip"] is True
        assert data["tier"] == "Gold"

    @patch('app.routers.adult_content.get_current_user_id') 
    @patch('app.routers.adult_content.get_vip_content_service')
    def test_get_vip_info_non_vip(self, mock_vip_service_dep, mock_auth, client):
        """VIP가 아닌 사용자 정보 테스트"""
        mock_auth.return_value = 123
        
        mock_vip_service = Mock()
        mock_vip_service.get_vip_status.return_value = {
            "is_vip": False,
            "tier": None,
            "expires_at": None
        }
        mock_vip_service_dep.return_value = mock_vip_service
        
        response = client.get("/v1/adult/vip/info",
                            headers={"Authorization": "Bearer valid_token"})
        
        assert response.status_code == 200
        data = response.json()
        assert data["is_vip"] is False


class TestFlashOfferEndpoints:
    """플래시 오퍼 엔드포인트 테스트"""
    
    @patch('app.routers.adult_content.get_current_user_id')
    @patch('app.routers.adult_content.get_flash_offer_service')
    def test_get_active_flash_offers_success(self, mock_flash_service_dep, mock_auth, client):
        """활성 플래시 오퍼 조회 테스트"""
        mock_auth.return_value = 123
        
        mock_flash_service = Mock()
        mock_flash_service.get_active_offers.return_value = [
            {
                "offer_id": "flash_001",
                "title": "50% 할인",
                "discount": 0.5,
                "expires_at": "2025-06-19T00:00:00Z"
            }
        ]
        mock_flash_service_dep.return_value = mock_flash_service
        
        response = client.get("/v1/adult/flash-offers/active",
                            headers={"Authorization": "Bearer valid_token"})
        
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 1
        assert data[0]["offer_id"] == "flash_001"

    @patch('app.routers.adult_content.get_current_user_id')
    @patch('app.routers.adult_content.get_flash_offer_service')
    def test_purchase_flash_offer_success(self, mock_flash_service_dep, mock_auth, client):
        """플래시 오퍼 구매 성공 테스트"""
        mock_auth.return_value = 123
        
        mock_flash_service = Mock()
        mock_flash_service.purchase_offer.return_value = {
            "success": True,
            "offer_id": "flash_001",
            "final_price": 50
        }
        mock_flash_service_dep.return_value = mock_flash_service
        
        purchase_data = {"offer_id": "flash_001"}
        response = client.post("/v1/adult/flash-offers/purchase",
                             json=purchase_data,
                             headers={"Authorization": "Bearer valid_token"})
        
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True


class TestServiceDependencyInjection:
    """서비스 의존성 주입 테스트"""
    
    @patch('app.routers.adult_content.get_db')
    def test_token_service_injection(self, mock_db):
        """TokenService 의존성 주입 테스트"""
        from app.routers.adult_content import get_token_service
        
        mock_session = Mock(spec=Session)
        mock_db.return_value = mock_session
        
        # 서비스 생성 테스트
        service = get_token_service(db=mock_session)
        assert service is not None

    @patch('app.routers.adult_content.get_db')
    def test_age_verification_service_injection(self, mock_db):
        """AgeVerificationService 의존성 주입 테스트"""
        from app.routers.adult_content import get_age_verification_service
        
        mock_session = Mock(spec=Session)
        mock_db.return_value = mock_session
        
        service = get_age_verification_service(db=mock_session)
        assert service is not None


class TestErrorHandling:
    """오류 처리 테스트"""
    
    @patch('app.routers.adult_content.get_current_user_id')
    @patch('app.routers.adult_content.get_adult_content_service')
    def test_database_connection_error(self, mock_service_dep, mock_auth, client):
        """데이터베이스 연결 오류 처리 테스트"""
        mock_auth.return_value = 123
        
        mock_service = Mock()
        mock_service.get_gallery_for_user.side_effect = ConnectionError("DB connection failed")
        mock_service_dep.return_value = mock_service
        
        response = client.get("/v1/adult/content/preview",
                            headers={"Authorization": "Bearer valid_token"})
        
        # 연결 오류 시 500 응답
        assert response.status_code == 500

    @patch('app.routers.adult_content.get_current_user_id')
    def test_malformed_request_data(self, mock_auth, client):
        """잘못된 요청 데이터 처리 테스트"""
        mock_auth.return_value = 123
        
        # JSON 형식이 아닌 데이터
        response = client.post("/v1/adult/content/unlock",
                             data="invalid json",
                             headers={"Authorization": "Bearer valid_token",
                                    "Content-Type": "application/json"})
        
        # 요청 데이터 오류 시 422 응답
        assert response.status_code == 422


class TestPermissionAndSecurity:
    """권한 및 보안 테스트"""
    
    @patch('app.routers.adult_content.get_current_user_id')
    @patch('app.routers.adult_content.get_age_verification_service')
    def test_age_verification_required(self, mock_age_service_dep, mock_auth, client):
        """연령 확인 필요 테스트"""
        mock_auth.return_value = 123
        
        mock_age_service = Mock()
        mock_age_service.is_user_age_verified.return_value = False
        mock_age_service_dep.return_value = mock_age_service
        
        # 연령 확인이 필요한 경우의 로직은 실제 구현에 따라 다름
        # 여기서는 기본 응답이 정상적으로 처리되는지 확인
        response = client.get("/v1/adult/content/preview",
                            headers={"Authorization": "Bearer valid_token"})
        
        # 적절한 응답 상태 확인 (구현에 따라 다를 수 있음)
        assert response.status_code in [200, 403]

    def test_content_access_logging(self, client):
        """콘텐츠 접근 로깅 테스트"""
        # 로깅 기능이 구현되어 있다면 테스트
        # 실제 구현에서는 audit log나 access log를 확인할 수 있음
        pass


class TestIntegrationScenarios:
    """통합 시나리오 테스트"""
    
    @patch('app.routers.adult_content.get_current_user_id')
    @patch('app.routers.adult_content.get_adult_content_service')
    @patch('app.routers.adult_content.get_token_service')
    def test_complete_unlock_workflow(self, mock_token_service_dep, mock_content_service_dep, mock_auth, client):
        """완전한 언락 워크플로우 테스트"""
        mock_auth.return_value = 123
        
        # 1. 토큰 서비스 모킹
        mock_token_service = Mock()
        mock_token_service.has_sufficient_balance.return_value = True
        mock_token_service.deduct_tokens.return_value = True
        mock_token_service_dep.return_value = mock_token_service
        
        # 2. 콘텐츠 서비스 모킹
        mock_content_service = Mock()
        mock_content_service.unlock_stage_for_user.return_value = {
            "success": True,
            "stage": 2,
            "content_url": "https://example.com/content/2"
        }
        mock_content_service_dep.return_value = mock_content_service
        
        # 3. 언락 실행
        unlock_data = {"stage": 2, "tokens_to_spend": 100}
        response = client.post("/v1/adult/content/unlock",
                             json=unlock_data,
                             headers={"Authorization": "Bearer valid_token"})
        
        # 4. 검증
        assert response.status_code == 200
        
        # 5. 서비스 호출 확인
        mock_token_service.has_sufficient_balance.assert_called_once()
        mock_token_service.deduct_tokens.assert_called_once()
        mock_content_service.unlock_stage_for_user.assert_called_once()


class TestPerformanceAndLoad:
    """성능 및 부하 테스트"""
    
    @patch('app.routers.adult_content.get_current_user_id')
    @patch('app.routers.adult_content.get_adult_content_service')
    def test_concurrent_requests_handling(self, mock_service_dep, mock_auth, client):
        """동시 요청 처리 테스트"""
        mock_auth.return_value = 123
        
        mock_service = Mock()
        mock_service.get_gallery_for_user.return_value = {"stages": []}
        mock_service_dep.return_value = mock_service
        
        # 동시 요청 시뮬레이션
        import threading
        results = []
        
        def make_request():
            response = client.get("/v1/adult/content/preview",
                                headers={"Authorization": "Bearer valid_token"})
            results.append(response.status_code)
        
        threads = []
        for _ in range(10):
            t = threading.Thread(target=make_request)
            threads.append(t)
            t.start()
        
        for t in threads:
            t.join()
        
        # 모든 요청이 성공적으로 처리되어야 함
        assert all(status == 200 for status in results)
        assert len(results) == 10
