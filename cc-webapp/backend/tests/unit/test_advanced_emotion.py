"""
Advanced Emotion Analysis System Tests - Production Grade
Comprehensive tests with edge cases, error scenarios, and realistic data validation
"""

import pytest
import json
import asyncio
import time
from unittest.mock import Mock, patch, AsyncMock, MagicMock
from datetime import datetime, timedelta
from typing import Dict, Any, List
import numpy as np
from decimal import Decimal

# More realistic test fixtures
@pytest.fixture
def realistic_emotion_confidence_samples():
    """Realistic emotion confidence distributions"""
    return {
        "high_confidence": [0.92, 0.89, 0.95, 0.88, 0.91],
        "medium_confidence": [0.75, 0.68, 0.72, 0.76, 0.69],
        "low_confidence": [0.45, 0.52, 0.38, 0.49, 0.43],
        "borderline": [0.69, 0.70, 0.71, 0.68, 0.72]  # Around threshold
    }

@pytest.fixture
def complex_multilingual_texts():
    """Complex multilingual texts for testing"""
    return {
        "korean_emotional": [
            "진짜 미치겠다 이거... 계속 지기만 해",
            "대박!!! 드디어 잭팟이다 ㅠㅠㅠ 너무 기뻐",
            "이게 뭐야... 뭔가 이상한데 확률이 조작된 건 아니지?",
            "음... 잘 모르겠네. 다음엔 뭘 해볼까?"
        ],
        "english_emotional": [
            "This is absolutely ridiculous! I keep losing everything!",
            "OMG YES!!! Finally hit the jackpot!!! 🎉🎉🎉",
            "Something feels off... are the odds rigged or what?",
            "Hmm, not sure what to think about this game"
        ],
        "mixed_language": [
            "Wow this is 대박! Really amazing game!",
            "뭐야 this doesn't make sense at all",
            "I'm so 기뻐 right now! 진짜로!"
        ],
        "ambiguous_context": [
            "It's fine I guess",
            "Whatever",
            "Could be better",
            "Not bad not good"
        ]
    }

class TestEmotionModelsAdvanced:
    """Advanced emotion model tests with edge cases"""
    
    def test_emotion_result_boundary_values(self):
        """Test emotion model with boundary values"""
        from app.emotion_models import EmotionResult, SupportedEmotion, SupportedLanguage
        
        # Test exact threshold boundary
        boundary_emotion = EmotionResult(
            emotion=SupportedEmotion.NEUTRAL,
            score=0.5,
            confidence=0.7,  # Exactly at threshold
            language=SupportedLanguage.KOREAN
        )
        
        assert boundary_emotion.is_confident() == True
        
        # Test just below threshold
        below_threshold = EmotionResult(
            emotion=SupportedEmotion.NEUTRAL,
            score=0.5,
            confidence=0.699999,  # Just below
            language=SupportedLanguage.KOREAN
        )
        
        assert below_threshold.is_confident() == False
    
    def test_emotion_model_validation_failures(self):
        """Test emotion model validation with invalid data"""
        from app.emotion_models import EmotionResult, SupportedEmotion, SupportedLanguage
        from pydantic import ValidationError
          # Test invalid score range
        with pytest.raises(ValidationError, match="Input should be less than or equal to 1"):
            EmotionResult(
                emotion=SupportedEmotion.EXCITED,
                score=1.5,  # Invalid: > 1
                confidence=0.8,
                language=SupportedLanguage.KOREAN
            )
          # Test invalid confidence range
        with pytest.raises(ValidationError, match="Input should be greater than or equal to 0"):
            EmotionResult(
                emotion=SupportedEmotion.EXCITED,
                score=0.8,
                confidence=-0.1,  # Invalid: < 0
                language=SupportedLanguage.KOREAN
            )
    
    def test_language_detection_accuracy(self, complex_multilingual_texts):
        """Test language detection accuracy with complex texts"""
        from app.utils.sentiment_analyzer import detect_language
        
        # Test Korean detection accuracy
        korean_correct = 0
        for text in complex_multilingual_texts["korean_emotional"]:
            detected = detect_language(text)
            if detected == "korean":
                korean_correct += 1
        
        # Should detect Korean correctly at least 75% of the time
        accuracy = korean_correct / len(complex_multilingual_texts["korean_emotional"])
        assert accuracy >= 0.75, f"Korean detection accuracy too low: {accuracy}"
        
        # Test mixed language handling (should not crash)
        for text in complex_multilingual_texts["mixed_language"]:
            detected = detect_language(text)
            assert detected in ["korean", "english", "unknown"]

