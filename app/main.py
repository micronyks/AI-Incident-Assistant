from fastapi import FastAPI
from fastapi import Depends

from sqlalchemy import text
from sqlalchemy.orm import Session

from app.database.session import get_db

from app.config.settings import settings
from app.core.logging import configure_logging
from app.api.routes.request import router as request_router
from app.api.routes.ai import router as ai_router
from app.api.routes.incidents import router as incident_router
from app.api.routes.github_webhook import router as github_webhook_router

configure_langsmith()

configure_logging()

import logging

logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.app_name,
    description="Production-grade AI powered enterprise request management platform.",
    version=settings.app_version,
)

app.include_router(request_router)
app.include_router(ai_router)
app.include_router(incident_router)
app.include_router(github_webhook_router)


@app.get("/")
async def root():
    return {
        "message": f"Welcome to {settings.app_name}",
        "environment": settings.environment,
    }


@app.get("/health")
async def health(db: Session = Depends(get_db)):
    logger.info("Health endpoint called")

    db.execute(text("SELECT 1"))

    return {
        "status": "UP",
        "database": "Connected",
        "version": settings.app_version,
    }