/**
 * Central environment configuration for the browser bundle.
 *
 * IMPORTANT — react-scripts (CRA) only inlines variables whose name starts with
 * `REACT_APP_`, and only when they are read as a *static* member expression:
 *
 *   process.env.REACT_APP_FOO   ✅ inlined at build time
 *   process.env['REACT_APP_FOO'] ❌ compiled to undefined
 *   process.env[name]           ❌ compiled to undefined
 *
 * So every variable below is written out literally and must never be
 * turned into a dynamic lookup. Adding a new one means adding a new
 * `REACT_APP_*` line to `.env.local` (and `.env.example`) AND a literal read
 * here.
 *
 * Server-only secrets (APIMO_TOKEN, APIMO_PROVIDER_ID, JWT_SECRET, Airtable,
 * OAuth, KV/Redis, SMTP) must NEVER be read from this file — they belong in
 * `api/` serverless functions and `src/backend/`, which run on the server.
 */

function readString(value: string | undefined, fallback: string): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : fallback;
}

export const env = {
  /** React mode, inlined by react-scripts. */
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',

  // ─── Apimo (property listings) ───────────────────────────────────────────
  /**
   * Agency id used to build `/api/apimo/agencies/{id}/properties`.
   * Falls back to the production agency id when the variable is absent.
   */
  apimoAgencyId: readString(process.env.REACT_APP_APIMO_AGENCY_ID, '25311'),

  /**
   * Overrides the Apimo proxy base URL. Leave empty to use the same-origin
   * proxy: the CRA dev proxy in `src/setupProxy.js` locally, and the Vercel
   * function in `api/apimo.js` in production. Both attach the credentials
   * server-side, so no token ever reaches the browser.
   */
  apimoBaseUrl: readString(process.env.REACT_APP_APIMO_BASE_URL, '/api/apimo'),

  // ─── Vacances / Toolbox public API ───────────────────────────────────────
  vacancesApiUrl: readString(process.env.REACT_APP_VACANCES_API_URL, ''),
  crmApiUrl: readString(process.env.REACT_APP_CRM_API_URL, ''),
  publicVacancesApiKey: readString(
    process.env.REACT_APP_PUBLIC_VACANCES_API_KEY,
    ''
  ),
  vacancesMock: process.env.REACT_APP_VACANCES_MOCK === 'true',

  // ─── AI / chatbot ────────────────────────────────────────────────────────
  geminiApiKey: readString(process.env.REACT_APP_GEMINI_API_KEY, ''),

  /**
   * ChromaDB base URL. Defaults to the same-origin `/chroma` dev proxy so the
   * browser never has to deal with ChromaDB's CORS policy.
   */
  chromaUrl: readString(process.env.REACT_APP_CHROMA_URL, '/chroma'),

  // ─── Auth backend ────────────────────────────────────────────────────────
  authBaseUrl: readString(process.env.REACT_APP_AUTH_BASE_URL, ''),
} as const;

/**
 * Logs any client-visible variable that is expected but missing.
 * Call once at startup from `src/index.tsx` to make misconfiguration obvious
 * instead of silently degrading a feature.
 */
export function reportMissingClientEnv(): void {
  if (!env.isDevelopment) return;

  const missing: string[] = [];
  if (!env.geminiApiKey) missing.push('REACT_APP_GEMINI_API_KEY');
  if (!env.vacancesApiUrl) missing.push('REACT_APP_VACANCES_API_URL');

  if (missing.length > 0) {
    console.warn(
      `[env] Missing client env vars: ${missing.join(', ')}. ` +
        'Define them in .env.local and restart the dev server — react-scripts ' +
        'reads .env files once at startup and never reloads them.'
    );
  }
}

export default env;
