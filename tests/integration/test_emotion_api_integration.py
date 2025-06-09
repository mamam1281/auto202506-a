"""
Emotion Analysis API Integration Tests
End-to-end tests for the complete emotion analysis system
"""

import pytest
import asyncio
import json
import time
from fastapi.testclient import TestClient
from unittest.mock import patch, Mock

@pytest.fixture
def client():
    """FastAPI test client"""
    from app.main import app
    return TestClient(app)

@pytest.fixture
def auth_headers():
    """Authentication headers for API requests"""
    return {"Authorization": "Bearer test_jwt_token"}

class TestEmotionAPIIntegration:
    """Full integration tests for emotion analysis APIs"""
    
    def test_complete_emotion_analysis_flow(self, client, auth_headers):
        """Test complete emotion analysis flow from API to database"""
        # Given: User message with context
        payload = {
            "user_id": 1,
            "text": "슬롯에서 대박났어! 정말 기뻐요!",
            "context": {
                "recent_games": ["slot"],
                "win_streak": 3,
                "session_duration": 1800
            }
        }
        
        with patch('app.routers.ai.get_current_user') as mock_auth:
            mock_auth.return_value = {"user_id": 1, "nickname": "test_user"}
            
            # When: POST to /ai/analyze
            response = client.post("/ai/analyze", json=payload, headers=auth_headers)
            
            # Then: Success response with emotion data
            assert response.status_code == 200
            data = response.json()
            
            assert data["success"] == True
            assert data["data"]["emotion"] in ["excited", "happy", "positive"]
            assert data["data"]["confidence"] >= 0.7
            assert data["data"]["language"] == "korean"
            assert data["data"]["context_aware"] == True
    
    def test_recommendation_based_on_emotion(self, client, auth_headers):
        """Test that recommendations are generated based on emotion analysis"""
        with patch('app.routers.recommendation.get_current_user') as mock_auth:
            mock_auth.return_value = {"user_id": 1}
            
            # Given: User with recent emotion analysis
            with patch('app.services.recommendation_service.get_user_emotion_history') as mock_history:
                mock_history.return_value = [
                    {"emotion": "excited", "confidence": 0.9, "timestamp": "2025-01-01T10:00:00"}
                ]
                
                # When: Request personalized recommendations
                response = client.get("/recommend/personalized?user_id=1", headers=auth_headers)
                
                # Then: Recommendations reflect emotional state
                assert response.status_code == 200
                data = response.json()
                
                assert data["success"] == True
                assert len(data["data"]["recommendations"]) > 0
                
                recommendation = data["data"]["recommendations"][0]
                assert "game_type" in recommendation
                assert "confidence" in recommendation
                assert "reason" in recommendation
                assert "excited" in recommendation["reason"].lower()
    
    def test_feedback_generation_pipeline(self, client, auth_headers):
        """Test feedback generation based on emotion and context"""
        # Given: Emotion analysis result
        payload = {
            "user_id": 1,
            "emotion": "frustrated",
            "segment": "Medium",
            "context": {
                "game_type": "slot",
                "result": "loss",
                "consecutive_losses": 3
            }
        }
        
        with patch('app.routers.feedback.get_current_user') as mock_auth:
            mock_auth.return_value = {"user_id": 1}
            
            # When: Generate feedback
            response = client.post("/feedback/generate", json=payload, headers=auth_headers)
            
            # Then: Appropriate feedback generated
            assert response.status_code == 200
            data = response.json()
            
            assert data["success"] == True
            assert "feedback" in data["data"]
            assert "template_id" in data["data"]
            assert len(data["data"]["feedback"]) > 0
            
            # Feedback should be encouraging for frustrated user
            feedback_text = data["data"]["feedback"].lower()
            encouraging_words = ["힘내", "괜찮", "다음", "기회", "better", "next"]
            assert any(word in feedback_text for word in encouraging_words)

