"""
Email service using Brevo (formerly Sendinblue).
"""

import logging
import base64
from typing import Dict, Any, Optional, List

import sib_api_v3_sdk
from sib_api_v3_sdk.rest import ApiException
from sib_api_v3_sdk.api import TransactionalEmailsApi
from sib_api_v3_sdk import SendSmtpEmail
from sib_api_v3_sdk import SendSmtpEmailSender
from sib_api_v3_sdk import SendSmtpEmailTo
from sib_api_v3_sdk import SendSmtpEmailCc
from sib_api_v3_sdk import SendSmtpEmailBcc
from sib_api_v3_sdk import SendSmtpEmailAttachment

from app.core.config import settings
from app.core.exceptions import EmailServiceError, ConfigurationError

logger = logging.getLogger(__name__)


class EmailService:
    """Service for sending emails via Brevo."""
    
    MAX_ATTACHMENT_SIZE = 25 * 1024 * 1024  # 25 MB per file
    ALLOWED_MIME_TYPES = {
        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        'application/pdf', 'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain', 'text/csv',
        'application/zip', 'application/x-rar-compressed'
    }
    
    def __init__(self):
        """Initialize the email service."""
        if not settings.BREVO_API_KEY:
            raise ConfigurationError("BREVO_API_KEY is not configured")
        
        if not settings.BREVO_FROM_EMAIL:
            raise ConfigurationError("BREVO_FROM_EMAIL is not configured")
        
        # Configure Brevo API
        configuration = sib_api_v3_sdk.Configuration()
        configuration.api_key['api-key'] = settings.BREVO_API_KEY
        
        self.api_instance = TransactionalEmailsApi(sib_api_v3_sdk.ApiClient(configuration))
        self.from_email = settings.BREVO_FROM_EMAIL
        self.from_name = settings.BREVO_FROM_NAME
        
        logger.info("Email service initialized successfully")
        logger.info(f"Using Brevo API key: {settings.BREVO_API_KEY[:10]}...")
        logger.info(f"From email: {self.from_email}")
        logger.info(f"From name: {self.from_name}")
    
    async def send_email(
        self,
        to_email: str,
        subject: str,
        body_text: str,
        body_html: Optional[str] = None,
        cc_emails: Optional[List[str]] = None,
        bcc_emails: Optional[List[str]] = None,
        attachments: Optional[List[Dict[str, str]]] = None
    ) -> Dict[str, Any]:
        """
        Send an email via Brevo with optional HTML, CC, BCC, and attachments.
        
        Args:
            to_email: Recipient email address
            subject: Email subject
            body_text: Plain text email body
            body_html: Optional HTML email body
            cc_emails: Optional list of CC recipients
            bcc_emails: Optional list of BCC recipients
            attachments: Optional list of dicts with 'filename', 'content_type', 'content' (base64)
            
        Returns:
            Dict containing the response from Brevo
            
        Raises:
            EmailServiceError: If email sending fails
        """
        try:
            # Create sender
            sender = SendSmtpEmailSender(
                email=self.from_email,
                name=self.from_name
            )
            
            # Create main recipient
            to_recipient = SendSmtpEmailTo(email=to_email)
            to_list = [to_recipient]
            
            # Add CC recipients
            cc_list = None
            if cc_emails:
                cc_list = [SendSmtpEmailCc(email=email) for email in cc_emails]
            
            # Add BCC recipients
            bcc_list = None
            if bcc_emails:
                bcc_list = [SendSmtpEmailBcc(email=email) for email in bcc_emails]
            
            # Build email data
            email_data = SendSmtpEmail(
                sender=sender,
                to=to_list,
                subject=subject,
                text_content=body_text
            )
            
            # Add HTML content if provided
            if body_html:
                email_data.html_content = body_html
            
            # Add CC recipients
            if cc_list:
                email_data.cc = cc_list
            
            # Add BCC recipients
            if bcc_list:
                email_data.bcc = bcc_list
            
            # Add attachments
            if attachments:
                logger.info(f"Processing {len(attachments)} attachments for email")
                attachment_list = []
                for attachment in attachments:
                    logger.info(f"Processing attachment: {attachment['filename']}, type: {attachment['content_type']}")
                    
                    # Validate MIME type
                    if attachment['content_type'] not in self.ALLOWED_MIME_TYPES:
                        logger.warning(f"Skipping attachment {attachment['filename']}: MIME type not allowed")
                        continue
                    
                    try:
                        # Validate base64 content
                        if not attachment['content'] or not isinstance(attachment['content'], str):
                            logger.warning(f"Invalid base64 content for {attachment['filename']}")
                            continue
                        
                        # Decode base64 content to validate
                        content_bytes = base64.b64decode(attachment['content'])
                        logger.info(f"Decoded {len(content_bytes)} bytes for {attachment['filename']}")
                        
                        # Validate size
                        if len(content_bytes) > self.MAX_ATTACHMENT_SIZE:
                            logger.warning(f"Attachment {attachment['filename']} exceeds max size, skipping")
                            continue
                        
                        # Re-encode to ensure proper base64 format
                        validated_content = base64.b64encode(content_bytes).decode('utf-8')
                        
                        # Create attachment object with base64 content
                        attachment_obj = SendSmtpEmailAttachment(
                            name=attachment['filename'],
                            content=validated_content  # Use validated base64 string
                        )
                        attachment_list.append(attachment_obj)
                        logger.info(f"Added attachment to email: {attachment['filename']}")
                    except Exception as e:
                        logger.warning(f"Failed to process attachment {attachment['filename']}: {e}")
                        continue
                
                if attachment_list:
                    email_data.attachment = attachment_list
                    logger.info(f"Total attachments added to email: {len(attachment_list)}")
                else:
                    logger.warning("No valid attachments to add to email")
            
            # Send email
            logger.info(f"Sending email to {to_email} with subject: {subject}")
            if cc_emails:
                logger.info(f"CC recipients: {cc_emails}")
            if bcc_emails:
                logger.info(f"BCC recipients: {bcc_emails}")
            if attachments:
                logger.info(f"Attachments: {len(attachments)} file(s)")
            
            # Log email data structure for debugging
            logger.info(f"Email data structure: sender={email_data.sender}, to={len(email_data.to)} recipients")
            if hasattr(email_data, 'attachment') and email_data.attachment:
                logger.info(f"Email attachment field: {len(email_data.attachment)} attachments")
            else:
                logger.warning("Email attachment field is empty or missing")
            
            response = self.api_instance.send_transac_email(email_data)
            
            # Log response details
            logger.info(f"Email sent successfully. Message ID: {response.message_id}")
            logger.info(f"Brevo API response: {response}")
            
            return {
                "message_id": response.message_id,
                "message": "Email sent successfully!"
            }
            
        except ApiException as e:
            logger.error(f"Brevo API error: {e}")
            raise EmailServiceError(f"Failed to send email: {e}")
        except Exception as e:
            logger.error(f"Failed to send email: {str(e)}")
            raise EmailServiceError(f"Failed to send email: {str(e)}")
    
    def validate_email_address(self, email: str) -> bool:
        """
        Validate email address format.
        
        Args:
            email: Email address to validate
            
        Returns:
            True if email is valid, False otherwise
        """
        import re
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return bool(re.match(pattern, email))

