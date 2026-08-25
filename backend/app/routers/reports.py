from fastapi import APIRouter, Query
from app.services.database_service import db_service

router = APIRouter(prefix="/api", tags=["Reports"])

@router.get("/reports")
async def get_reports(
    crop: str = Query(default="All"),
    disease: str = Query(default="All"),
    user_id: str = Query(default="demo_farmer_123")
):
    """
    Returns all disease scan reports for logged in user.
    """
    reports = db_service.get_reports(user_id=user_id, crop=crop, disease=disease)
    return {
        "status": "success",
        "count": len(reports),
        "reports": reports
    }
