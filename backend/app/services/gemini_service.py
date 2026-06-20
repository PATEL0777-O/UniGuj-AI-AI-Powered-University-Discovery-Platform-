import httpx
import json
from typing import AsyncGenerator, Dict, Any, Optional
from app.core.config import get_settings

settings = get_settings()

class GeminiService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.base_url = "https://generativelanguage.googleapis.com/v1beta"
        self.model = "gemini-2.0-flash"

    async def generate_response(
        self, 
        query: str, 
        context: str = "",
        conversation_history: Optional[list] = None
    ) -> AsyncGenerator[str, None]:
        """Stream response from Gemini API"""

        system_prompt = f"""You are UniGuj AI, an expert educational consultant for Gujarat universities. 
You help students find the best universities, courses, scholarships, and career paths.
Use the following context about Gujarat universities to answer accurately:

{context}

Guidelines:
- Be concise but informative
- Use bullet points for lists
- Include specific numbers when available
- If unsure, say so honestly
- Suggest follow-up questions when helpful"""

        contents = [{"role": "user", "parts": [{"text": system_prompt}]}]

        if conversation_history:
            for msg in conversation_history:
                role = "user" if msg.get("role") == "user" else "model"
                contents.append({"role": role, "parts": [{"text": msg.get("text", "")}]})

        contents.append({"role": "user", "parts": [{"text": query}]})

        url = f"{self.base_url}/models/{self.model}:streamGenerateContent?key={self.api_key}"

        payload = {
            "contents": contents,
            "generationConfig": {
                "temperature": 0.7,
                "maxOutputTokens": 2048,
                "topP": 0.9
            },
            "safetySettings": [
                {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
                {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
                {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
                {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"}
            ]
        }

        async with httpx.AsyncClient(timeout=60.0) as client:
            async with client.stream("POST", url, json=payload) as response:
                async for line in response.aiter_lines():
                    if line.startswith("data: "):
                        try:
                            data = json.loads(line[6:])
                            if "candidates" in data and data["candidates"]:
                                candidate = data["candidates"][0]
                                if "content" in candidate and "parts" in candidate["content"]:
                                    for part in candidate["content"]["parts"]:
                                        if "text" in part:
                                            yield part["text"]
                        except (json.JSONDecodeError, KeyError):
                            continue

    async def generate_suggestions(self, query: str) -> list:
        """Generate smart follow-up suggestions"""
        suggestions = [
            "Compare fees with other universities",
            "What are the placement statistics?",
            "Show available scholarships",
            "Tell me about campus facilities",
            "What courses are available?"
        ]
        return suggestions[:3]

gemini_service_instance = GeminiService()
