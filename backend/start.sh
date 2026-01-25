#!/bin/bash
# Start script for backend deployment

echo "🚀 Starting Skill Genome API..."
uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}
