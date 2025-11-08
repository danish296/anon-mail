"""
Email-related API endpoints.
"""

import logging
import base64
from typing import Optional, List
from fastapi import APIRouter, HTTPException, Form, UploadFile, File
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.models.email import EmailRequest, EmailResponse, AIBodyRequest, AIBodyResponse
from app.services.email_service import EmailService
from app.services.ai_service import AIService
from app.core.config import settings
from app.core.exceptions import EmailServiceError, AIServiceError

logger = logging.getLogger(__name__)
router = APIRouter()

# Rate limiter
limiter = Limiter(key_func=get_remote_address)

# Service instances
email_service = EmailService()
ai_service = AIService()


@router.post("/send-email", response_model=EmailResponse)
async def send_email(
    to: str = Form(...),
    subject: str = Form(...),
    body_text: str = Form(...),
    body_html: Optional[str] = Form(default=None),
    cc: Optional[str] = Form(default=None),
    bcc: Optional[str] = Form(default=None),
    files: List[UploadFile] = File(default=[])
):
    """
    Send an email with HTML, CC, BCC, and attachments.
    
    Args:
        to: Recipient email address
        subject: Email subject
        body_text: Plain text email body
        body_html: Optional HTML email body
        cc: Optional comma-separated CC recipients
        bcc: Optional comma-separated BCC recipients
        files: Optional list of file attachments
        
    Returns:
        Success response with message
        
    Raises:
        HTTPException: If email sending fails
    """
    try:
        logger.info(f"Sending email to {to} with subject: {subject}")
        logger.info(f"Received {len(files)} file(s)")
        
        for idx, f in enumerate(files):
            logger.info(f"File {idx}: filename={f.filename}, content_type={f.content_type}, size={f.size if hasattr(f, 'size') else 'unknown'}")
        
        # Parse CC and BCC
        cc_emails = [email.strip() for email in cc.split(',')] if cc else None
        bcc_emails = [email.strip() for email in bcc.split(',')] if bcc else None
        
        # Process attachments
        attachments = []
        if files and len(files) > 0:
            logger.info(f"Processing {len(files)} attachments...")
            for file in files:
                # Skip empty or invalid files
                if not file or not file.filename or file.filename == '':
                    logger.warning(f"Skipping invalid file: {file}")
                    continue
                    
                if file.filename and file.size and file.size > 0:
                    try:
                        logger.info(f"Processing attachment: {file.filename}, size: {file.size}, type: {file.content_type}")
                        
                        # Read file content
                        content = await file.read()
                        logger.info(f"Read {len(content)} bytes from {file.filename}")
                        
                        # Validate size
                        if len(content) > email_service.MAX_ATTACHMENT_SIZE:
                            logger.warning(f"File {file.filename} exceeds max size ({email_service.MAX_ATTACHMENT_SIZE} bytes)")
                            raise HTTPException(
                                status_code=413,
                                detail=f"File {file.filename} is too large. Max size: {email_service.MAX_ATTACHMENT_SIZE / 1024 / 1024:.0f} MB"
                            )
                        
                        # Validate MIME type
                        if file.content_type not in email_service.ALLOWED_MIME_TYPES:
                            logger.warning(f"File type {file.content_type} not allowed")
                            raise HTTPException(
                                status_code=400,
                                detail=f"File type '{file.content_type}' is not allowed. Allowed types: {', '.join(email_service.ALLOWED_MIME_TYPES)}"
                            )
                        
                        # Base64 encode content
                        content_b64 = base64.b64encode(content).decode('utf-8')
                        logger.info(f"Base64 encoded {file.filename}, length: {len(content_b64)}")
                        
                        attachments.append({
                            'filename': file.filename,
                            'content_type': file.content_type or 'application/octet-stream',
                            'content': content_b64
                        })
                        logger.info(f"Added attachment: {file.filename}")
                        
                    except HTTPException:
                        raise
                    except Exception as e:
                        logger.error(f"Error processing file {file.filename}: {str(e)}")
                        raise HTTPException(
                            status_code=400,
                            detail=f"Error processing file {file.filename}: {str(e)}"
                        )
        
        logger.info(f"Total attachments processed: {len(attachments)}")
        
        # Log attachment details before sending
        if attachments:
            for i, att in enumerate(attachments):
                logger.info(f"Attachment {i}: {att['filename']} ({att['content_type']}) - {len(att['content'])} chars base64")
        
        # Send email
        result = await email_service.send_email(
            to_email=to,
            subject=subject,
            body_text=body_text,
            body_html=body_html,
            cc_emails=cc_emails,
            bcc_emails=bcc_emails,
            attachments=attachments if attachments else None
        )
        
        logger.info(f"Email sent successfully to {to}")
        
        return EmailResponse(message=result["message"])
        
    except EmailServiceError as e:
        logger.error(f"Email service error: {e.message}")
        raise HTTPException(status_code=502, detail=e.message)
    
    except HTTPException:
        raise
    
    except Exception as e:
        logger.error(f"Unexpected error sending email: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")



@router.post("/generate-body", response_model=AIBodyResponse)
async def generate_email_body(
    request: AIBodyRequest
):
    """
    Generate email body using AI based on subject.
    
    Args:
        request: AI body generation request
        
    Returns:
        Generated email body
        
    Raises:
        HTTPException: If AI generation fails
    """
    try:
        logger.info(f"Received request: {request}")
        logger.info(f"Subject received: '{request.subject}'")
        
        # Validate subject
        if not await ai_service.validate_subject(request.subject):
            raise HTTPException(
                status_code=400,
                detail="Subject line is required and must be at least 2 characters long"
            )
        
        logger.info(f"Generating email body for subject: {request.subject}")
        
        # Generate email body
        generated_body = await ai_service.generate_email_body(request.subject)
        
        logger.info("Email body generated successfully")
        
        return AIBodyResponse(body=generated_body)
        
    except AIServiceError as e:
        logger.error(f"AI service error: {e.message}")
        raise HTTPException(status_code=503, detail=e.message)
    
    except HTTPException:
        raise
    
    except Exception as e:
        logger.error(f"Unexpected error generating email body: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")
