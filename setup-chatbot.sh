#!/bin/bash

# RAG Chatbot Setup Script
# This script helps you set up the RAG chatbot quickly

echo "🤖 RAG Chatbot Setup"
echo "===================="
echo ""

# Check if ChromaDB is running
echo "📦 Checking ChromaDB..."
if curl -s http://localhost:8000/api/v1/heartbeat > /dev/null 2>&1; then
    echo "✅ ChromaDB is running"
else
    echo "❌ ChromaDB is not running"
    echo ""
    echo "To start ChromaDB, run one of:"
    echo "  Option 1 (Docker): docker run -p 8000:8000 chromadb/chroma"
    echo "  Option 2 (Python): pip install chromadb && chroma run --host localhost --port 8000"
    echo ""
    read -p "Press Enter to continue anyway or Ctrl+C to exit..."
fi

# Check for .env.local
echo ""
echo "🔑 Checking environment variables..."
if [ -f .env.local ]; then
    echo "✅ .env.local found"
    
    # Check for OpenAI key
    if grep -q "REACT_APP_OPENAI_API_KEY=sk-" .env.local; then
        echo "✅ OpenAI API key configured"
    else
        echo "⚠️  OpenAI API key not found or invalid"
        echo ""
        read -p "Enter your OpenAI API key (or press Enter to skip): " openai_key
        if [ ! -z "$openai_key" ]; then
            echo "REACT_APP_OPENAI_API_KEY=$openai_key" >> .env.local
            echo "✅ OpenAI API key added to .env.local"
        fi
    fi
else
    echo "❌ .env.local not found"
    echo "Creating .env.local from template..."
    cp .env.local.example .env.local
    echo "✅ Created .env.local"
    echo ""
    echo "⚠️  Please edit .env.local and add your OpenAI API key"
    echo "   Get it from: https://platform.openai.com/api-keys"
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
if command -v npm &> /dev/null; then
    npm install
    echo "✅ Dependencies installed"
else
    echo "❌ npm not found. Please install Node.js first."
    exit 1
fi

# Index properties (optional)
echo ""
read -p "Would you like to index properties now? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🔄 Indexing properties..."
    echo "This will index all properties from Apimo into ChromaDB..."
    echo ""
    echo "Starting server briefly to run indexing..."
    npm start &
    SERVER_PID=$!
    sleep 10
    
    curl -X POST http://localhost:3000/api/chatbot \
      -H "Content-Type: application/json" \
      -d '{"action": "index_properties"}' \
      2>/dev/null
    
    if [ $? -eq 0 ]; then
        echo "✅ Properties indexed successfully"
    else
        echo "⚠️  Indexing failed. You can do this later from the app."
    fi
    
    kill $SERVER_PID 2>/dev/null
fi

echo ""
echo "✨ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Start ChromaDB if not running: docker run -p 8000:8000 chromadb/chroma"
echo "2. Start the dev server: npm start"
echo "3. Open http://localhost:3000"
echo "4. Click the chat button in the bottom-right corner"
echo ""
echo "📖 For more info, see: RAG_CHATBOT_GUIDE.md"