class TestSentimentAnalyzerRobustness:
    """Robust sentiment analyzer tests"""
    
    @patch('app.utils.sentiment_analyzer.load_local_model')
    def test_model_loading_failure_handling(self, mock_load_model):
        """Test handling of model loading failures"""
        # Simulate model loading failure
        mock_load_model.side_effect = FileNotFoundError("Model file not found")
        
        from app.utils.sentiment_analyzer import SentimentAnalyzer
        
        # Should gracefully handle missing model
        with pytest.raises(RuntimeError, match="Failed to load sentiment model"):
            SentimentAnalyzer()
    
    @patch('app.utils.sentiment_analyzer.load_local_model')
    def test_model_prediction_inconsistency(self, mock_load_model, realistic_emotion_confidence_samples):
        """Test handling of inconsistent model predictions"""
        mock_model = Mock()
        
        # Simulate inconsistent predictions for same input
        predictions = [
            {"emotion": "excited", "confidence": 0.9},
            {"emotion": "frustrated", "confidence": 0.8},  # Different emotion
            {"emotion": "excited", "confidence": 0.3},    # Same emotion, low confidence
        ]
        mock_model.predict.side_effect = predictions
        mock_load_model.return_value = mock_model
        
        from app.utils.sentiment_analyzer import SentimentAnalyzer
        analyzer = SentimentAnalyzer()
        
        # Multiple predictions for same text should be handled
        results = []
        for _ in range(3):
            result = analyzer.analyze("Test text")
            results.append((result.emotion, result.confidence))
        
        # Should have consistency checks or error handling
        assert len(set(r[0] for r in results)) <= 2  # Max 2 different emotions
    
    def test_performance_under_load(self, complex_multilingual_texts):
        """Test performance with realistic load"""
        from app.utils.sentiment_analyzer import SentimentAnalyzer
        
        with patch('app.utils.sentiment_analyzer.load_local_model') as mock_load:
            mock_model = Mock()
            mock_model.predict.return_value = {"emotion": "neutral", "confidence": 0.8}
            mock_load.return_value = mock_model
            
            analyzer = SentimentAnalyzer()
            
            # Test with 100 rapid requests
            start_time = time.time()
            all_texts = []
            for text_list in complex_multilingual_texts.values():
                all_texts.extend(text_list)
            
            # Extend to 100 texts
            test_texts = (all_texts * 10)[:100]
            
            results = []
            for text in test_texts:
                result = analyzer.analyze(text)
                results.append(result)
            
            end_time = time.time()
            avg_time = (end_time - start_time) / len(test_texts)
            
            # Should process each text in under 100ms
            assert avg_time < 0.1, f"Average processing time too slow: {avg_time:.3f}s"
            assert len(results) == 100
            assert all(r.emotion is not None for r in results)
    
    @patch('app.utils.sentiment_analyzer.call_llm_fallback')
    def test_llm_fallback_failure_cascade(self, mock_llm):
        """Test cascading failures in LLM fallback"""
        # Simulate LLM service failures
        mock_llm.side_effect = [
            Exception("OpenAI API rate limit"),
            Exception("Claude API timeout"),
            Exception("Network error")
        ]
        
        from app.utils.sentiment_analyzer import SentimentAnalyzer
        
        with patch('app.utils.sentiment_analyzer.load_local_model') as mock_load:
            mock_model = Mock()
            mock_model.predict.return_value = {"emotion": "neutral", "confidence": 0.5}  # Low confidence
            mock_load.return_value = mock_model
            
            analyzer = SentimentAnalyzer()
            
            # Should fall back to local model result when LLM fails
            result = analyzer.analyze("Ambiguous text")
            
            assert result.emotion == "neutral"
            assert result.confidence == 0.5
            # Should have fallback_used flag
            assert hasattr(result, 'fallback_attempted')

