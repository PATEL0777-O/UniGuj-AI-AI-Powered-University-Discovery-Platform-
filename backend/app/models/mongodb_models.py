from bson import ObjectId
from datetime import datetime
from typing import Optional, List, Dict, Any

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")

# University Model
university_schema = {
    "name": str,
    "location": {"city": str, "state": str},
    "type": str,  # Government | Private | Deemed
    "established": int,
    "accreditation": [str],
    "courses": [{
        "name": str,
        "duration": str,
        "fees": int,
        "seats": int,
        "eligibility": str,
        "placement_stats": {
            "avg_package": float,
            "highest_package": float,
            "placement_rate": int
        }
    }],
    "rankings": {"nirf": int, "state_rank": int},
    "facilities": [str],
    "contact": {"phone": str, "email": str, "website": str},
    "images": [str],
    "virtual_tour_url": str,
    "description": str,
    "rating": float,
    "updated_at": datetime
}

# Scholarship Model
scholarship_schema = {
    "name": str,
    "provider": str,
    "eligibility": {
        "min_marks": float,
        "category": [str],
        "income_limit": int,
        "course_level": str
    },
    "amount": {"type": str, "value": int},
    "deadline": datetime,
    "apply_link": str,
    "documents_required": [str],
    "description": str
}

# Placement Model
placement_schema = {
    "university_id": ObjectId,
    "year": int,
    "company_name": str,
    "role": str,
    "package_lpa": float,
    "students_hired": int,
    "branch": str
}

# User Model
user_schema = {
    "email": str,
    "password_hash": str,
    "name": str,
    "profile": {
        "education": str,
        "interests": [str],
        "skills": [str],
        "preferred_location": str,
        "budget_range": {"min": int, "max": int}
    },
    "bookmarks": [ObjectId],
    "chat_history": [{
        "query": str,
        "response": str,
        "timestamp": datetime
    }],
    "created_at": datetime
}
