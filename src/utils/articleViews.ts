// src/utils/articleViews.ts
// Shared MAG article view counter with API-backed counts and local cache fallback.

const STORAGE_KEY = 'sq_article_views_cache';
const API_ENDPOINT = '/api/article-views';
const VIEW_THRESHOLD = 5000;

type ViewStore = Record<string, number>;

function normalizeArticleId(articleId: number | string): string {
  return String(articleId).trim();
}

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

function updateStore(updates: ViewStore): ViewStore {
  const store = {
    ...readStore(),
    ...updates,
  };

  writeStore(store);
  return store;
}

function getFallbackCounts(articleIds: Array<number | string>): ViewStore {
  const store = readStore();
  return articleIds.reduce<ViewStore>((acc, articleId) => {
    const key = normalizeArticleId(articleId);
    acc[key] = store[key] ?? 0;
    return acc;
  }, {});
}

/** Fetch current view counts for one or more articles from the shared API. */
export async function fetchViewCounts(articleIds: Array<number | string>): Promise<ViewStore> {
  const normalizedIds = Array.from(
    new Set(articleIds.map((articleId) => normalizeArticleId(articleId)).filter(Boolean))
  );

  if (normalizedIds.length === 0) {
    return {};
  }

  try {
    const response = await fetch(`${API_ENDPOINT}?ids=${encodeURIComponent(normalizedIds.join(','))}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch view counts (${response.status})`);
    }

    const data = await response.json();
    const counts = (data?.counts ?? {}) as ViewStore;
    updateStore(counts);
    return counts;
  } catch (error) {
    console.warn('Falling back to cached article view counts:', error);
    return getFallbackCounts(normalizedIds);
  }
}

/** Increment an article view count via the shared API and return the latest total. */
export async function incrementViewCount(articleId: number | string): Promise<number> {
  const key = normalizeArticleId(articleId);

  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ articleId: key }),
    });

    if (!response.ok) {
      throw new Error(`Failed to increment article view count (${response.status})`);
    }

    const data = await response.json();
    const next = Number(data?.count) || 0;
    updateStore({ [key]: next });
    return next;
  } catch (error) {
    console.warn('Falling back to local article view increment:', error);
    const store = readStore();
    const next = (store[key] ?? 0) + 1;
    updateStore({ [key]: next });
    return next;
  }
}

/** Read current view count without incrementing. */
export function getViewCount(articleId: number | string): number {
  const store = readStore();
  return store[normalizeArticleId(articleId)] ?? 0;
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
