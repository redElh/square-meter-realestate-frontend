// Proxy configuration for Create React App
// This file is automatically picked up by CRA's dev server

const { createProxyMiddleware } = require('http-proxy-middleware');
const express = require('express');

module.exports = function(app) {
  const credentials = '4567:d07da6e744bb033d1299469f1f6f7334531ec05c';
  const base64Credentials = Buffer.from(credentials).toString('base64');
  
  console.log('🚀 Setting up proxy middleware...');
  console.log('🔑 Authorization header will be:', `Basic ${base64Credentials}`);
  
  // ChromaDB Proxy - Must come BEFORE body parser to avoid conflicts
  app.use(
    '/chroma',
    createProxyMiddleware({
      target: 'http://localhost:8000',
      changeOrigin: true,
      timeout: 60000,
      proxyTimeout: 60000,
      pathRewrite: {
        '^/chroma': '',
      },
      onProxyReq: (proxyReq, req, res) => {
        console.log('🔵 ChromaDB Proxy:', req.method, req.url);
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log('✅ ChromaDB Response:', proxyRes.statusCode);
      },
      onError: (err, req, res) => {
        console.error('❌ Proxy Error:', err.message);
        res.status(500).json({ error: 'Proxy error', message: err.message });
      },
      logLevel: 'debug',
    })
  );
  
  // CRITICAL: Add body parser middleware AFTER ChromaDB proxy
  // This ensures req.body is populated for other routes
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));
  
  app.use(
    '/api/apimo',
    createProxyMiddleware({
      target: 'https://api.apimo.pro',
      changeOrigin: true,
      secure: false,
      pathRewrite: {
        '^/api/apimo': '', // Remove /api/apimo prefix when forwarding
      },
      headers: {
        'Authorization': `Basic ${base64Credentials}`
      },
      onProxyReq: (proxyReq, req, res) => {
        console.log('🔐 Proxy: Request intercepted');
        console.log('🔗 Proxy: Path:', req.url);
        console.log('📋 Proxy: Headers:', proxyReq.getHeaders());
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log('📥 Proxy: Response status:', proxyRes.statusCode);
      },
      logLevel: 'debug',
    })
  );

  // Google Reviews - Playwright scraping (NO API KEY, NO BILLING)
  app.get('/api/google-reviews', async (req, res) => {
    try {
      console.log('📊 Google Reviews endpoint called');
      const handler = require('../api/google-reviews.js');
      await handler(req, res);
    } catch (error) {
      console.error('❌ Error in Google Reviews handler:', error);
      res.status(500).json({ 
        success: false, 
        error: error.message,
        reviews: [],
        count: 0,
        source: 'error'
      });
    }
  });

  // WordPress REST API – custom handler that solves InfinityFree's JS/AES anti-bot challenge.
  // InfinityFree (rf.gd) returns an HTML page with dynamically-generated AES-CBC values.
  // The browser is supposed to decrypt them, set a cookie, then redirect.
  // We replicate this server-side so the React app always gets JSON.
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
      const req = http.request({ hostname: WP_HOST, path, method: 'GET', headers }, (res) => {
        const chunks = [];
        res.on('data', c => chunks.push(c));
        res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: Buffer.concat(chunks).toString('utf8') }));
      });
      req.on('error', reject);
      req.setTimeout(15000, () => { req.destroy(new Error('WP request timeout')); });
      req.end();
    });
  }

  app.use('/wp-api', async (req, res) => {
    // Rewrite /wp-api/X  →  /wp-json/wp/v2/X
    const wpPath = '/wp-json/wp/v2' + req.url;
    console.log('📰 WP proxy:', wpPath);
    try {
      // First attempt – no cookie
      let r = await wpRequest(wpPath, null);
      const ct = r.headers['content-type'] || '';
      if (ct.includes('json')) {
        res.set('Content-Type', 'application/json; charset=UTF-8');
        res.set('Access-Control-Allow-Origin', '*');
        return res.send(r.body);
      }
      // Got HTML challenge – solve it
      const cookieVal = solveInfinityFreeChallenge(r.body);
      if (!cookieVal) {
        console.error('❌ WP: could not solve InfinityFree challenge');
        return res.status(502).json({ error: 'Could not solve anti-bot challenge' });
      }
      console.log('🔑 WP: challenge solved, retrying with cookie …');
      // Second attempt – with solved cookie (add ?i=1 as the host expects)
      const sep = wpPath.includes('?') ? '&' : '?';
      r = await wpRequest(wpPath + sep + 'i=1', cookieVal);
      const ct2 = r.headers['content-type'] || '';
      if (ct2.includes('json')) {
        res.set('Content-Type', 'application/json; charset=UTF-8');
        res.set('Access-Control-Allow-Origin', '*');
        return res.send(r.body);
      }
      // Edge case: still not JSON; one more fold
      const ck2 = solveInfinityFreeChallenge(r.body) || cookieVal;
      r = await wpRequest(wpPath + sep + 'i=2', ck2);
      const ct3 = r.headers['content-type'] || '';
      if (ct3.includes('json')) {
        res.set('Content-Type', 'application/json; charset=UTF-8');
        res.set('Access-Control-Allow-Origin', '*');
        return res.send(r.body);
      }
      console.error('❌ WP: host still returning HTML after 3 attempts');
      res.status(502).json({ error: 'WordPress returned HTML after challenge retries' });
    } catch (err) {
      console.error('❌ WP proxy error:', err.message);
      res.status(502).json({ error: 'WordPress proxy error', message: err.message });
    }
  });

  // Property inquiry email sending
  // Apply JSON body parser specifically to this route
  const jsonParser = express.json({ limit: '50mb' });
  app.post('/api/send-property-inquiry', jsonParser, async (req, res) => {
    try {
      console.log('📧 Email endpoint called');
      console.log('📦 Request body:', req.body);
      console.log('📦 Request headers:', req.headers);
      console.log('📦 Content-Type:', req.get('Content-Type'));
      
      // Check if body was parsed
      if (!req.body || Object.keys(req.body).length === 0) {
        console.error('❌ req.body is empty or undefined!');
        console.error('❌ This might be because Content-Type header is not application/json');
        return res.status(400).json({ 
          success: false, 
          error: 'Request body is empty. Make sure Content-Type is application/json' 
        });
      }
      
      const handler = require('../api/send-property-inquiry.js');
      await handler(req, res);
    } catch (error) {
      console.error('Error in email handler:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });
};
