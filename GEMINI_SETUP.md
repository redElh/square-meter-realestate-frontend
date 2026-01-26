# Google Gemini AI Setup (100% FREE)

## Why Gemini?

✅ **Completely FREE** - No credit card required
✅ **Generous limits** - 60 requests per minute (free tier)
✅ **Powerful** - Gemini 1.5 Flash model (fast & accurate)
✅ **Easy setup** - Get API key in 1 minute
✅ **No billing** - Never charges, never expires

## Get Your FREE API Key

1. Visit: **https://aistudio.google.com/app/apikey**
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

## Configure the Chatbot

1. Open `.env.local` file
2. Replace `YOUR_GEMINI_API_KEY_HERE` with your actual API key:
   ```
   REACT_APP_GEMINI_API_KEY=AIzaSyC_your_actual_key_here
   ```
3. Save the file

## Start the Application

```bash
npm start
```

## Test the AI Assistant

1. Open http://localhost:3000
2. Click the chat button (bottom-right)
3. Try:
   - "Hello, I'm looking for a villa in Nice"
   - "What are the fees for buying property?"
   - "I want to book a viewing"

## Features

- 🤖 Intelligent conversational AI
- 🏠 Property search with semantic understanding
- 🌍 Multilingual support (EN, FR, ES, DE)
- 📊 RAG (Retrieval-Augmented Generation)
- 💬 Context-aware responses
- 🎯 Action suggestions (book viewing, contact agent)

## Free Tier Limits

- **60 requests/minute** - More than enough for testing
- **Unlimited** total requests
- **No expiration** - Use forever for free
- **No credit card** needed

Perfect for development and small-scale production!

## Troubleshooting

**Error: "API key not found"**
- Make sure you added the key to `.env.local`
- Restart the development server after editing `.env.local`

**Error: "Invalid API key"**
- Check if you copied the complete key from Google AI Studio
- Make sure there are no extra spaces

**Need help?**
Check the chatbot console logs for detailed error messages.
