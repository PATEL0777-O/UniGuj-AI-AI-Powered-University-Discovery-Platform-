from app.core.dependencies import get_db
from bson import ObjectId
from typing import List, Dict, Any, Optional

class UniversityService:
    def __init__(self):
        self.db = None

    async def get_collection(self):
        if self.db is None:
            self.db = get_db()
        return self.db["universities"]

    async def get_all_universities(
        self, 
        skip: int = 0, 
        limit: int = 50,
        city: Optional[str] = None,
        course: Optional[str] = None,
        type_filter: Optional[str] = None,
        min_fees: Optional[int] = None,
        max_fees: Optional[int] = None
    ) -> List[Dict[str, Any]]:
        collection = await self.get_collection()
        query = {}

        if city:
            query["location.city"] = {"$regex": city, "$options": "i"}
        if type_filter:
            query["type"] = type_filter
        if course:
            query["courses.name"] = {"$regex": course, "$options": "i"}
        if min_fees is not None or max_fees is not None:
            fees_query = {}
            if min_fees is not None:
                fees_query["$gte"] = min_fees
            if max_fees is not None:
                fees_query["$lte"] = max_fees
            query["courses.fees"] = fees_query

        cursor = collection.find(query).skip(skip).limit(limit)
        universities = []
        async for doc in cursor:
            doc["id"] = str(doc.pop("_id"))
            universities.append(doc)
        return universities

    async def get_university_by_id(self, university_id: str) -> Optional[Dict[str, Any]]:
        collection = await self.get_collection()
        doc = await collection.find_one({"_id": ObjectId(university_id)})
        if doc:
            doc["id"] = str(doc.pop("_id"))
            return doc
        return None

    async def search_universities(self, query: str) -> List[Dict[str, Any]]:
        collection = await self.get_collection()
        search_query = {
            "$or": [
                {"name": {"$regex": query, "$options": "i"}},
                {"location.city": {"$regex": query, "$options": "i"}},
                {"courses.name": {"$regex": query, "$options": "i"}},
                {"description": {"$regex": query, "$options": "i"}}
            ]
        }
        cursor = collection.find(search_query).limit(20)
        universities = []
        async for doc in cursor:
            doc["id"] = str(doc.pop("_id"))
            universities.append(doc)
        return universities

    async def get_universities_for_comparison(self, university_ids: List[str]) -> List[Dict[str, Any]]:
        collection = await self.get_collection()
        object_ids = [ObjectId(uid) for uid in university_ids]
        cursor = collection.find({"_id": {"$in": object_ids}})
        universities = []
        async for doc in cursor:
            doc["id"] = str(doc.pop("_id"))
            universities.append(doc)
        return universities

    async def get_top_universities(self, limit: int = 10) -> List[Dict[str, Any]]:
        collection = await self.get_collection()
        cursor = collection.find().sort("rankings.nirf", 1).limit(limit)
        universities = []
        async for doc in cursor:
            doc["id"] = str(doc.pop("_id"))
            universities.append(doc)
        return universities

    async def get_context_for_ai(self, query: str) -> str:
        """Get relevant university data as context for AI responses"""
        universities = await self.search_universities(query)
        if not universities:
            return "No specific university data found for this query."

        context_parts = []
        for uni in universities[:3]:
            courses = ", ".join([c["name"] for c in uni.get("courses", [])[:5]])
            context_parts.append(
                f"{uni['name']} ({uni['location']['city']}): "
                f"Type: {uni['type']}, Established: {uni['established']}, "
                f"NIRF Rank: {uni.get('rankings', {}).get('nirf', 'N/A')}, "
                f"Courses: {courses}"
            )
        return "\n".join(context_parts)

university_service = UniversityService()
