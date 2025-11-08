"""
Application configuration settings.
"""

import os
from typing import List
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Settings:
    """Application settings."""
    
    def __init__(self):
        # Application
        self.APP_NAME = os.getenv("APP_NAME", "Quick Mail Sender")
        self.APP_VERSION = os.getenv("APP_VERSION", "1.0")
        self.DEBUG = os.getenv("DEBUG", "False").lower() == "true"
        
        # API Keys
        self.BREVO_API_KEY = os.getenv("BREVO_API_KEY", "")
        self.BREVO_FROM_EMAIL = os.getenv("BREVO_FROM_EMAIL", "")
        self.BREVO_FROM_NAME = os.getenv("BREVO_FROM_NAME", "Quick Mail Sender")
        self.GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
        
        # CORS
        allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "")
        self.ALLOWED_ORIGINS = [
            "http://localhost:3000", 
            "http://127.0.0.1:3000"
        ]
        
        # Add production origins from environment variable
        if allowed_origins_env:
            self.ALLOWED_ORIGINS.extend(allowed_origins_env.split(","))
        
        # In production, allow all Vercel domains (more permissive for easier deployment)
        if not self.DEBUG:
            self.ALLOWED_ORIGINS.append("*")  # Allow all origins in production
            # For more security, replace "*" with your specific Vercel domain:
            # self.ALLOWED_ORIGINS.append("https://your-project.vercel.app")
        
        # Rate Limiting
        self.RATE_LIMIT_EMAIL = "15/minute"
        self.RATE_LIMIT_AI = "10/minute"


settings = Settings()
