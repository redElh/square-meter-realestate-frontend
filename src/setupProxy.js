const { createProxyMiddleware } = require('http-proxy-middleware');
const express = require('express');

module.exports = function(app) {

  // ─── Auth & Reviews Proxy ───────────────────────────────────────────────────
  // Proxy /auth/* and /api/reviews API requests to backend (port 4000)
  app.use(
    createProxyMiddleware({
      target: 'http://localhost:4000',
      changeOrigin: true,
      pathFilter: (pathname) =>
        (pathname.startsWith('/auth') && pathname !== '/auth') ||
        pathname.startsWith('/api/reviews'),
    })
  );

  // ─── Credentials for Apimo (from environment variables) ──────────────────
  const providerId = process.env.APIMO_PROVIDER_ID;
  const token = process.env.APIMO_TOKEN;
  if (!providerId || !token) {
    console.warn('⚠️ APIMO credentials not set in environment variables');
  }
  const credentials = providerId && token ? `${providerId}:${token}` : '';
  const base64Credentials = credentials ? Buffer.from(credentials).toString('base64') : '';

  console.log('🚀 Setting up proxy middleware...');

  // ─── ChromaDB Proxy ────────────────────────────────────────────────────────
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

  // ─── Apimo Proxy ───────────────────────────────────────────────────────────
  app.use(
    '/api/apimo',
    createProxyMiddleware({
      target: 'https://api.apimo.pro',
      changeOrigin: true,
      secure: false,
      pathRewrite: {
        '^/api/apimo': '',
      },
      headers: {
        'Authorization': `Basic ${base64Credentials}`,
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

  // ─── Google Reviews ────────────────────────────────────────────────────────
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
        source: 'error',
      });
    }
  });

  // ─── Article Views ─────────────────────────────────────────────────────────
  app.all('/api/article-views', async (req, res) => {
    try {
      console.log(`📈 Article views endpoint called: ${req.method}`);
      const handler = require('../api/article-views.js');
      await handler(req, res);
    } catch (error) {
      console.error('❌ Error in article views handler:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // ─── WordPress / InfinityFree Proxy ────────────────────────────────────────
  const http = require('http');
  const crypto = require('crypto');
  const WP_HOST = 'squaremeter-blog.rf.gd';

  function solveInfinityFreeChallenge(html) {
    const m = html.match(/a=toNumbers\(\"([a-f0-9]+)\"\),b=toNumbers\(\"([a-f0-9]+)\"\),c=toNumbers\(\"([a-f0-9]+)\"\)/);
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
    const wpPath = '/wp-json/wp/v2' + req.url;
    console.log('📰 WP proxy:', wpPath);
    try {
      let r = await wpRequest(wpPath, null);
      const ct = r.headers['content-type'] || '';
      if (ct.includes('json')) {
        res.set('Content-Type', 'application/json; charset=UTF-8');
        res.set('Access-Control-Allow-Origin', '*');
        return res.send(r.body);
      }
      const cookieVal = solveInfinityFreeChallenge(r.body);
      if (!cookieVal) {
        console.error('❌ WP: could not solve InfinityFree challenge');
        return res.status(502).json({ error: 'Could not solve anti-bot challenge' });
      }
      console.log('🔑 WP: challenge solved, retrying with cookie …');
      const sep = wpPath.includes('?') ? '&' : '?';
      r = await wpRequest(wpPath + sep + 'i=1', cookieVal);
      const ct2 = r.headers['content-type'] || '';
      if (ct2.includes('json')) {
        res.set('Content-Type', 'application/json; charset=UTF-8');
        res.set('Access-Control-Allow-Origin', '*');
        return res.send(r.body);
      }
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

  // ─── Property Inquiry Email ────────────────────────────────────────────────
  const jsonParser = express.json({ limit: '50mb' });
  app.post('/api/send-property-inquiry', jsonParser, async (req, res) => {
    try {
      console.log('📧 Email endpoint called');
      if (!req.body || Object.keys(req.body).length === 0) {
        console.error('❌ req.body is empty');
        return res.status(400).json({
          success: false,
          error: 'Request body is empty. Make sure Content-Type is application/json',
        });
      }
      const handler = require('../api/send-property-inquiry.js');
      await handler(req, res);
    } catch (error) {
      console.error('Error in email handler:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // ─── Property Statistics ───────────────────────────────────────────────────
  const statsParser = express.json({ limit: '50mb' });
  app.all('/api/property-stats', statsParser, async (req, res) => {
    try {
      console.log(`📊 Property stats endpoint called: ${req.method}`, req.url);
      if (
        (req.method === 'POST' || req.method === 'PUT') &&
        (!req.body || Object.keys(req.body).length === 0)
      ) {
        console.error('❌ Property-stats: req.body is empty');
        return res.status(400).json({
          success: false,
          error: 'Request body is empty. Make sure Content-Type is application/json',
        });
      }
      const handler = require('../api/property-stats.js');
      await handler(req, res);
    } catch (error) {
      console.error('❌ Error in property-stats handler:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });
};
