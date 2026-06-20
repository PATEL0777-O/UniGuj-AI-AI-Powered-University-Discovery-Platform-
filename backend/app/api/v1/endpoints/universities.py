from fastapi import APIRouter, Query, HTTPException
from typing import Optional, List
from app.services.university_service import university_service
from app.schemas.responses import UniversityResponse

router = APIRouter()

@router.get("/", response_model=List[UniversityResponse])
async def list_universities(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    city: Optional[str] = None,
    course: Optional[str] = None,
    type_filter: Optional[str] = None,
    min_fees: Optional[int] = None,
    max_fees: Optional[int] = None
):
    return await university_service.get_all_universities(
        skip=skip, limit=limit, city=city, course=course,
        type_filter=type_filter, min_fees=min_fees, max_fees=max_fees
    )

@router.get("/search")
async def search_universities(q: str = Query(..., min_length=1)):
    return await university_service.search_universities(q)

@router.get("/top")
async def get_top_universities(limit: int = Query(10, ge=1, le=20)):
    return await university_service.get_top_universities(limit)

@router.get("/{university_id}", response_model=UniversityResponse)
async def get_university(university_id: str):
    uni = await university_service.get_university_by_id(university_id)
    if not uni:
        raise HTTPException(status_code=404, detail="University not found")
    return uni
