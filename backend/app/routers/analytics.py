from fastapi import APIRouter
from app.services.database_service import db_service

router = APIRouter(prefix="/api", tags=["Analytics"])

@router.get("/analytics")
async def get_analytics_summary():
    """
    Returns live analytics dynamically computed from Supabase database reports.
    """
    return db_service.get_analytics()
