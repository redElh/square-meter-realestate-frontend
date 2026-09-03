// Vacances public API service
// Docs: PUBLIC_VACANCES_API.md
// Base: https://api.squaremeter.ma/api/public

function getDefaultBase(): string {
  // Prefer env var if explicitly set
  const envBase =
    (process.env.REACT_APP_VACANCES_API_URL as string) ||
    (process.env.REACT_APP_CRM_API_URL as string);
  if (envBase) return envBase.replace(/\/$/, '');
  // In browser: try same-origin first (works with dev proxy + Vercel functions)
  // This also avoids CORS when CRM is down (returns HTML).
  if (typeof window !== 'undefined' && window.location?.origin) {
    // Use same-origin /api/public — dev setupProxy and Vercel will handle it.
    // If this 404s we fallback to CRM below.
    return `${window.location.origin}/api/public`;
  }
  return 'https://api.squaremeter.ma/api/public';
}

export const VACANCES_API_BASE = getDefaultBase();
const CRM_FALLBACK_BASE = 'https://api.squaremeter.ma/api/public';

const VACANCES_API_KEY =
  (process.env.REACT_APP_PUBLIC_VACANCES_API_KEY as string) || '';

type ReservedSingleResponse = {
  propertyId: string;
  reservedDates: string[]; // YYYY-MM-DD sorted ASC, Africa/Casablanca
  count: number;
};

type ReservedBatchResponse = {
  reservations: Record<string, string[]>;
};

type CalendarResponse = {
  calendar: Record<string, string[]>;
  totalProperties: number;
  totalDates: number;
};

// Simple in-memory cache (60s for reservations, 300s for properties)
const cache = new Map<string, { data: any; expiresAt: number }>();

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.data as T;
}

function setCached(key: string, data: any, ttlMs: number) {
  cache.set(key, { data, expiresAt: Date.now() + ttlMs });
}

function buildHeaders(): HeadersInit {
  // NOTE: only use CORS-safelisted headers here. Non-safelisted headers (e.g.
  // Cache-Control) trigger a preflight that the cross-origin backend
  // (api.squaremeter.ma) does NOT allow, which would block cross-origin fetches.
  // Real-time freshness is handled by polling with `force: true` (bypasses the
  // in-memory cache), no HTTP no-cache header needed.
  const headers: HeadersInit = { Accept: 'application/json' };
  if (VACANCES_API_KEY) {
    (headers as Record<string, string>)['X-API-Key'] = VACANCES_API_KEY;
  }
  return headers;
}

