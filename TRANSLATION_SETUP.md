# Translation Service Setup Guide

## Overview

The Square Meter real estate platform now includes automatic email translation functionality. When users submit a property inquiry form, the email can be displayed in their selected language but will always be sent in French to the agency.

## Architecture

### Frontend (React + TypeScript)
- **Component**: `SellingMultiStep.tsx`
- Generates email content in the user's selected language
- Displays email preview modal for review and editing
- Sends email via API endpoint

### Backend Translation Options

#### Option 1: JavaScript/Node.js (Simple, Integrated)
- **File**: `api/send-property-inquiry.js`
- Uses LibreTranslate API (free, no API key required)
- Serverless function on Vercel
- **Pros**: Simple deployment, no additional services
- **Cons**: Depends on external API, limited customization

#### Option 2: Python Translation Service (Advanced, Flexible)
- **Files**: 
  - `services/translation_service.py` - Core translation logic
  - `api_translation.py` - Flask API server
- Supports multiple backends with automatic fallback:
  1. DeepL (best quality, requires API key)
  2. Azure Translator (enterprise-grade, requires subscription)
  3. LibreTranslate (free, open-source)
  4. Google Translate (unofficial, backup only)
- **Pros**: Better translation quality, multiple backends, offline support
- **Cons**: Requires separate Python service

## Setup Instructions

### Quick Start (JavaScript Only)

1. **No additional setup required!** The JavaScript translation is integrated.

2. **Environment Variables** (optional):
   ```bash
   # .env.local
   CONTACT_EMAIL=contact@squaremeter.com
   TRANSLATE_API_URL=https://libretranslate.com/translate
   ```

3. **Deploy to Vercel**:
   ```bash
   vercel deploy
   ```

### Advanced Setup (Python Translation Service)

#### Step 1: Install Python Dependencies

```bash
# Navigate to frontend directory
cd c:\Users\u\square-meter-realestate\frontend

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements-translation.txt
```

#### Step 2: Configure Translation Backends

Create a `.env` file:

```bash
# LibreTranslate (Free, no API key)
LIBRETRANSLATE_URL=https://libretranslate.com/translate

# DeepL (Optional, best quality)
DEEPL_API_KEY=your_deepl_api_key_here

# Azure Translator (Optional, enterprise)
AZURE_TRANSLATOR_KEY=your_azure_key
AZURE_TRANSLATOR_ENDPOINT=https://api.cognitive.microsofttranslator.com
AZURE_TRANSLATOR_REGION=westeurope

# Flask server settings
PORT=5000
DEBUG=False
```

#### Step 3: Run Python Translation Service

```bash
# Development
python api_translation.py

# Production (with Gunicorn)
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 api_translation:app
```

#### Step 4: Update JavaScript API to Use Python Service

Edit `api/send-property-inquiry.js`:

```javascript
async function translateToFrench(subject, content, sourceLang) {
  const PYTHON_TRANSLATION_API = process.env.PYTHON_TRANSLATION_API || 'http://localhost:5000';
  
  try {
    const response = await fetch(`${PYTHON_TRANSLATION_API}/translate-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subject: subject,
        content: content,
        source_lang: sourceLang,
      }),
    });

    if (!response.ok) throw new Error('Translation API error');
    
    const data = await response.json();
    return {
      subject: data.translated_subject,
      content: data.translated_content,
    };
  } catch (error) {
    console.error('Translation failed:', error);
    return { subject, content };
  }
}
```

## Translation Backends Comparison

### 1. LibreTranslate (Default)
- **Cost**: Free
- **Quality**: Good (7/10)
- **Setup**: None (public API)
- **Limits**: Rate limited
- **Best for**: Development, MVP

### 2. DeepL
- **Cost**: Free tier (500k chars/month), then $5.49/month
- **Quality**: Excellent (9/10)
- **Setup**: API key required
- **Limits**: 500k characters/month (free)
- **Best for**: Production, high quality needs
- **Sign up**: https://www.deepl.com/pro-api

### 3. Azure Translator
- **Cost**: Pay-as-you-go ($10/million chars)
- **Quality**: Excellent (9/10)
- **Setup**: Azure subscription required
- **Limits**: No monthly limits
- **Best for**: Enterprise, high volume
- **Sign up**: https://azure.microsoft.com/en-us/services/cognitive-services/translator/

### 4. Google Translate (Unofficial)
- **Cost**: Free (uses unofficial API)
- **Quality**: Good (8/10)
- **Setup**: pip install googletrans
- **Limits**: None (but unstable)
- **Best for**: Backup only
- **Note**: Not recommended for production

## Testing

### Test Frontend Email Generation

1. Navigate to: `http://localhost:3000/selling-multistep`
2. Fill out all form steps
3. Submit the form
4. Review the generated email preview
5. Click "Send Message"
6. Check for success alert

### Test Python Translation Service

```bash
# Test translation endpoint
curl -X POST http://localhost:5000/translate \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello, I want to sell my property", "source_lang": "en"}'

# Test email translation
curl -X POST http://localhost:5000/translate-email \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Property Inquiry",
    "content": "I am interested in selling my property",
    "source_lang": "en"
  }'
```

### Test JavaScript Translation

```bash
# From browser console on any page
fetch('/api/send-property-inquiry', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    subject: 'Test Subject',
    content: 'Test content in English',
    currentLanguage: 'en',
    formData: {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      phone: '+33123456789'
    }
  })
})
.then(r => r.json())
.then(console.log)
```

## Deployment

### Vercel (JavaScript Only)
1. Push code to GitHub
2. Import project in Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

### Heroku (Python Service)
```bash
# Create Procfile
echo "web: gunicorn -w 4 api_translation:app" > Procfile

# Deploy
heroku create square-meter-translation
heroku config:set DEEPL_API_KEY=your_key_here
git push heroku main
```

### Docker (Python Service)
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements-translation.txt .
RUN pip install --no-cache-dir -r requirements-translation.txt
COPY services/ ./services/
COPY api_translation.py .
EXPOSE 5000
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "api_translation:app"]
```

## Troubleshooting

### Translation Not Working
1. Check network connection
2. Verify API keys (if using DeepL/Azure)
3. Check console for errors
4. Test translation service independently

### Email Not Sending
1. Verify CONTACT_EMAIL environment variable
2. Check email service configuration
3. Review server logs
4. Test with a simple email first

### Python Service Won't Start
1. Check Python version (3.8+ required)
2. Verify all dependencies installed
3. Check port availability
4. Review error logs

## Next Steps

1. **Email Service**: Integrate with SendGrid, Mailgun, or AWS SES
2. **Database**: Store inquiries in a database for tracking
3. **Notifications**: Add SMS notifications for urgent inquiries
4. **Analytics**: Track form submission and conversion rates
5. **A/B Testing**: Test different email formats

## Support

For issues or questions:
- Email: dev@squaremeter.com
- Docs: [Internal Wiki]
- Slack: #dev-support
