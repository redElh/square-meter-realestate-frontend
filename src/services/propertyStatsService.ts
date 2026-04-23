/**
 * Property Statistics Service
 * Handles fetching and managing property statistics
 */

import axios from 'axios';

export interface PropertyStats {
  propertyId: string | number;
  views: number;
  inquiries: number;
  favorites: number;
  clicks: number;
  updatedAt?: string;
  resetAt?: string;
}

export interface PropertyWithStats extends PropertyStats {
  title: string;
  price: number;
  location: string;
}

const API_BASE = '/api/property-stats';
const STATS_CACHE_KEY = 'property_stats_cache_v1';

const isBrowser = typeof window !== 'undefined';

const readStatsCache = (): Record<string, PropertyStats> => {
  if (!isBrowser) return {};

  try {
    const raw = window.localStorage.getItem(STATS_CACHE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (error) {
    console.warn('[Stats] Failed to read local stats cache:', error);
    return {};
  }
};

const writeStatsCache = (stats: Record<string, PropertyStats>) => {
  if (!isBrowser) return;

  try {
    window.localStorage.setItem(STATS_CACHE_KEY, JSON.stringify(stats));
  } catch (error) {
    console.warn('[Stats] Failed to write local stats cache:', error);
  }
};

const upsertCachedStat = (stat: PropertyStats | null | undefined) => {
  if (!stat || stat.propertyId === null || stat.propertyId === undefined) return;
  const cache = readStatsCache();
  cache[String(stat.propertyId)] = stat;
  writeStatsCache(cache);
};

const parseStatsMapPayload = (payload: any): Record<string | number, PropertyStats> => {
  if (payload?.success === true && payload?.stats && typeof payload.stats === 'object') {
    return payload.stats;
  }

  if (payload && typeof payload === 'object' && !Array.isArray(payload)) {
    return payload;
  }

  return {};
};

const sanitizeNonNegativeNumber = (value: unknown): number => {
  if (typeof value !== 'number' || !Number.isFinite(value)) return 0;
  return value > 0 ? value : 0;
};

const toCappedPercent = (numerator: number, denominator: number): number => {
  if (denominator <= 0) return 0;

  const rawPercent = (numerator / denominator) * 100;
  const boundedPercent = Math.min(100, Math.max(0, rawPercent));

  return Math.round(boundedPercent * 100) / 100;
};

class PropertyStatsService {
  /**
   * Track a property stat increment
   */
  async trackStat(propertyId: string | number, statType: 'views' | 'inquiries' | 'favorites' | 'clicks', value: number = 1): Promise<PropertyStats | null> {
    try {
      console.log(`[Stats] Tracking ${statType} for property ${propertyId}...`);
      const response = await axios.post(API_BASE, {
        propertyId,
        statType,
        value
      });
      console.log(`[Stats] ✅ Successfully tracked ${statType}:`, response.data);
      const updatedStats = response.data.stats || null;
      upsertCachedStat(updatedStats);
      return updatedStats;
    } catch (error: any) {
      console.error(`[Stats] ❌ Failed to track stat (${statType}):`, {
        error: error?.message,
        status: error?.response?.status,
        data: error?.response?.data,
        url: API_BASE
      });
      return null;
    }
  }

  /**
   * Get stats for a single property
   */
  async getPropertyStats(propertyId: string | number): Promise<PropertyStats | null> {
    try {
      const response = await axios.get(API_BASE, {
        params: { propertyId }
      });
      const stats = response.data || null;
      upsertCachedStat(stats);
      return stats;
    } catch (error) {
      console.error('Failed to fetch property stats:', error);

      const cached = readStatsCache();
      const cachedPropertyStats = cached[String(propertyId)] || null;
      if (cachedPropertyStats) {
        console.warn('[Stats] Using cached property stats after fetch failure.');
      }
      return cachedPropertyStats;
    }
  }

  /**
   * Get all properties statistics
   */
  async getAllStats(): Promise<Record<string | number, PropertyStats>> {
    try {
      console.log(`[Stats] Fetching all stats from ${API_BASE}...`);
      const response = await axios.get(API_BASE);
      const statsMap = parseStatsMapPayload(response.data);
      console.log(`[Stats] ✅ Fetched stats:`, statsMap);
      writeStatsCache(statsMap as Record<string, PropertyStats>);
      return statsMap;
    } catch (error: any) {
      console.error(`[Stats] ❌ Failed to fetch all stats:`, {
        error: error?.message,
        status: error?.response?.status,
        url: API_BASE
      });

      const cachedStats = readStatsCache();
      if (Object.keys(cachedStats).length > 0) {
        console.warn('[Stats] Using cached stats snapshot after API failure.');
        return cachedStats;
      }

      return {};
    }
  }

  /**
   * Reset stats for a property
   */
  async resetPropertyStats(propertyId: string | number): Promise<PropertyStats | null> {
    try {
      const response = await axios.put(API_BASE, { propertyId });
      const resetStats = response.data.stats || null;
      upsertCachedStat(resetStats);
      return resetStats;
    } catch (error) {
      console.error('Failed to reset stats:', error);
      return null;
    }
  }

  /**
   * Get top properties by a metric
   */
  async getTopProperties(metric: 'views' | 'inquiries' | 'favorites' | 'clicks', limit: number = 10): Promise<PropertyStats[]> {
    try {
      const allStats = await this.getAllStats();
      return Object.values(allStats)
        .sort((a, b) => b[metric] - a[metric])
        .slice(0, limit);
    } catch (error) {
      console.error('Failed to get top properties:', error);
      return [];
    }
  }

  /**
   * Calculate engagement score for a property (0-100)
   */
  calculateEngagementScore(stats: PropertyStats): number {
    const views = sanitizeNonNegativeNumber(stats.views);
    const inquiries = sanitizeNonNegativeNumber(stats.inquiries);
    const favorites = sanitizeNonNegativeNumber(stats.favorites);
    const clicks = sanitizeNonNegativeNumber(stats.clicks);

    const weights = {
      views: 0.4,
      inquiries: 0.3,
      favorites: 0.2,
      clicks: 0.1
    };

    // Normalize and weight
    const maxViews = 1000; // Adjust based on expected max
    const maxInquiries = 50;
    const maxFavorites = 50;
    const maxClicks = 100;

    const normalizedScore =
      (Math.min(views, maxViews) / maxViews) * weights.views +
      (Math.min(inquiries, maxInquiries) / maxInquiries) * weights.inquiries +
      (Math.min(favorites, maxFavorites) / maxFavorites) * weights.favorites +
      (Math.min(clicks, maxClicks) / maxClicks) * weights.clicks;

    const boundedScore = Math.min(1, Math.max(0, normalizedScore));
    return Math.round(boundedScore * 100);
  }

  /**
   * Get conversion rate (inquiries vs views)
   */
  getConversionRate(stats: PropertyStats): number {
    const views = sanitizeNonNegativeNumber(stats.views);
    const inquiries = sanitizeNonNegativeNumber(stats.inquiries);

    return toCappedPercent(Math.min(inquiries, views), views);
  }

  /**
   * Get engagement rate (favorites + clicks + inquiries vs views)
   */
  getEngagementRate(stats: PropertyStats): number {
    const views = sanitizeNonNegativeNumber(stats.views);
    const inquiries = sanitizeNonNegativeNumber(stats.inquiries);
    const favorites = sanitizeNonNegativeNumber(stats.favorites);
    const clicks = sanitizeNonNegativeNumber(stats.clicks);

    const totalInteractions = inquiries + favorites + clicks;
    const effectiveInteractions = Math.min(totalInteractions, views);

    return toCappedPercent(effectiveInteractions, views);
  }

  /**
   * Get trend data for a property (real data from events)
   */
  async getTrendData(propertyId: string | number, timeframe: '24h' | '7d' | '30d' = '7d'): Promise<any[]> {
    try {
      const response = await axios.get(API_BASE, {
        params: { propertyId, trend: 'true', timeframe }
      });
      console.log('[Stats] Fetched trend data:', response.data);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('[Stats] Failed to fetch trend data:', error);
      return [];
    }
  }
}

const propertyStatsService = new PropertyStatsService();

export default propertyStatsService;
