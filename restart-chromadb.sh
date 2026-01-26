#!/bin/bash

# Quick ChromaDB restart with CORS fix
# Use this if you get CORS errors

echo "🛑 Stopping ChromaDB..."
ps aux | grep "chroma run" | grep -v grep | awk '{print $2}' | xargs kill 2>/dev/null
sleep 2

echo "🚀 Starting ChromaDB with CORS enabled..."
cd "$(dirname "$0")"
CHROMA_SERVER_CORS_ALLOW_ORIGINS='["http://localhost:3000"]' nohup chroma run --host localhost --port 8000 > chroma.log 2>&1 &

sleep 3

if curl -s http://localhost:8000/api/v2/heartbeat > /dev/null 2>&1; then
    echo "✅ ChromaDB is running with CORS enabled!"
    echo "   URL: http://localhost:8000"
    echo "   Allowed origin: http://localhost:3000"
else
    echo "❌ ChromaDB failed to start. Check chroma.log"
    exit 1
fi
