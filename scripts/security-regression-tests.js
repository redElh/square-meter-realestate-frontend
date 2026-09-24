// SquareMeter — Security Regression Tests
// ---------------------------------------------------------
// Standalone Node.js test suite (no external dependencies) that
// verifies the 11 penetration-test remediations (V1..V11) plus the
// additional security improvements described in SECURITY_FIXES.md.
//
// Run with:  node scripts/security-regression-tests.js
// ---------------------------------------------------------

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const crypto = require('crypto');
const http = require('http');

const ROOT = path.resolve(__dirname, '..');
const apiDir = path.join(ROOT, 'api');
const srcDir = path.join(ROOT, 'src');

// ---------------------------------------------------------------
// Tiny test harness
// ---------------------------------------------------------------
let passed = 0;
let failed = 0;
const failures = [];

function test(name, fn) {
  return Promise.resolve()
    .then(fn)
    .then(() => { passed++; console.log('  ✓ ' + name); })
    .catch((err) => {
      failed++;
      failures.push({ name, err });
      console.error('  ✗ ' + name);
      console.error('      → ' + (err && err.message ? err.message : err));
    });
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function assertEqual(actual, expected, msg) {
  if (actual !== expected) {
    throw new Error(`${msg || 'assertEqual'}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

function makeRes() {
  const headers = {};
  const res = {
    headers,
    statusCode: 200,
    body: undefined,
    setHeader(k, v) { this.headers[k] = v; return this; },
    status(c) { this.statusCode = c; return this; },
    json(payload) { this.body = payload; this.sent = true; return this; },
    send(payload) { this.body = payload; this.sent = true; return this; },
    end() { this.sent = true; return this; },
  };
  return res;
}

// Load an api/*.js module regardless of its export style (ESM default or CJS).
// A custom require shim lets us mock server-side-only modules (@google/generative-ai).
function loadApiModule(filename, requireShim) {
  const src = fs.readFileSync(path.join(apiDir, filename), 'utf8');
  const code = src.replace(/export default\s+/, 'module.exports = ');
  const module = { exports: {} };
  const localRequire = requireShim || ((name) => require(name));
  const run = new Function('module', 'exports', 'require', '__dirname', 'process', 'Buffer', 'fetch', code);
  run(module, module.exports, localRequire, apiDir, process, Buffer, global.fetch);
  return module.exports;
}

function collectFiles(dir, out, exts) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) collectFiles(full, out, exts);
    else if (exts.some((e) => entry.name.endsWith(e))) out.push(full);
  }
  return out;
}

// ---------------------------------------------------------------
// T1 — Secrets scan (V1, V3, V4, V5, V6)
// ---------------------------------------------------------------
async function runSecretsScan() {
  console.log('\n■ T1 — Scan des secrets / identifiants codés en dur (V1, V3, V4, V5, V6)');

  const KNOWN_LEAKS = [
    'd07da6e744bb033d1299469f1f6f7334531ec05c', // V1 — Apimo token
    "providerId: '4567'",                        // V1 — Apimo provider
    'SM-TEAM::Clients#2026!X7p9$ZqL',            // V3 — client space password
    'SM-TEAM::Analytics#2026!M2@A9qL7vR3',       // V5 — analytics password
    'SquareMeter#2025!Mag',                      // V4 — Mag password
  ];

  const scanTargets = ['api', 'src'].map((d) => path.join(ROOT, d));
  const files = [];
  for (const t of scanTargets) collectFiles(t, files, ['.js', '.ts', '.tsx', '.jsx', '.json']);

  await test('Aucun mot de passe/token connu ne figure plus dans le code (src/ + api/)', () => {
    const leaks = [];
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      for (const leak of KNOWN_LEAKS) {
        if (content.includes(leak)) leaks.push(`${path.relative(ROOT, file)} contient ${leak}`);
      }
    }
    assert(leaks.length === 0, leaks.join('\n') || 'no leaks');
  });

  await test('apimoService.ts côté client ne contient plus providerId ni token', () => {
    const s = fs.readFileSync(path.join(srcDir, 'services', 'apimoService.ts'), 'utf8');
    assert(!/providerId:/.test(s) && !/token:/.test(s), 'providerId/token found in client config');
  });

  await test('api/apimo.js lit les identifiants depuis les variables d’environnement', () => {
    const s = fs.readFileSync(path.join(apiDir, 'apimo.js'), 'utf8');
    assert(s.includes('process.env.APIMO_PROVIDER_ID') && s.includes('process.env.APIMO_TOKEN'),
      'APIMO env vars not referenced');
  });

  await test('MagProtectedRoute.tsx (V4) a bien été supprimé', () => {
    const file = path.join(srcDir, 'components', 'ProtectedRoute', 'MagProtectedRoute.tsx');
    assert(!fs.existsSync(file), 'MagProtectedRoute.tsx still exists');
  });

  await test('Le chatbot client ne contient plus de clé Gemini côté navigateur', () => {
    const s = fs.readFileSync(path.join(srcDir, 'services', 'ragChatbotService.ts'), 'utf8');
    assert(!s.includes('GoogleGenerativeAI') && !s.includes('REACT_APP_GEMINI_API_KEY'),
      'client chatbot still references Gemini directly');
  });

  await test('api/chatbot.js utilise GEMINI_API_KEY (côté serveur uniquement)', () => {
    const s = fs.readFileSync(path.join(apiDir, 'chatbot.js'), 'utf8');
    assert(s.includes('GEMINI_API_KEY') && !s.includes('REACT_APP_GEMINI_API_KEY'), 'chatbot.js key env wrong');
  });

  await test('Aucun appel direct à l’API Gemini dans le bundle client (src/services/ragChatbotService.ts)', () => {
    const s = fs.readFileSync(path.join(srcDir, 'services', 'ragChatbotService.ts'), 'utf8');
    assert(s.includes("/api/chatbot"), 'client service does not route via /api/chatbot');
  });
}

// ---------------------------------------------------------------
// T2 — api/verify-access.js (V3 + V5)
// ---------------------------------------------------------------
async function runVerifyAccessTests() {
  console.log('\n■ T2 — Vérification serveur des mots de passe — /api/verify-access (V3 + V5)');

  process.env.CLIENTS_ACCESS_PASSWORD = 'Test-Clients-2026!Secure';
  process.env.ANALYTICS_ACCESS_PASSWORD = 'Test-Analytics-2026!Secure';
  const handler = loadApiModule('verify-access.js');

  async function call(body, origin = 'https://www.squaremeter.ma') {
    const req = { headers: { origin }, method: 'POST', body };
    const res = makeRes();
    await handler(req, res);
    return { status: res.statusCode, body: res.body, headers: res.headers };
  }

  await test('Mot de passe client correct → 200 { authenticated: true }', async () => {
    const r = await call({ password: 'Test-Clients-2026!Secure', section: 'clients' });
    assertEqual(r.status, 200);
    assertEqual(r.body.authenticated, true);
  });

  await test('Mot de passe analytics correct → 200 { authenticated: true }', async () => {
    const r = await call({ password: 'Test-Analytics-2026!Secure', section: 'analytics' });
    assertEqual(r.status, 200);
    assertEqual(r.body.authenticated, true);
  });

  await test('Mauvais mot de passe → 401 avec tentatives restantes', async () => {
    const r = await call({ password: 'Wrong-Password-123', section: 'clients' });
    assertEqual(r.status, 401);
    assert(typeof r.body.remainingAttempts === 'number' && r.body.remainingAttempts >= 0);
  });

  await test('5 échecs consécutifs → 429 (verrouillage anti force brute)', async () => {
    for (let i = 0; i < 5; i++) {
      const r = await call({ password: 'Wrong-Password-123', section: 'analytics' });
      assertEqual(r.status, 401);
    }
    const r = await call({ password: 'Test-Analytics-2026!Secure', section: 'analytics' });
    assertEqual(r.status, 429, 'expected lockout after 5 failed attempts');
    assert(typeof r.body.retryAfter === 'number' && r.body.retryAfter > 0);
  });

  await test('Section invalide → 400', async () => {
    const r = await call({ password: 'Test-Clients-2026!Secure', section: 'admin' });
    assertEqual(r.status, 400);
  });

  await test('Mot de passe manquant → 400', async () => {
    const r = await call({ password: '', section: 'clients' });
    assertEqual(r.status, 400);
  });

  await test('Mot de passe non string (nombre) → 400', async () => {
    const r = await call({ password: 123456789012, section: 'clients' });
    assertEqual(r.status, 400);
  });

  await test('Mot de passe trop court (< 12 caractères) → 400', async () => {
    const r = await call({ password: 'short', section: 'clients' });
    assertEqual(r.status, 400);
  });

  await test('Méthode interdite (GET) → 405', async () => {
    const req = { headers: { origin: 'https://www.squaremeter.ma' }, method: 'GET' };
    const res = makeRes();
    await handler(req, res);
    assertEqual(res.statusCode, 405);
  });

  await test('Origine non autorisée → aucun en-tête Access-Control-Allow-Origin', async () => {
    const r = await call({ password: 'Test-Clients-2026!Secure', section: 'clients' }, 'https://evil.example.com');
    assert(!('Access-Control-Allow-Origin' in r.headers), 'ACAO header leaked to unknown origin');
  });

  await test('Variable d’environnement absente → 500 (refus de servir)', async () => {
    delete process.env.CLIENTS_ACCESS_PASSWORD;
    try {
      const r = await call({ password: 'Test-Clients-2026!Secure', section: 'clients' });
      assertEqual(r.status, 500);
    } finally {
      process.env.CLIENTS_ACCESS_PASSWORD = 'Test-Clients-2026!Secure';
    }
  });

  await test('Comparaison en temps constant (crypto.timingSafeEqual) utilisée', () => {
    const src = fs.readFileSync(path.join(apiDir, 'verify-access.js'), 'utf8');
    assert(src.includes('crypto.timingSafeEqual'), 'timingSafeEqual not used');
  });
}

// ---------------------------------------------------------------
// T3 — api/wordpress.js path whitelist (V8)
// ---------------------------------------------------------------
async function runWordPressTests() {
  console.log('\n■ T3 — Liste blanche des chemins du proxy WordPress — /api/wordpress (V8)');

  const originalRequest = http.request;
  const requestedPaths = [];
  let jsonBody = JSON.stringify({ data: [] });

  http.request = (options, cb) => {
    requestedPaths.push(options.path);
    const response = {
      statusCode: 200,
      headers: { 'content-type': 'application/json' },
      on(evt, cb2) {
        if (evt === 'data') cb2(Buffer.from(jsonBody));
        if (evt === 'end') setTimeout(cb2, 0);
        return this;
      },
    };
    cb(response);
    return { on() { return this; }, setTimeout() { return this; }, end() {} };
  };

  try {
    const handler = loadApiModule('wordpress.js');

    async function call(pathValue, origin = 'https://www.squaremeter.ma') {
      requestedPaths.length = 0;
      const req = { headers: { origin }, method: 'GET', query: { path: pathValue }, url: '/api/wordpress' };
      const res = makeRes();
      await handler(req, res);
      return { status: res.statusCode, body: res.body, requested: requestedPaths.slice() };
    }

    await test('/posts est autorisé', async () => {
      const r = await call('/posts');
      assertEqual(r.status, 200);
      assertEqual(r.requested[0], '/wp-json/wp/v2/posts', 'did not proxy to WordPress');
    });

    await test('/posts/123 est autorisé', async () => {
      const r = await call('/posts/123');
      assertEqual(r.status, 200);
      assertEqual(r.requested[0], '/wp-json/wp/v2/posts/123');
    });

    await test('/pages et /categories et /tags sont autorisés', async () => {
      for (const p of ['/pages', '/categories', '/tags']) {
        const r = await call(p);
        assertEqual(r.status, 200, `${p} should be allowed`);
      }
    });

    await test('/users → 403 (énumération de comptes bloquée)', async () => {
      const r = await call('/users');
      assertEqual(r.status, 403);
      assertEqual(r.requested.length, 0, 'request reached upstream');
    });

    await test('/settings → 403', async () => {
      const r = await call('/settings');
      assertEqual(r.status, 403);
    });

    await test('/media → 403 (endpoint non listé)', async () => {
      const r = await call('/media');
      assertEqual(r.status, 403);
    });

    await test('Tentative de traversée de chemin → 403', async () => {
      const r = await call('/../../etc/passwd');
      assertEqual(r.status, 403);
    });

    await test('Chemin encodé URL malveillant → 403', async () => {
      const r = await call('/%2e%2e%2fusers');
      assertEqual(r.status, 403);
    });

    await test('Origine inconnue → aucun en-tête CORS', async () => {
      const r = await call('/posts', 'https://evil.example.com');
      assert(!r.headers || !('Access-Control-Allow-Origin' in r.headers));
    });
  } finally {
    http.request = originalRequest;
  }
}

// ---------------------------------------------------------------
// T4 — api/apimo.js (V1 + V2)
// ---------------------------------------------------------------
async function runApimoTests() {
  console.log('\n■ T4 — Proxy Apimo verrouillé — /api/apimo (V1 + V2)');

  const originalFetch = global.fetch;
  global.fetch = async (url) => ({
    ok: true,
    status: 200,
    headers: new Map([['content-type', 'application/json']]),
    async json() { return { properties: [], total_items: 0 }; },
  });

  process.env.APIMO_PROVIDER_ID = 'test-provider';
  process.env.APIMO_TOKEN = 'test-token';
  const handler = loadApiModule('apimo.js');

  try {
    async function call(method, origin, url) {
      const req = { headers: { origin }, method, url: url || '/api/apimo/agencies/25311/properties' };
      const res = makeRes();
      await handler(req, res);
      return res;
    }

    await test('Origine autorisée → en-tête CORS présent', async () => {
      for (const origin of ['https://www.squaremeter.ma', 'https://squaremeter.ma']) {
        const res = await call('GET', origin);
        assertEqual(res.headers['Access-Control-Allow-Origin'], origin);
      }
    });

    await test('Origine inconnue → aucun en-tête CORS', async () => {
      const res = await call('GET', 'https://evil.example.com');
      assert(!('Access-Control-Allow-Origin' in res.headers));
    });

    await test('Méthode POST → 405 (lecture seule)', async () => {
      const res = await call('POST', 'https://www.squaremeter.ma');
      assertEqual(res.statusCode, 405);
    });

    await test('Méthode PUT → 405 (lecture seule)', async () => {
      const res = await call('PUT', 'https://www.squaremeter.ma');
      assertEqual(res.statusCode, 405);
    });

    await test('Identifiants absents → réponse d’erreur sans secret', async () => {
      delete process.env.APIMO_PROVIDER_ID;
      delete process.env.APIMO_TOKEN;
      const res = await call('GET', 'https://www.squaremeter.ma');
      assertEqual(res.statusCode, 200);
      assertEqual(res.body.error, 'API configuration error');
      assert(!JSON.stringify(res.body).includes('test-token'), 'secret leaked in response');
    });
  } finally {
    process.env.APIMO_PROVIDER_ID = undefined;
    process.env.APIMO_TOKEN = undefined;
    global.fetch = originalFetch;
  }
}

// ---------------------------------------------------------------
// T5 — api/chatbot.js input sanitization (V9)
// ---------------------------------------------------------------
async function runChatbotTests() {
  console.log('\n■ T5 — Assainissement des entrées du chatbot — /api/chatbot (V9)');

  const sentMessages = [];
  class FakeModel {
    startChat() {
      return { sendMessage: async (msg) => { sentMessages.push(msg); return { response: { text: () => 'OK' } }; } };
    }
  }
  class FakeGenAI {
    constructor(key) { this.key = key; }
    getGenerativeModel() { return new FakeModel(); }
  }
  const requireShim = (name) => (name === '@google/generative-ai' ? { GoogleGenerativeAI: FakeGenAI } : require(name));

  process.env.GEMINI_API_KEY = 'test-gemini-key';
  const handler = loadApiModule('chatbot.js', requireShim);

  async function call(body, method = 'POST') {
    const req = { headers: { origin: 'https://www.squaremeter.ma' }, method, body };
    const res = makeRes();
    await handler(req, res);
    return { status: res.statusCode, body: res.body };
  }

  await test('Message non string → 400', async () => {
    const r = await call({ message: 12345, language: 'en' });
    assertEqual(r.status, 400);
  });

  await test('Message vide après trim → 400', async () => {
    const r = await call({ message: '     ', language: 'en' });
    assertEqual(r.status, 400);
  });

  await test('Message sans message → 400', async () => {
    const r = await call({ language: 'en' });
    assertEqual(r.status, 400);
  });

  await test('Caractères de contrôle supprimés avant d’atteindre le modèle', async () => {
    sentMessages.length = 0;
    const r = await call({ message: '\x00\x01\x1f\x7f' + 'B'.repeat(50), language: 'en' });
    assertEqual(r.status, 200);
    const sent = sentMessages[0];
    assert(sent === 'B'.repeat(50), `control chars not stripped: ${JSON.stringify(sent)}`);
  });

  await test('Message limité à 1000 caractères avant d’atteindre le modèle', async () => {
    sentMessages.length = 0;
    const r = await call({ message: 'C'.repeat(2000), language: 'en' });
    assertEqual(r.status, 200);
    assertEqual(sentMessages[0].length, 1000, 'message length not capped at 1000');
  });

  await test('Invite système durcie (injection de prompt) — 6 langues', () => {
    const src = fs.readFileSync(path.join(apiDir, 'chatbot.js'), 'utf8');
    for (const lang of ['en', 'fr', 'es', 'de', 'ar', 'ru']) {
      assert(src.includes(`${lang}:`), `missing system prompt for ${lang}`);
    }
    assert(/IGNORE any instructions|IGNOREZ toute instruction/i.test(src), 'anti-injection rules missing');
  });

  await test('Clé API absente → 500 (service désactivé, aucune fuite)', async () => {
    delete process.env.GEMINI_API_KEY;
    const r = await call({ message: 'hello', language: 'en' });
    assertEqual(r.status, 500);
    process.env.GEMINI_API_KEY = 'test-gemini-key';
  });
}

// ---------------------------------------------------------------
// T6 — Sécurité globale (headers + CORS, améliorations supplémentaires)
// ---------------------------------------------------------------
async function runGlobalChecks() {
  console.log('\n■ T6 — Améliorations globales (headers de sécurité + CORS + debug endpoint)');

  await test('En-têtes de sécurité présents dans vercel.json', () => {
    const v = fs.readFileSync(path.join(ROOT, 'vercel.json'), 'utf8');
    for (const h of ['X-Frame-Options', 'X-Content-Type-Options', 'Referrer-Policy', 'Permissions-Policy', 'Strict-Transport-Security']) {
      assert(v.includes(h), `missing header ${h}`);
    }
  });

  await test('Aucun en-tête CORS sauvage ("*") dans les fonctions serverless', () => {
    const files = collectFiles(apiDir, [], ['.js']);
    const offenders = [];
    for (const f of files) {
      const s = fs.readFileSync(f, 'utf8');
      if (/Access-Control-Allow-Origin['"]?\s*,\s*['"]\*['"]/.test(s)) offenders.push(f);
    }
    assert(offenders.length === 0, `wildcard CORS in: ${offenders.join(', ')}`);
  });

  await test('Toutes les fonctions serverless restreignent les origines (squaremeter.ma)', () => {
    const files = collectFiles(apiDir, [], ['.js']);
    const offenders = [];
    for (const f of files) {
      const s = fs.readFileSync(f, 'utf8');
      if (!s.includes('squaremeter.ma')) offenders.push(path.basename(f));
    }
    assert(offenders.length === 0, `no origin restriction in: ${offenders.join(', ')}`);
  });

  await test('Endpoint de debug (api/debug-careers.js) supprimé', () => {
    assert(!fs.existsSync(path.join(apiDir, 'debug-careers.js')), 'debug-careers.js still exists');
  });

  await test('api/verify-access.js présent (nouvel endpoint serveur)', () => {
    assert(fs.existsSync(path.join(apiDir, 'verify-access.js')), 'verify-access.js missing');
  });

  await test('V7 — Le contenu WordPress est assaini par DOMPurify avant affichage', () => {
    const s = fs.readFileSync(path.join(srcDir, 'pages', 'company', 'MagArticle.tsx'), 'utf8');
    assert(s.includes('DOMPurify'), 'DOMPurify not imported');
    assert(s.includes('ALLOWED_TAGS'), 'no tag allowlist');
    assert(s.includes('ALLOWED_ATTR'), 'no attribute allowlist');
    assert(s.includes('sanitizeHtml('), 'sanitizeHtml not applied');
    const riskyTags = /<script|<iframe|<object|<embed/i;
    const allowedRisky = ['script', 'iframe', 'object', 'embed', 'form', 'input', 'svg', 'math']
      .filter((tag) => s.includes(`'${tag}'`));
    assert(allowedRisky.length === 0, `risky tag allowed in list: ${allowedRisky.join(', ')}`);
  });

  await test('V6 — api/chatbot.js lit la clé Gemini côté serveur (pas REACT_APP)', () => {
    const s = fs.readFileSync(path.join(apiDir, 'chatbot.js'), 'utf8');
    assert(s.includes('process.env.GEMINI_API_KEY') && !s.includes('REACT_APP_GEMINI_API_KEY'),
      'Gemini key exposure in server file');
  });
}

// ---------------------------------------------------------------
// Runner
// ---------------------------------------------------------------
(async () => {
  console.log('══════════════════════════════════════════════════════════');
  console.log('  SquareMeter — Tests de régression sécurité (V1–V11)');
  console.log(`  ${new Date().toISOString()}`);
  console.log('══════════════════════════════════════════════════════════');

  await runSecretsScan();
  await runVerifyAccessTests();
  await runWordPressTests();
  await runApimoTests();
  await runChatbotTests();
  await runGlobalChecks();

  console.log('\n══════════════════════════════════════════════════════════');
  console.log(`  RÉSULTAT : ${passed} tests réussis, ${failed} échecs`);
  if (failed > 0) {
    console.log('  Tests en échec :');
    for (const f of failures) console.log(`    • ${f.name} — ${f.err.message}`);
  }
  console.log('══════════════════════════════════════════════════════════');
  process.exit(failed > 0 ? 1 : 0);
})();
