/**
 * Google Reviews Service
 * Fetches reviews from Google Maps via Playwright scraping
 */

export interface GoogleReview {
  author_name: string;
  rating: number;
  text: string;
  relative_time_description: string;
  time: number;
  profile_photo_url: string;
  language: string;
}

export interface ReviewsResponse {
  success: boolean;
  count: number;
  reviews: GoogleReview[];
  source: 'google_maps_scraped' | 'fallback';
  message?: string;
}

/**
 * Fetch Google Maps reviews
 */
export const fetchGoogleReviews = async (): Promise<GoogleReview[]> => {
  try {
    console.log('🌐 Fetching from /api/google-reviews...');
    const response = await fetch('/api/google-reviews');
    console.log('📡 Response received:', response.status, response.statusText);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: ReviewsResponse = await response.json();
    console.log('📦 Parsed JSON data:', data);
    
    if (data.success && data.reviews) {
      console.log(`✅ Got ${data.count} reviews from ${data.source}`);
      if (data.message) {
        console.log(`ℹ️ ${data.message}`);
      }
      return data.reviews;
    }
    
    console.warn('⚠️ Response was not successful or had no reviews');
    return [];
  } catch (error) {
    console.error('❌ Error fetching reviews:', error);
    return [];
  }
};
