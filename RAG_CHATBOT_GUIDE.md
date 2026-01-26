# RAG Chatbot Implementation Guide

## 🚀 Overview

The RAG (Retrieval-Augmented Generation) Chatbot is an intelligent AI assistant that helps users find properties, answer questions, and book viewings using natural language.

## 📋 Features

### ✅ Implemented

1. **Natural Language Property Search**
   - "Find me a 3-bedroom villa in Nice under €800k with a pool"
   - Automatically extracts: location, budget, rooms, amenities
   - Returns relevant properties with images and details

2. **FAQ System**
   - Buying process in France
   - Legal requirements
   - Fees and costs
   - Multilingual responses (EN, FR, ES, DE)

3. **Viewing Booking**
   - Direct integration with contact form
   - Schedule viewings from chat
   - Connect with agents

4. **Multilingual Support**
   - Detects user language from i18n
   - Responds in EN, FR, ES, DE
   - Voice input in user's language

5. **Voice Input**
   - Speech-to-text using Web Speech API
   - Works in all supported languages

6. **Property Recommendations**
   - Shows property cards in chat
   - Click to view details
   - Action buttons (View, Book, Contact)

## 🛠️ Technology Stack

- **OpenAI GPT-4**: Natural language understanding and generation
- **ChromaDB**: Vector database for property embeddings
- **LangChain**: RAG orchestration and context management
- **React + TypeScript**: Frontend component
- **Framer Motion**: Smooth animations

## 📦 Installation

### 1. Install Dependencies

```bash
cd frontend
npm install
```

New packages added:
- `openai@^4.28.0` - OpenAI API client
- `chromadb@^1.8.1` - Vector database
- `langchain@^0.1.25` - RAG framework

### 2. Set Up ChromaDB (Local)

#### Option A: Docker (Recommended)

```bash
docker pull chromadb/chroma
docker run -p 8000:8000 chromadb/chroma
```

#### Option B: Python

```bash
pip install chromadb
chroma run --host localhost --port 8000
```

### 3. Environment Variables

Create `.env.local` in the frontend root:

```env
# OpenAI API Key (required)
REACT_APP_OPENAI_API_KEY=sk-your-key-here

# ChromaDB URL (default: http://localhost:8000)
REACT_APP_CHROMA_URL=http://localhost:8000

# Optional: OpenAI Model
REACT_APP_OPENAI_MODEL=gpt-4
```

**Get OpenAI API Key:**
1. Go to https://platform.openai.com/api-keys
2. Create new secret key
3. Copy and paste into `.env.local`

### 4. Index Properties

The chatbot needs to index your properties into the vector database:

```typescript
// Run once after setup or when properties update
import { vectorStoreService } from './services/vectorStoreService';
import { apimoService } from './services/apimoService';

// Initialize and index
await vectorStoreService.initialize();
const properties = await apimoService.getProperties();
await vectorStoreService.indexProperties(properties);
```

Or call the API endpoint:

```bash
curl -X POST http://localhost:3000/api/chatbot \
  -H "Content-Type: application/json" \
  -d '{"action": "index_properties"}'
```

## 📝 Usage

### Basic Chat

```typescript
import { ragChatbotService } from './services/ragChatbotService';

// Initialize
ragChatbotService.initialize(process.env.REACT_APP_OPENAI_API_KEY);

// Set language
ragChatbotService.setLanguage('fr');

// Send message
const response = await ragChatbotService.chat(
  "Find me a villa in Nice under €800k"
);

console.log(response.content); // AI response
console.log(response.propertyResults); // Matching properties
console.log(response.actionSuggestions); // Suggested actions
```

### Component Integration

The RAG Assistant is automatically loaded in `App.tsx`:

```tsx
import RAGAssistant from './components/AIAssistant/RAGAssistant';

function App() {
  return (
    <div>
      {/* Your app content */}
      <RAGAssistant />
    </div>
  );
}
```

## 🎯 Example Queries

### Property Search

```
✅ "Show me 3-bedroom apartments in Nice under €600k"
✅ "Find villas with pools in Cannes"
✅ "I'm looking for a luxury property with sea view"
✅ "Properties near Monaco with parking"
```

### FAQ

```
✅ "How do I buy a property in France?"
✅ "What are the legal requirements?"
✅ "How much are notary fees?"
✅ "What documents do I need?"
```

### Booking

```
✅ "I want to visit this property"
✅ "Book a viewing for next Tuesday"
✅ "Schedule a visit"
```

