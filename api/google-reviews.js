/**
 * Google Maps Reviews using Google Places API
 * Official, reliable, and free (with generous quota)
 * Get your API key from: https://console.cloud.google.com/apis/credentials
 */

// Your Google Places API Key (add to .env.local and Vercel env vars)
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

// Your Google Maps Place ID - extract from your Google Maps URL
const PLACE_ID = 'ChIJc4YBc_x4D2cRKQHizoFyeZ8'; // M² Square Meter place ID

/**
 * Fetch real Google reviews using official Google Places API
 */
async function fetchGooglePlacesReviews() {
  if (!GOOGLE_PLACES_API_KEY) {
    console.error('❌ GOOGLE_PLACES_API_KEY not configured');
    return [];
  }

  try {
    console.log('🔍 Fetching reviews from Google Places API...');
    
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=name,rating,reviews,user_ratings_total&key=${GOOGLE_PLACES_API_KEY}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status !== 'OK') {
      console.error('❌ Google Places API error:', data.status, data.error_message);
      return [];
    }
    
    const reviews = data.result?.reviews || [];
    
    console.log(`✅ Successfully fetched ${reviews.length} real reviews from Google!`);
    console.log(`⭐ Business rating: ${data.result?.rating} (${data.result?.user_ratings_total} total reviews)`);
    
    // Transform to our format
    return reviews.map(review => ({
      author_name: review.author_name,
      rating: review.rating,
      text: review.text,
      relative_time_description: review.relative_time_description,
      time: review.time,
      profile_photo_url: review.profile_photo_url,
      language: review.language
    }));
    
  } catch (error) {
    console.error('❌ Error fetching from Google Places API:', error.message);
    return [];
  }
}

/**
 * Main handler
 */
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    console.log('🔍 Fetching real Google reviews...');
    
    const reviews = await fetchGooglePlacesReviews();
    
    if (reviews && reviews.length > 0) {
      console.log(`✅ Successfully fetched ${reviews.length} real Google reviews!`);
      return res.json({
        success: true,
        count: reviews.length,
        reviews: reviews,
        source: 'google_places_api',
        message: 'Real Google reviews via official Places API'
      });
    } else {
      console.log('⚠️ No reviews available - API key might be missing or invalid');
      return res.json({
        success: false,
        count: 0,
        reviews: [],
        source: 'error',
        message: 'Unable to fetch reviews - please configure GOOGLE_PLACES_API_KEY'
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
      reviews: [],
      count: 0,
      source: 'error'
    });
  }
};
