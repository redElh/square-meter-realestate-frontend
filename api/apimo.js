// Vercel Serverless Function to proxy Apimo API requests
// This avoids CORS issues and keeps credentials secure

const ALLOWED_ORIGINS = [
  'https://www.squaremeter.ma',
  'https://squaremeter.ma',
];

export default async function handler(req, res) {
  // Restrict CORS to known origins
  const origin = req.headers.origin || '';
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Accept'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Apimo API credentials — must be set in Vercel environment variables
  const providerId = process.env.APIMO_PROVIDER_ID;
  const token = process.env.APIMO_TOKEN;
  if (!providerId || !token) {
    console.error('❌ Missing APIMO credentials in environment variables');
    return res.status(500).json({ error: 'API configuration error' });
  }
  const credentials = `${providerId}:${token}`;
  const base64Credentials = Buffer.from(credentials).toString('base64');

  // Extract the path after /api/apimo
  // req.url will be like: /api/apimo/agencies/25311/properties?limit=1000
  const urlParts = req.url.split('?');
  const path = urlParts[0].replace('/api/apimo', '');
  const queryString = urlParts[1] || '';
  const apiUrl = `https://api.apimo.pro${path}${queryString ? '?' + queryString : ''}`;

  console.log('🔗 Incoming URL:', req.url);
  console.log('🔗 Extracted path:', path);
  console.log('🔗 Query string:', queryString);
  console.log('🔗 Final API URL:', apiUrl);
  console.log('🔐 Using credentials - providerId:', providerId);

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${base64Credentials}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Apimo API Error:', response.status, data);
      
      // For authentication errors, return a friendly error but with 200 status
      // to avoid breaking the frontend page load
      if (response.status === 401 || response.status === 403) {
        console.warn('⚠️ Authentication issue with Apimo API - returning empty data');
        return res.status(200).json({ 
          data: [],
          error: 'Authentication error - returning cached/empty data',
          status: response.status 
        });
      }
      
      return res.status(response.status).json(data);
    }

    console.log('✅ Apimo API Success');
    return res.status(200).json(data);
  } catch (error) {
    console.error('❌ Proxy Error:', error);
    // Return 200 with empty data on error instead of failing the page
    return res.status(200).json({ 
      data: [], 
      error: 'Temporary connection error - please try again',
      message: error.message 
    });
  }
}