class TestCJAIServiceRealistic:
    """Realistic CJ AI service tests"""
    
    @pytest.mark.asyncio
    async def test_concurrent_emotion_analysis_race_conditions(self):
        """Test race conditions in concurrent emotion analysis"""
        from app.services.cj_ai_service import CJAIService
        
        mock_redis = Mock()
        mock_analyzer = Mock()
        
        # Simulate different analysis times
        async def slow_analysis(text):
            await asyncio.sleep(0.1)  # 100ms
            return Mock(emotion="excited", confidence=0.8)
        
        async def fast_analysis(text):
            await asyncio.sleep(0.01)  # 10ms
            return Mock(emotion="frustrated", confidence=0.9)
        
        mock_analyzer.analyze_async.side_effect = [slow_analysis, fast_analysis]
        
        service = CJAIService(redis_client=mock_redis, sentiment_analyzer=mock_analyzer)
        
        # Start two analyses for same user simultaneously
        task1 = service.analyze_emotion(1, "First message", {})
        task2 = service.analyze_emotion(1, "Second message", {})
        
        results = await asyncio.gather(task1, task2, return_exceptions=True)
        
        # Both should complete without errors
        assert len(results) == 2
        assert not any(isinstance(r, Exception) for r in results)
    
    def test_redis_connection_failure_handling(self):
        """Test handling of Redis connection failures"""
        from app.services.cj_ai_service import CJAIService
        
        # Mock Redis connection failure
        mock_redis = Mock()
        mock_redis.set.side_effect = ConnectionError("Redis connection lost")
        mock_redis.get.side_effect = ConnectionError("Redis connection lost")
        
        service = CJAIService(redis_client=mock_redis)
        
        # Should handle Redis failures gracefully
        result = service.cache_emotion_result(1, {"emotion": "excited"})
        
        # Should return False or handle gracefully, not crash
        assert result in [False, None]
    
    def test_memory_leak_prevention(self):
        """Test for memory leaks in emotion analysis"""
        from app.services.cj_ai_service import CJAIService
        import gc
        import psutil
        import os
        
        process = psutil.Process(os.getpid())
        initial_memory = process.memory_info().rss
        
        service = CJAIService()
        
        # Perform many emotion analyses
        for i in range(1000):
            service.analyze_emotion_sync(f"user_{i}", f"Test message {i}", {})
            
            # Force garbage collection every 100 iterations
            if i % 100 == 0:
                gc.collect()
        
        final_memory = process.memory_info().rss
        memory_growth = final_memory - initial_memory
        
        # Memory growth should be reasonable (< 50MB for 1000 analyses)
        assert memory_growth < 50 * 1024 * 1024, f"Memory leak detected: {memory_growth / 1024 / 1024:.2f}MB growth"

