from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from app.schemas.requests import ChatRequest
from app.services.gemini_service import gemini_service_instance
from app.services.university_service import university_service
from app.core.dependencies import get_db
from bson import ObjectId
import json

router = APIRouter()

@router.post("/chat")
async def chat_with_ai(request: ChatRequest):
    # Get context from university data
    context = await university_service.get_context_for_ai(request.query)

    # Get conversation history if provided
    conversation_history = []
    if request.conversation_id:
        db = get_db()
        conv = await db.conversations.find_one({"_id": ObjectId(request.conversation_id)})
        if conv:
            conversation_history = conv.get("messages", [])

    async def generate_stream():
        full_response = ""
        async for chunk in gemini_service_instance.generate_response(
            request.query, context, conversation_history
        ):
            full_response += chunk
            yield f"data: {json.dumps({'chunk': chunk})}\n\n"

        # Send suggestions at the end
        suggestions = await gemini_service_instance.generate_suggestions(request.query)
        yield f"data: {json.dumps({'suggestions': suggestions, 'done': True})}\n\n"

    return StreamingResponse(
        generate_stream(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "Connection": "keep-alive"}
    )

@router.post("/chat/json")
async def chat_with_ai_json(request: ChatRequest):
    context = await university_service.get_context_for_ai(request.query)

    # For non-streaming response
    response_text = ""
    async for chunk in gemini_service_instance.generate_response(request.query, context):
        response_text += chunk

    suggestions = await gemini_service_instance.generate_suggestions(request.query)

    return {
        "response": response_text,
        "conversation_id": request.conversation_id or "new",
        "suggestions": suggestions,
        "sources": []
    }
