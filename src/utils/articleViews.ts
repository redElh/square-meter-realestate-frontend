// src/utils/articleViews.ts
// Persistent view counter using localStorage.
// Counts are stored per-article, survive page refreshes, work offline.

const STORAGE_KEY = 'sq_article_views';
const VIEW_THRESHOLD = 5000;

type ViewStore = Record<string, number>;

function readStore(): ViewStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ViewStore) : {};
  } catch {
    return {};
  }
}

function writeStore(store: ViewStore): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // ignore storage quota errors
  }
}

/** Increment view count for an article and return the new total. */
export function incrementViewCount(articleId: number | string): number {
  const store = readStore();
  const key = String(articleId);
  const next = (store[key] ?? 0) + 1;
  store[key] = next;
  writeStore(store);
  return next;
}

/** Read current view count without incrementing. */
export function getViewCount(articleId: number | string): number {
  const store = readStore();
  return store[String(articleId)] ?? 0;
}

/**
 * Format a raw view count for display.
 *   0–999   → "42"
 *   1000–4999 → "1.2k"
 *   ≥5000   → "+5k"
 */
export function formatViewCount(count: number): string {
  if (count >= VIEW_THRESHOLD) return '+5k';
  if (count >= 1000) return `${(count / 1000).toFixed(1).replace('.0', '')}k`;
  return String(count);
}
