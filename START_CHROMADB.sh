#!/bin/bash
cd /c/Users/u/square-meter-realestate/frontend
export CHROMA_SERVER_CORS_ALLOW_ORIGINS='["http://localhost:3000"]'
chroma run --host localhost --port 8000 --path ./chroma
