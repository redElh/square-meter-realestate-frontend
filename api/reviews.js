const https = require('https');

function stripQuotes(v) {
  if (typeof v === 'string') return v.replace(/^"(.*)"$/, '$1');
  return v;
}

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = stripQuotes(process.env.AIRTABLE_TABLE_NAME || 'Reviews');
const FIELD_NAME = process.env.AIRTABLE_FIELD_NAME || 'Name';
const FIELD_RATING = process.env.AIRTABLE_FIELD_RATING || 'Rating';
const FIELD_COMMENT = process.env.AIRTABLE_FIELD_COMMENT || 'Comment';
const FIELD_CREATED_AT = process.env.AIRTABLE_FIELD_CREATED_AT || 'Date';

function airtableRequest(method, body) {
  return new Promise((resolve, reject) => {
    const path = `/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`;
    const options = {
      hostname: 'api.airtable.com',
      path,
      method,
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode >= 400) {
            const msg = parsed.error?.message || `Airtable ${method} failed: ${res.statusCode}`;
            console.error('Airtable error:', JSON.stringify(parsed));
            reject(new Error(msg));
          } else {
            resolve(parsed);
          }
        } catch {
          reject(new Error(`Airtable ${method} failed: ${res.statusCode} ${data}`));
        }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function handler(req, res) {
  const ALLOWED_ORIGINS = ['https://www.squaremeter.ma', 'https://squaremeter.ma'];
  const origin = req.headers.origin || '';
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      const data = await airtableRequest('GET');
      const reviews = (data.records || []).map((r) => ({
        id: r.id,
        name: r.fields[FIELD_NAME] || '',
        rating: r.fields[FIELD_RATING] || 5,
        comment: r.fields[FIELD_COMMENT] || '',
        created_at: r.fields[FIELD_CREATED_AT] || r.createdTime,
      }));
      return res.status(200).json({ success: true, reviews });
    }

    if (req.method === 'POST') {
      const { name, rating, comment } = req.body || {};
      if (!name || !comment) {
        return res.status(400).json({ success: false, error: 'Name and comment are required' });
      }
      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ success: false, error: 'Rating must be between 1 and 5' });
      }
      const data = await airtableRequest('POST', {
        records: [{ fields: { [FIELD_NAME]: name, [FIELD_RATING]: Number(rating), [FIELD_COMMENT]: comment, [FIELD_CREATED_AT]: new Date().toISOString() } }],
      });
      const record = data.records?.[0];
      return res.status(201).json({
        success: true,
        review: {
          id: record.id,
          name: record.fields[FIELD_NAME],
          rating: record.fields[FIELD_RATING],
          comment: record.fields[FIELD_COMMENT],
          created_at: record.fields[FIELD_CREATED_AT],
        },
      });
    }

    res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (error) {
    console.error('Reviews API error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = handler;
