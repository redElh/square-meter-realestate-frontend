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
