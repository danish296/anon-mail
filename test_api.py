#!/usr/bin/env python3
"""
Simple test script for Quick Mail Sender API.
"""

import requests
import json
import time

BASE_URL = "http://127.0.0.1:8000"

def test_health_check():
    """Test the health check endpoint."""
    print("Testing health check...")
    try:
        response = requests.get(f"{BASE_URL}/")
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False

def test_generate_body():
    """Test the AI body generation endpoint."""
    print("\nTesting AI body generation...")
    try:
        payload = {"subject": "Meeting follow-up"}
        response = requests.post(
            f"{BASE_URL}/generate-body",
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Generated body: {data.get('body', 'No body generated')[:100]}...")
        else:
            print(f"Error response: {response.text}")
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False

def test_send_email():
    """Test the email sending endpoint."""
    print("\nTesting email sending...")
    try:
        payload = {
            "to": "test@example.com",
            "subject": "Test Email from Quick Mail Sender",
            "body": "This is a test email sent via Brevo from Quick Mail Sender."
        }
        response = requests.post(
            f"{BASE_URL}/send-email",
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Response: {data.get('message', 'No message')}")
        else:
            print(f"Error response: {response.text}")
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False

def main():
    """Run all tests."""
    print("Quick Mail Sender API Test")
    print("=" * 40)
    
    # Test health check
    health_ok = test_health_check()
    
    # Test AI generation (may fail if API keys not configured)
    ai_ok = test_generate_body()
    
    # Test email sending (may fail if API keys not configured)
    email_ok = test_send_email()
    
    print("\n" + "=" * 40)
    print("Test Results:")
    print(f"Health Check: {'✓' if health_ok else '✗'}")
    print(f"AI Generation: {'✓' if ai_ok else '✗'}")
    print(f"Email Sending: {'✓' if email_ok else '✗'}")
    
    if health_ok:
        print("\n✓ API is running successfully!")
        print("Note: AI and Email tests may fail if API keys are not configured.")
        print("Make sure to set up your Brevo and Gemini API keys in the .env file.")
    else:
        print("\n✗ API is not responding. Make sure the server is running.")

if __name__ == "__main__":
    main()
