from fastapi import APIRouter, Query
from typing import Optional
from app.core.dependencies import get_db

router = APIRouter()

@router.get("/")
async def list_placements(
    university_id: Optional[str] = None,
    year: Optional[int] = None,
    company: Optional[str] = None,
    branch: Optional[str] = None
):
    db = get_db()
    query = {}

    if university_id:
        query["university_id"] = university_id
    if year:
        query["year"] = year
    if company:
        query["company_name"] = {"$regex": company, "$options": "i"}
    if branch:
        query["branch"] = branch

    cursor = db.placements.find(query).sort("package_lpa", -1)
    placements = []
    async for doc in cursor:
        doc["id"] = str(doc.pop("_id"))
        placements.append(doc)
    return placements

@router.get("/stats")
async def get_placement_stats():
    db = get_db()

    # Aggregate stats
    pipeline = [
        {"$group": {
            "_id": "$university_name",
            "avg_package": {"$avg": "$package_lpa"},
            "highest_package": {"$max": "$package_lpa"},
            "total_hired": {"$sum": "$students_hired"},
            "count": {"$sum": 1}
        }},
        {"$sort": {"avg_package": -1}}
    ]

    stats = []
    async for doc in db.placements.aggregate(pipeline):
        stats.append({
            "university": doc["_id"],
            "avg_package": round(doc["avg_package"], 1),
            "highest_package": doc["highest_package"],
            "total_hired": doc["total_hired"],
            "company_count": doc["count"]
        })

    # Top companies
    company_pipeline = [
        {"$group": {
            "_id": "$company_name",
            "total_hired": {"$sum": "$students_hired"},
            "avg_package": {"$avg": "$package_lpa"}
        }},
        {"$sort": {"total_hired": -1}},
        {"$limit": 10}
    ]

    top_companies = []
    async for doc in db.placements.aggregate(company_pipeline):
        top_companies.append({
            "company": doc["_id"],
            "total_hired": doc["total_hired"],
            "avg_package": round(doc["avg_package"], 1)
        })

    # Branch-wise stats
    branch_pipeline = [
        {"$group": {
            "_id": "$branch",
            "avg_package": {"$avg": "$package_lpa"},
            "total_hired": {"$sum": "$students_hired"}
        }},
        {"$sort": {"avg_package": -1}}
    ]

    branch_stats = []
    async for doc in db.placements.aggregate(branch_pipeline):
        branch_stats.append({
            "branch": doc["_id"],
            "avg_package": round(doc["avg_package"], 1),
            "total_hired": doc["total_hired"]
        })

    return {
        "university_stats": stats,
        "top_companies": top_companies,
        "branch_stats": branch_stats
    }

@router.get("/trends")
async def get_placement_trends():
    db = get_db()

    pipeline = [
        {"$group": {
            "_id": "$year",
            "avg_package": {"$avg": "$package_lpa"},
            "total_hired": {"$sum": "$students_hired"}
        }},
        {"$sort": {"_id": 1}}
    ]

    trends = []
    async for doc in db.placements.aggregate(pipeline):
        trends.append({
            "year": doc["_id"],
            "avg_package": round(doc["avg_package"], 1),
            "total_hired": doc["total_hired"]
        })

    return trends
