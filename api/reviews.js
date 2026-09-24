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

// ── Validation & sanitization (mirrors backend/routes/reviewRoutes.js) ─
const NAME_MIN = 2;
const NAME_MAX = 50;
const COMMENT_MIN = 10;
const COMMENT_MAX = 500;
const NAME_REGEX = /^[\p{L}\s'.-]+$/u;
const URL_PATTERN = /(https?:\/\/|www\.)/i;
const INJECTION_PATTERNS = [
  /<\s*script/i,
  /<\s*iframe/i,
  /<\s*object/i,
  /<\s*embed/i,
  /<\s*svg[^>]*on/i,
  /javascript\s*:/i,
  /data\s*:\s*text\/html/i,
  /vbscript\s*:/i,
  /\bon\w+\s*=/i,
];
function containsInjection(v) {
  return INJECTION_PATTERNS.some((re) => re.test(v));
}
function sanitizePlainText(v) {
  if (typeof v !== 'string') return '';
  let s = v.replace(/\0/g, '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  s = s.replace(/(javascript|data|vbscript)\s*:/gi, '');
  s = s.replace(/on\w+\s*=/gi, '');
  return s.slice(0, 1000);
}
function validateName(raw) {
  if (typeof raw !== 'string') return 'Le nom est requis.';
  const v = raw.trim();
  if (!v) return 'Le nom est requis.';
  if (v.length < NAME_MIN) return `Le nom doit contenir au moins ${NAME_MIN} caractères.`;
  if (v.length > NAME_MAX) return `Le nom ne peut pas dépasser ${NAME_MAX} caractères.`;
  if (containsInjection(v)) return 'Caractères non autorisés dans le nom.';
  if (URL_PATTERN.test(v)) return 'Les liens ne sont pas autorisés dans le nom.';
  if (!NAME_REGEX.test(v)) return 'Le nom contient des caractères non autorisés.';
  return null;
}
function validateComment(raw) {
  if (typeof raw !== 'string') return 'Le commentaire est requis.';
  const v = raw.trim();
  if (!v) return 'Le commentaire est requis.';
  if (v.length < COMMENT_MIN) return `Le commentaire doit contenir au moins ${COMMENT_MIN} caractères.`;
  if (v.length > COMMENT_MAX) return `Le commentaire ne peut pas dépasser ${COMMENT_MAX} caractères.`;
  if (containsInjection(v)) return 'Contenu non autorisé dans le commentaire.';
  if (URL_PATTERN.test(v)) return 'Les liens ne sont pas autorisés dans le commentaire.';
  if (/(.)\1{7,}/.test(v)) return 'Caractères répétés excessifs.';
  return null;
}
function validateRating(raw) {
  const r = Number(raw);
  if (!Number.isFinite(r)) return 'La note est requise.';
  if (r < 1 || r > 5) return 'La note doit être entre 1 et 5.';
  const rounded = Math.round(r * 10) / 10;
  if (Math.abs(rounded - r) > 0.001) return 'Note invalide.';
  return null;
}

// Simple in-memory rate limit for Vercel serverless (per lambda instance)
// For production, replace with Upstash Redis. This is a best-effort fallback.
const rateMap = new Map();
function isRateLimited(ip) {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const max = 5;
  const entry = rateMap.get(ip) || { count: 0, start: now };
  if (now - entry.start > windowMs) {
    entry.count = 1;
    entry.start = now;
  } else {
    entry.count += 1;
  }
  rateMap.set(ip, entry);
  // Cleanup old entries
  if (rateMap.size > 1000) {
    for (const [k, v] of rateMap) if (now - v.start > windowMs) rateMap.delete(k);
  }
  return entry.count > max;
}

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
      const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.headers['x-real-ip'] || 'unknown';
      if (isRateLimited(ip)) {
        return res.status(429).json({ success: false, error: 'Trop de tentatives. Veuillez réessayer dans 15 minutes.' });
      }

      const { name, rating, comment, website } = req.body || {};

      // Honeypot
      if (typeof website === 'string' && website.trim() !== '') {
        console.warn('Reviews honeypot triggered from', ip);
        return res.status(201).json({ success: true, review: null });
      }

      const allowed = new Set(['name', 'rating', 'comment', 'website']);
      const extra = Object.keys(req.body || {}).filter((k) => !allowed.has(k));
      if (extra.length > 0) {
        return res.status(400).json({ success: false, error: 'Champs non autorisés.' });
      }

      const nameErr = validateName(name);
      if (nameErr) return res.status(400).json({ success: false, error: nameErr });
      const ratingErr = validateRating(rating);
      if (ratingErr) return res.status(400).json({ success: false, error: ratingErr });
      const commentErr = validateComment(comment);
      if (commentErr) return res.status(400).json({ success: false, error: commentErr });

      const safeName = sanitizePlainText(name);
      const safeComment = sanitizePlainText(comment);
      const safeRating = Math.round(Number(rating) * 10) / 10;

      if (safeName.length < NAME_MIN || safeName.length > NAME_MAX) {
        return res.status(400).json({ success: false, error: 'Nom invalide après nettoyage.' });
      }
      if (safeComment.length < COMMENT_MIN || safeComment.length > COMMENT_MAX) {
        return res.status(400).json({ success: false, error: 'Commentaire invalide après nettoyage.' });
      }

      const data = await airtableRequest('POST', {
        records: [{ fields: { [FIELD_NAME]: safeName, [FIELD_RATING]: safeRating, [FIELD_COMMENT]: safeComment, [FIELD_CREATED_AT]: new Date().toISOString() } }],
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
    res.status(500).json({ success: false, error: 'Erreur interne. Veuillez réessayer.' });
  }
}

module.exports = handler;
