#!/bin/bash

# Quick Setup Script for Google Maps Reviews
# Run: bash SETUP_GOOGLE_REVIEWS.sh

echo "🚀 Setting up Google Maps Reviews Scraper..."
echo ""

# Check if Playwright is installed
if ! npm list playwright &> /dev/null; then
    echo "📦 Installing Playwright..."
    npm install playwright
else
    echo "✅ Playwright already installed"
fi

# Check if Chromium is installed
PLAYWRIGHT_DIR="$HOME/.cache/ms-playwright"
PLAYWRIGHT_DIR_WINDOWS="$HOME/AppData/Local/ms-playwright"

if [ ! -d "$PLAYWRIGHT_DIR" ] && [ ! -d "$PLAYWRIGHT_DIR_WINDOWS" ]; then
    echo "🌐 Installing Chromium browser..."
    npx playwright install chromium --with-deps
else
    echo "✅ Chromium already installed"
fi

echo ""
echo "🧪 Testing the scraper..."
node testGoogleReviews.js

echo ""
echo "✅ Setup complete!"
echo ""
echo "📖 Next steps:"
echo "  1. Start dev server: npm start"
echo "  2. Open http://localhost:3000"
echo "  3. Scroll to Testimonials section"
echo ""
echo "📚 Read GOOGLE_REVIEWS_SUCCESS.md for full documentation"
