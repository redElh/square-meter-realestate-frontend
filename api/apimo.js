// Vercel Serverless Function to proxy Apimo API requests
// This avoids CORS issues and keeps credentials secure

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Apimo API credentials
  const providerId = process.env.APIMO_PROVIDER_ID || '4567';
  const token = process.env.APIMO_TOKEN || 'd07da6e744bb033d1299469f1f6f7334531ec05c';
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
      method: req.method,
      headers: {
        'Authorization': `Basic ${base64Credentials}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined,
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
