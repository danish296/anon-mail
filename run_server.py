#!/usr/bin/env python3
"""
Startup script for Quick Mail Sender API.
"""

import uvicorn
from app.core.config import settings

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8000,
        reload=settings.DEBUG,
        log_level="info"
    )
