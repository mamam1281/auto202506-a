from __future__ import annotations

import os
import re
import json
import logging
from typing import Tuple, Optional, Dict, Any

try:
    from langdetect import detect, LangDetectException
except ImportError:
    detect = None
    LangDetectException = None # type: ignore

from ..emotion_models import EmotionResult, SupportedEmotion, SupportedLanguage

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

SENTIMENT_MODEL_PATH = os.getenv("SENTIMENT_MODEL_PATH", "path/to/dummy_model.bin")
EMOTION_CONFIDENCE_THRESHOLD = float(os.getenv("EMOTION_CONFIDENCE_THRESHOLD", "0.6"))
CONTEXT_AWARE_RESPONSES = os.getenv("CONTEXT_AWARE_RESPONSES", "true").lower() == "true"
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
CLAUDE_API_KEY = os.getenv("CLAUDE_API_KEY")
MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY")

def clean_text(text: str) -> str:
    if not isinstance(text, str):
        logger.warning(f"clean_text received non-string input: {type(text)}. Returning empty string.")
        return ""
    text = text.lower().strip()
    text = re.sub(r'[^\w\s'-]', '', text)
    text = re.sub(r'\s+', ' ', text)
    return text

def detect_language_robust(text: str) -> SupportedLanguage:
    if not text or not isinstance(text, str) or text.isspace():
        logger.warning("detect_language received empty/invalid text, defaulting to English.")
        return SupportedLanguage.ENGLISH

    korean_chars = re.compile(r"[가-힣]")
    primary_guess = SupportedLanguage.KOREAN if korean_chars.search(text) else SupportedLanguage.ENGLISH

    if detect and LangDetectException:
        try:
            lang_code = detect(text)
            if lang_code == "ko": return SupportedLanguage.KOREAN
            if lang_code == "en": return SupportedLanguage.ENGLISH
            logger.warning(f"Langdetect unmapped code '{lang_code}'. Using heuristic: {primary_guess.value}")
            return primary_guess
        except LangDetectException as e:
            logger.warning(f"Langdetect failed: {e}. Falling back to heuristic: {primary_guess.value}")
            return primary_guess
    else:
        logger.info("langdetect not available/imported. Using heuristic.")
        return primary_guess

def analyze_sentiment_local(text: str, lang: SupportedLanguage) -> Tuple[SupportedEmotion, float]:
    logger.info(f"Local sentiment analysis (dummy) for lang '{lang.value}': '{text}'")
    if lang == SupportedLanguage.KOREAN:
        return (SupportedEmotion.SADNESS, 0.75) if "슬픔" in text else (SupportedEmotion.NEUTRAL, 0.5)
    else:
        if "happy" in text or "joy" in text: return SupportedEmotion.JOY, 0.8
        if "sad" in text or "cry" in text: return SupportedEmotion.SADNESS, 0.85
        return SupportedEmotion.NEUTRAL, 0.4

def analyze_sentiment_llm(
    text: str, lang: SupportedLanguage, provider: str = "openai", context: Optional[Dict[str, Any]] = None
) -> Tuple[Optional[SupportedEmotion], float, Dict[str, Any]]:
    logger.info(f"LLM sentiment analysis (dummy) via {provider} for lang '{lang.value}': '{text}'")
    llm_metadata = {"provider": provider, "model": "dummy_model", "prompt_len": len(text), "cost_sim": 0.001}

    key_missing = False
    if provider == "openai" and not OPENAI_API_KEY: key_missing = True
    elif provider == "claude" and not CLAUDE_API_KEY: key_missing = True
    elif provider == "mistral" and not MISTRAL_API_KEY: key_missing = True

    if key_missing:
        logger.error(f"{provider.capitalize()} API key missing.")
        return None, 0.0, llm_metadata

    emotion, conf = SupportedEmotion.NEUTRAL, 0.6
    if "exciting" in text or "놀라운" in text: emotion, conf = SupportedEmotion.SURPRISE, 0.9
    elif "angry" in text or "화나" in text: emotion, conf = SupportedEmotion.ANGER, 0.7

    llm_metadata["sim_output"] = {"emotion": emotion.value, "confidence": conf}
    if CONTEXT_AWARE_RESPONSES and context:
        logger.info(f"LLM (dummy) context: {json.dumps(context, indent=2, ensure_ascii=False)}")
        llm_metadata["context_provided"] = True
    return emotion, conf, llm_metadata

