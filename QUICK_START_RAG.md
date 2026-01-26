# 🚀 RAG Chatbot - Quick Start Commands

## Step 1: Install Dependencies
```bash
npm install
```

## Step 2: Start ChromaDB

### Option A: Docker (Recommended)
```bash
docker pull chromadb/chroma
docker run -p 8000:8000 chromadb/chroma
```

### Option B: Python
```bash
pip install chromadb
chroma run --host localhost --port 8000
```

## Step 3: Configure Environment

Create `.env.local` file:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your OpenAI API key:
```env
REACT_APP_OPENAI_API_KEY=sk-your-key-here
REACT_APP_CHROMA_URL=http://localhost:8000
```

**Get OpenAI Key:** https://platform.openai.com/api-keys

## Step 4: Start Development Server
```bash
npm start
```

## Step 5: Index Properties

Open a new terminal and run:
```bash
curl -X POST http://localhost:3000/api/chatbot \
  -H "Content-Type: application/json" \
  -d '{"action": "index_properties"}'
```

## Step 6: Test the Chatbot

1. Visit http://localhost:3000
2. Click the chat button (bottom-right corner)
3. Try these queries:

```
"Find me a 3-bedroom villa in Nice under €800k with a pool"
"What's the buying process in France?"
"Show me luxury apartments with sea view"
"I want to book a viewing"
```

---

## 🆘 Troubleshooting

### ChromaDB not running?
```bash
# Check if ChromaDB is up
curl http://localhost:8000/api/v1/heartbeat
```

### OpenAI key not working?
```bash
# Verify .env.local exists
cat .env.local | grep OPENAI

# Restart dev server
npm start
```

### Properties not indexed?
```bash
# Re-run indexing
curl -X POST http://localhost:3000/api/chatbot \
  -H "Content-Type: application/json" \
  -d '{"action": "index_properties"}'
```

---

## 📖 Full Documentation

See `RAG_CHATBOT_GUIDE.md` for complete setup and usage instructions.

## 🎯 Summary Document

See `RAG_IMPLEMENTATION_COMPLETE.md` for feature overview and next steps.
