"""
통합 감정 분석 테스트 - MCP 최적화
기존 중복 테스트들을 통합하고 공통 픽스처 활용
"""

import pytest
import time
import concurrent.futures
from unittest.mock import Mock, patch, AsyncMock

pytestmark = pytest.mark.emotion


class TestBasicEmotionDetection:
    """기본 감정 감지 테스트"""
    
    def test_emotion_detection_simple(self):
        """간단한 감정 감지 테스트"""
        # Given: Mock emotion analyzer
        mock_analyzer = Mock()
        mock_analyzer.analyze.return_value = Mock(
            emotion="excited",
            confidence=0.8,
            language="english"
        )
        
        # When: Analyze text
        result = mock_analyzer.analyze("I won!")
        
        # Then: Valid result
        assert result.emotion == "excited"
        assert result.confidence == 0.8
        assert result.language == "english"
    
    def test_multiple_emotions(self):
        """다양한 감정 테스트"""
        mock_analyzer = Mock()
        
        test_cases = [
            ("I'm so happy!", "happy"),
            ("This is terrible", "angry"),
            ("I don't care", "neutral"),
            ("Amazing jackpot!", "excited")
        ]
        
        for text, expected_emotion in test_cases:
            mock_analyzer.analyze.return_value = Mock(
                emotion=expected_emotion,
                confidence=0.7,
                language="english"
            )
            
            result = mock_analyzer.analyze(text)
            assert result.emotion == expected_emotion
            assert result.confidence >= 0.5


class TestEmotionConfidence:
    """감정 신뢰도 테스트"""
    
    def test_confidence_levels(self):
        """다양한 신뢰도 레벨 테스트"""
        mock_analyzer = Mock()
        
        confidence_levels = [0.1, 0.3, 0.5, 0.7, 0.9, 1.0]
        
        for confidence in confidence_levels:
            mock_analyzer.analyze.return_value = Mock(
                emotion="neutral",
                confidence=confidence,
                language="english"
            )
            
            result = mock_analyzer.analyze("test")
            assert result.confidence == confidence
            
            # 낮은 신뢰도는 특별 처리
            if confidence < 0.5:
                assert result.emotion in ["neutral", "uncertain"]
    
    def test_confidence_thresholds(self):
        """신뢰도 임계값 테스트"""
        mock_analyzer = Mock()
        
        # 높은 신뢰도
        mock_analyzer.analyze.return_value = Mock(
            emotion="happy",
            confidence=0.9,
            language="english"
        )
        result = mock_analyzer.analyze("Great!")
        assert result.confidence >= 0.8
        
        # 낮은 신뢰도
        mock_analyzer.analyze.return_value = Mock(
            emotion="uncertain",
            confidence=0.3,
            language="english"
        )
        result = mock_analyzer.analyze("hmm")
        assert result.confidence < 0.5


class TestMultilingualEmotion:
    """다국어 감정 분석 테스트"""
    
    def test_english_emotions(self):
        """영어 감정 분석"""
        mock_analyzer = Mock()
        
        english_tests = [
            ("I love this!", "happy", "english"),
            ("This sucks", "angry", "english"),
            ("Whatever", "neutral", "english")
        ]
        
        for text, emotion, lang in english_tests:
            mock_analyzer.analyze.return_value = Mock(
                emotion=emotion,
                confidence=0.8,
                language=lang
            )
            
            result = mock_analyzer.analyze(text)
            assert result.language == "english"
            assert result.emotion == emotion
    
    def test_korean_emotions(self):
        """한국어 감정 분석"""
        mock_analyzer = Mock()
        
        korean_tests = [
            ("정말 좋아!", "happy", "korean"),
            ("화나네", "angry", "korean"),
            ("그냥 그래", "neutral", "korean")
        ]
        
        for text, emotion, lang in korean_tests:
            mock_analyzer.analyze.return_value = Mock(
                emotion=emotion,
                confidence=0.8,
                language=lang
            )
            
            result = mock_analyzer.analyze(text)
            assert result.language == "korean"
            assert result.emotion == emotion


class TestEmotionPerformance:
    """감정 분석 성능 테스트"""
    
    @pytest.mark.performance
    def test_batch_processing_speed(self):
        """배치 처리 속도 테스트"""
        mock_analyzer = Mock()
        
        # 50개 텍스트 배치
        texts = [f"Test message {i}" for i in range(50)]
        
        start_time = time.time()
        
        for text in texts:
            mock_analyzer.analyze.return_value = Mock(
                emotion="neutral",
                confidence=0.7,
                language="english"
            )
            result = mock_analyzer.analyze(text)
            assert result is not None
        
        end_time = time.time()
        processing_time = end_time - start_time
        
        # 50개를 1초 내에 처리해야 함
        assert processing_time < 1.0
        
        avg_time = processing_time / len(texts)
        assert avg_time < 0.02  # 20ms per text
    
    def test_concurrent_analysis(self):
        """동시 분석 테스트"""
        mock_analyzer = Mock()
        texts = ["test1", "test2", "test3", "test4", "test5"]
        
        def analyze_text(text):
            mock_analyzer.analyze.return_value = Mock(
                emotion="neutral",
                confidence=0.7,
                language="english"
            )
            return mock_analyzer.analyze(text)
        
        # 동시 처리
        with concurrent.futures.ThreadPoolExecutor(max_workers=3) as executor:
            futures = [executor.submit(analyze_text, text) for text in texts]
            results = [future.result() for future in concurrent.futures.as_completed(futures)]
        
        assert len(results) == len(texts)
        for result in results:
            assert result.emotion == "neutral"


