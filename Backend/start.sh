#!/bin/bash
echo "Installing dependencies..."
python3 -m pip install uvicorn fastapi google-generativeai python-dotenv pypdf python-multipart

echo "Starting server..."
python3 -m uvicorn main:app --host 0.0.0.0 --port 8080