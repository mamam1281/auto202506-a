from __future__ import annotations
import json
import logging
import os
import random
from pathlib import Path
from typing import List, Dict, Any, Optional
from pydantic import BaseModel # Ensure BaseModel is imported

from ..emotion_models import EmotionResult, SupportedEmotion, SupportedLanguage

logger = logging.getLogger(__name__)
OPENAI_API_KEY_FEEDBACK = os.getenv("OPENAI_API_KEY")

class FeedbackResponse(BaseModel):
    text: str
    animation_meta: Optional[Dict[str, Any]] = None
    source: str # "template", "template_fallback", or "llm"

class EmotionFeedbackService:
    def __init__(self, templates_file_path: Optional[str] = None):
        base_dir = Path(__file__).resolve().parent.parent
        self.templates_path = Path(templates_file_path) if templates_file_path else base_dir / "data" / "feedback_templates.json"
        self.templates = self._load_templates()
        logger.info(f"EmotionFeedbackService initialized. Templates: {self.templates_path}, Loaded: {bool(self.templates)}")

    def _load_templates(self) -> Dict[str, Any]:
        try:
            with open(self.templates_path, 'r', encoding='utf-8') as f: return json.load(f)
        except FileNotFoundError: logger.error(f"Feedback templates file not found: {self.templates_path}"); return {}
        except json.JSONDecodeError: logger.error(f"Error decoding JSON: {self.templates_path}"); return {}

    async def _generate_feedback_with_llm(self, emotion: EmotionResult, user_segment: Optional[str], mission_type: Optional[str], language: SupportedLanguage, context_text: Optional[str]=None) -> Optional[FeedbackResponse]:
        logger.info(f"Attempting LLM fallback for feedback (dummy) for lang {language.value}.")
        if not OPENAI_API_KEY_FEEDBACK:
            logger.warning("LLM API key for feedback not configured."); return None

        prompt = f"User feels {emotion.emotion.value} (score {emotion.score:.2f}, conf {emotion.confidence:.2f}) in {language.value}."
        # Add more context to prompt here...
        logger.info(f"LLM Feedback Prompt (dummy): {prompt[:200]}") # Log truncated prompt

        llm_text = f"LLM says: You feel {emotion.emotion.name.lower()}!"
        if language == SupportedLanguage.KOREAN: llm_text = f"LLM 메시지: {emotion.emotion.name} 감정이시네요!"
        return FeedbackResponse(text=llm_text, animation_meta={"type": "llm_pulse"}, source="llm")

    async def get_emotion_feedback(
        self, emotion_result: EmotionResult, user_segment: str = "GENERAL",
        mission_type: str = "GENERAL", context_text: Optional[str] = None
    ) -> Optional[FeedbackResponse]:
        logger.info(f"Getting feedback for emotion: {emotion_result.emotion.value}, lang: {emotion_result.language.value}, seg: {user_segment}, mission: {mission_type}")
        lang_code = emotion_result.language.value
        selected_template = None

        if lang_code in self.templates:
            lang_templates = self.templates[lang_code]
            key_options = []
            emo_name = emotion_result.emotion.name
            # Simplified key generation
            if emotion_result.score > 0.5 : prefix = "SUCCESS_HIGH_"
            elif emotion_result.score < -0.5: prefix = "FAILURE_LOW_"
            else: prefix = "NEUTRAL_"

            key_options.append(f"{prefix}{emo_name}_{user_segment.upper()}_{mission_type.upper()}")
            key_options.append(f"{prefix}{emo_name}_{user_segment.upper()}")
            key_options.append(f"{prefix}{emo_name}_GENERAL")
            if user_segment.upper() == "NEW_USER": key_options.append("NEW_USER_NEUTRAL_WELCOME")
            key_options.append("NEUTRAL_NEUTRAL_GENERAL") # Ultimate fallback within templates

            for key in key_options:
                if key in lang_templates and lang_templates[key]:
                    choice = random.choice(lang_templates[key])
                    selected_template = FeedbackResponse(text=choice["text"], animation_meta=choice.get("animation"), source="template")
                    logger.info(f"Selected template for key '{key}'"); break

        if not selected_template:
            logger.warning(f"No template for lang {lang_code}, context. Trying LLM.")
            selected_template = await self._generate_feedback_with_llm(emotion_result, user_segment, mission_type, emotion_result.language, context_text)

        if not selected_template: logger.error("Failed to get feedback."); return None
        return selected_template
