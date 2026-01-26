#!/bin/bash
cd "$(dirname "$0")"
export CHROMA_SERVER_CORS_ALLOW_ORIGINS='["http://localhost:3000"]'
chroma run --host localhost --port 8000 --path ./chroma &
echo "ChromaDB started with CORS enabled"
