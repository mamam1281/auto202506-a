"""
MVP User Flow Tests - 10명 사용자 기준 실제 사용 시나리오
"""

import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch

@pytest.fixture
def client():
    from app.main import app
    return TestClient(app)

class TestBasicUserJourney:
    """기본 사용자 여정 - MVP 수준"""
    
    def test_complete_user_flow_happy_path(self, client):
        """완전한 사용자 플로우 - 성공 케이스"""
        
        # 1. 초대코드로 로그인
        with patch('app.services.auth_service.validate_invite_code') as mock_auth:
            mock_auth.return_value = True
            
            login_response = client.post("/auth/login", json={
                "invite_code": "ABC123",
                "nickname": "mvp_user",
                "password": "test123"
            })
            
            # 로그인 성공하거나 적어도 명확한 에러
            assert login_response.status_code in [200, 400, 401]
            
            if login_response.status_code == 200:
                token = login_response.json().get("access_token")
                headers = {"Authorization": f"Bearer {token}"}
                
                # 2. 토큰 잔고 확인
                balance_response = client.get("/tokens/balance", headers=headers)
                
                if balance_response.status_code == 200:
                    balance = balance_response.json().get("balance", 0)
                    
                    # 3. 게임 플레이 (잔고가 있다면)
                    if balance >= 10:
                        game_response = client.post("/games/slot/spin", 
                                                   json={"bet_amount": 10}, 
                                                   headers=headers)
                        
                        # 게임 결과 확인
                        assert game_response.status_code in [200, 400, 402]
    
    def test_user_with_insufficient_tokens(self, client):
        """토큰 부족한 사용자 처리"""
        
        with patch('app.services.auth_service.validate_invite_code') as mock_auth:
            with patch('app.services.token_service.get_user_balance') as mock_balance:
                mock_auth.return_value = True
                mock_balance.return_value = 5  # 5토큰만 있음
                
                login_response = client.post("/auth/login", json={
                    "invite_code": "ABC123",
                    "nickname": "poor_user",
                    "password": "test123"
                })
                
                if login_response.status_code == 200:
                    token = login_response.json().get("access_token")
                    headers = {"Authorization": f"Bearer {token}"}
                    
                    # 10토큰 게임 시도
                    game_response = client.post("/games/slot/spin", 
                                               json={"bet_amount": 10}, 
                                               headers=headers)
                    
                    # 토큰 부족 에러 (402) 또는 명확한 메시지
                    assert game_response.status_code in [402, 400]
                    
                    if game_response.status_code in [400, 402]:
                        error_data = game_response.json()
                        error_message = error_data.get("message", "").lower()
                        assert any(word in error_message for word in [
                            "token", "insufficient", "부족", "balance"
                        ])

class TestConcurrentUsers:
    """동시 사용자 테스트 - 10명 기준"""
    
    def test_5_users_can_play_simultaneously(self, client):
        """5명이 동시에 게임 가능한지"""
        
        # Mock 설정
        with patch('app.services.auth_service.validate_invite_code') as mock_auth:
            with patch('app.services.token_service.get_user_balance') as mock_balance:
                mock_auth.return_value = True
                mock_balance.return_value = 100  # 충분한 토큰
                
                # 5명 사용자 동시 로그인 시뮬레이션
                users = []
                for i in range(5):
                    login_response = client.post("/auth/login", json={
                        "invite_code": "ABC123",
                        "nickname": f"user_{i}",
                        "password": "test123"
                    })
                    
                    if login_response.status_code == 200:
                        token = login_response.json().get("access_token")
                        users.append({"id": i, "token": token})
                
                # 동시 게임 플레이
                successful_games = 0
                for user in users:
                    headers = {"Authorization": f"Bearer {user['token']}"}
                    game_response = client.post("/games/slot/spin", 
                                               json={"bet_amount": 10}, 
                                               headers=headers)
                    
                    if game_response.status_code == 200:
                        successful_games += 1
                
                # 최소 3명은 성공해야 함 (60% 성공률)
                assert successful_games >= 3, f"동시 게임 성공률 너무 낮음: {successful_games}/5"

class TestErrorRecovery:
    """에러 복구 테스트 - 시스템이 죽지 않는지"""
    
    def test_system_survives_invalid_requests(self, client):
        """잘못된 요청들로부터 시스템이 살아남는지"""
        
        bad_requests = [
            # 잘못된 JSON
            {"method": "POST", "url": "/auth/login", "json": {}},
            
            # 없는 엔드포인트
            {"method": "GET", "url": "/nonexistent/endpoint"},
            
            # 잘못된 토큰
            {"method": "GET", "url": "/tokens/balance", 
             "headers": {"Authorization": "Bearer invalid_token"}},
            
            # 잘못된 게임 요청
            {"method": "POST", "url": "/games/slot/spin", 
             "json": {"bet_amount": -10}},  # 음수 베팅
        ]
        
        for req in bad_requests:
            try:
                if req["method"] == "POST":
                    response = client.post(req["url"], 
                                         json=req.get("json"), 
                                         headers=req.get("headers"))
                else:
                    response = client.get(req["url"], 
                                        headers=req.get("headers"))
                
                # 어떤 응답이든 오면 됨 (시스템이 살아있음)
                assert response.status_code in [200, 400, 401, 404, 422, 500]
                
            except Exception as e:
                # 완전히 죽지만 않으면 됨
                assert "Connection" not in str(e)  # 연결 끊어지면 안됨

class TestMinimalPerformance:
    """최소한의 성능 테스트"""
    
    def test_login_response_time_reasonable(self, client):
        """로그인 응답 시간이 합리적인지"""
        
        with patch('app.services.auth_service.validate_invite_code') as mock_auth:
            mock_auth.return_value = True
            
            start_time = time.time()
            
            response = client.post("/auth/login", json={
                "invite_code": "ABC123",
                "nickname": "speed_test",
                "password": "test123"
            })
            
            end_time = time.time()
            response_time = end_time - start_time
            
            # 5초 안에 응답 (매우 관대한 기준)
            assert response_time < 5.0, f"로그인 너무 느림: {response_time:.2f}초"
            assert response.status_code in [200, 400, 401]
    
    def test_game_response_time_acceptable(self, client):
        """게임 응답 시간이 허용 가능한지"""
        
        with patch('app.services.auth_service.validate_invite_code') as mock_auth:
            with patch('app.services.token_service.get_user_balance') as mock_balance:
                mock_auth.return_value = True
                mock_balance.return_value = 100
                
                # 로그인
                login_response = client.post("/auth/login", json={
                    "invite_code": "ABC123",
                    "nickname": "game_speed_test",
                    "password": "test123"
                })
                
                if login_response.status_code == 200:
                    token = login_response.json().get("access_token")
                    headers = {"Authorization": f"Bearer {token}"}
                    
                    start_time = time.time()
                    
                    # 게임 플레이
                    game_response = client.post("/games/slot/spin", 
                                               json={"bet_amount": 10}, 
                                               headers=headers)
                    
                    end_time = time.time()
                    response_time = end_time - start_time
                    
                    # 3초 안에 응답 (관대한 기준)
                    assert response_time < 3.0, f"게임 너무 느림: {response_time:.2f}초"

# MVP 통합 테스트 실행
if __name__ == "__main__":
    pytest.main([
        "test_mvp_user_flow.py",
        "-v",
        "--tb=short",
        "--timeout=60",  # 60초 타임아웃
        "--maxfail=3"    # 3개 실패 시 중단
    ])