def get_emotion_analysis(
    text: str, session_context: Optional[Dict[str, Any]] = None
) -> Optional[EmotionResult]:
    if not text or not isinstance(text, str) or text.isspace():
        logger.warning("get_emotion_analysis: empty/invalid text.")
        return None

    cleaned_text = clean_text(text)
    if not cleaned_text:
        logger.warning("get_emotion_analysis: text empty after cleaning.")
        return None

    detected_lang = detect_language_robust(cleaned_text)
    logger.info(f"Analyzing (lang: {detected_lang.value}): "{cleaned_text}"")

    local_emotion, local_conf = analyze_sentiment_local(cleaned_text, detected_lang)
    source = "local_model"
    llm_log = None
    final_emotion, final_conf = local_emotion, local_conf

    if local_conf < EMOTION_CONFIDENCE_THRESHOLD:
        logger.info(f"Local conf ({local_conf:.2f}) < threshold. Trying LLM.")
        providers = ["openai", "claude", "mistral"]
        chosen_provider = next((p for p in providers if (p == "openai" and OPENAI_API_KEY) or \
                                                       (p == "claude" and CLAUDE_API_KEY) or \
                                                       (p == "mistral" and MISTRAL_API_KEY)), None)
        if chosen_provider:
            llm_emo, llm_c, llm_att_log = analyze_sentiment_llm(
                cleaned_text, detected_lang, provider=chosen_provider,
                context=session_context if CONTEXT_AWARE_RESPONSES else None
            )
            llm_log = llm_att_log
            if llm_emo and llm_c > local_conf:
                logger.info(f"LLM ({chosen_provider}) better. Using LLM result.")
                final_emotion, final_conf = llm_emo, llm_c
                source = f"llm_{chosen_provider}"
            else:
                logger.info(f"LLM ({chosen_provider}) no better or failed. Using local.")
        else:
            logger.warning("No LLM provider with API key. Using local.")
    else:
        logger.info("Local model confidence sufficient.")

    score = final_conf if final_emotion not in [SupportedEmotion.ANGER, SupportedEmotion.FEAR, SupportedEmotion.SADNESS] else -final_conf

    return EmotionResult(
        emotion=final_emotion,
        score=score,
        confidence=final_conf,
        language=detected_lang,
        raw_output={
            "source": source,
            "local_details": {"e": local_emotion.value, "c": local_conf} if source != "local_model" else None,
            "llm_details": llm_log
        }
    )

if __name__ == "__main__":
    print("\n--- Testing Sentiment Analyzer Utility ---")
    if detect: print(f"Langdetect: '안녕하세요' -> {detect('안녕하세요')}, 'Hello world' -> {detect('Hello world')}")
    else: print("Langdetect not installed or import failed.")

    texts = [
        ("I am feeling very happy and joyful today!", None),
        ("이건 정말 슬픈 소식이야.", None),
        ("This is neutral.", None),
        ("I'm so angry I could scream!", {"user_history": "lost last 3 games"}),
        ("정말 놀라운 결과입니다!", {"user_segment": "VIP"}),
        ("", None), (None, None)
    ]
    # Simulate API keys for testing fallback
    OPENAI_API_KEY = "dummy_openai_key"
    EMOTION_CONFIDENCE_THRESHOLD = 0.7 # To encourage LLM fallback

    for text, ctx in texts:
        print(f"\nAnalyzing: '{text}' (Context: {ctx is not None})")
        result = get_emotion_analysis(text, ctx)
        if result:
            print(f"  Emotion: {result.emotion.name} ({result.get_display_emotion()})")
            print(f"  Score: {result.score:.2f}, Confidence: {result.confidence:.2f}")
            print(f"  Lang: {result.language.value}, Source: {json.dumps(result.raw_output, indent=2, ensure_ascii=False)}")
        else:
            print("  Analysis failed or text invalid.")
    print("\n--- End of Test ---")
