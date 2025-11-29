#!/bin/bash
echo "Installing dependencies from requirements.txt..."
python3 -m pip install -r requirements.txt

echo "Starting server..."
python3 -m uvicorn main:app --host 0.0.0.0 --port 8080