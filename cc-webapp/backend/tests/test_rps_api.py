import unittest
from unittest.mock import Mock, patch
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.main import app
from app.services.rps_service import RPSResult


class TestRPSAPI(unittest.TestCase):
    """RPS API 엔드포인트 테스트."""
    
    def setUp(self):
        """각 테스트 전에 실행되는 설정."""
        self.client = TestClient(app)
        
    @patch('app.auth.jwt.get_current_user')
    @patch('app.routers.games.get_game_service')
    @patch('app.database.get_db')
    def test_rps_play_success(self, mock_get_db, mock_get_game_service, mock_get_current_user):
        """정상적인 RPS API 호출 테스트."""
        # Mock setup
        mock_db = Mock(spec=Session)
        mock_get_db.return_value = mock_db
        
        mock_user = {"user_id": 1}
        mock_get_current_user.return_value = mock_user
        
        mock_game_service = Mock()
        mock_result = RPSResult(
            user_choice="rock",
            computer_choice="scissors", 
            result="win",
            tokens_change=10,
            balance=110
        )
        mock_game_service.rps_play.return_value = mock_result
        mock_get_game_service.return_value = mock_game_service
        
        # API 호출
        response = self.client.post(
            "/api/games/rps/play",
            json={"choice": "rock", "bet_amount": 10}
        )
        
        # 응답 검증
        assert response.status_code == 200
        data = response.json()
        assert data["user_choice"] == "rock"
        assert data["computer_choice"] == "scissors"
        assert data["result"] == "win"
        assert data["tokens_change"] == 10
        assert data["balance"] == 110
        
        # 서비스 호출 검증
        mock_game_service.rps_play.assert_called_once_with(1, "rock", 10, mock_db)
        
    @patch('app.auth.jwt.get_current_user')
    @patch('app.routers.games.get_game_service') 
    @patch('app.database.get_db')
    def test_rps_play_invalid_choice(self, mock_get_db, mock_get_game_service, mock_get_current_user):
        """잘못된 선택으로 RPS API 호출 테스트."""
        # Mock setup
        mock_db = Mock(spec=Session)
        mock_get_db.return_value = mock_db
        
        mock_user = {"user_id": 1}
        mock_get_current_user.return_value = mock_user
        
        mock_game_service = Mock()
        mock_game_service.rps_play.side_effect = ValueError("올바르지 않은 선택입니다")
        mock_get_game_service.return_value = mock_game_service
        
        # API 호출
        response = self.client.post(
            "/api/games/rps/play",
            json={"choice": "invalid", "bet_amount": 10}
        )
        
        # 응답 검증
        assert response.status_code == 400
        data = response.json()
        assert "올바르지 않은 선택입니다" in data["detail"]
        
    @patch('app.auth.jwt.get_current_user')
    @patch('app.routers.games.get_game_service')
    @patch('app.database.get_db')
    def test_rps_play_insufficient_tokens(self, mock_get_db, mock_get_game_service, mock_get_current_user):
        """토큰 부족으로 RPS API 호출 테스트."""
        # Mock setup
        mock_db = Mock(spec=Session)
        mock_get_db.return_value = mock_db
        
        mock_user = {"user_id": 1}
        mock_get_current_user.return_value = mock_user
        
        mock_game_service = Mock()
        mock_game_service.rps_play.side_effect = ValueError("토큰이 부족합니다")
        mock_get_game_service.return_value = mock_game_service
        
        # API 호출
        response = self.client.post(
            "/api/games/rps/play",
            json={"choice": "rock", "bet_amount": 100}
        )
        
        # 응답 검증
        assert response.status_code == 400
        data = response.json()
        assert "토큰이 부족합니다" in data["detail"]


if __name__ == '__main__':
    unittest.main()
