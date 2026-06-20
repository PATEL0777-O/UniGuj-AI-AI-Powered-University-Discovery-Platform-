from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import get_settings
import redis.asyncio as redis
from contextlib import asynccontextmanager

settings = get_settings()

# MongoDB
mongo_client: AsyncIOMotorClient | None = None

def get_db():
    if mongo_client is None:
        return None
    return mongo_client[settings.DATABASE_NAME]

async def connect_db():
    """Try to connect to MongoDB but don't raise on failure.

    This allows the FastAPI app to start even when MongoDB isn't available
    (useful for local development without Docker).
    """
    global mongo_client
    try:
        # Use a short server selection timeout so connection failures are fast
        mongo_client = AsyncIOMotorClient(settings.MONGODB_URI, serverSelectionTimeoutMS=2000)
        # Verify connection
        try:
            await mongo_client.admin.command('ping')
        except Exception:
            # Can't reach MongoDB; mark as None and continue
            print("Warning: MongoDB not available, continuing without DB.")
            mongo_client = None
    except Exception as e:
        print(f"Warning: MongoDB connection failed: {e}")
        mongo_client = None
    return mongo_client

async def close_db():
    global mongo_client
    if mongo_client:
        mongo_client.close()

# Redis
redis_client = None

async def get_redis():
    global redis_client
    if redis_client is None:
        try:
            redis_client = redis.from_url(settings.REDIS_URL, decode_responses=True)
            try:
                await redis_client.ping()
            except Exception:
                print("Warning: Redis not available, continuing without Redis.")
                await redis_client.close()
                redis_client = None
        except Exception as e:
            print(f"Warning: Redis initialization failed: {e}")
            redis_client = None
    return redis_client

async def close_redis():
    global redis_client
    if redis_client:
        try:
            await redis_client.close()
        except Exception:
            pass

@asynccontextmanager
async def lifespan(app):
    await connect_db()
    yield
    await close_db()
    await close_redis()
