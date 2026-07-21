// Vercel Serverless Function - Server-side password verification
// Replaces client-side hardcoded password checks (V3, V5)

const crypto = require('crypto');

const ALLOWED_ORIGINS = [
  'https://www.squaremeter.ma',
  'https://squaremeter.ma',
];

// Constant-time string comparison
function timingSafeEqual(a, b) {
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');
  if (bufA.length !== bufB.length) {
    // Still compare to avoid length-based timing
    crypto.timingSafeEqual(bufA, Buffer.alloc(bufA.length));
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

// Simple in-memory rate limiter (resets on cold start — acceptable for Vercel)
const attempts = new Map();
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 60 * 1000;

function checkRateLimit(key) {
  const record = attempts.get(key);
  if (!record) return { allowed: true, remaining: MAX_ATTEMPTS };

  if (record.lockUntil && Date.now() < record.lockUntil) {
    const retryAfter = Math.ceil((record.lockUntil - Date.now()) / 1000);
    return { allowed: false, remaining: 0, retryAfter };
  }

  if (record.lockUntil && Date.now() >= record.lockUntil) {
    attempts.delete(key);
    return { allowed: true, remaining: MAX_ATTEMPTS };
  }

  return { allowed: true, remaining: MAX_ATTEMPTS - record.count };
}

function recordFailedAttempt(key) {
  const record = attempts.get(key) || { count: 0, lockUntil: null };
  record.count += 1;
  if (record.count >= MAX_ATTEMPTS) {
    record.lockUntil = Date.now() + LOCKOUT_MS;
    record.count = 0;
  }
  attempts.set(key, record);
}

function clearAttempts(key) {
  attempts.delete(key);
}

module.exports = async (req, res) => {
  const origin = req.headers.origin || '';
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password, section } = req.body;

  if (!password || !section) {
    return res.status(400).json({ error: 'Missing password or section' });
  }

  // Validate section
  const validSections = ['clients', 'analytics'];
  if (!validSections.includes(section)) {
    return res.status(400).json({ error: 'Invalid section' });
  }

  // Validate password input
  if (typeof password !== 'string' || password.length < 12 || password.length > 128) {
    return res.status(400).json({ error: 'Invalid password format' });
  }

  // Check rate limit
  const rateKey = `verify:${section}`;
  const rateCheck = checkRateLimit(rateKey);
  if (!rateCheck.allowed) {
    return res.status(429).json({
      error: 'Too many attempts',
      retryAfter: rateCheck.retryAfter,
    });
  }

  // Get expected password from environment
  const envKey = section === 'clients' ? 'CLIENTS_ACCESS_PASSWORD' : 'ANALYTICS_ACCESS_PASSWORD';
  const expectedPassword = process.env[envKey];

  if (!expectedPassword) {
    console.error(`❌ Missing ${envKey} in environment variables`);
    return res.status(500).json({ error: 'Server configuration error' });
  }

  // Constant-time comparison
  const isValid = timingSafeEqual(password.normalize('NFKC'), expectedPassword);

  if (isValid) {
    clearAttempts(rateKey);
    return res.status(200).json({ authenticated: true });
  }

  recordFailedAttempt(rateKey);
  const remaining = MAX_ATTEMPTS - ((attempts.get(rateKey)?.count) || 0);

  return res.status(401).json({
    error: 'Invalid password',
    remainingAttempts: Math.max(0, remaining),
  });
};
