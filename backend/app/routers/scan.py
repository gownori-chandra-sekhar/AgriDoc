import os
import json
import logging
from fastapi import APIRouter, UploadFile, File, Header, HTTPException
from app.services.yolo_service import yolo_service
from app.services.storage_service import storage_service
from app.services.tts_service import tts_service
from app.services.database_service import db_service
from app.services.fcm_service import fcm_service

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api", tags=["Scan"])

# Load knowledge_db.json
KNOWLEDGE_DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "knowledge_db.json")

def load_knowledge_db():
    try:
        with open(KNOWLEDGE_DB_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        logger.error(f"Error loading knowledge_db.json: {e}")
        return {}

KNOWLEDGE_DB = load_knowledge_db()

@router.post("/scan")
async def scan_plant(
    file: UploadFile = File(...),
    gps: str = Header(default="16.5062, 80.6480"),
    lang: str = Header(default="en")
):
    """
    Scans plant leaf image, predicts disease using YOLOv8, fetches translated remedy,
    generates TTS audio voice, saves to database, and triggers push notification.
    """
    if file.content_type and not (file.content_type.startswith("image/") or file.content_type == "application/octet-stream"):
        raise HTTPException(status_code=400, detail="Uploaded file must be an image.")

    image_bytes = await file.read()
    if not image_bytes:
        raise HTTPException(status_code=400, detail="Empty image file received.")

    # 1. Upload image
    image_url = storage_service.upload_image(image_bytes, filename_prefix="scan")

    # 2. Run YOLO model prediction
    prediction = yolo_service.predict(image_bytes)
    disease_key = prediction.get("disease_key", "leaf_blight")
    confidence = prediction.get("confidence", 0.95)
    bbox = prediction.get("bbox", [50, 50, 200, 200])

    # 3. Fetch solution from local KNOWLEDGE_DB JSON for disease & language
    disease_info = KNOWLEDGE_DB.get(disease_key, KNOWLEDGE_DB.get("leaf_blight", {}))
    
    # Selected language dictionary (fallback to English if lang missing)
    target_lang = lang.lower() if lang.lower() in ["en", "te", "hi", "ta", "kn", "mr"] else "en"
    translated = disease_info.get(target_lang, disease_info.get("en", {}))
    disease_names = disease_info.get("name", {})
    disease_name_str = disease_names.get(target_lang, disease_names.get("en", disease_key.replace("_", " ").title()))

    cause = translated.get("cause", "Fungal infection triggered by high atmospheric moisture.")
    solution = translated.get("solution", "1. Reduce irrigation. 2. Spray Copper Oxychloride.")
    urgency = translated.get("urgency", "High")
    crop = disease_info.get("crop", "Agriculture Crop")

    # 4. Generate localized TTS audio voice
    tts_text = f"Diagnosis: {disease_name_str}. Urgency: {urgency}. Remedial Actions: {solution}"
    audio_url = tts_service.generate_audio(tts_text, target_lang)

    # 5. Save report to Supabase / local DB
    report_data = {
        "disease_key": disease_key,
        "crop": crop,
        "disease_name": disease_name_str,
        "confidence": confidence,
        "cause": cause,
        "solution": solution,
        "urgency": urgency,
        "gps": gps,
        "image_url": image_url,
        "audio_url": audio_url,
        "bbox": bbox,
        "user_id": "demo_farmer_123"
    }

    saved_report = db_service.save_report(report_data)

    # 6. Send FCM push notification
    fcm_service.send_push_notification(
        title=f"🚨 Alert: {disease_name_str} Detected",
        body=f"Urgency: {urgency}. Tap to listen to voice instructions in your language.",
        data={"report_id": saved_report.get("id"), "audio_url": audio_url}
    )

    return {
        "id": saved_report.get("id"),
        "disease_key": disease_key,
        "disease": disease_name_str,
        "confidence": confidence,
        "cause": cause,
        "solution": solution,
        "urgency": urgency,
        "crop": crop,
        "report_text": f"Disease: {disease_name_str}\nCause: {cause}\nSolution:\n{solution}",
        "audio_url": audio_url,
        "image_url": image_url,
        "bbox": bbox,
        "gps": gps,
        "created_at": saved_report.get("created_at")
    }
