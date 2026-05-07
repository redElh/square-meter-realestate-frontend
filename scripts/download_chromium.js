// Helper to show/download chromium via @sparticuz/chromium
(async () => {
  try {
    const chromium = require('@sparticuz/chromium');
    console.log('Attempting to resolve @sparticuz/chromium executable path...');
    const p = await chromium.executablePath();
    console.log('Chromium executable path:', p);
  } catch (err) {
    console.error('Error with @sparticuz/chromium:', err.message);
    console.log('Try running `npm install` to trigger postinstall, or `npm rebuild @sparticuz/chromium`.');
    process.exit(1);
  }
})();
