// Vercel Serverless Function to proxy Apimo API requests
// This avoids CORS issues and keeps credentials secure

const ALLOWED_ORIGINS = [
  'https://www.squaremeter.ma',
  'https://squaremeter.ma',
];

async function fetchWithRetry(url, options, retries = 2, delay = 1000) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, options);
      if (response.ok || attempt === retries) return response;
      if (response.status === 429 || response.status >= 500) {
        console.warn(`⚠️ Apimo returned ${response.status}, retry ${attempt + 1}/${retries} in ${delay}ms`);
        await new Promise(r => setTimeout(r, delay));
        delay *= 2;
        continue;
      }
      return response;
    } catch (err) {
      if (attempt === retries) throw err;
      console.warn(`⚠️ Apimo fetch error, retry ${attempt + 1}/${retries}: ${err.message}`);
      await new Promise(r => setTimeout(r, delay));
      delay *= 2;
    }
  }
}

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
    return res.status(200).json({ properties: [], total_items: 0, error: 'API configuration error' });
  }
  const credentials = `${providerId}:${token}`;
  const base64Credentials = Buffer.from(credentials).toString('base64');

  // Extract the path after /api/apimo
  const urlParts = req.url.split('?');
  const path = urlParts[0].replace('/api/apimo', '');
  const queryString = urlParts[1] || '';
  const apiUrl = `https://api.apimo.pro${path}${queryString ? '?' + queryString : ''}`;

  console.log('🔗 Final API URL:', apiUrl);

  try {
    const response = await fetchWithRetry(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${base64Credentials}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    let data;
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      console.error('❌ Apimo returned non-JSON:', response.status, text.substring(0, 200));
      return res.status(200).json({ properties: [], total_items: 0, error: 'Apimo API returned unexpected response' });
    }

    if (!response.ok) {
      console.error('❌ Apimo API Error:', response.status, data);
      return res.status(200).json({ properties: [], total_items: 0, error: `Apimo API error: ${response.status}` });
    }

    console.log('✅ Apimo API Success');
    return res.status(200).json(data);
  } catch (error) {
    console.error('❌ Proxy Error:', error);
    return res.status(200).json({
      properties: [],
      total_items: 0,
      error: 'Temporary connection error - please try again',
      message: error.message
    });
  }
}