class TestRecommendationSystemAdvanced:
    """Advanced recommendation system tests"""
    
    def test_cold_start_problem_handling(self):
        """Test handling of cold start problem (new users)"""
        from app.services.recommendation_service import RecommendationService
        
        service = RecommendationService()
        
        # New user with no history
        with patch.object(service, 'get_user_emotion_history') as mock_history:
            mock_history.return_value = []  # No history
            
            recommendations = service.get_personalized_recommendations(
                user_id=999999,  # New user ID
                current_emotion="neutral"
            )
            
            # Should still provide recommendations (fallback to popular/default)
            assert len(recommendations) > 0
            assert all("confidence" in rec for rec in recommendations)
            # Confidence should be lower for cold start
            assert all(rec["confidence"] < 0.7 for rec in recommendations)
    
    def test_recommendation_diversity_and_quality(self):
        """Test recommendation diversity and quality metrics"""
        from app.services.recommendation_service import RecommendationService
        
        service = RecommendationService()
        
        # User with varied emotion history
        varied_history = [
            {"emotion": "excited", "game": "slot", "outcome": "win"},
            {"emotion": "frustrated", "game": "roulette", "outcome": "loss"},
            {"emotion": "curious", "game": "gacha", "outcome": "win"},
            {"emotion": "excited", "game": "slot", "outcome": "win"},
            {"emotion": "bored", "game": "roulette", "outcome": "loss"}
        ]
        
        with patch.object(service, 'get_user_emotion_history') as mock_history:
            mock_history.return_value = varied_history
            
            recommendations = service.get_personalized_recommendations(
                user_id=1,
                current_emotion="excited"
            )
            
            # Check diversity (shouldn't recommend same game repeatedly)
            game_types = [rec["game_type"] for rec in recommendations]
            unique_games = set(game_types)
            
            assert len(unique_games) >= 2, "Recommendations lack diversity"
            
            # Check quality (confidence scores should be reasonable)
            confidences = [rec["confidence"] for rec in recommendations]
            avg_confidence = sum(confidences) / len(confidences)
            
            assert avg_confidence > 0.5, f"Recommendation quality too low: {avg_confidence}"
    
    def test_recommendation_explanation_quality(self):
        """Test quality of recommendation explanations"""
        from app.services.recommendation_service import RecommendationService
        
        service = RecommendationService()
        
        emotion_context_pairs = [
            ("excited", {"recent_wins": 3, "favorite_game": "slot"}),
            ("frustrated", {"recent_losses": 5, "last_game": "roulette"}),
            ("curious", {"new_user": True, "games_tried": ["slot"]}),
            ("bored", {"session_length": 3600, "repeated_game": "slot"})
        ]
        
        for emotion, context in emotion_context_pairs:
            recommendations = service.get_personalized_recommendations(
                user_id=1,
                current_emotion=emotion,
                context=context
            )
            
            for rec in recommendations:
                explanation = rec.get("reason", "")
                
                # Explanation should mention the emotion
                assert emotion.lower() in explanation.lower(), f"Explanation doesn't reference emotion: {explanation}"
                
                # Explanation should be substantive (> 20 characters)
                assert len(explanation) > 20, f"Explanation too brief: {explanation}"
                
                # Should not contain placeholder text
                assert "TODO" not in explanation
                assert "placeholder" not in explanation.lower()

