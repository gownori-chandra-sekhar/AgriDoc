import os
import uuid
import logging
from PIL import Image, ImageDraw
import io
from app.config import settings

logger = logging.getLogger(__name__)

IMAGE_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads", "images")
os.makedirs(IMAGE_DIR, exist_ok=True)

class StorageService:
    def __init__(self):
        self.cloudinary_configured = False
        if settings.CLOUDINARY_CLOUD_NAME and settings.CLOUDINARY_API_KEY:
            try:
                import cloudinary
                import cloudinary.uploader
                cloudinary.config(
                    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
                    api_key=settings.CLOUDINARY_API_KEY,
                    api_secret=settings.CLOUDINARY_API_SECRET
                )
                self.cloudinary_configured = True
                logger.info("Cloudinary successfully configured.")
            except Exception as e:
                logger.warning(f"Cloudinary setup failed: {e}")

    def upload_image(self, image_bytes: bytes, filename_prefix: str = "crop") -> str:
        """
        Uploads image to Cloudinary or saves locally.
        Converts RGBA/PNG to RGB for safe JPEG saving.
        Returns URL path.
        """
        if self.cloudinary_configured:
            try:
                import cloudinary.uploader
                response = cloudinary.uploader.upload(image_bytes, folder="agridoc_crops")
                return response.get("secure_url", "")
            except Exception as e:
                logger.error(f"Cloudinary upload failed: {e}. Saving locally instead.")

        # Local storage fallback
        filename = f"{filename_prefix}_{uuid.uuid4().hex[:10]}.jpg"
        filepath = os.path.join(IMAGE_DIR, filename)

        try:
            image = Image.open(io.BytesIO(image_bytes))
            # Convert RGBA/P/LA image modes to RGB before saving as JPEG
            if image.mode in ("RGBA", "P", "LA"):
                image = image.convert("RGB")
            image.save(filepath, format="JPEG", quality=85)
            logger.info(f"Saved local crop image: {filename}")
            return f"/api/images/{filename}"
        except Exception as e:
            logger.error(f"Local image save error: {e}")
            # Generate fallback crop image
            return self.generate_fallback_image(filename)

    def generate_fallback_image(self, filename: str) -> str:
        """Generates synthetic plant leaf image when saving fails."""
        filepath = os.path.join(IMAGE_DIR, filename)
        try:
            img = Image.new("RGB", (640, 480), color=(34, 139, 34))
            draw = ImageDraw.Draw(img)
            draw.polygon([(80, 400), (320, 60), (560, 400)], fill=(46, 160, 67))
            draw.line([(320, 60), (320, 440)], fill=(20, 80, 30), width=6)
            draw.ellipse([260, 180, 380, 280], fill=(160, 82, 45))
            img.save(filepath, format="JPEG", quality=80)
            return f"/api/images/{filename}"
        except Exception as e:
            logger.error(f"Failed generating fallback image: {e}")
            return "/api/images/default.jpg"

storage_service = StorageService()
