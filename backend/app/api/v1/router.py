from fastapi import APIRouter
from app.api.v1.endpoints import auth, universities, compare, scholarships, placements, ai_chat, recommendations

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(universities.router, prefix="/universities", tags=["Universities"])
api_router.include_router(compare.router, prefix="/compare", tags=["Comparison"])
api_router.include_router(scholarships.router, prefix="/scholarships", tags=["Scholarships"])
api_router.include_router(placements.router, prefix="/placements", tags=["Placements"])
api_router.include_router(ai_chat.router, prefix="/ai", tags=["AI Chat"])
api_router.include_router(recommendations.router, prefix="/recommendations", tags=["Recommendations"])
