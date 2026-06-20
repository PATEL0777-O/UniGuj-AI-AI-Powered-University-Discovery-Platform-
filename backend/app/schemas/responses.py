from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    created_at: datetime

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class UniversityResponse(BaseModel):
    id: str
    name: str
    location: Dict[str, str]
    type: str
    established: int
    accreditation: List[str]
    courses: List[Dict[str, Any]]
    rankings: Dict[str, Any]
    facilities: List[str]
    images: List[str]
    virtual_tour_url: Optional[str]
    description: Optional[str]
    rating: Optional[float]

class ScholarshipResponse(BaseModel):
    id: str
    name: str
    provider: str
    eligibility: Dict[str, Any]
    amount: Dict[str, Any]
    deadline: datetime
    apply_link: str
    documents_required: List[str]
    description: Optional[str]

class PlacementResponse(BaseModel):
    id: str
    university_id: str
    university_name: str
    year: int
    company_name: str
    role: str
    package_lpa: float
    students_hired: int
    branch: str

class ChatResponse(BaseModel):
    response: str
    conversation_id: str
    suggestions: List[str]
    sources: Optional[List[Dict[str, str]]] = None

class ComparisonResponse(BaseModel):
    universities: List[UniversityResponse]
    metrics: Dict[str, Any]

class DashboardStats(BaseModel):
    total_universities: int
    total_courses: int
    total_scholarships: int
    total_placements: int
    active_students: int

class RecommendationResponse(BaseModel):
    universities: List[Dict[str, Any]]
    courses: List[Dict[str, Any]]
    career_paths: List[Dict[str, Any]]
    confidence_score: float
