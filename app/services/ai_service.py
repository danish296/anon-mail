"""
AI service using Google Gemini for content generation.
"""

import logging
from typing import Dict, Any

import google.generativeai as genai

from app.core.config import settings
from app.core.exceptions import AIServiceError, ConfigurationError

logger = logging.getLogger(__name__)


class AIService:
    """Service for AI-powered content generation using Google Gemini."""
    
    def __init__(self):
        """Initialize the AI service."""
        if not settings.GEMINI_API_KEY:
            raise ConfigurationError("GEMINI_API_KEY is not configured")
        
        # Configure Gemini
        genai.configure(api_key=settings.GEMINI_API_KEY)
        # You can change the model here:
        # Options: 'gemini-2.5-flash', 'gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-pro', 'gemini-1.0-pro'
        self.model = genai.GenerativeModel('gemini-2.5-flash')
        
        logger.info("AI service initialized successfully")
    
    async def generate_email_body(self, subject: str) -> str:
        """
        Generate email body content based on subject using Gemini.
        
        Args:
            subject: Email subject line
            
        Returns:
            Generated email body content
            
        Raises:
            AIServiceError: If AI generation fails
        """
        try:
            # Create prompt for email body generation
            prompt = f"""You are an expert email writer. Write a complete, professional email body based ONLY on this subject: "{subject}"

CRITICAL: The email body MUST be directly related to and expand upon the subject line "{subject}".

Instructions:
1. Start with an appropriate greeting (e.g., "Hi," or "Hello,")
2. Write 2-4 paragraphs that are SPECIFICALLY about "{subject}"
3. The content must logically follow from the subject line
4. Use a professional yet friendly tone
5. End with an appropriate closing (e.g., "Best regards," or "Thanks,")
6. Do NOT repeat the subject line in the body
7. Do NOT write generic content - make it specific to "{subject}"

Example: If subject is "Trip Tomorrow", write about the trip happening tomorrow - details, reminders, plans, etc.

Now write the email body:"""
            
            logger.info(f"Generating email body for subject: {subject}")
            
            # Generate content
            response = self.model.generate_content(prompt)
            
            if not response.text:
                raise AIServiceError("AI service returned empty response")
            
            generated_body = response.text.strip()
            logger.info("Email body generated successfully")
            
            return generated_body
            
        except Exception as e:
            logger.error(f"Failed to generate email body: {str(e)}")
            raise AIServiceError(f"Failed to generate email body: {str(e)}")
    
    async def validate_subject(self, subject: str) -> bool:
        """
        Validate subject line for AI generation.
        
        Args:
            subject: Subject line to validate
            
        Returns:
            True if subject is valid, False otherwise
        """
        if not subject or not subject.strip():
            return False
        
        # Check for minimum length and reasonable content
        if len(subject.strip()) < 2:
            return False
        
        return True
