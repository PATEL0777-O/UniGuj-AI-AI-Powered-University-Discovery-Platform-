from app.core.dependencies import get_db
from app.services.university_service import university_service
from typing import List, Dict, Any

class RecommendationEngine:
    def __init__(self):
        self.db = None

    async def get_collection(self, name: str):
        if self.db is None:
            self.db = get_db()
        return self.db[name]

    async def get_recommendations(
        self,
        education: str,
        interests: List[str],
        skills: List[str],
        budget_max: float,
        preferred_location: str = None,
        preferred_course: str = None
    ) -> Dict[str, Any]:
        collection = await self.get_collection("universities")

        query = {}
        if preferred_location:
            query["location.city"] = {"$regex": preferred_location, "$options": "i"}

        cursor = collection.find(query).limit(20)
        universities = []
        async for doc in cursor:
            doc["id"] = str(doc.pop("_id"))
            universities.append(doc)

        scored_universities = []
        for uni in universities:
            score = self._calculate_university_score(
                uni, education, interests, skills, budget_max, preferred_course
            )
            if score > 0:
                scored_universities.append({**uni, "match_score": score})

        scored_universities.sort(key=lambda x: x["match_score"], reverse=True)

        matching_courses = self._extract_matching_courses(
            scored_universities[:5], interests, preferred_course, budget_max
        )

        career_paths = self._generate_career_paths(interests, skills)

        return {
            "universities": scored_universities[:5],
            "courses": matching_courses[:5],
            "career_paths": career_paths,
            "confidence_score": min(95, max(60, len(scored_universities) * 10))
        }

    def _calculate_university_score(
        self, uni: Dict, education: str, interests: List[str], 
        skills: List[str], budget_max: float, preferred_course: str
    ) -> float:
        score = 0.0

        for course in uni.get("courses", []):
            if course["fees"] <= budget_max:
                score += 20
                break

        if preferred_course:
            for course in uni.get("courses", []):
                if preferred_course.lower() in course["name"].lower():
                    score += 30

        uni_courses = " ".join([c["name"] for c in uni.get("courses", [])]).lower()
        for interest in interests:
            if interest.lower() in uni_courses:
                score += 10

        nirf = uni.get("rankings", {}).get("nirf", 100)
        score += max(0, (100 - nirf) * 0.3)

        rating = uni.get("rating", 0)
        score += rating * 5

        return score

    def _extract_matching_courses(
        self, universities: List[Dict], interests: List[str], 
        preferred_course: str, budget_max: float
    ) -> List[Dict]:
        courses = []
        for uni in universities:
            for course in uni.get("courses", []):
                if course["fees"] <= budget_max:
                    course_info = {
                        "name": course["name"],
                        "university": uni["name"],
                        "fees": course["fees"],
                        "duration": course["duration"],
                        "avg_package": course.get("placement_stats", {}).get("avg_package", 0),
                        "placement_rate": course.get("placement_stats", {}).get("placement_rate", 0)
                    }
                    courses.append(course_info)
        return courses

    def _generate_career_paths(self, interests: List[str], skills: List[str]) -> List[Dict]:
        paths = []

        tech_paths = {
            "software": {
                "course": "B.Tech CSE / MCA",
                "skills": ["Programming", "Data Structures", "Algorithms"],
                "roles": ["Software Engineer", "Full Stack Developer", "Tech Lead"],
                "salary_range": "Rs 4-25 LPA"
            },
            "data": {
                "course": "B.Tech CSE / M.Sc Data Science",
                "skills": ["Statistics", "Python", "Machine Learning"],
                "roles": ["Data Analyst", "Data Scientist", "ML Engineer"],
                "salary_range": "Rs 5-30 LPA"
            },
            "management": {
                "course": "MBA",
                "skills": ["Leadership", "Communication", "Strategy"],
                "roles": ["Business Analyst", "Product Manager", "CEO"],
                "salary_range": "Rs 6-40 LPA"
            }
        }

        for interest in interests:
            interest_lower = interest.lower()
            for key, path in tech_paths.items():
                if key in interest_lower or any(key in skill.lower() for skill in skills):
                    paths.append(path)
                    break

        if not paths:
            paths.append({
                "course": "B.Tech / B.Sc / B.Com",
                "skills": skills[:3] if skills else ["Communication", "Problem Solving"],
                "roles": ["Graduate Trainee", "Analyst", "Manager"],
                "salary_range": "Rs 3-15 LPA"
            })

        return paths[:3]

recommendation_engine = RecommendationEngine()
