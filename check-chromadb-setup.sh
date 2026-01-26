#!/bin/bash
# Verification script for ChromaDB setup

echo "🔍 Checking ChromaDB Setup..."
echo ""

# Check ChromaDB server
echo "1. Checking ChromaDB server..."
if ps aux | grep "chroma run" | grep -v grep > /dev/null; then
    echo "   ✅ ChromaDB server is running"
    
    # Test connection
    if curl -s http://localhost:8000/api/v1/heartbeat 2>&1 | grep -q "error"; then
        echo "   ⚠️  ChromaDB using API v2 (v1 deprecated)"
    else
        echo "   ✅ ChromaDB accessible on port 8000"
    fi
else
    echo "   ❌ ChromaDB server is NOT running"
    echo "      Run: cd frontend && nohup chroma run --host localhost --port 8000 --path ./chroma > chromadb.log 2>&1 &"
fi

echo ""

# Check npm package version
echo "2. Checking ChromaDB npm package..."
cd /c/Users/u/square-meter-realestate/frontend
VERSION=$(npm list chromadb 2>&1 | grep chromadb | head -1 | grep -oP '[\d\.]+' | head -1)
if [ ! -z "$VERSION" ]; then
    echo "   ✅ chromadb@$VERSION installed"
    if [[ "$VERSION" =~ ^3\. ]]; then
        echo "   ✅ Version 3.x supports API v2"
    elif [[ "$VERSION" =~ ^1\. ]]; then
        echo "   ⚠️  Version 1.x only supports deprecated API v1"
        echo "      Upgrade: npm install chromadb@latest --force"
    fi
else
    echo "   ❌ chromadb not installed"
fi

echo ""

# Check React server
echo "3. Checking React dev server..."
if ps aux | grep "react-scripts start" | grep -v grep > /dev/null; then
    echo "   ✅ React server is running"
    
    # Check if proxy is responding (only works if server is up)
    sleep 2
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 2>&1 | grep -q "200\|301\|302"; then
        echo "   ✅ React server accessible on port 3000"
    fi
else
    echo "   ❌ React server is NOT running"
    echo "      Run: npm start"
fi

echo ""
echo "✨ Setup Check Complete!"
