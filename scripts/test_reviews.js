// Quick test runner for google-reviews scraper
const path = require('path');
const handler = require('../api/google-reviews');

(async () => {
  try {
    if (typeof handler.scrapeGoogleReviews === 'function') {
      const reviews = await handler.scrapeGoogleReviews();
      console.log('Test scraped reviews count:', reviews.length);
      console.dir(reviews.slice(0, 3), { depth: null });
    } else {
      console.error('scrapeGoogleReviews not exported from api/google-reviews.js');
      process.exit(1);
    }
  } catch (err) {
    console.error('Test run error:', err.message);
    process.exit(1);
  }
})();
