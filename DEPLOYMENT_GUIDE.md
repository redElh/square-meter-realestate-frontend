# 🚀 Deployment Guide - Square Meter Real Estate

## Quick Deployment to Vercel

### Prerequisites
- ✅ Vercel account connected to your GitHub repository
- ✅ All environment variables configured (see VERCEL_ENV_SETUP.md)

### Step 1: Commit and Push Changes

```bash
# Add all new and modified files
git add .

# Commit changes
git commit -m "feat: Add AI Assistant with multi-language support and responsive design"

# Push to main branch
git push origin main
```

### Step 2: Configure Vercel Environment Variables

Go to your Vercel project dashboard and add these environment variables:

#### Required for AI Assistant
```
REACT_APP_GEMINI_API_KEY=your_new_gemini_api_key_here
```

**⚠️ SECURITY NOTE:** 
- Get a NEW API key from: https://aistudio.google.com/app/apikey
- The previous key was leaked and must be replaced
- Add ONLY to Vercel environment variables, NEVER commit to git

#### Required for Email (already configured)
```
GMAIL_USER=redaelhiri9@gmail.com
GMAIL_APP_PASSWORD=uonnrlzgmazoxysq
CONTACT_EMAIL=Essaouira@m2squaremeter.com
CONTACT_EMAIL2=direction@m2squaremeter.com
CONTACT_EMAIL3=Squaremeter@apilead3.net
```

### Step 3: Deploy

Vercel will automatically deploy when you push to main. You can also:

```bash
# Deploy using Vercel CLI
npm install -g vercel
vercel --prod
```

## Important Notes

### ChromaDB in Production

⚠️ **ChromaDB is NOT available in production on Vercel** due to serverless limitations.

The AI Assistant will automatically use **fallback mode** in production, which:
- ✅ Still searches properties using direct APIMO API
- ✅ Uses Google Gemini AI for natural language understanding
- ✅ Provides intelligent responses in all 6 languages
- ✅ Works without vector database

**ChromaDB is only for local development** to enhance search with semantic similarity.

### Production AI Assistant Features

Even without ChromaDB, the AI Assistant in production:
- ✅ Understands natural language queries
- ✅ Filters properties by price, location, rooms, amenities
- ✅ Responds in user's selected language (EN, FR, ES, DE, AR, RU)
- ✅ Shows disclaimer about being in development
- ✅ Provides property recommendations
- ✅ Works on all devices (responsive design)

### Environment Variables

The app checks for `NODE_ENV === 'production'` to automatically disable ChromaDB in production.

No additional configuration needed - it just works! 🎉

## Post-Deployment Checklist

After deployment, verify:

- [ ] AI Assistant button appears on all pages
- [ ] Chat opens and displays welcome message in correct language
- [ ] Disclaimer banner shows in header
- [ ] Property search works (queries APIMO directly)
- [ ] AI responds in the correct language based on app settings
- [ ] Mobile responsive design works (test on phone)
- [ ] Email forms still work correctly
- [ ] All 6 languages work (EN, FR, ES, DE, AR, RU)

## Testing the AI Assistant in Production

Test these scenarios:

1. **Language Switching**
   - Go to Settings → Change language
   - Open AI Assistant
   - Verify title, subtitle, and disclaimer are translated

2. **Property Search**
   - Ask: "Find me a 3-bedroom villa in Essaouira"
   - Ask: "Show me the cheapest apartment"
   - Ask: "Properties under €500k with a pool"

3. **Mobile Responsiveness**
   - Open on mobile device
   - Check chat fits on screen
   - Test input and buttons work

4. **Multi-device Support**
   - Test on desktop (large screen)
   - Test on tablet (medium screen)
   - Test on mobile (small screen)

## Troubleshooting

### AI Assistant doesn't respond
- Check REACT_APP_GEMINI_API_KEY is set in Vercel
- Check browser console for errors
- Verify Gemini API quota hasn't been exceeded

### Wrong language in responses
- Verify language is correctly set in app
- Check translation files are deployed
- Clear browser cache

### Mobile layout issues
- Check viewport meta tag in index.html
- Verify Tailwind CSS is building correctly
- Test in Chrome DevTools mobile view

## Build Information

Last successful build size:
```
Main bundle: ~838 KB (gzipped)
CSS: ~12 KB (gzipped)
```

Build time: ~2 minutes

## Support

For issues or questions:
- Email: Essaouira@m2squaremeter.com
- Check logs in Vercel dashboard
- Review browser console errors

---

**Ready to deploy? Run the git commands above and push to production! 🚀**
