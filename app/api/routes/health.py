"""
Health check endpoints.
"""

import logging
from fastapi import APIRouter
from pydantic import BaseModel

from app.core.config import settings

logger = logging.getLogger(__name__)
router = APIRouter()


class HealthResponse(BaseModel):
    """Health check response model."""
    
    status: str
    app_name: str
    version: str


@router.get("/", response_model=HealthResponse)
async def health_check():
    """
    Health check endpoint.
    
    Returns:
        Health status of the API
    """
    logger.info("Health check requested")
    
    return HealthResponse(
        status="API is running",
        app_name=settings.APP_NAME,
        version=settings.APP_VERSION
    )
