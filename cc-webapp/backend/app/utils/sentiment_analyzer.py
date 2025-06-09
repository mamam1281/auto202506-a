from __future__ import annotations

import os
import re
import json
import logging
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass
from enum import Enum
from pathlib import Path

logger = logging.getLogger(__name__)

class SupportedEmotion(Enum):
    """지원하는 감정 유형"""
    EXCITED = "excited"
    FRUSTRATED = "frustrated"
    CURIOUS = "curious"
    TIRED = "tired"
    ANGRY = "angry"
    SAD = "sad"
    NEUTRAL = "neutral"

class SupportedLanguage(Enum):
    """지원하는 언어"""
    KOREAN = "korean"
    ENGLISH = "english"

def preprocess_text(text: str) -> str:
    """텍스트 전처리"""
    if not text:
        return ""
    
    # 특수문자 제거 (한글, 영문, 숫자, 공백, 하이픈, 어포스트로피 제외)
    text = re.sub(r'[^\w\s\'-]', '', text)
    
    # 연속된 공백을 하나로 줄임
    text = re.sub(r'\s+', ' ', text)
    
    return text.strip()

@dataclass
class EmotionResult:
    """감정 분석 결과"""
    emotion: str
    score: float
    confidence: float
    language: str
    
    def is_confident(self) -> bool:
        """신뢰도가 높은 결과인지 확인"""
        return self.confidence >= 0.7

def detect_language(text: str) -> str:
    """언어 감지"""
    # 한글이 포함되어 있으면 한국어로 판단
    if re.search(r'[가-힣]', text):
        return SupportedLanguage.KOREAN.value
    else:
        return SupportedLanguage.ENGLISH.value

def analyze_emotion_basic(text: str) -> EmotionResult:
    """기본 감정 분석 (키워드 기반)"""
    language = detect_language(text)
    text_lower = text.lower()
    
    # 감정별 키워드 정의
    emotion_keywords = {
        SupportedEmotion.EXCITED: {
            'korean': ['기뻐', '좋아', '최고', '대박', '환상', '완전', '진짜', '와'],
            'english': ['great', 'awesome', 'amazing', 'fantastic', 'wonderful', 'excellent', 'love', 'best']
        },
        SupportedEmotion.FRUSTRATED: {
            'korean': ['짜증', '답답', '화나', '빡쳐', '열받', '싫어', '최악'],
            'english': ['annoying', 'frustrated', 'angry', 'hate', 'worst', 'terrible', 'awful']
        },
        SupportedEmotion.CURIOUS: {
            'korean': ['궁금', '어떻게', '왜', '뭐야', '신기', '재밌'],
            'english': ['curious', 'interesting', 'wonder', 'how', 'why', 'what']
        },
        SupportedEmotion.TIRED: {
            'korean': ['피곤', '졸려', '지쳐', '힘들', '못하겠'],
            'english': ['tired', 'exhausted', 'sleepy', 'worn out', 'cant anymore']
        },
        SupportedEmotion.ANGRY: {
            'korean': ['화나', '빡쳐', '열받', '미쳐', '죽이고싶'],
            'english': ['angry', 'mad', 'furious', 'pissed', 'rage']
        },
        SupportedEmotion.SAD: {
            'korean': ['슬퍼', '우울', '눈물', '속상', '마음아파'],
            'english': ['sad', 'depressed', 'cry', 'tears', 'heartbroken']
        }
    }
    
    # 키워드 매칭으로 감정 점수 계산
    emotion_scores = {}
    
    for emotion, keywords in emotion_keywords.items():
        score = 0
        lang_keywords = keywords.get(language, [])
        
        for keyword in lang_keywords:
            if keyword in text_lower:
                score += 1
        
        if score > 0:
            emotion_scores[emotion] = score / len(lang_keywords)
    
    # 가장 높은 점수의 감정 선택
    if emotion_scores:
        best_emotion = max(emotion_scores, key=emotion_scores.get)
        score = emotion_scores[best_emotion]
        confidence = min(score * 2, 1.0)  # 신뢰도 계산
        
        return EmotionResult(
            emotion=best_emotion.value,
            score=score,
            confidence=confidence,
            language=language
        )
    else:
        # 매칭되는 키워드가 없으면 중립
        return EmotionResult(
            emotion=SupportedEmotion.NEUTRAL.value,
            score=0.5,
            confidence=0.6,
            language=language
        )

class SentimentAnalyzer:
    """감정 분석기 클래스"""
    
    def __init__(self):
        self.confidence_threshold = float(os.getenv('EMOTION_CONFIDENCE_THRESHOLD', '0.7'))
        self.llm_fallback_enabled = os.getenv('LLM_FALLBACK_ENABLED', 'false').lower() == 'true'
        self.model = None  # 모델 속성 추가
        self.fallback_mode = self.llm_fallback_enabled  # 폴백 모드 속성 추가
        logger.info(f"SentimentAnalyzer initialized with threshold: {self.confidence_threshold}")
    
    def analyze(self, text: str) -> EmotionResult:
        """텍스트에서 감정 분석"""
        if not text or not text.strip():
            return EmotionResult(
                emotion=SupportedEmotion.NEUTRAL.value,
                score=0.0,
                confidence=1.0,
                language=SupportedLanguage.KOREAN.value
            )
        
        # 텍스트 전처리
        processed_text = preprocess_text(text)
        
        # 기본 감정 분석
        result = analyze_emotion_basic(processed_text)
        
        # 신뢰도가 낮으면 LLM 폴백 (향후 구현)
        if result.confidence < self.confidence_threshold and self.llm_fallback_enabled:
            logger.info(f"Low confidence ({result.confidence}), attempting LLM fallback")
            # TODO: LLM 폴백 구현
            pass
        
        logger.debug(f"Emotion analysis result: {result}")
        return result

def get_emotion_analysis(text: str, context: Optional[Dict] = None) -> EmotionResult:
    """감정 분석 함수 (편의용)"""
    analyzer = SentimentAnalyzer()
    return analyzer.analyze(text)

def load_local_model():
    """로컬 모델 로드 (향후 구현)"""
    # TODO: 실제 ML 모델 로드 구현
    logger.info("Local sentiment model loading (placeholder)")
    return None
