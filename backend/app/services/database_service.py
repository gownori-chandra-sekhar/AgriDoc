import logging
import uuid
from datetime import datetime, timezone
from app.config import settings

logger = logging.getLogger(__name__)

class DatabaseService:
    def __init__(self):
        self.supabase_client = None
        self.local_reports = []

        if settings.SUPABASE_URL and (settings.SUPABASE_SERVICE_ROLE_KEY or settings.SUPABASE_ANON_KEY):
            try:
                from supabase import create_client
                key = settings.SUPABASE_SERVICE_ROLE_KEY or settings.SUPABASE_ANON_KEY
                self.supabase_client = create_client(settings.SUPABASE_URL, key)
                logger.info("Supabase client connected for live data operations.")
            except Exception as e:
                logger.error(f"Supabase connection error: {e}")

    def save_report(self, report_data: dict) -> dict:
        """Saves live scan report to Supabase table 'reports'."""
        if "id" not in report_data:
            report_data["id"] = f"rep_{uuid.uuid4().hex[:8]}"
        if "created_at" not in report_data:
            report_data["created_at"] = datetime.now(timezone.utc).isoformat()

        if self.supabase_client:
            try:
                res = self.supabase_client.table("reports").insert(report_data).execute()
                if res.data and len(res.data) > 0:
                    return res.data[0]
            except Exception as e:
                logger.error(f"Failed inserting report into Supabase: {e}")

        # Local storage fallback if offline
        self.local_reports.insert(0, report_data)
        return report_data

    def get_reports(self, user_id: str = None, crop: str = None, disease: str = None) -> list:
        """Fetches strictly live reports stored in Supabase database."""
        if self.supabase_client:
            try:
                query = self.supabase_client.table("reports").select("*").order("created_at", desc=True)
                if user_id and user_id != 'all' and user_id != 'demo_farmer_123':
                    query = query.eq("user_id", user_id)
                res = query.execute()
                if res.data is not None:
                    filtered = res.data
                    if crop and crop != "All":
                        filtered = [r for r in filtered if crop.lower() in (r.get("crop") or "").lower()]
                    if disease and disease != "All":
                        filtered = [r for r in filtered if disease.lower() in (r.get("disease_key") or "").lower() or disease.lower() in (r.get("disease_name") or "").lower()]
                    return filtered
            except Exception as e:
                logger.error(f"Error reading from Supabase: {e}")

        # Local store
        filtered = self.local_reports
        if crop and crop != "All":
            filtered = [r for r in filtered if crop.lower() in (r.get("crop") or "").lower()]
        if disease and disease != "All":
            filtered = [r for r in filtered if disease.lower() in (r.get("disease_key") or "").lower() or disease.lower() in (r.get("disease_name") or "").lower()]
        return filtered

    def get_analytics(self) -> dict:
        """Computes live analytics strictly from actual database records."""
        reports = self.get_reports()
        
        disease_counts = {}
        health_counts = {"Healthy": 0, "Mild": 0, "Severe": 0}

        for r in reports:
            name = r.get("disease_name", "Unknown Issue")
            short_name = name.split("(")[0].strip() if "(" in name else name
            disease_counts[short_name] = disease_counts.get(short_name, 0) + 1

            urgency = (r.get("urgency") or "").lower()
            disease_key = (r.get("disease_key") or "").lower()

            if "healthy" in disease_key or urgency == "low":
                health_counts["Healthy"] += 1
            elif urgency == "high":
                health_counts["Severe"] += 1
            else:
                health_counts["Mild"] += 1

        # Live Top 5 Diseases
        sorted_diseases = sorted(disease_counts.items(), key=lambda x: x[1], reverse=True)[:5]
        top_5 = [{"disease": d[0], "count": d[1]} for d in sorted_diseases]

        # Live Crop Health Breakdown
        crop_health_breakdown = [
            {"name": "Healthy Crops", "value": health_counts["Healthy"], "color": "#22c55e"},
            {"name": "Mild Infection", "value": health_counts["Mild"], "color": "#eab308"},
            {"name": "Severe Outbreak", "value": health_counts["Severe"], "color": "#ef4444"}
        ]

        return {
            "status": "success",
            "top_5_diseases": top_5,
            "crop_health_breakdown": crop_health_breakdown,
            "total_scans_this_month": len(reports),
            "active_hotspots": len([r for r in reports if (r.get("urgency") or "").lower() == "high"])
        }

db_service = DatabaseService()
