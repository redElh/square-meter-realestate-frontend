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

  // Get the path from the query parameter
  const path = req.query.path || req.url.replace('/api/apimo', '');
  const apiUrl = `https://api.apimo.pro${path}`;

  console.log('🔗 Proxying request to:', apiUrl);

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
      return res.status(response.status).json(data);
    }

    console.log('✅ Apimo API Success');
    return res.status(200).json(data);
  } catch (error) {
    console.error('❌ Proxy Error:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}
