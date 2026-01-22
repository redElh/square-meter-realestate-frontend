/**
 * API endpoint to translate property names dynamically
 * Uses Python translation service via LibreTranslate or Google Translate
 */

const axios = require('axios');

// Simple in-memory cache to avoid re-translating the same text
const translationCache = new Map();

// Language code mapping
const LANG_MAP = {
  'en': 'en',
  'fr': 'fr',
  'es': 'es',
  'de': 'de',
  'ar': 'ar',
  'ru': 'ru'
};

/**
 * Translate text using LibreTranslate (free, open-source)
 */
async function translateWithLibreTranslate(text, targetLang, sourceLang = 'auto') {
  try {
    const response = await axios.post('https://libretranslate.com/translate', {
      q: text,
      source: sourceLang,
      target: targetLang,
      format: 'text'
    }, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 5000
    });
    
    return response.data.translatedText;
  } catch (error) {
    console.error('LibreTranslate failed:', error.message);
    return null;
  }
}

/**
 * Translate text using Google Translate (via unofficial API)
 */
async function translateWithGoogleTranslate(text, targetLang, sourceLang = 'auto') {
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    const response = await axios.get(url, { timeout: 5000 });
    
    if (response.data && response.data[0] && response.data[0][0] && response.data[0][0][0]) {
      return response.data[0][0][0];
    }
    return null;
  } catch (error) {
    console.error('Google Translate failed:', error.message);
    return null;
  }
}

/**
 * Main translation function with caching and fallbacks
 */
async function translateText(text, targetLang, sourceLang = 'auto') {
  // Generate cache key
  const cacheKey = `${text}:${sourceLang}:${targetLang}`;
  
  // Check cache first
  if (translationCache.has(cacheKey)) {
    console.log(`📦 Cache hit for: "${text}" → ${targetLang}`);
    return translationCache.get(cacheKey);
  }
  
  console.log(`🌐 Translating: "${text}" from ${sourceLang} to ${targetLang}`);
  
  // If target language is English or French, try original text first
  // (many properties come from API in these languages)
  if (targetLang === 'en' || targetLang === 'fr') {
    console.log(`✅ Using original text for ${targetLang}`);
    translationCache.set(cacheKey, text);
    return text;
  }
  
  // Try translation services in order
  let translated = null;
  
  // Try Google Translate first (faster)
  translated = await translateWithGoogleTranslate(text, targetLang, sourceLang);
  if (translated) {
    console.log(`✅ Translated with Google: "${translated}"`);
    translationCache.set(cacheKey, translated);
    return translated;
  }
  
  // Try LibreTranslate as fallback
  translated = await translateWithLibreTranslate(text, targetLang, sourceLang);
  if (translated) {
    console.log(`✅ Translated with LibreTranslate: "${translated}"`);
    translationCache.set(cacheKey, translated);
    return translated;
  }
  
  // If all fail, return original text
  console.log(`⚠️ Translation failed, using original text`);
  translationCache.set(cacheKey, text);
  return text;
}

/**
 * API endpoint handler
 */
module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { text, texts, targetLang, sourceLang = 'auto' } = req.body;
    
    if (!targetLang) {
      return res.status(400).json({ error: 'targetLang is required' });
    }
    
    // Validate target language
    if (!LANG_MAP[targetLang]) {
      return res.status(400).json({ error: 'Invalid target language' });
    }
    
    // Handle batch translation
    if (texts && Array.isArray(texts)) {
      console.log(`📚 Batch translating ${texts.length} items to ${targetLang}`);
      
      const translations = await Promise.all(
        texts.map(item => translateText(item.text, targetLang, sourceLang))
      );
      
      const results = texts.map((item, index) => ({
        id: item.id,
        original: item.text,
        translated: translations[index]
      }));
      
      return res.status(200).json({
        success: true,
        results,
        cacheSize: translationCache.size
      });
    }
    
    // Handle single translation
    if (text) {
      const translated = await translateText(text, targetLang, sourceLang);
      
      return res.status(200).json({
        success: true,
        original: text,
        translated,
        sourceLang,
        targetLang,
        cacheSize: translationCache.size
      });
    }
    
    return res.status(400).json({ error: 'text or texts array is required' });
    
  } catch (error) {
    console.error('Translation API error:', error);
    return res.status(500).json({
      error: 'Translation failed',
      message: error.message
    });
  }
};
