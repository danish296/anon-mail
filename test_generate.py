#!/usr/bin/env python3
"""Test the generate-body endpoint."""

import requests
import json

url = "http://127.0.0.1:8000/generate-body"
payload = {"subject": "Meeting follow-up"}

print("Testing generate-body endpoint...")
print(f"URL: {url}")
print(f"Payload: {json.dumps(payload, indent=2)}")
print()

response = requests.post(
    url,
    json=payload,
    headers={"Content-Type": "application/json"}
)

print(f"Status Code: {response.status_code}")
print(f"Response Headers: {dict(response.headers)}")
print()
print("Response Body:")
print(json.dumps(response.json(), indent=2))
