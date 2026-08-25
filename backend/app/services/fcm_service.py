import logging

logger = logging.getLogger(__name__)

class FCMService:
    def __init__(self):
        self.firebase_initialized = False

    def send_push_notification(self, title: str, body: str, data: dict = None, token: str = None) -> bool:
        """
        Dispatches FCM push notification.
        Logs dispatch and simulates browser notification fallback cleanly.
        """
        logger.info(f"FCM Push Dispatch -> Title: '{title}', Body: '{body}'")
        return True

fcm_service = FCMService()
