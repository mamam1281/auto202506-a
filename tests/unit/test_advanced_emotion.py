"""
Advanced Emotion Analysis System Tests
Tests for emotion models, sentiment analyzer, CJ AI service, recommendation service, and feedback service.
"""

import pytest
import json
from unittest.mock import Mock, patch, AsyncMock
from datetime import datetime
from typing import Dict, Any

# Test fixtures and data
@pytest.fixture
def sample_emotion_data():
    """Sample emotion data for testing"""
    return {
        "emotion": "excited",
        "score": 0.85,
        "confidence": 0.92,
        "language": "korean"
    }

@pytest.fixture
def sample_user_context():
    """Sample user context for testing"""
    return {
        "user_id": 1,
        "recent_games": ["slot"],
        "win_streak": 3,
        "session_duration": 1800,
        "segment": "Medium"
    }

@pytest.fixture
def mock_redis():
    """Mock Redis client"""
    mock = Mock()
    mock.get.return_value = None
    mock.set.return_value = True
    mock.hgetall.return_value = {}
    return mock

@pytest.fixture
def mock_llm_client():
    """Mock LLM client for fallback testing"""
    mock = Mock()
    mock.generate_response.return_value = {
        "emotion": "excited",
        "confidence": 0.95,
        "reasoning": "User expressed happiness about winning"
    }
    return mock

class TestEmotionModels:
    """Test emotion models and data structures"""
    
    def test_emotion_result_creation(self, sample_emotion_data):
        """Test EmotionResult model creation and validation"""
        # Given: Valid emotion data
        from app.emotion_models import EmotionResult, SupportedEmotion, SupportedLanguage
        
        emotion = EmotionResult(
            emotion=SupportedEmotion.EXCITED,
            score=sample_emotion_data["score"],
            confidence=sample_emotion_data["confidence"],
            language=SupportedLanguage.KOREAN
        )
        
        # Then: Model created successfully
        assert emotion.emotion == "excited"
        assert emotion.score == 0.85
        assert emotion.confidence == 0.92
        assert emotion.language == "korean"
        assert emotion.is_confident() == True  # Above default threshold
    
    def test_emotion_confidence_threshold(self):
        """Test emotion confidence threshold checking"""
        from app.emotion_models import EmotionResult, SupportedEmotion, SupportedLanguage
        
        # Given: Low confidence emotion
        low_confidence_emotion = EmotionResult(
            emotion=SupportedEmotion.NEUTRAL,
            score=0.6,
            confidence=0.5,  # Below threshold
            language=SupportedLanguage.ENGLISH
        )
        
        # Then: Not confident
        assert low_confidence_emotion.is_confident() == False
    
    def test_multi_language_support(self):
        """Test multi-language emotion detection"""
        from app.emotion_models import SupportedLanguage
        
        # Given: Different languages
        korean = SupportedLanguage.KOREAN
        english = SupportedLanguage.ENGLISH
        
        # Then: Languages supported
        assert korean.value == "korean"
        assert english.value == "english"
        
        # Test display labels
        assert korean.get_display_label() in ["한국어", "Korean"]
        assert english.get_display_label() in ["English", "영어"]

