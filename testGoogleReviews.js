/**
 * Test Google Maps Reviews Scraper
 * Run with: node testGoogleReviews.js
 */

const scraper = require('./api/google-reviews.js');

async function testScraper() {
  console.log('🧪 Testing Google Maps Scraper...\n');
  
  // Simulate a request
  const mockReq = { method: 'GET' };
  const mockRes = {
    setHeader: () => {},
    status: (code) => ({
      end: () => {},
      json: (data) => {
        console.log('\n📊 Response Status:', code);
        console.log('📦 Response Data:', JSON.stringify(data, null, 2));
      }
    }),
    json: (data) => {
      console.log('\n✅ Success Response:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📊 Source:', data.source);
      console.log('🔢 Review Count:', data.count);
      console.log('💬 Message:', data.message);
      console.log('\n📋 Reviews:');
      
      data.reviews.forEach((review, i) => {
        console.log(`\n  ${i + 1}. ${review.author_name} - ${'⭐'.repeat(review.rating)}`);
        console.log(`     "${review.text.substring(0, 100)}..."`);
        console.log(`     🕒 ${review.relative_time_description}`);
      });
      
      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    }
  };
  
  try {
    await scraper(mockReq, mockRes);
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testScraper();
