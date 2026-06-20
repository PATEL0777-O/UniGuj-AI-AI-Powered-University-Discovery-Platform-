from fastapi import APIRouter
from app.schemas.requests import RecommendationRequest
from app.services.recommendation_engine import recommendation_engine

router = APIRouter()

@router.post("/")
async def get_recommendations(request: RecommendationRequest):
    return await recommendation_engine.get_recommendations(
        education=request.education,
        interests=request.interests,
        skills=request.skills,
        budget_max=request.budget_max,
        preferred_location=request.preferred_location,
        preferred_course=request.preferred_course
    )