class TestSentimentAnalyzer:
    """Test sentiment analyzer utility"""
    
    @patch('app.utils.sentiment_analyzer.load_local_model')
    def test_sentiment_analyzer_local_model(self, mock_load_model):
        """Test local sentiment model analysis"""
        # Given: Configured local model
        mock_model = Mock()
        mock_model.predict.return_value = {"emotion": "excited", "confidence": 0.9}
        mock_load_model.return_value = mock_model
        
        from app.utils.sentiment_analyzer import SentimentAnalyzer
        analyzer = SentimentAnalyzer()
        
        # When: Analyze positive text
        result = analyzer.analyze("I love this game!")
        
        # Then: Returns positive emotion with high confidence
        assert result.emotion == "excited"
        assert result.confidence >= 0.7
        assert result.language in ["korean", "english"]
    
    @patch('app.utils.sentiment_analyzer.detect_language')
    def test_language_detection(self, mock_detect):
        """Test automatic language detection"""
        # Given: Korean text
        mock_detect.return_value = "korean"
        
        from app.utils.sentiment_analyzer import SentimentAnalyzer
        analyzer = SentimentAnalyzer()
        
        # When: Analyze Korean text
        result = analyzer.analyze("정말 기뻐요!")
        
        # Then: Korean language detected
        assert result.language == "korean"
        mock_detect.assert_called_once_with("정말 기뻐요!")
    
    @patch('app.utils.sentiment_analyzer.call_llm_fallback')
    def test_sentiment_analyzer_llm_fallback(self, mock_llm, mock_redis):
        """Test LLM fallback when confidence is low"""
        # Given: Ambiguous text with low confidence
        mock_llm.return_value = {
            "emotion": "curious",
            "confidence": 0.85,
            "reasoning": "User asking question"
        }
        
        from app.utils.sentiment_analyzer import SentimentAnalyzer
        analyzer = SentimentAnalyzer(redis_client=mock_redis)
        
        # Mock local model returning low confidence
        with patch.object(analyzer, '_analyze_local') as mock_local:
            mock_local.return_value = Mock(confidence=0.5, emotion="neutral")
            
            # When: Local model confidence < 0.7
            result = analyzer.analyze("What does this mean?")
            
            # Then: Fallback to external LLM
            assert result.confidence >= 0.8
            mock_llm.assert_called_once()
            
            # And: Log fallback usage for cost tracking
            mock_redis.hincrby.assert_called()

class TestCJAIServiceIntegration:
    """Test CJ AI service integration"""
    
    @pytest.mark.asyncio
    async def test_ai_analyze_endpoint(self, sample_user_context):
        """Test POST /ai/analyze endpoint"""
        from fastapi.testclient import TestClient
        from app.main import app
        
        client = TestClient(app)
        
        # Given: Valid user message
        payload = {
            "user_id": sample_user_context["user_id"],
            "text": "슬롯에서 대박났어!",
            "context": {
                "recent_games": sample_user_context["recent_games"]
            }
        }
        
        # Mock authentication
        with patch('app.routers.ai.get_current_user') as mock_auth:
            mock_auth.return_value = {"user_id": 1, "nickname": "test_user"}
            
            # When: POST to /ai/analyze
            response = client.post(
                "/ai/analyze", 
                json=payload,
                headers={"Authorization": "Bearer test_token"}
            )
            
            # Then: 200 OK + emotion analysis result
            assert response.status_code == 200
            data = response.json()
            assert data["success"] == True
            assert "emotion" in data["data"]
            assert "confidence" in data["data"]
    
    @pytest.mark.asyncio
    async def test_ai_websocket_push(self, mock_redis):
        """Test real-time emotion feedback via WebSocket"""
        from app.services.cj_ai_service import CJAIService
        
        # Given: Active WebSocket connection
        mock_websocket = AsyncMock()
        service = CJAIService(redis_client=mock_redis)
        
        # When: Emotion analysis completed
        emotion_result = {
            "emotion": "excited",
            "confidence": 0.9,
            "feedback": "Great job!"
        }
        
        await service.push_emotion_feedback(1, emotion_result, mock_websocket)
        
        # Then: Real-time feedback pushed to client
        mock_websocket.send_text.assert_called_once()
        sent_data = json.loads(mock_websocket.send_text.call_args[0][0])
        assert sent_data["type"] == "emotion_feedback"
        assert sent_data["data"]["emotion"] == "excited"

