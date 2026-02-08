# Google Reviews Setup with Places API

## Why Google Places API?

✅ **Official Google API** - Reliable and supported
✅ **Real reviews** - Fetches actual Google reviews from your business
✅ **Free tier** - Generous quota (not billed unless you exceed limits)
✅ **Works on Vercel** - No browser/binary limitations
✅ **Fast** - Millisecond response times
✅ **Always up-to-date** - Gets latest reviews automatically

## Setup Instructions (5 minutes)

### Step 1: Get Google Places API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Go to **APIs & Services** → **Library**
4. Search for **"Places API"** and enable it
5. Go to **APIs & Services** → **Credentials**
6. Click **"Create Credentials"** → **"API Key"**
7. Copy the API key

### Step 2: Restrict API Key (Security)

1. Click on your newly created API key
2. Under **"API restrictions"**, select **"Restrict key"**
3. Choose **"Places API"** from the dropdown
4. Under **"Application restrictions"**, add your domains:
   - `localhost` (for development)
   - `*.vercel.app` (for Vercel deployments)
   - Your custom domain

### Step 3: Add API Key to Environment Variables

#### Local Development:
Add to `.env.local`:
```env
GOOGLE_PLACES_API_KEY=your_actual_api_key_here
```

#### Vercel Production:
1. Go to your Vercel project dashboard
2. Settings → Environment Variables
3. Add new variable:
   - **Name**: `GOOGLE_PLACES_API_KEY`
   - **Value**: Your API key
   - **Environment**: Production, Preview, Development (select all)
4. Save and redeploy

### Step 4: Find Your Place ID (Already done)

Your place ID is already configured in the code:
```
ChIJc4YBc_x4D2cRKQHizoFyeZ8
```

This was extracted from your Google Maps URL.

## Testing

### Test Locally:
```bash
npm start
# Visit homepage - reviews section should show real Google reviews
```

### Test API Directly:
```bash
curl http://localhost:3000/api/google-reviews
```

### Expected Response:
```json
{
  "success": true,
  "count": 5,
  "reviews": [
    {
      "author_name": "Real Customer Name",
      "rating": 5,
      "text": "Actual review text...",
      "relative_time_description": "2 weeks ago",
      "time": 1234567890,
      "profile_photo_url": "https://...",
      "language": "fr"
    }
  ],
  "source": "google_places_api",
  "message": "Real Google reviews via official Places API"
}
```

## Cost & Quota

**Places API Pricing:**
- **First $200/month**: FREE (Google Cloud free tier)
- **Per request**: $0.017 (Basic Data)
- **Monthly quota**: ~11,764 free requests

**For your site:**
- Review endpoint called ~100 times/day
- Cost: ~$0 (well within free tier)

## Benefits Over Scraping

| Feature | Scraping (Playwright) | Places API |
|---------|----------------------|------------|
| Reliability | ❌ Breaks often | ✅ Always works |
| Speed | ❌ 10-60s | ✅ <1s |
| Vercel Compatible | ❌ Binary issues | ✅ Perfect |
| Cost | Free but unreliable | Free & reliable |
| Maintenance | ❌ High | ✅ None |
| Real Reviews | ✅ Yes | ✅ Yes |

## Troubleshooting

### No reviews showing?
1. Check API key is set correctly
2. Verify Places API is enabled in Google Cloud Console
3. Check browser console for errors
4. Test API endpoint directly: `/api/google-reviews`

### "API key not configured" error?
- Add `GOOGLE_PLACES_API_KEY` to `.env.local` (local)
- Add to Vercel Environment Variables (production)

### Reviews in wrong language?
- Google returns reviews in their original language
- Most common languages will be shown first

## Next Steps

1. Get your API key from Google Cloud Console
2. Add it to `.env.local` and Vercel
3. Test locally
4. Deploy to Vercel
5. Enjoy real, always-updated Google reviews! 🎉
