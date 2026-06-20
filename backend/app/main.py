from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import get_settings
from app.core.dependencies import lifespan
from app.api.v1.router import api_router
from app.utils.data_seeder import seed_database
import asyncio

settings = get_settings()

app = FastAPI(
    title="UniGuj AI API",
    description="AI-powered EdTech platform for Gujarat universities",
    version="1.0.0",
    lifespan=lifespan
)

# CORS
origins = settings.CORS_ORIGINS.split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
async def root():
    return {
        "message": "Welcome to UniGuj AI API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "uniguj-ai-api"}

@app.get("/readiness")
async def readiness_check():
    return {"status": "ready"}

@app.on_event("startup")
async def startup_event():
    # Seed database on startup
    try:
        await seed_database()
    except Exception as e:
        print(f"Seeding error (may already be seeded): {e}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