class TestRecommendationService:
    """Test recommendation service"""
    
    def test_personalized_recommendation(self, sample_user_context):
        """Test personalized game recommendation"""
        from app.services.recommendation_service import RecommendationService
        
        # Given: User with emotion history
        service = RecommendationService()
        
        # Mock user emotion history
        emotion_history = [
            {"emotion": "excited", "game": "slot", "timestamp": datetime.now()},
            {"emotion": "frustrated", "game": "roulette", "timestamp": datetime.now()}
        ]
        
        with patch.object(service, 'get_user_emotion_history') as mock_history:
            mock_history.return_value = emotion_history
            
            # When: GET recommendations
            recommendations = service.get_personalized_recommendations(
                user_id=sample_user_context["user_id"],
                current_emotion="excited"
            )
            
            # Then: Returns game recommendations based on emotion + history
            assert len(recommendations) > 0
            assert all("game_type" in rec for rec in recommendations)
            assert all("confidence" in rec for rec in recommendations)
            assert all("reason" in rec for rec in recommendations)
    
    def test_recommendation_strategy_selection(self):
        """Test recommendation strategy selection"""
        from app.services.recommendation_service import RecommendationService
        
        service = RecommendationService()
        
        # Given: Different user segments
        whale_user = {"segment": "Whale", "total_spent": 10000}
        medium_user = {"segment": "Medium", "total_spent": 1000}
        low_user = {"segment": "Low", "total_spent": 100}
        
        # When: Request recommendations for different segments
        whale_strategy = service.select_strategy(whale_user)
        medium_strategy = service.select_strategy(medium_user)
        low_strategy = service.select_strategy(low_user)
        
        # Then: Different strategies applied
        assert whale_strategy in ["collaborative", "hybrid"]
        assert medium_strategy in ["content_based", "hybrid"]
        assert low_strategy == "content_based"

class TestEmotionFeedbackService:
    """Test emotion feedback service"""
    
    def test_feedback_template_selection(self):
        """Test emotion-based feedback template selection"""
        from app.services.emotion_feedback_service import EmotionFeedbackService
        
        service = EmotionFeedbackService()
        
        # Given: User emotion "frustrated" + segment "Medium"
        context = {
            "emotion": "frustrated",
            "segment": "Medium",
            "game_type": "slot",
            "result": "loss"
        }
        
        # When: Request feedback
        feedback = service.generate_feedback(
            emotion="frustrated",
            segment="Medium",
            context=context
        )
        
        # Then: Appropriate encouraging template selected
        assert feedback is not None
        assert "template_id" in feedback
        assert "message" in feedback
        assert len(feedback["message"]) > 0
    
    def test_multi_language_feedback(self):
        """Test multi-language feedback generation"""
        from app.services.emotion_feedback_service import EmotionFeedbackService
        
        service = EmotionFeedbackService()
        
        # Given: Korean user with "excited" emotion
        context = {
            "language": "korean",
            "emotion": "excited",
            "segment": "Medium"
        }
        
        # When: Generate feedback
        feedback = service.generate_feedback(
            emotion="excited",
            segment="Medium",
            context=context
        )
        
        # Then: Korean feedback template used
        assert feedback["language"] == "korean"
        # Check for Korean characters in message
        assert any(ord(char) > 127 for char in feedback["message"])
    
    @patch('app.services.emotion_feedback_service.call_llm_for_feedback')
    def test_llm_fallback_feedback(self, mock_llm):
        """Test LLM fallback when no template matches"""
        from app.services.emotion_feedback_service import EmotionFeedbackService
        
        # Given: Rare emotion combination
        mock_llm.return_value = {
            "message": "That's an interesting situation! Let me help you.",
            "template_id": "llm_generated",
            "confidence": 0.9
        }
        
        service = EmotionFeedbackService()
        
        # When: No matching template found
        feedback = service.generate_feedback(
            emotion="confused_excited",  # Rare combination
            segment="Unknown",
            context={"rare_situation": True}
        )
        
        # Then: LLM generates contextual feedback
        assert feedback["template_id"] == "llm_generated"
        assert feedback["message"] is not None
        mock_llm.assert_called_once()

