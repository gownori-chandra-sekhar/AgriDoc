import os
import uuid
import logging
from gtts import gTTS

logger = logging.getLogger(__name__)

# Directory to host generated audio locally
AUDIO_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads", "audio")
os.makedirs(AUDIO_DIR, exist_ok=True)

# Language code mapping for gTTS
GTTS_LANG_MAP = {
    "en": "en",
    "te": "te",
    "hi": "hi",
    "ta": "ta",
    "kn": "kn",
    "mr": "mr"
}

class TTSService:
    def generate_audio(self, text: str, lang: str = "en") -> str:
        """
        Generates TTS audio mp3 file for given text and language.
        Returns relative URL or path to access the audio.
        """
        try:
            gtts_lang = GTTS_LANG_MAP.get(lang, "en")
            # Truncate text if extremely long for faster audio generation
            clean_text = text.replace("\n", " ").strip()
            if len(clean_text) > 400:
                clean_text = clean_text[:400] + "..."

            filename = f"speech_{uuid.uuid4().hex[:10]}.mp3"
            filepath = os.path.join(AUDIO_DIR, filename)

            tts = gTTS(text=clean_text, lang=gtts_lang, slow=False)
            tts.save(filepath)

            logger.info(f"Generated TTS audio for lang={lang}: {filename}")
            return f"/api/audio/{filename}"

        except Exception as e:
            logger.error(f"TTS Generation failed: {e}. Falling back to default audio file.")
            # Return empty or fallback endpoint
            return f"/api/audio/default_alert.mp3"

tts_service = TTSService()
