"""Integration tests for feedback router - actual API call scenarios."""

import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, Mock, MagicMock
from app.main import app
from app.schemas import FeedbackResponse

@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c

class TestFeedbackRouterIntegration:
    """Integration tests for feedback router endpoints."""
    
    def test_emotion_based_feedback_valid_request(self, client):
        """Test emotion-based feedback endpoint with valid request."""
        payload = {
            "emotion_result_data": {
                "emotion": "HAPPY",
                "language": "KO",
                "score": 0.9,
                "text": "I'm feeling great!"
            },
            "user_segment": "Whale",
            "mission_type": "DAILY",
            "context_text": "User completed slot game"
        }
        
        with patch('app.routers.feedback.EmotionFeedbackService') as mock_service_class:
            mock_service = Mock()
            mock_service.get_emotion_feedback.return_value = FeedbackResponse(
                success=True,
                message="Test feedback message",
                recommendation="Test recommendation",
                reward_suggestion="+100 tokens"
            )
            mock_service_class.return_value = mock_service
            
            response = client.post("/api/feedback/emotion_based", json=payload)
            
            assert response.status_code == 200
            data = response.json()
            assert data["success"] is True
            assert data["message"] == "Test feedback message"
            assert data["recommendation"] == "Test recommendation"
            assert data["reward_suggestion"] == "+100 tokens"
    
    def test_emotion_based_feedback_service_unavailable(self, client):
        """Test emotion-based feedback when service is unavailable."""
        payload = {
            "emotion_result_data": {
                "emotion": "HAPPY",
                "language": "KO"
            }
        }
        
        with patch('app.routers.feedback.get_emotion_feedback_service', return_value=None):
            response = client.post("/api/feedback/emotion_based", json=payload)
            
            assert response.status_code == 503
            assert "Feedback service unavailable" in response.json()["detail"]
    
    def test_emotion_based_feedback_invalid_emotion_data(self, client):
        """Test emotion-based feedback with invalid emotion result data."""
        payload = {
            "emotion_result_data": {
                "emotion": "INVALID_EMOTION",
                "language": "INVALID_LANGUAGE"
            }
        }
        
        with patch('app.routers.feedback.EmotionFeedbackService') as mock_service_class:
            mock_service_class.return_value = Mock()
            
            response = client.post("/api/feedback/emotion_based", json=payload)
            
            assert response.status_code == 400
            assert "Invalid emotion_result_data" in response.json()["detail"]
    
    def test_emotion_based_feedback_service_exception(self, client):
        """Test emotion-based feedback when service raises exception."""
        payload = {
            "emotion_result_data": {
                "emotion": "HAPPY",
                "language": "KO"
            }
        }
        
        with patch('app.routers.feedback.EmotionFeedbackService') as mock_service_class:
            mock_service = Mock()
            mock_service.get_emotion_feedback.side_effect = Exception("Service error")
            mock_service_class.return_value = mock_service
            
            response = client.post("/api/feedback/emotion_based", json=payload)
            
            assert response.status_code == 500
            assert "Failed to generate feedback" in response.json()["detail"]
    
    def test_emotion_based_feedback_missing_required_fields(self, client):
        """Test emotion-based feedback with missing required fields."""
        payload = {}
        
        response = client.post("/api/feedback/emotion_based", json=payload)
        
        assert response.status_code == 422  # Validation error
    
    def test_emotion_based_feedback_no_feedback_generated(self, client):
        """Test emotion-based feedback when no feedback is generated."""
        payload = {
            "emotion_result_data": {
                "emotion": "HAPPY",
                "language": "KO"
            }
        }
        
        with patch('app.routers.feedback.EmotionFeedbackService') as mock_service_class:
            mock_service = Mock()
            mock_service.get_emotion_feedback.return_value = None
            mock_service_class.return_value = mock_service
            
            response = client.post("/api/feedback/emotion_based", json=payload)
            
            assert response.status_code == 200
            assert response.json() is None
    
    @patch('app.routers.feedback.get_current_user')
    def test_generate_feedback_valid_request(self, mock_get_user, client):
        """Test generate feedback endpoint with valid request."""
        mock_get_user.return_value = {"user_id": 1}
        
        payload = {
            "user_id": 1,
            "emotion": "happy",
            "segment": "Whale",
            "context": {"game": "slot"}
        }
        
        with patch('app.routers.feedback.EmotionFeedbackService') as mock_service_class:
            mock_service = Mock()
            mock_service.generate_feedback.return_value = {
                "message": "Great job!",
                "suggestions": ["Try roulette"]
            }
            mock_service_class.return_value = mock_service
            
            response = client.post("/api/feedback/generate", json=payload)
            
            assert response.status_code == 200
            data = response.json()
            assert data["success"] is True
            assert "data" in data
    
    @patch('app.routers.feedback.get_current_user')
    def test_generate_feedback_missing_required_fields(self, mock_get_user, client):
        """Test generate feedback with missing required fields."""
        mock_get_user.return_value = {"user_id": 1}
        
        payload = {
            "segment": "Medium"
            # Missing user_id and emotion
        }
        
        with patch('app.routers.feedback.EmotionFeedbackService') as mock_service_class:
            mock_service_class.return_value = Mock()
            
            response = client.post("/api/feedback/generate", json=payload)
            
            assert response.status_code == 400
            assert "Missing required fields" in response.json()["detail"]
    
    @patch('app.routers.feedback.get_current_user')
    def test_generate_feedback_unauthorized_user(self, mock_get_user, client):
        """Test generate feedback with unauthorized user."""
        mock_get_user.return_value = {"user_id": 2}  # Different user
        
        payload = {
            "user_id": 1,  # Requesting for different user
            "emotion": "happy"
        }
        
        with patch('app.routers.feedback.EmotionFeedbackService') as mock_service_class:
            mock_service_class.return_value = Mock()
            
            response = client.post("/api/feedback/generate", json=payload)
            
            assert response.status_code == 403
            assert "Not authorized" in response.json()["detail"]
    
    @patch('app.routers.feedback.get_current_user')
    def test_generate_feedback_service_exception(self, mock_get_user, client):
        """Test generate feedback when service raises exception."""
        mock_get_user.return_value = {"user_id": 1}
        
        payload = {
            "user_id": 1,
            "emotion": "happy"
        }
        
        with patch('app.routers.feedback.EmotionFeedbackService') as mock_service_class:
            mock_service = Mock()
            mock_service.generate_feedback.side_effect = Exception("Service error")
            mock_service_class.return_value = mock_service
            
            response = client.post("/api/feedback/generate", json=payload)
            
            assert response.status_code == 200  # Returns error in response body
            data = response.json()
            assert data["success"] is False
            assert "Failed to generate feedback" in data["error"]
    
    @patch('app.routers.feedback.get_current_user')
    def test_generate_feedback_default_values(self, mock_get_user, client):
        """Test generate feedback with default values."""
        mock_get_user.return_value = {"user_id": 1}
        
        payload = {
            "user_id": 1,
            "emotion": "happy"
            # segment and context will use defaults
        }
        
        with patch('app.routers.feedback.EmotionFeedbackService') as mock_service_class:
            mock_service = Mock()
            mock_service.generate_feedback.return_value = {"message": "Default feedback"}
            mock_service_class.return_value = mock_service
            
            response = client.post("/api/feedback/generate", json=payload)
            
            assert response.status_code == 200
            # Verify defaults were used
            mock_service.generate_feedback.assert_called_with("happy", "Medium", {})
    
    def test_feedback_router_openapi_documentation(self, client):
        """Test that feedback endpoints are documented in OpenAPI."""
        response = client.get("/openapi.json")
        
        assert response.status_code == 200
        openapi_spec = response.json()
        
        # Check that feedback endpoints are documented
        paths = openapi_spec["paths"]
        assert "/api/feedback/emotion_based" in paths
        assert "/api/feedback/generate" in paths
        
        # Check HTTP methods
        assert "post" in paths["/api/feedback/emotion_based"]
        assert "post" in paths["/api/feedback/generate"]
    
    def test_feedback_router_tags(self, client):
        """Test that feedback endpoints have correct tags."""
        response = client.get("/openapi.json")
        openapi_spec = response.json()
        
        emotion_based_spec = openapi_spec["paths"]["/api/feedback/emotion_based"]["post"]
        generate_spec = openapi_spec["paths"]["/api/feedback/generate"]["post"]
        
        assert "Feedback" in emotion_based_spec["tags"]
        assert "Feedback" in generate_spec["tags"]
    
    def test_multiple_concurrent_requests(self, client):
        """Test handling multiple concurrent requests."""
        import concurrent.futures
        import threading
        
        def make_request():
            payload = {
                "emotion_result_data": {
                    "emotion": "HAPPY",
                    "language": "KO"
                }
            }
            
            with patch('app.routers.feedback.EmotionFeedbackService') as mock_service_class:
                mock_service = Mock()
                mock_service.get_emotion_feedback.return_value = FeedbackResponse(
                    success=True,
                    message="Concurrent test",
                    recommendation="Test"
                )
                mock_service_class.return_value = mock_service
                
                return client.post("/api/feedback/emotion_based", json=payload)
        
        # Send multiple concurrent requests
        with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
            futures = [executor.submit(make_request) for _ in range(10)]
            responses = [future.result() for future in futures]
        
        # All requests should succeed
        for response in responses:
            assert response.status_code == 200
