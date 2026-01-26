#!/bin/bash

# AI Assistant Startup Script
# Ensures both ChromaDB and React app are running

echo "🚀 Starting AI Assistant..."

# Check if ChromaDB is running
if curl -s http://localhost:8000/api/v2/heartbeat > /dev/null 2>&1; then
    echo "✅ ChromaDB is already running on port 8000"
else
    echo "🔄 Starting ChromaDB server with CORS enabled..."
    cd "$(dirname "$0")"
    CHROMA_SERVER_CORS_ALLOW_ORIGINS='["http://localhost:3000"]' nohup chroma run --host localhost --port 8000 > chroma.log 2>&1 &
    sleep 3
    
    if curl -s http://localhost:8000/api/v2/heartbeat > /dev/null 2>&1; then
        echo "✅ ChromaDB started successfully"
    else
        echo "❌ ChromaDB failed to start. Check chroma.log for errors."
        exit 1
    fi
fi

# Start React app
echo "🔄 Starting React development server..."
npm start

echo ""
echo "✨ AI Assistant is ready!"
echo "   - React App: http://localhost:3000"
echo "   - ChromaDB: http://localhost:8000"
echo ""