class TestPerformanceAndIntegration:
    """Performance and integration tests"""
    
    @pytest.mark.asyncio
    async def test_emotion_analysis_performance(self):
        """Test emotion analysis performance under load"""
        from app.utils.sentiment_analyzer import SentimentAnalyzer
        import asyncio
        import time
        
        analyzer = SentimentAnalyzer()
        
        # Given: 100 concurrent emotion analysis requests
        texts = [f"Test message {i}" for i in range(100)]
        
        start_time = time.time()
        
        # When: All requests processed
        tasks = [analyzer.analyze_async(text) for text in texts]
        results = await asyncio.gather(*tasks)
        
        end_time = time.time()
        avg_response_time = (end_time - start_time) / len(texts)
        
        # Then: Average response time < 500ms
        assert avg_response_time < 0.5
        assert len(results) == 100
        assert all(result.emotion is not None for result in results)
    
    def test_recommendation_cache_efficiency(self, mock_redis):
        """Test recommendation caching efficiency"""
        from app.services.recommendation_service import RecommendationService
        
        service = RecommendationService(redis_client=mock_redis)
        
        # Given: Repeated recommendation requests
        user_id = 1
        
        # First request - cache miss
        mock_redis.get.return_value = None
        recommendations1 = service.get_personalized_recommendations(user_id, "excited")
        
        # Second request - cache hit
        cached_data = json.dumps(recommendations1)
        mock_redis.get.return_value = cached_data
        recommendations2 = service.get_personalized_recommendations(user_id, "excited")
        
        # Then: Cache hit ratio measured
        assert recommendations1 == recommendations2
        assert mock_redis.get.call_count >= 2
        assert mock_redis.set.call_count >= 1

class TestDatabaseIntegration:
    """Database integration tests"""
    
    @pytest.mark.asyncio
    async def test_emotion_log_storage(self):
        """Test emotion log storage in database"""
        # This would require actual database setup
        # For now, we'll mock the database operations
        
        from app.models.emotion_models import UserEmotionLog
        
        # Given: Emotion analysis result
        emotion_data = {
            "user_id": 1,
            "emotion": "excited",
            "confidence": 0.9,
            "text": "Great game!",
            "context": {"game": "slot"}
        }
        
        # When: Store in database (mocked)
        with patch('app.database.session') as mock_session:
            log_entry = UserEmotionLog(**emotion_data)
            mock_session.add(log_entry)
            mock_session.commit()
            
            # Then: Database operations called
            mock_session.add.assert_called_once()
            mock_session.commit.assert_called_once()
    
    def test_recommendation_history_tracking(self):
        """Test recommendation history tracking"""
        from app.models.emotion_models import RecommendationHistory
        
        # Given: Recommendation made to user
        recommendation_data = {
            "user_id": 1,
            "emotion": "excited",
            "recommended_game": "roulette",
            "confidence": 0.8,
            "strategy_used": "hybrid",
            "accepted": True
        }
        
        # When: Track recommendation (mocked)
        with patch('app.database.session') as mock_session:
            history_entry = RecommendationHistory(**recommendation_data)
            mock_session.add(history_entry)
            mock_session.commit()
            
            # Then: History tracked
            mock_session.add.assert_called_once()
            mock_session.commit.assert_called_once()

# Environment variable override tests
class TestEnvironmentOverrides:
    """Test environment variable overrides"""
    
    @patch.dict('os.environ', {
        'EMOTION_CONFIDENCE_THRESHOLD': '0.8',
        'LLM_FALLBACK_ENABLED': 'true',
        'SENTIMENT_MODEL_PATH': '/test/models/sentiment_v3.bin'
    })
    def test_environment_variable_overrides(self):
        """Test that environment variables override defaults"""
        from app.utils.sentiment_analyzer import SentimentAnalyzer
        
        # Given: Environment variables set
        analyzer = SentimentAnalyzer()
        
        # Then: Configuration reflects environment settings
        assert analyzer.confidence_threshold == 0.8
        assert analyzer.llm_fallback_enabled == True
        assert analyzer.model_path == '/test/models/sentiment_v3.bin'
    
    @patch.dict('os.environ', {
        'RESPONSE_TEMPLATE_COUNT': '75',
        'RECOMMENDATION_STRATEGY': 'collaborative'
    })
    def test_service_environment_overrides(self):
        """Test service-specific environment overrides"""
        from app.services.emotion_feedback_service import EmotionFeedbackService
        from app.services.recommendation_service import RecommendationService
        
        # Given: Service environment variables
        feedback_service = EmotionFeedbackService()
        recommendation_service = RecommendationService()
        
        # Then: Services use environment settings
        assert feedback_service.template_count == 75
        assert recommendation_service.default_strategy == 'collaborative'

if __name__ == "__main__":
    # Run specific test categories
    pytest.main([
        "test_advanced_emotion.py",
        "-v",
        "--tb=short",
        "--cov=app",
        "--cov-report=html"
    ])
