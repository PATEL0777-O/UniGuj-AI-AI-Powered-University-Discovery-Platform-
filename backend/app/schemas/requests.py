from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    name: str = Field(..., min_length=2)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class ChatRequest(BaseModel):
    query: str = Field(..., min_length=1)
    conversation_id: Optional[str] = None
    context: Optional[Dict[str, Any]] = None

class CompareRequest(BaseModel):
    university_ids: List[str] = Field(..., min_length=2, max_length=4)

class ScholarshipFilter(BaseModel):
    category: Optional[str] = None
    min_marks: Optional[float] = None
    income_limit: Optional[float] = None
    course_level: Optional[str] = None

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    education: Optional[str] = None
    interests: Optional[List[str]] = None
    skills: Optional[List[str]] = None
    preferred_location: Optional[str] = None
    budget_range: Optional[Dict[str, float]] = None

class BookmarkAction(BaseModel):
    university_id: str
    action: str = Field(..., pattern="^(add|remove)$")

class RecommendationRequest(BaseModel):
    education: str
    interests: List[str]
    skills: List[str]
    budget_max: float
    preferred_location: Optional[str] = None
    preferred_course: Optional[str] = None
