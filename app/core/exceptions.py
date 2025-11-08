"""
Custom exceptions for the application.
"""


class QuickMailSenderError(Exception):
    """Base exception for Quick Mail Sender."""
    
    def __init__(self, message: str):
        self.message = message
        super().__init__(self.message)


class EmailServiceError(QuickMailSenderError):
    """Exception raised when email service fails."""
    pass


class AIServiceError(QuickMailSenderError):
    """Exception raised when AI service fails."""
    pass


class ConfigurationError(QuickMailSenderError):
    """Exception raised when configuration is invalid."""
    pass
