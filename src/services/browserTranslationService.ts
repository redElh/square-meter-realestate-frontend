/**
 * Browser-side translation service
 * Uses Google Translate unofficial API (free, no API key needed)
 */

interface TranslationCache {
  [key: string]: string;
}

// In-memory cache to avoid re-translating
const cache: TranslationCache = {};

/**
 * Translate text using Google Translate unofficial API
 */
export async function translateText(
  text: string,
  targetLang: string,
  sourceLang: string = 'auto'
): Promise<string> {
  // Generate cache key
  const cacheKey = `${text}:${sourceLang}:${targetLang}`;
  
  // Check cache
  if (cache[cacheKey]) {
    return cache[cacheKey];
  }
  
  // Don't translate if target is English (properties are already in English from API)
  if (targetLang === 'en') {
    cache[cacheKey] = text;
    return text;
  }
  
  try {
    // Use Google Translate unofficial API
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    
    const response = await fetch(url, {
      method: 'GET',
      // Don't send Content-Type header - it causes CORS issues
    });
    
    if (!response.ok) {
      console.warn(`Translation API returned ${response.status} for "${text}"`);
      cache[cacheKey] = text;
      return text;
    }
    
    const data = await response.json();
    
    if (data && data[0] && data[0][0] && data[0][0][0]) {
      const translated = data[0][0][0];
      cache[cacheKey] = translated;
      return translated;
    }
    
    // If translation fails, return original
    cache[cacheKey] = text;
    return text;
  } catch (error) {
    // Silently fail and return original text
    console.warn(`Translation failed for "${text}":`, error);
    cache[cacheKey] = text;
    return text;
  }
}

/**
 * Translate multiple texts in batch
 */
export async function translateBatch(
  texts: string[],
  targetLang: string,
  sourceLang: string = 'auto'
): Promise<string[]> {
  // Don't translate if target is English (properties are already in English)
  if (targetLang === 'en') {
    return texts;
  }
  
  // Translate all texts in parallel with rate limiting
  // Split into smaller batches to avoid overwhelming the API
  const batchSize = 5;
  const results: string[] = [];
  
  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);
    const batchTranslations = await Promise.all(
      batch.map(text => translateText(text, targetLang, sourceLang))
    );
    results.push(...batchTranslations);
    
    // Small delay between batches to avoid rate limiting
    if (i + batchSize < texts.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  return results;
}

/**
 * Clear translation cache
 */
export function clearCache(): void {
  Object.keys(cache).forEach(key => delete cache[key]);
}

/**
 * Get cache size
 */
export function getCacheSize(): number {
  return Object.keys(cache).length;
}
