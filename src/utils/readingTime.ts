// src/utils/readingTime.ts
// Advanced reading time estimation based on language, content type, and reading patterns

interface ReadingTimeOptions {
  wordsPerMinute?: number;
  language?: string;
  includeImages?: boolean;
  includeCodeBlocks?: boolean;
}

interface ReadingTimeResult {
  minutes: number;
  words: number;
  formattedTime: string;
}

/**
 * Average reading speeds by language (words per minute)
 * Based on research: https://iovs.arvojournals.org/article.aspx?articleid=2166061
 */
const READING_SPEEDS: Record<string, number> = {
  en: 228, // English
  fr: 195, // French
  es: 218, // Spanish
  de: 179, // German
  ar: 138, // Arabic (right-to-left, different script)
  ru: 184, // Russian (Cyrillic script)
  default: 200, // Fallback
};

/**
 * Strip HTML tags and decode entities
 */
function stripHtml(html: string): string {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return (tmp.textContent || tmp.innerText || '').trim();
}

/**
 * Count words accurately based on language
 */
function countWords(text: string, language: string = 'en'): number {
  // Remove extra whitespace
  const cleaned = text.replace(/\s+/g, ' ').trim();
  
  if (!cleaned) return 0;
  
  // For languages without spaces between words (like Chinese/Japanese)
  // we'd need different logic, but for now focus on space-separated languages
  if (['zh', 'ja', 'ko'].includes(language)) {
    // Count characters for Asian languages (rough approximation)
    return Math.ceil(cleaned.length / 2.5);
  }
  
  // For Arabic, account for shorter word length visually
  if (language === 'ar') {
    const words = cleaned.split(/\s+/).filter(Boolean);
    return Math.ceil(words.length * 1.1); // Arabic words tend to be longer
  }
  
  // Standard word count for space-separated languages
  return cleaned.split(/\s+/).filter(Boolean).length;
}

/**
 * Estimate time to view images (15 seconds per image, max 3 minutes for images)
 */
function estimateImageTime(html: string): number {
  const imageMatches = html.match(/<img[^>]*>/gi) || [];
  const imageCount = imageMatches.length;
  
  if (imageCount === 0) return 0;
  
  // 12 seconds per image (people scan images quickly)
  const totalSeconds = Math.min(imageCount * 12, 180); // Max 3 minutes for images
  return totalSeconds / 60;
}

/**
 * Estimate time to read code blocks (slower than regular text)
 */
function estimateCodeTime(html: string): number {
  const codeMatches = html.match(/<code[^>]*>[\s\S]*?<\/code>/gi) || [];
  const preMatches = html.match(/<pre[^>]*>[\s\S]*?<\/pre>/gi) || [];
  
  const codeBlocks = [...codeMatches, ...preMatches];
  if (codeBlocks.length === 0) return 0;
  
  // Code is read at about 1/3 the speed of regular text
  const codeChars = codeBlocks.join('').length;
  return (codeChars / 1000); // Roughly 1 minute per 1000 code characters
}

/**
 * Calculate accurate reading time for content
 */
export function calculateReadingTime(
  htmlContent: string,
  options: ReadingTimeOptions = {}
): ReadingTimeResult {
  const {
    language = 'en',
    includeImages = true,
    includeCodeBlocks = true,
    wordsPerMinute = READING_SPEEDS[language] || READING_SPEEDS.default,
  } = options;
  
  // Get clean text
  const text = stripHtml(htmlContent);
  const words = countWords(text, language);
  
  // Base reading time
  let minutes = words / wordsPerMinute;
  
  // Add time for images
  if (includeImages) {
    minutes += estimateImageTime(htmlContent);
  }
  
  // Add time for code blocks
  if (includeCodeBlocks) {
    minutes += estimateCodeTime(htmlContent);
  }
  
  // Always show at least 1 minute, round up (better to overestimate)
  minutes = Math.max(1, Math.ceil(minutes));
  
  return {
    minutes,
    words,
    formattedTime: formatReadingTime(minutes),
  };
}

/**
 * Format reading time in a human-friendly way
 */
function formatReadingTime(minutes: number): string {
  if (minutes === 1) return '1 min';
  if (minutes < 10) return `${minutes} min`;
  
  // For longer articles, round to nearest 5
  const rounded = Math.round(minutes / 5) * 5;
  return `${rounded} min`;
}

/**
 * Get reading time with translation support
 */
export function getReadingTime(
  htmlContent: string,
  language: string = 'en'
): string {
  const result = calculateReadingTime(htmlContent, { language });
  return result.formattedTime;
}

/**
 * Get estimated word count
 */
export function getWordCount(htmlContent: string, language: string = 'en'): number {
  const text = stripHtml(htmlContent);
  return countWords(text, language);
}

/**
 * Classify reading length
 */
export function getReadingCategory(minutes: number): 'quick' | 'short' | 'medium' | 'long' {
  if (minutes <= 2) return 'quick';
  if (minutes <= 5) return 'short';
  if (minutes <= 10) return 'medium';
  return 'long';
}
