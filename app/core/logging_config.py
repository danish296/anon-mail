"""
Logging configuration for the application.
"""

import logging
import sys
from typing import Dict, Any


def setup_logging() -> None:
    """Setup structured logging for the application."""
    
    # Configure root logger
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        handlers=[
            logging.StreamHandler(sys.stdout)
        ]
    )
    
    # Configure specific loggers
    loggers = {
        "uvicorn": logging.INFO,
        "uvicorn.access": logging.INFO,
        "fastapi": logging.INFO,
        "app": logging.INFO,
    }
    
    for logger_name, level in loggers.items():
        logging.getLogger(logger_name).setLevel(level)


def log_structured_event(
    logger: logging.Logger,
    level: int,
    event: str,
    **kwargs: Any
) -> None:
    """Log a structured event with additional context."""
    
    extra_data = {
        "event": event,
        **kwargs
    }
    
    logger.log(level, f"Event: {event}", extra=extra_data)