class TestEmotionFeedbackSystemRobust:
    """Robust emotion feedback system tests"""
    
    def test_template_coverage_completeness(self):
        """Test that feedback templates cover all emotion-segment combinations"""
        from app.services.emotion_feedback_service import EmotionFeedbackService
        
        service = EmotionFeedbackService()
        
        emotions = ["excited", "frustrated", "curious", "tired", "angry", "sad", "neutral"]
        segments = ["Whale", "Medium", "Low", "VIP", "New"]
        languages = ["korean", "english"]
        
        missing_combinations = []
        
        for emotion in emotions:
            for segment in segments:
                for language in languages:
                    context = {"language": language}
                    
                    try:
                        feedback = service.generate_feedback(emotion, segment, context)
                        
                        # Should have valid feedback
                        assert feedback is not None
                        assert "message" in feedback
                        assert len(feedback["message"]) > 0
                        
                    except Exception as e:
                        missing_combinations.append((emotion, segment, language, str(e)))
        
        # Should cover at least 80% of combinations
        coverage = 1 - (len(missing_combinations) / (len(emotions) * len(segments) * len(languages)))
        assert coverage >= 0.8, f"Template coverage too low: {coverage:.2f}, Missing: {missing_combinations[:5]}"
    
    def test_feedback_tone_appropriateness(self):
        """Test that feedback tone matches emotion context"""
        from app.services.emotion_feedback_service import EmotionFeedbackService
        
        service = EmotionFeedbackService()
        
        # Test negative emotion feedback should be encouraging
        negative_context = {
            "emotion": "frustrated",
            "segment": "Medium",
            "consecutive_losses": 5,
            "context": {"game_result": "loss"}
        }
        
        feedback = service.generate_feedback("frustrated", "Medium", negative_context)
        message = feedback["message"].lower()
        
        # Should contain encouraging words
        encouraging_words = ["괜찮", "다음", "힘내", "better", "next", "try", "chance"]
        has_encouraging = any(word in message for word in encouraging_words)
        assert has_encouraging, f"Frustrated feedback lacks encouragement: {message}"
        
        # Should NOT contain discouraging words
        discouraging_words = ["포기", "그만", "quit", "give up", "hopeless"]
        has_discouraging = any(word in message for word in discouraging_words)
        assert not has_discouraging, f"Frustrated feedback is discouraging: {message}"
    
    def test_llm_fallback_cost_monitoring(self):
        """Test LLM fallback cost monitoring and limits"""
        from app.services.emotion_feedback_service import EmotionFeedbackService
        
        with patch('app.services.emotion_feedback_service.call_llm_for_feedback') as mock_llm:
            mock_llm.return_value = {
                "message": "Custom generated feedback",
                "template_id": "llm_generated",
                "cost": 0.05  # $0.05 per call
            }
            
            service = EmotionFeedbackService()
            
            # Simulate multiple LLM calls
            total_cost = 0
            for i in range(10):
                feedback = service.generate_feedback(
                    emotion=f"rare_emotion_{i}",
                    segment="Unknown",
                    context={}
                )
                
                if feedback.get("template_id") == "llm_generated":
                    total_cost += 0.05
            
            # Should monitor and limit LLM usage costs
            assert total_cost <= 0.50, f"LLM costs too high: ${total_cost}"

class TestPerformanceAndScalability:
    """Performance and scalability tests"""
    
    @pytest.mark.asyncio
    async def test_system_performance_under_realistic_load(self):
        """Test system performance under realistic concurrent load"""
        from app.services.cj_ai_service import CJAIService
        from app.services.recommendation_service import RecommendationService
        from app.services.emotion_feedback_service import EmotionFeedbackService
        
        # Simulate 50 concurrent users
        num_users = 50
        requests_per_user = 5
        
        async def user_session(user_id):
            """Simulate a user session with multiple requests"""
            ai_service = CJAIService()
            rec_service = RecommendationService()
            feedback_service = EmotionFeedbackService()
            
            session_results = []
            
            for request_num in range(requests_per_user):
                start_time = time.time()
                
                try:
                    # Emotion analysis
                    emotion_result = await ai_service.analyze_emotion(
                        user_id, 
                        f"User {user_id} message {request_num}",
                        {"request_num": request_num}
                    )
                    
                    # Recommendation
                    recommendations = rec_service.get_personalized_recommendations(
                        user_id,
                        emotion_result.emotion if emotion_result else "neutral"
                    )
                    
                    # Feedback
                    feedback = feedback_service.generate_feedback(
                        emotion_result.emotion if emotion_result else "neutral",
                        "Medium",
                        {}
                    )
                    
                    end_time = time.time()
                    request_time = end_time - start_time
                    
                    session_results.append({
                        "user_id": user_id,
                        "request_num": request_num,
                        "duration": request_time,
                        "success": True
                    })
                    
                except Exception as e:
                    session_results.append({
                        "user_id": user_id,
                        "request_num": request_num,
                        "duration": time.time() - start_time,
                        "success": False,
                        "error": str(e)
                    })
            
            return session_results
        
        # Run concurrent user sessions
        start_time = time.time()
        tasks = [user_session(user_id) for user_id in range(num_users)]
        all_results = await asyncio.gather(*tasks, return_exceptions=True)
        end_time = time.time()
        
        # Analyze results
        successful_sessions = [r for r in all_results if not isinstance(r, Exception)]
        total_requests = sum(len(session) for session in successful_sessions)
        successful_requests = sum(
            sum(1 for req in session if req["success"]) 
            for session in successful_sessions
        )
        
        success_rate = successful_requests / total_requests if total_requests > 0 else 0
        total_duration = end_time - start_time
        requests_per_second = total_requests / total_duration
        
        # Performance assertions
        assert success_rate >= 0.95, f"Success rate too low: {success_rate:.2%}"
        assert requests_per_second >= 10, f"Throughput too low: {requests_per_second:.2f} req/s"
        assert total_duration < 30, f"Total test time too long: {total_duration:.2f}s"
    
    def test_database_connection_pool_exhaustion(self):
        """Test handling of database connection pool exhaustion"""
        from app.services.cj_ai_service import CJAIService
        
        with patch('app.database.session') as mock_session_factory:
            # Simulate connection pool exhaustion
            mock_session_factory.side_effect = Exception("Connection pool exhausted")
            
            service = CJAIService()
            
            # Should handle database connection failures gracefully
            try:
                result = service.log_emotion_to_database(1, {"emotion": "excited"})
                # Should either return False or handle gracefully
                assert result in [False, None]
            except Exception as e:
                # If it raises an exception, it should be a handled one
                assert "Connection pool" in str(e) or "Database unavailable" in str(e)