class TestConcurrentEmotionAnalysis:
    """Test system behavior under concurrent load"""
    
    @pytest.mark.asyncio
    async def test_concurrent_emotion_requests(self, client, auth_headers):
        """Test multiple concurrent emotion analysis requests"""
        # Given: Multiple users sending emotion analysis requests
        payloads = [
            {
                "user_id": i,
                "text": f"Test message {i}",
                "context": {"test": True}
            }
            for i in range(1, 11)  # 10 concurrent requests
        ]
        
        with patch('app.routers.ai.get_current_user') as mock_auth:
            mock_auth.return_value = {"user_id": 1}
            
            # When: Send concurrent requests
            start_time = time.time()
            
            async def make_request(payload):
                return client.post("/ai/analyze", json=payload, headers=auth_headers)
            
            tasks = [make_request(payload) for payload in payloads]
            responses = await asyncio.gather(*tasks, return_exceptions=True)
            
            end_time = time.time()
            
            # Then: All requests processed successfully
            successful_responses = [r for r in responses if hasattr(r, 'status_code') and r.status_code == 200]
            assert len(successful_responses) >= 8  # Allow for some failures in concurrent testing
            
            # Response time reasonable for concurrent requests
            avg_time = (end_time - start_time) / len(payloads)
            assert avg_time < 2.0  # Average less than 2 seconds per request

class TestErrorHandlingIntegration:
    """Test error handling across the emotion analysis system"""
    
    def test_invalid_emotion_analysis_request(self, client, auth_headers):
        """Test handling of invalid emotion analysis requests"""
        # Given: Invalid request payload
        invalid_payloads = [
            {},  # Empty payload
            {"user_id": "invalid"},  # Invalid user_id type
            {"user_id": 1},  # Missing required text field
            {"user_id": 1, "text": ""},  # Empty text
            {"user_id": 1, "text": "x" * 10000}  # Text too long
        ]
        
        with patch('app.routers.ai.get_current_user') as mock_auth:
            mock_auth.return_value = {"user_id": 1}
            
            for payload in invalid_payloads:
                # When: Send invalid request
                response = client.post("/ai/analyze", json=payload, headers=auth_headers)
                
                # Then: Appropriate error response
                assert response.status_code in [400, 422]  # Bad Request or Validation Error
                
                if response.status_code == 400:
                    data = response.json()
                    assert data["success"] == False
                    assert "message" in data
    
    def test_llm_fallback_error_handling(self, client, auth_headers):
        """Test error handling when LLM fallback fails"""
        payload = {
            "user_id": 1,
            "text": "Ambiguous text that needs LLM fallback",
            "context": {}
        }
        
        with patch('app.routers.ai.get_current_user') as mock_auth:
            mock_auth.return_value = {"user_id": 1}
            
            # Mock LLM fallback failure
            with patch('app.utils.sentiment_analyzer.call_llm_fallback') as mock_llm:
                mock_llm.side_effect = Exception("LLM service unavailable")
                
                # When: LLM fallback fails
                response = client.post("/ai/analyze", json=payload, headers=auth_headers)
                
                # Then: Graceful degradation
                assert response.status_code == 200  # Should still return response
                data = response.json()
                
                # Should fall back to local model result even with low confidence
                assert data["success"] == True
                assert "emotion" in data["data"]
                assert data["data"]["confidence"] < 0.7  # Low confidence indication

class TestDataConsistencyIntegration:
    """Test data consistency across the emotion analysis system"""
    
    def test_emotion_log_database_consistency(self, client, auth_headers):
        """Test that emotion analysis results are consistently logged"""
        payload = {
            "user_id": 1,
            "text": "Test emotion logging",
            "context": {"test": "database_consistency"}
        }
        
        with patch('app.routers.ai.get_current_user') as mock_auth:
            mock_auth.return_value = {"user_id": 1}
            
            with patch('app.database.session') as mock_session:
                # When: Emotion analysis performed
                response = client.post("/ai/analyze", json=payload, headers=auth_headers)
                
                # Then: Result logged to database
                assert response.status_code == 200
                
                # Verify database interaction
                mock_session.add.assert_called()
                mock_session.commit.assert_called()
    
    def test_redis_cache_consistency(self, client, auth_headers):
        """Test Redis cache consistency for emotion analysis"""
        payload = {
            "user_id": 1,
            "text": "Test Redis caching",
            "context": {}
        }
        
        with patch('app.routers.ai.get_current_user') as mock_auth:
            mock_auth.return_value = {"user_id": 1}
            
            with patch('app.services.cj_ai_service.redis_client') as mock_redis:
                # When: Multiple requests for same analysis
                response1 = client.post("/ai/analyze", json=payload, headers=auth_headers)
                response2 = client.post("/ai/analyze", json=payload, headers=auth_headers)
                
                # Then: Redis operations performed
                assert response1.status_code == 200
                assert response2.status_code == 200
                
                # Verify caching behavior
                assert mock_redis.set.call_count >= 1
                assert mock_redis.get.call_count >= 1

if __name__ == "__main__":
    pytest.main([
        "test_emotion_api_integration.py",
        "-v",
        "--tb=short"
    ])
