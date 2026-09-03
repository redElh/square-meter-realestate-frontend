// Vercel handler for PUBLIC_VACANCES_API — pure proxy to the real backend.
//
// Backend (Express on Railway) lives at https://api.squaremeter.ma and is the
// source of truth for Toolbox → Vacances (category:3 APIMO).
//
// This function simply forwards all /api/public/vacances/* requests to
// https://api.squaremeter.ma/api/public/vacances/* so the frontend can use a
// same-origin URL (avoids CORS, works behind CDN). No duplicate logic here.

const BACKEND = 'https://api.squaremeter.ma';

export default async function handler(req, res) {
  const pathname = (req.url || '').split('?')[0].replace(/\/$/, '');
  const target = `${BACKEND}${pathname}${req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : ''}`;

  try {
    const upstream = await fetch(target, {
      method: req.method || 'GET',
      headers: {
        Accept: 'application/json',
        ...(req.headers['x-api-key'] ? { 'X-API-Key': req.headers['x-api-key'] } : {}),
      },
    });

    // Mirror the upstream status + JSON body
    res.status(upstream.status);
    try {
      const json = await upstream.json();
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      return res.json(json);
    } catch {
      const text = await upstream.text();
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      return res.send(text);
    }
  } catch (e) {
    console.error('[vacances proxy] error', e.message);
    return res.status(502).json({ error: 'Upstream vacances API unavailable', message: e.message });
  }
}
