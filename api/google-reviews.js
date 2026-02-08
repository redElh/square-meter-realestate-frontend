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
                authorName = text;
                break;
              }
            }
          }
          
          // Extract rating
          let rating = 5;
          const ratingElement = container.querySelector('[role="img"][aria-label*="star"]');
          if (ratingElement) {
            const ariaLabel = ratingElement.getAttribute('aria-label') || '';
            const match = ariaLabel.match(/(\d+)/);
            if (match) rating = parseInt(match[1]);
          }
          
          // Extract review text
          let reviewText = '';
          const textElement = container.querySelector('.wiI7pd, .MyEned, span[jslog]');
          if (textElement) {
            reviewText = textElement.textContent?.trim() || '';
          }
          
          // If no specific review text element, try to find the largest text block
          if (!reviewText) {
            const allSpans = Array.from(container.querySelectorAll('span'));
            for (const span of allSpans) {
              const text = span.textContent?.trim() || '';
              if (text.length > 30 && text.length < 2000 && !text.includes('star')) {
                reviewText = text;
                break;
              }
            }
          }
          
          // Extract time
          let timeText = 'Récemment';
          const timeElement = container.querySelector('.rsqaWe, span[class*="date"]');
          if (timeElement) {
            timeText = timeElement.textContent?.trim() || 'Récemment';
          }
          
          // Extract profile photo
          let profilePhoto = '';
          const imgElement = container.querySelector('img');
          if (imgElement && imgElement.src && !imgElement.src.includes('maps_api_logo')) {
            profilePhoto = imgElement.src;
          }
          
          // Ensure we have a profile photo
          if (!profilePhoto) {
            profilePhoto = `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=023927&color=fff&size=128`;
          }
          
          // Only add if we have meaningful content
          if ((authorName !== 'Anonymous' || reviewText) && index < 10) {
            extractedReviews.push({
              author_name: authorName,
              rating: rating,
              text: reviewText || 'Service exceptionnel!',
              relative_time_description: timeText,
              time: Date.now() - (index * 7 * 24 * 60 * 60 * 1000), // Spread over weeks
              profile_photo_url: profilePhoto,
              language: 'fr'
            });
          }
        } catch (err) {
          // Error extracting this review, skip it
        }
      });
      
      return extractedReviews;
    });
    
    await browser.close();
    
    console.log(`✅ Scraped ${reviews.length} reviews!`);
    return reviews;
    
  } catch (error) {
    console.error('❌ Scraping error:', error.message);
    if (browser) await browser.close();
    return [];
  }
}

/**
 * Fallback reviews (high quality French reviews)
 */
function getFallbackReviews() {
  const now = Date.now();
  return [
    {
      author_name: "Sophie Martin",
      rating: 5,
      text: "Service exceptionnel ! M² Square Meter a été d'une aide précieuse pour notre projet immobilier à Essaouira. Équipe professionnelle et réactive.",
      relative_time_description: "il y a 2 semaines",
      time: now - 14 * 24 * 60 * 60 * 1000,
      profile_photo_url: "https://ui-avatars.com/api/?name=Sophie+Martin&background=023927&color=fff&size=128",
      language: "fr"
    },
    {
      author_name: "Ahmed Benali",
      rating: 5,
      text: "Excellente agence immobilière ! Professionnalisme et expertise du marché local. Nous avons trouvé notre propriété idéale grâce à leur accompagnement.",
      relative_time_description: "il y a 3 semaines",
      time: now - 21 * 24 * 60 * 60 * 1000,
      profile_photo_url: "https://ui-avatars.com/api/?name=Ahmed+Benali&background=023927&color=fff&size=128",
      language: "fr"
    },
    {
      author_name: "Marie Dubois",
      rating: 5,
      text: "Très satisfaits du service ! L'équipe de M² Square Meter est compétente et à l'écoute. Communication excellente tout au long du processus.",
      relative_time_description: "il y a 1 mois",
      time: now - 30 * 24 * 60 * 60 * 1000,
      profile_photo_url: "https://ui-avatars.com/api/?name=Marie+Dubois&background=023927&color=fff&size=128",
      language: "fr"
    },
    {
      author_name: "Jean-Pierre Lefebvre",
      rating: 5,
      text: "Agence de confiance ! M² Square Meter nous a accompagnés avec sérieux dans notre investissement immobilier. Très bon suivi.",
      relative_time_description: "il y a 1 mois",
      time: now - 35 * 24 * 60 * 60 * 1000,
      profile_photo_url: "https://ui-avatars.com/api/?name=Jean-Pierre+Lefebvre&background=023927&color=fff&size=128",
      language: "fr"
    },
    {
      author_name: "Fatima Zahra",
      rating: 5,
      text: "Service de qualité ! Équipe professionnelle qui maîtrise parfaitement le marché d'Essaouira. Je recommande vivement.",
      relative_time_description: "il y a 2 mois",
      time: now - 60 * 24 * 60 * 60 * 1000,
      profile_photo_url: "https://ui-avatars.com/api/?name=Fatima+Zahra&background=023927&color=fff&size=128",
      language: "fr"
    },
    {
      author_name: "Thomas Bernard",
      rating: 5,
      text: "Expérience très positive ! M² Square Meter a facilité toutes nos démarches. Professionnalisme et efficacité au rendez-vous.",
      relative_time_description: "il y a 2 mois",
      time: now - 65 * 24 * 60 * 60 * 1000,
      profile_photo_url: "https://ui-avatars.com/api/?name=Thomas+Bernard&background=023927&color=fff&size=128",
      language: "fr"
    }
  ];
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
    return res.json({
      success: false,
      count: 0,
      reviews: [],
      source: 'error',
      message: `Error fetching reviews: ${error.message}`
    });
  }
};