function buildUrl(path: string, base = VACANCES_API_BASE): string {
  const b = base.replace(/\/$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${b}${p}`;
}

// ---------------------------------------------------------------------------
// Mock generator — ensures calendar always shows blocked days even if CRM is
// down / returns HTML (as currently observed on crm.squaremeter.ma).
// Generates deterministic dates in the next 30 days so they are always visible.
// ---------------------------------------------------------------------------
function formatIso(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function generateMockReservedDates(propertyId: string | number): string[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const hash = String(propertyId)
    .split('')
    .reduce((a, c) => a + c.charCodeAt(0), 0);
  const offset = hash % 3; // variation per property 0..2
  // Show blocked days starting tomorrow+offset so they are always in view
  const offsets = [2 + offset, 3 + offset, 5 + offset, 10 + offset, 11 + offset, 12 + offset, 18 + offset, 19 + offset, 25 + offset];
  const dates = offsets.map((n) => {
    const d = new Date(today);
    d.setDate(d.getDate() + n);
    return formatIso(d);
  });
  // Also add a past-offset to test past disabling (should be ignored by disabled:before:today)
  return [...new Set(dates)].sort();
}

const MOCK_ENABLED =
  // Allow forcing mock via ?mockVacances=1 or localStorage
  (typeof window !== 'undefined' &&
    (window.location.search.includes('mockVacances=1') ||
      localStorage.getItem('mockVacances') === '1')) ||
  // If env explicitly wants mock
  process.env.REACT_APP_VACANCES_MOCK === '1';

/**
 * Convert YYYY-MM-DD (Africa/Casablanca) to a local Date at midnight.
 * react-day-picker disables by matching Date objects (startOfDay equality).
 */
export function parseIsoDate(iso: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

export function isoToDateObjects(dates: string[]): Date[] {
  return dates.map(parseIsoDate).filter(Boolean) as Date[];
}

export function isoSet(dates: string[]): Set<string> {
  return new Set(dates);
}

/**
 * Check if a [from, to) range overlaps any reserved date.
 * Stay nights are [from, to) — departure day (to) is exclusive so back-to-back
 * bookings on the same day are allowed (checkout = next check-in).
 */
export function isRangeOverlapsReserved(
  from: Date | undefined,
  to: Date | undefined,
  reservedSet: Set<string>
): boolean {
  if (!from || !to || reservedSet.size === 0) return false;
  const fmt = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const start = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const end = new Date(to.getFullYear(), to.getMonth(), to.getDate());
  if (end <= start) return false;
  for (let cur = new Date(start); cur < end; cur.setDate(cur.getDate() + 1)) {
    if (reservedSet.has(fmt(cur))) return true;
  }
  return false;
}

async function fetchJson(url: string, signal?: AbortSignal): Promise<any> {
  const res = await fetch(url, { headers: buildHeaders(), signal });
  const ct = res.headers.get('content-type') || '';
  // If server returns HTML (e.g. Vercel fallback) treat as error
  if (!ct.includes('application/json')) {
    const text = await res.text().catch(() => '');
    // 200 with HTML means route not found on that host
    throw new Error(`Non-JSON response ${res.status} ct=${ct} body=${text.slice(0, 120).replace(/\n/g, ' ')}`);
  }
  if (!res.ok) {
    if (res.status === 404) return null; // treat as empty
    const text = await res.text().catch(() => '');
    throw new Error(`CRM ${res.status} ${res.statusText} ${text.slice(0, 200)}`);
  }
  return res.json();
}

export async function getReservedDates(
  propertyId: string | number,
  opts?: { signal?: AbortSignal; force?: boolean }
): Promise<string[]> {
  const id = String(propertyId).trim();
  if (!id) return [];
  if (!/^[A-Za-z0-9_-]+$/.test(id)) {
    console.warn(`[vacancesService] invalid propertyId "${id}"`);
    return [];
  }
  const cacheKey = `single:${id}`;
  if (!opts?.force) {
    const cached = getCached<string[]>(cacheKey);
    if (cached) {
      console.log(`[vacancesService] cache hit ${id} ->`, cached);
      return cached;
    }
  }

  // If mock forced, return mock immediately (still caches)
  if (MOCK_ENABLED) {
    const mock = generateMockReservedDates(id);
    console.log(`[vacancesService] MOCK forced for ${id} ->`, mock);
    setCached(cacheKey, mock, 60_000);
    return mock;
  }

  // Try same-origin (Vercel proxy) first, then the authoritative API backend.
  // If the same-origin proxy is not deployed it 404s — we must NOT short-circuit
  // to empty there, but keep trying the real backend (api.squaremeter.ma).
  const basesToTry = [VACANCES_API_BASE, CRM_FALLBACK_BASE].filter((v, i, a) => a.indexOf(v) === i);
  let lastError: any = null;
  let sawNotFound = false;
  for (const base of basesToTry) {
    const url = buildUrl(`/vacances/reservations/${encodeURIComponent(id)}`, base);
    console.log(`[vacancesService] fetching ${url}`);
    try {
      const data = await fetchJson(url, opts?.signal);
      if (data === null) {
        // 404 on this host (e.g. same-origin proxy not deployed) — try the
        // other base before giving up.
        console.log(`[vacancesService] 404 for ${id} at ${base} (proxy not deployed?) -> trying next base`);
        sawNotFound = true;
        continue;
      }
      const d = data as ReservedSingleResponse;
      const dates = Array.isArray(d.reservedDates) ? d.reservedDates : [];
      console.log(`[vacancesService] success ${id} @ ${base} ->`, dates);
      setCached(cacheKey, dates, 60_000);
      return dates;
    } catch (err: any) {
      if (err?.name === 'AbortError') throw err;
      console.warn(`[vacancesService] fetch failed @ ${base} for ${id}:`, err?.message || err);
      lastError = err;
      // try next base
      continue;
    }
  }

  // Every base returned 404 (route truly not found anywhere).
  if (sawNotFound && !lastError) {
    console.log(`[vacancesService] ${id} not found on any base -> empty real`);
    setCached(cacheKey, [], 30_000);
    return [];
  }

  // All bases failed with real errors — NO fallback mock (user requested real
  // data, not falsified). Throw so UI shows a real error state.
  console.warn(`[vacancesService] all bases failed for ${id}. Returning REAL empty (no falsified fallback). Last error:`, lastError?.message);
  setCached(cacheKey, [], 30_000);
  throw lastError || new Error('Vacances API unavailable - real CRM returned HTML/404 (see console). Add ?mockVacances=1 to show demo data.');

}

export async function getBatchReservations(
  ids: (string | number)[],
  opts?: { signal?: AbortSignal }
): Promise<Record<string, string[]>> {
  const clean = [...new Set(ids.map((v) => String(v).trim()).filter(Boolean))].slice(0, 50);
  if (clean.length === 0) return {};
  if (MOCK_ENABLED) {
    const mock: Record<string, string[]> = {};
    clean.forEach((cid) => (mock[cid] = generateMockReservedDates(cid)));
    return mock;
  }
  const sorted = [...clean].sort();
  const cacheKey = `batch:${sorted.join(',')}`;
  const cached = getCached<Record<string, string[]>>(cacheKey);
  if (cached) return cached;

  const basesToTry = [VACANCES_API_BASE, CRM_FALLBACK_BASE].filter((v, i, a) => a.indexOf(v) === i);
  for (const base of basesToTry) {
    const url = buildUrl(`/vacances/reservations?ids=${encodeURIComponent(sorted.join(','))}`, base);
    try {
      const data = await fetchJson(url, opts?.signal);
      if (data === null) {
        console.log(`[vacancesService] batch 404 at ${base} -> trying next base`);
        continue;
      }
      const d = data as ReservedBatchResponse;
      const reservations = d.reservations || {};
      setCached(cacheKey, reservations, 60_000);
      return reservations;
    } catch (err) {
      console.warn(`[vacancesService] batch failed @ ${base}:`, err);
      continue;
    }
  }
  // No fallback mock — return empty real
  console.warn(`[vacancesService] batch all bases failed, returning empty real`);
  return {};
}

export async function getVacancesCalendar(opts?: {
  signal?: AbortSignal;
}): Promise<Record<string, string[]>> {
  const cacheKey = 'calendar:all';
  const cached = getCached<Record<string, string[]>>(cacheKey);
  if (cached) return cached;
  const basesToTry = [VACANCES_API_BASE, CRM_FALLBACK_BASE].filter((v, i, a) => a.indexOf(v) === i);
  for (const base of basesToTry) {
    const url = buildUrl('/vacances/calendar', base);
    try {
      const data = await fetchJson(url, opts?.signal);
      if (data === null) {
        console.log(`[vacancesService] calendar 404 at ${base} -> trying next base`);
        continue;
      }
      const d = data as CalendarResponse;
      const cal = d.calendar || {};
      setCached(cacheKey, cal, 60_000);
      return cal;
    } catch (err) {
      console.warn(`[vacancesService] calendar failed @ ${base}:`, err);
      continue;
    }
  }
  return cached ?? {};
}

export function clearVacancesCache() {
  cache.clear();
}

const vacancesService = {
  VACANCES_API_BASE,
  getReservedDates,
  getBatchReservations,
  getVacancesCalendar,
  parseIsoDate,
  isoToDateObjects,
  isoSet,
  isRangeOverlapsReserved,
  generateMockReservedDates,
  clearCache: clearVacancesCache,
};

export default vacancesService;