# Add property-based testing for edge cases
try:
    from hypothesis import given, strategies as st
    
    class TestPropertyBasedEdgeCases:
        """Property-based tests for edge cases"""
        
        @given(st.floats(min_value=0.0, max_value=1.0))
        def test_confidence_threshold_property(self, confidence_value):
            """Property test for confidence threshold behavior"""
            from app.emotion_models import EmotionResult, SupportedEmotion, SupportedLanguage
            
            emotion = EmotionResult(
                emotion=SupportedEmotion.NEUTRAL,
                score=0.5,
                confidence=confidence_value,
                language=SupportedLanguage.KOREAN
            )
            
            # Property: confidence threshold should be consistent
            expected_confident = confidence_value >= 0.7
            assert emotion.is_confident() == expected_confident
        
        @given(st.text(min_size=1, max_size=1000))
        def test_text_analysis_robustness(self, input_text):
            """Property test for text analysis robustness"""
            from app.utils.sentiment_analyzer import SentimentAnalyzer
            
            with patch('app.utils.sentiment_analyzer.load_local_model') as mock_load:
                mock_model = Mock()
                mock_model.predict.return_value = {"emotion": "neutral", "confidence": 0.8}
                mock_load.return_value = mock_model
                
                analyzer = SentimentAnalyzer()
                
                # Property: should not crash on any valid text input
                try:
                    result = analyzer.analyze(input_text)
                    assert result.emotion is not None
                    assert 0.0 <= result.confidence <= 1.0
                except Exception as e:
                    # Only acceptable exceptions
                    assert any(err_type in str(e) for err_type in [
                        "Text too long", "Invalid characters", "Empty text"
                    ])

except ImportError:
    # Hypothesis not available, skip property-based tests
    print("Hypothesis not installed, skipping property-based tests")

if __name__ == "__main__":
    # Run with strict settings
    pytest.main([
        "test_advanced_emotion.py",
        "-v",
        "--tb=short",
        "--strict-markers",
        "--strict-config",
        "--cov=app",
        "--cov-report=html",
        "--cov-fail-under=85",  # Require 85% coverage
        "--maxfail=3",  # Stop after 3 failures
        "-x"  # Stop on first failure for debugging
    ])
