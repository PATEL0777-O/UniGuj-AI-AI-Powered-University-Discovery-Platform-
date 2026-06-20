from fastapi import APIRouter, HTTPException
from app.schemas.requests import CompareRequest
from app.services.university_service import university_service
from app.schemas.responses import ComparisonResponse

router = APIRouter()

@router.post("/", response_model=ComparisonResponse)
async def compare_universities(request: CompareRequest):
    if len(request.university_ids) < 2:
        raise HTTPException(status_code=400, detail="Need at least 2 universities to compare")
    if len(request.university_ids) > 4:
        raise HTTPException(status_code=400, detail="Can compare maximum 4 universities")

    universities = await university_service.get_universities_for_comparison(request.university_ids)

    if len(universities) != len(request.university_ids):
        raise HTTPException(status_code=404, detail="One or more universities not found")

    # Calculate comparison metrics
    metrics = {
        "fees_comparison": {},
        "placement_comparison": {},
        "ranking_comparison": {},
        "facilities_comparison": {}
    }

    for uni in universities:
        uni_name = uni["name"]

        # Fees
        avg_fees = sum(c["fees"] for c in uni.get("courses", [])) / max(len(uni.get("courses", [])), 1)
        metrics["fees_comparison"][uni_name] = round(avg_fees)

        # Placement
        avg_package = sum(c.get("placement_stats", {}).get("avg_package", 0) for c in uni.get("courses", [])) / max(len(uni.get("courses", [])), 1)
        metrics["placement_comparison"][uni_name] = round(avg_package, 1)

        # Ranking
        metrics["ranking_comparison"][uni_name] = uni.get("rankings", {}).get("nirf", 999)

        # Facilities
        metrics["facilities_comparison"][uni_name] = len(uni.get("facilities", []))

    return {"universities": universities, "metrics": metrics}
