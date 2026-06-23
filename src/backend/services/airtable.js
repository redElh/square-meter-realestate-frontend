const https = require('https');

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = (process.env.AIRTABLE_TABLE_NAME || 'Reviews').replace(/^"(.*)"$/, '$1');

// Field name mappings — override via .env if your Airtable columns are named differently
const FIELD_NAME = process.env.AIRTABLE_FIELD_NAME || 'name';
const FIELD_RATING = process.env.AIRTABLE_FIELD_RATING || 'rating';
const FIELD_COMMENT = process.env.AIRTABLE_FIELD_COMMENT || 'comment';
const FIELD_CREATED_AT = process.env.AIRTABLE_FIELD_CREATED_AT || 'created_at';

function stripQuotes(v) {
  if (typeof v === 'string') return v.replace(/^"(.*)"$/, '$1');
  return v;
}

function airtableRequest(method, body) {
  return new Promise((resolve, reject) => {
    const path = `/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`;
    const query = '';
    const url = new URL(path + query, 'https://api.airtable.com');

    const options = {
      hostname: 'api.airtable.com',
      path: url.pathname + url.search,
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
            console.error('Airtable error response:', JSON.stringify(parsed, null, 2));
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

async function getReviews() {
  const data = await airtableRequest('GET');
  if (data.records?.length > 0) {
    const sampleFields = Object.keys(data.records[0].fields);
    console.log('Airtable available fields:', sampleFields.join(', '));
  }
  return (data.records || []).map((record) => ({
    id: record.id,
    name: record.fields[FIELD_NAME] || '',
    rating: record.fields[FIELD_RATING] || 5,
    comment: record.fields[FIELD_COMMENT] || '',
    created_at: record.fields[FIELD_CREATED_AT] || record.createdTime,
  }));
}

async function addReview({ name, rating, comment }) {
  const data = await airtableRequest('POST', {
    records: [
      {
        fields: {
          [FIELD_NAME]: name,
          [FIELD_RATING]: Number(rating),
          [FIELD_COMMENT]: comment,
          [FIELD_CREATED_AT]: new Date().toISOString(),
        },
      },
    ],
  });
  const record = data.records?.[0];
  return {
    id: record.id,
    name: record.fields[FIELD_NAME],
    rating: record.fields[FIELD_RATING],
    comment: record.fields[FIELD_COMMENT],
    created_at: record.fields[FIELD_CREATED_AT],
  };
}

module.exports = { getReviews, addReview };
