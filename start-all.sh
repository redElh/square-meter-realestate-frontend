#!/bin/bash
# Start ChromaDB and React App

echo "🚀 Starting Square Meter Real Estate App..."
echo ""

# Start ChromaDB
echo "1️⃣  Starting ChromaDB server..."
cd /c/Users/u/square-meter-realestate/frontend

# Check if ChromaDB is already running
if ps aux | grep "chroma run" | grep -v grep > /dev/null; then
    echo "   ✅ ChromaDB already running"
else
    nohup chroma run --host localhost --port 8000 --path ./chroma > chromadb.log 2>&1 &
    sleep 3
    
    if ps aux | grep "chroma run" | grep -v grep > /dev/null; then
        echo "   ✅ ChromaDB started on port 8000"
    else
        echo "   ❌ Failed to start ChromaDB"
        exit 1
    fi
fi

echo ""
echo "2️⃣  Testing ChromaDB connection..."
sleep 2

# Test API v2
if curl -s http://localhost:8000/api/v2/tenants/default_tenant/databases/default_database/collections > /dev/null 2>&1; then
    echo "   ✅ ChromaDB API v2 responding"
else
    echo "   ❌ ChromaDB not responding"
    exit 1
fi

echo ""
echo "3️⃣  Starting Auth Backend..."
if ps aux | grep "src/backend/index.js" | grep -v grep > /dev/null; then
    echo "   ✅ Auth Backend already running"
else
    npm run backend > backend.log 2>&1 &
    echo "   ✅ Auth Backend started in background"
fi

echo ""
echo "4️⃣  React app should be running..."
echo "   📱 Open: http://localhost:3000"
echo ""
echo "✨ Setup complete!"
echo ""
echo "📊 Monitoring:"
echo "   - Backend logs: tail -f backend.log"
echo "   - ChromaDB logs: tail -f chromadb.log"
echo "   - ChromaDB status: ps aux | grep chroma"
echo "   - Backend status: ps aux | grep backend"
echo ""
