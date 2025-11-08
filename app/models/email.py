"""
Email-related Pydantic models.
"""

from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field


class AttachmentInfo(BaseModel):
    """Metadata for an attachment."""
    
    filename: str = Field(..., description="Attachment filename")
    content_type: str = Field(..., description="MIME type (e.g., application/pdf)")
    size: int = Field(..., description="File size in bytes")
    
    class Config:
        json_schema_extra = {
            "example": {
                "filename": "document.pdf",
                "content_type": "application/pdf",
                "size": 102400
            }
        }


class EmailRequest(BaseModel):
    """Request model for sending an email."""
    
    to: EmailStr = Field(..., description="Recipient email address")
    cc: Optional[List[EmailStr]] = Field(default=None, description="CC recipients")
    bcc: Optional[List[EmailStr]] = Field(default=None, description="BCC recipients")
    subject: str = Field(..., min_length=1, max_length=200, description="Email subject")
    body_text: str = Field(..., min_length=1, description="Plain text email body")
    body_html: Optional[str] = Field(default=None, description="HTML email body (optional)")
    attachments: Optional[List[AttachmentInfo]] = Field(default=None, description="Attachment metadata")
    
    class Config:
        json_schema_extra = {
            "example": {
                "to": "recipient@example.com",
                "cc": None,
                "bcc": None,
                "subject": "Hello from Quick Mail Sender",
                "body_text": "This is a test email.",
                "body_html": "<p>This is a <strong>test</strong> email.</p>",
                "attachments": []
            }
        }


class EmailResponse(BaseModel):
    """Response model for email operations."""
    
    message: str = Field(..., description="Response message")
    
    class Config:
        json_schema_extra = {
            "example": {
                "message": "Email sent successfully!"
            }
        }


class AIBodyRequest(BaseModel):
    """Request model for AI body generation."""
    
    subject: str = Field(..., min_length=1, max_length=200, description="Email subject for AI generation")
    
    class Config:
        json_schema_extra = {
            "example": {
                "subject": "Meeting follow-up"
            }
        }


class AIBodyResponse(BaseModel):
    """Response model for AI body generation."""
    
    body: str = Field(..., description="AI-generated email body")
    
    class Config:
        json_schema_extra = {
            "example": {
                "body": "Thank you for taking the time to meet with me today. I wanted to follow up on our discussion and provide you with the additional information you requested."
            }
        }
