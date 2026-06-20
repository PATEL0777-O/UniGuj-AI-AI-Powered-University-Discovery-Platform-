import asyncio

async def seed_database():
    """Safe no-op seeder: attempts to access DB only if available.

    This prevents startup failures when MongoDB is not installed locally.
    """
    try:
        # import here to avoid circular imports at module import time
        from app.core.dependencies import get_db

        db = get_db()
        if not db:
            return

        # Try a lightweight operation to verify connection without failing
        try:
            await db.list_collection_names()
        except Exception:
            # If any DB op fails, skip seeding silently
            return
    except Exception:
        # If dependencies are not available for any reason, skip seeding
        return