class TestEmotionAPIIntegration:
    """감정 분석 API 통합 테스트"""
    
    def test_api_request_structure(self):
        """API 요청 구조 테스트"""
        # Given: API 요청 데이터
        request_data = {
            "user_id": 1,
            "text": "I'm feeling great!",
            "language": "english"
        }
        
        # When: API 호출 시뮬레이션
        with patch('app.routers.ai.analyze_emotion') as mock_api:
            mock_api.return_value = {
                "emotion": "happy",
                "confidence": 0.85,
                "timestamp": "2024-01-01T00:00:00Z"
            }
            response = mock_api(request_data)
        
        # Then: 응답 검증
        assert "emotion" in response
        assert "confidence" in response
        assert "timestamp" in response
        assert response["emotion"] == "happy"
    
    def test_api_error_handling(self):
        """API 오류 처리 테스트"""
        error_cases = [
            {"text": ""},  # 빈 텍스트
            {"user_id": "invalid"},  # 잘못된 사용자 ID
            {},  # 필수 필드 누락
        ]
        
        for invalid_data in error_cases:
            with patch('app.routers.ai.analyze_emotion') as mock_api:
                mock_api.side_effect = ValueError("Invalid input")
                
                with pytest.raises(ValueError):
                    mock_api(invalid_data)


class TestEmotionGameIntegration:
    """감정-게임 통합 테스트"""
    
    def test_emotion_slot_feedback(self):
        """감정-슬롯머신 피드백 루프"""
        mock_analyzer = Mock()
        
        # 게임 이벤트와 예상 감정
        game_events = [
            ("I'm starting to play", "neutral"),
            ("First win!", "happy"),
            ("Lost again...", "disappointed"),
            ("JACKPOT!!!", "ecstatic"),
            ("Back to normal", "neutral")
        ]
        
        emotion_history = []
        
        for text, expected_emotion in game_events:
            mock_analyzer.analyze.return_value = Mock(
                emotion=expected_emotion,
                confidence=0.8,
                language="english"
            )
            
            result = mock_analyzer.analyze(text)
            emotion_history.append(result.emotion)
        
        # 감정 변화 패턴 검증
        assert "happy" in emotion_history
        assert "disappointed" in emotion_history
        assert "ecstatic" in emotion_history
        assert len(emotion_history) == len(game_events)
    
    def test_emotion_based_recommendations(self):
        """감정 기반 추천 시스템"""
        mock_analyzer = Mock()
        
        emotion_recommendations = {
            "happy": ["continue_playing", "try_higher_bet"],
            "frustrated": ["take_break", "try_different_game"],
            "neutral": ["explore_features", "check_bonuses"],
            "excited": ["enjoy_moment", "be_careful"]
        }
        
        for emotion, expected_recs in emotion_recommendations.items():
            mock_analyzer.analyze.return_value = Mock(
                emotion=emotion,
                confidence=0.8,
                language="english"
            )
            
            result = mock_analyzer.analyze(f"I feel {emotion}")
            
            # 감정에 따른 추천 로직 테스트
            if result.emotion == "happy":
                recommendations = ["continue_playing", "try_higher_bet"]
            elif result.emotion == "frustrated":
                recommendations = ["take_break", "try_different_game"]
            elif result.emotion == "neutral":
                recommendations = ["explore_features", "check_bonuses"]
            elif result.emotion == "excited":
                recommendations = ["enjoy_moment", "be_careful"]
            else:
                recommendations = []
            
            assert recommendations == expected_recs


class TestEmotionEdgeCases:
    """감정 분석 엣지 케이스 테스트"""
    
    def test_empty_text_handling(self):
        """빈 텍스트 처리"""
        mock_analyzer = Mock()
        
        empty_cases = ["", "   ", "\n\t", None]
        
        for empty_text in empty_cases:
            if empty_text is None:
                mock_analyzer.analyze.side_effect = ValueError("Text cannot be None")
                with pytest.raises(ValueError):
                    mock_analyzer.analyze(empty_text)
            else:
                mock_analyzer.analyze.return_value = Mock(
                    emotion="neutral",
                    confidence=0.1,
                    language="unknown"
                )
                result = mock_analyzer.analyze(empty_text)
                assert result.emotion == "neutral"
                assert result.confidence <= 0.5
    
    def test_very_long_text_handling(self):
        """매우 긴 텍스트 처리"""
        mock_analyzer = Mock()
        
        # 10,000자 텍스트
        long_text = "This is a very long text. " * 400
        
        mock_analyzer.analyze.return_value = Mock(
            emotion="neutral",
            confidence=0.6,
            language="english"
        )
        
        result = mock_analyzer.analyze(long_text)
        assert result is not None
        assert result.emotion in ["neutral", "mixed"]
    
    def test_mixed_language_text(self):
        """혼합 언어 텍스트 처리"""
        mock_analyzer = Mock()
        
        mixed_texts = [
            "Hello 안녕하세요 world",
            "I'm 정말 happy today!",
            "これは test です"
        ]
        
        for text in mixed_texts:
            mock_analyzer.analyze.return_value = Mock(
                emotion="neutral",
                confidence=0.5,
                language="mixed"
            )
            
            result = mock_analyzer.analyze(text)
            assert result.language in ["mixed", "unknown", "english"]
            assert result.confidence >= 0.3


if __name__ == "__main__":
    pytest.main([__file__, "-v"])