## 🔧 Customization

### Add More FAQs

Edit `src/services/ragChatbotService.ts`:

```typescript
const faqs = {
  your_topic: {
    en: "Your English answer...",
    fr: "Votre réponse en français...",
    // ...
  }
};
```

### Customize System Prompt

```typescript
private getSystemPrompt(language: string): string {
  return `You are a luxury real estate expert specializing in...`;
}
```

### Adjust Search Parameters

```typescript
// Increase/decrease property result limit
const results = await vectorStoreService.searchProperties(
  query,
  10, // Number of results
  filters
);
```

## 🚀 Production Deployment

### Important: Move OpenAI Calls to Backend

The current implementation has `dangerouslyAllowBrowser: true` for demo purposes. **In production**:

1. Create backend endpoint `/api/chat`:

```javascript
// api/chat.js
const OpenAI = require('openai');

module.exports = async (req, res) => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY // Server-side only
  });

  const { message } = req.body;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: message }]
  });

  res.json(completion.choices[0].message);
};
```

2. Update frontend service to call your backend:

```typescript
const response = await fetch('/api/chat', {
  method: 'POST',
  body: JSON.stringify({ message })
});
```

### Environment Variables (Vercel)

```bash
vercel env add OPENAI_API_KEY
vercel env add CHROMA_URL
```

### ChromaDB Production

For production, use:
- **Chroma Cloud** (https://www.trychroma.com/cloud)
- **Self-hosted ChromaDB** on your server
- **Pinecone** (alternative vector DB)

## 📊 Monitoring

### Check Indexed Properties

```typescript
// Get collection info
const collection = await vectorStoreService.collection;
const count = await collection.count();
console.log(`Indexed properties: ${count}`);
```

### View Conversation History

```typescript
const history = ragChatbotService.getHistory();
console.log(history);
```

### Clear History

```typescript
ragChatbotService.clearHistory();
```

## 🐛 Troubleshooting

### "OpenAI API key not found"

- Check `.env.local` file exists in frontend root
- Verify key format: `REACT_APP_OPENAI_API_KEY=sk-...`
- Restart dev server after adding env vars

### "Vector store initialization failed"

- Ensure ChromaDB is running: `curl http://localhost:8000/api/v1/heartbeat`
- Check CORS if accessing from different domain
- Verify `REACT_APP_CHROMA_URL` is correct

### "No properties found"

- Run indexing: `POST /api/chatbot` with `action: "index_properties"`
- Check Apimo service is returning properties
- Verify ChromaDB collection was created

### Voice input not working

- Only works in Chrome/Edge (WebKit browsers)
- Requires HTTPS or localhost
- Check browser microphone permissions

## 🔐 Security Best Practices

1. **Never expose API keys in frontend code**
   - Use environment variables
   - Call OpenAI from backend only

2. **Rate limiting**
   - Implement on `/api/chat` endpoint
   - Prevent abuse and manage costs

3. **Input validation**
   - Sanitize user messages
   - Filter malicious prompts

4. **Cost management**
   - Set OpenAI usage limits
   - Monitor token consumption
   - Use GPT-3.5-turbo for cost savings

## 💰 Cost Estimation

### OpenAI GPT-4 Pricing (as of 2026)

- Input: $30 per 1M tokens
- Output: $60 per 1M tokens

**Average conversation:**
- User message: ~50 tokens
- AI response: ~200 tokens
- Cost per exchange: ~$0.015

**Monthly estimate for 1000 users:**
- Avg 10 messages per user
- 10,000 exchanges × $0.015 = **$150/month**

**Cost savings:**
- Use GPT-3.5-turbo: 10x cheaper ($15/month)
- Cache common responses
- Limit max_tokens parameter

## 📈 Future Enhancements

### Planned Features

1. **Property Comparison**
   - "Compare these two properties"
   - Side-by-side analysis

2. **Market Insights**
   - "What's the average price in Nice?"
   - Trend analysis and predictions

3. **Saved Searches**
   - Remember user preferences
   - Alert on new matches

4. **Image Understanding**
   - GPT-4 Vision for property photo analysis
   - "Show me properties with modern kitchens"

5. **Agent Handoff**
   - Seamless transfer to human agent
   - Context preservation

6. **Multi-turn Refinement**
   - "Actually, I want a bigger budget"
   - Refine search iteratively

## 🤝 Support

For issues or questions:
1. Check this guide
2. Review service logs
3. Contact development team

## 📄 License

Internal use only - Square Meter Real Estate
