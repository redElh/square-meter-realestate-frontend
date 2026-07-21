// Vercel Serverless Function - WordPress REST API Proxy
// Solves InfinityFree's JS/AES anti-bot challenge server-side

const http = require('http');
const crypto = require('crypto');

const WP_HOST = 'squaremeter-blog.rf.gd';

function solveInfinityFreeChallenge(html) {
  // Extract a=key, b=iv, c=ciphertext from the inline <script>
  const m = html.match(/a=toNumbers\("([a-f0-9]+)"\),b=toNumbers\("([a-f0-9]+)"\),c=toNumbers\("([a-f0-9]+)"\)/);
  if (!m) return null;
  try {
    const key = Buffer.from(m[1], 'hex');
    const iv  = Buffer.from(m[2], 'hex');
    const enc = Buffer.from(m[3], 'hex');
    const d = crypto.createDecipheriv('aes-128-cbc', key, iv);
    d.setAutoPadding(false);
    return Buffer.concat([d.update(enc), d.final()]).toString('hex');
  } catch (e) {
    console.error('Challenge solve error:', e);
    return null;
  }
}

function wpRequest(path, cookie) {
  return new Promise((resolve, reject) => {
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0',
      'Accept': 'application/json, text/html, */*',
    };
    if (cookie) headers['Cookie'] = '__test=' + cookie;
    
    const req = http.request({ 
      hostname: WP_HOST, 
      path, 
      method: 'GET', 
      headers 
    }, (res) => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve({ 
        status: res.statusCode, 
        headers: res.headers, 
        body: Buffer.concat(chunks).toString('utf8') 
      }));
    });
    
    req.on('error', reject);
    req.setTimeout(15000, () => { 
      req.destroy(new Error('WP request timeout')); 
    });
    req.end();
  });
}

module.exports = async (req, res) => {
  // Restrict CORS to known origins
  const ALLOWED_ORIGINS = ['https://www.squaremeter.ma', 'https://squaremeter.ma'];
  const origin = req.headers.origin || '';
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Extract the WordPress API path from the query
  // /api/wordpress?path=/posts or /api/wordpress?path=/posts/123
  const wpPath = req.query.path || '/posts';

  // V8 fix: Whitelist allowed WordPress API paths
  const ALLOWED_PATHS = /^\/posts(\/\d+)?(\/)$/; // /posts or /posts/123
  const ALLOWED_PATHS_FULL = /^\/(posts|pages|categories|tags|media|users|comments)(\/[\w-]+)?(\/\d+)?$/;

  // Decode and validate the path
  const decodedPath = decodeURIComponent(wpPath);
  if (!ALLOWED_PATHS_FULL.test(decodedPath)) {
    console.warn('⚠️ Blocked disallowed WP path:', decodedPath);
    return res.status(403).json({ error: 'Path not allowed' });
  }

  // Only allow specific read-only endpoints
  const pathSegment = decodedPath.split('/')[1];
  const ALLOWED_ENDPOINTS = ['posts', 'pages', 'categories', 'tags'];
  if (!ALLOWED_ENDPOINTS.includes(pathSegment)) {
    return res.status(403).json({ error: 'Endpoint not allowed' });
  }

  const fullPath = '/wp-json/wp/v2' + decodedPath;
  
  console.log('📰 WP API Request:', fullPath);

  try {
    // First attempt – no cookie
    let response = await wpRequest(fullPath, null);
    const contentType = response.headers['content-type'] || '';
    
    // If we got JSON, return it immediately
    if (contentType.includes('json')) {
      res.setHeader('Content-Type', 'application/json; charset=UTF-8');
      return res.status(response.status).send(response.body);
    }
    
    // Got HTML challenge – solve it
    console.log('🔓 Anti-bot challenge detected, solving...');
    const cookieVal = solveInfinityFreeChallenge(response.body);
    
    if (!cookieVal) {
      console.error('❌ Could not solve InfinityFree challenge');
      return res.status(502).json({ 
        error: 'Could not solve anti-bot challenge',
        hint: 'WordPress hosting may have changed its anti-bot mechanism'
      });
    }
    
    console.log('🔑 Challenge solved, retrying with cookie...');
    
    // Second attempt – with solved cookie (add ?i=1 as the host expects)
    const sep = fullPath.includes('?') ? '&' : '?';
    const retryPath = fullPath + sep + 'i=1';
    
    response = await wpRequest(retryPath, cookieVal);
    const retryContentType = response.headers['content-type'] || '';
    
    if (retryContentType.includes('json')) {
      res.setHeader('Content-Type', 'application/json; charset=UTF-8');
      return res.status(response.status).send(response.body);
    }
    
    // Still not JSON after solving challenge
    console.error('❌ Still got HTML after solving challenge');
    return res.status(502).json({ 
      error: 'Challenge solved but JSON not returned',
      contentType: retryContentType
    });
    
  } catch (error) {
    console.error('❌ WordPress API Error:', error.message);
    return res.status(500).json({ 
      error: 'WordPress API request failed',
      message: error.message 
    });
  }
};
