from fastapi import APIRouter, Query
from typing import Optional
from app.core.dependencies import get_db
from app.schemas.responses import ScholarshipResponse
from datetime import datetime

router = APIRouter()

@router.get("/", response_model=list)
async def list_scholarships(
    category: Optional[str] = None,
    min_marks: Optional[float] = None,
    income_limit: Optional[float] = None,
    course_level: Optional[str] = None
):
    db = get_db()
    query = {}

    if category:
        query["eligibility.category"] = {"$in": [category]}
    if min_marks is not None:
        query["eligibility.min_marks"] = {"$lte": min_marks}
    if income_limit is not None:
        query["eligibility.income_limit"] = {"$gte": income_limit}
    if course_level:
        query["eligibility.course_level"] = course_level

    cursor = db.scholarships.find(query)
    scholarships = []
    async for doc in cursor:
        doc["id"] = str(doc.pop("_id"))
        scholarships.append(doc)
    return scholarships

@router.get("/eligible")
async def check_eligibility(
    marks: float = Query(..., ge=0, le=100),
    category: str = Query(...),
    income: float = Query(..., ge=0),
    course_level: str = Query(...)
):
    db = get_db()
    query = {
        "eligibility.min_marks": {"$lte": marks},
        "eligibility.category": {"$in": [category]},
        "eligibility.income_limit": {"$gte": income},
        "eligibility.course_level": {"$in": [course_level, "Any"]}
    }

    cursor = db.scholarships.find(query)
    eligible = []
    async for doc in cursor:
        doc["id"] = str(doc.pop("_id"))
        days_left = (doc["deadline"] - datetime.utcnow()).days
        doc["days_left"] = max(0, days_left)
        eligible.append(doc)

    return {"eligible_scholarships": eligible, "total": len(eligible)}

@router.get("/{scholarship_id}")
async def get_scholarship(scholarship_id: str):
    db = get_db()
    from bson import ObjectId
    doc = await db.scholarships.find_one({"_id": ObjectId(scholarship_id)})
    if not doc:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Scholarship not found")
    doc["id"] = str(doc.pop("_id"))
    return doc
