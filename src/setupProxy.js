// Proxy configuration for Create React App
// This file is automatically picked up by CRA's dev server

const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  const credentials = '4567:d07da6e744bb033d1299469f1f6f7334531ec05c';
  const base64Credentials = Buffer.from(credentials).toString('base64');
  
  console.log('🚀 Setting up proxy middleware...');
  console.log('🔑 Authorization header will be:', `Basic ${base64Credentials}`);
  
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
};
