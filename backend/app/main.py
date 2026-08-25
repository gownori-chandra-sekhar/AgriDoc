import os
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, Response
from PIL import Image, ImageDraw
from gtts import gTTS

from app.config import settings
from app.routers import scan, reports, robot, analytics

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("agridoc")

app = FastAPI(
    title="AgriDoc Dashboard API",
    description="Backend API for AgriDoc Autonomous Farm Robot Telemetry, Plant Disease Detection & Multilingual Voice Guidance",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static directories
UPLOADS_DIR = os.path.join(os.path.dirname(__file__), "uploads")
AUDIO_DIR = os.path.join(UPLOADS_DIR, "audio")
IMAGE_DIR = os.path.join(UPLOADS_DIR, "images")

os.makedirs(AUDIO_DIR, exist_ok=True)
os.makedirs(IMAGE_DIR, exist_ok=True)

# Mount static files
app.mount("/static/audio", StaticFiles(directory=AUDIO_DIR), name="static_audio")
app.mount("/static/images", StaticFiles(directory=IMAGE_DIR), name="static_images")

# Register Routers
app.include_router(scan.router)
app.include_router(reports.router)
app.include_router(robot.router)
app.include_router(analytics.router)

@app.get("/")
async def root():
    return {
        "app": "AgriDoc Dashboard API",
        "status": "online",
        "supported_languages": ["en", "te", "hi", "ta", "kn", "mr"],
        "version": "1.0.0"
    }

@app.get("/api/audio/{filename}")
async def get_audio_file(filename: str):
    """
    Serves TTS generated audio files. Dynamically generates sample audio if missing.
    """
    filepath = os.path.join(AUDIO_DIR, filename)
    if os.path.exists(filepath):
        return FileResponse(filepath, media_type="audio/mpeg")

    try:
        sample_filepath = os.path.join(AUDIO_DIR, f"gen_{filename}")
        if not os.path.exists(sample_filepath):
            tts = gTTS(text="AgriDoc Voice Advisory: Plant leaf disease scanned. Follow recommended fungicide instructions.", lang="en")
            tts.save(sample_filepath)
        return FileResponse(sample_filepath, media_type="audio/mpeg")
    except Exception as e:
        logger.error(f"Error serving audio: {e}")
        return Response(status_code=404, content="Audio file not found")

@app.get("/api/images/{filename}")
async def get_image_file(filename: str):
    """
    Serves stored scan images. Dynamically generates fallback crop image if missing.
    """
    filepath = os.path.join(IMAGE_DIR, filename)
    if os.path.exists(filepath):
        return FileResponse(filepath)

    # Generate synthetic leaf image on demand if missing
    try:
        gen_filepath = os.path.join(IMAGE_DIR, f"gen_{filename}.jpg")
        if not os.path.exists(gen_filepath):
            img = Image.new("RGB", (640, 480), color=(34, 139, 34))
            draw = ImageDraw.Draw(img)
            draw.polygon([(80, 400), (320, 60), (560, 400)], fill=(46, 160, 67))
            draw.line([(320, 60), (320, 440)], fill=(20, 80, 30), width=6)
            draw.ellipse([260, 180, 380, 280], fill=(160, 82, 45), outline=(139, 69, 19))
            img.save(gen_filepath, format="JPEG", quality=80)
        return FileResponse(gen_filepath, media_type="image/jpeg")
    except Exception as e:
        logger.error(f"Error serving image: {e}")
        return Response(status_code=404, content="Image file not found")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
