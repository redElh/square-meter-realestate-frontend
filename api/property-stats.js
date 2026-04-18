/**
 * Property Statistics API
 * Shared, durable counters for property interactions.
 */

const fs = require('fs/promises');
const path = require('path');
const { Redis } = require('@upstash/redis');
const { createClient } = require('redis');

const LOCAL_STORE_PATH = path.join(process.cwd(), 'data', 'property-stats.json');
const LOCAL_EVENT_STORE_PATH = path.join(process.cwd(), 'data', 'stat-events.json');

const STATS_KEY_PREFIX = 'prop:stats:';
const LEGACY_AGGREGATED_STATS_KEY = 'prop:stats:aggregated';
const PROPERTY_IDS_SET_KEY = 'prop:stats:property-ids';

const SUPPORTED_STAT_TYPES = new Set(['views', 'inquiries', 'favorites', 'clicks']);

let redisClient;
let directRedisClientPromise;

function getStorageMode() {
  if (process.env.KV_REDIS_URL) {
    return 'redis-url';
  }

  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    return 'redis-rest';
  }

  if (process.env.NODE_ENV !== 'production') {
    return 'local-file';
  }

  return 'unconfigured';
}

function isSharedStorageMode(mode) {
  return mode === 'redis-rest' || mode === 'redis-url';
}

function getRedisClient() {
  if (!redisClient) {
    redisClient = Redis.fromEnv();
  }
  return redisClient;
}

async function getDirectRedisClient() {
  if (!directRedisClientPromise) {
    const client = createClient({
      url: process.env.KV_REDIS_URL,
      socket: {
        reconnectStrategy: false,
      },
    });

    client.on('error', (error) => {
      console.error('Direct Redis client error:', error);
    });

    directRedisClientPromise = client.connect().then(() => client);
  }

  return directRedisClientPromise;
}

function normalizePropertyId(value) {
  const propertyId = String(value ?? '').trim();
  if (!propertyId || !/^[A-Za-z0-9_-]+$/.test(propertyId)) {
    return null;
  }
  return propertyId;
}

function normalizeStatType(value) {
  const statType = String(value ?? '').trim().toLowerCase();
  return SUPPORTED_STAT_TYPES.has(statType) ? statType : null;
}

function toSafeNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function toSafeIncrement(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 1;
  if (parsed === 0) return 0;
  return Math.trunc(parsed);
}

function createEmptyStats(propertyId) {
  return {
    propertyId,
    views: 0,
    inquiries: 0,
    favorites: 0,
    clicks: 0,
    updatedAt: new Date().toISOString(),
  };
}

function normalizeStatsRecord(propertyId, rawStats) {
  if (!rawStats || typeof rawStats !== 'object') {
    return null;
  }

  const normalized = createEmptyStats(propertyId);
  normalized.views = toSafeNumber(rawStats.views);
  normalized.inquiries = toSafeNumber(rawStats.inquiries);
  normalized.favorites = toSafeNumber(rawStats.favorites);
  normalized.clicks = toSafeNumber(rawStats.clicks);

  if (rawStats.updatedAt) {
    normalized.updatedAt = String(rawStats.updatedAt);
  }

  if (rawStats.resetAt) {
    normalized.resetAt = String(rawStats.resetAt);
  }

  return normalized;
}

function normalizeStatsMap(rawMap) {
  if (!rawMap || typeof rawMap !== 'object') {
    return {};
  }

  const normalized = {};

  Object.entries(rawMap).forEach(([candidateId, rawValue]) => {
    const propertyId = normalizePropertyId(
      (rawValue && typeof rawValue === 'object' && rawValue.propertyId) || candidateId
    );

    if (!propertyId) return;

    const stats = normalizeStatsRecord(propertyId, rawValue);
    if (stats) {
      normalized[propertyId] = stats;
    }
  });

  return normalized;
}

function getPropertyHashKey(propertyId) {
  return `${STATS_KEY_PREFIX}${propertyId}`;
}

async function ensureDataDir() {
  try {
    await fs.mkdir(path.dirname(LOCAL_STORE_PATH), { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') throw error;
  }
}

async function readLocalStats() {
  try {
    await ensureDataDir();
    const data = await fs.readFile(LOCAL_STORE_PATH, 'utf-8');
    return normalizeStatsMap(JSON.parse(data));
  } catch (error) {
    if (error.code === 'ENOENT') {
      return {};
    }
    console.error('Failed reading local property stats:', error);
    return {};
  }
}

async function writeLocalStats(statsMap) {
  await ensureDataDir();
  await fs.writeFile(LOCAL_STORE_PATH, JSON.stringify(statsMap, null, 2), 'utf-8');
}

async function readLocalEvents() {
  try {
    await ensureDataDir();
    const data = await fs.readFile(LOCAL_EVENT_STORE_PATH, 'utf-8');
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    console.error('Failed reading local stat events:', error);
    return [];
  }
}

async function writeLocalEvents(events) {
  await ensureDataDir();
  await fs.writeFile(LOCAL_EVENT_STORE_PATH, JSON.stringify(events), 'utf-8');
}

async function recordStatEvent(propertyId, statType, value = 1, storageMode = getStorageMode()) {
  // Event history is local/dev only. Shared prod mode falls back to synthesized trends.
  if (storageMode !== 'local-file') {
    return;
  }

  try {
    const events = await readLocalEvents();
    const now = Date.now();

    events.push({
      propertyId,
      statType,
      value,
      timestamp: now,
    });

    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
    const trimmedEvents = events.filter((event) => Number(event.timestamp) > thirtyDaysAgo);

    await writeLocalEvents(trimmedEvents);
  } catch (error) {
    // Non-critical for counters.
    console.warn('Failed to record local stat event:', error.message);
  }
}

async function getStatEvents(propertyId, days = 30, storageMode = getStorageMode()) {
  if (storageMode !== 'local-file') {
    return [];
  }

  const events = await readLocalEvents();
  const cutoffTime = Date.now() - days * 24 * 60 * 60 * 1000;

  return events.filter(
    (event) =>
      String(event.propertyId) === String(propertyId) &&
      Number.isFinite(Number(event.timestamp)) &&
      Number(event.timestamp) > cutoffTime
  );
}

async function getLegacyRedisPropertyStats(storageMode, propertyId) {
  const key = getPropertyHashKey(propertyId);
  let raw;

  if (storageMode === 'redis-rest') {
    raw = await getRedisClient().get(key);
  } else if (storageMode === 'redis-url') {
    const client = await getDirectRedisClient();
    raw = await client.get(key);
  }

  if (!raw || typeof raw !== 'string') {
    return null;
  }

  try {
    return normalizeStatsRecord(propertyId, JSON.parse(raw));
  } catch (error) {
    console.warn('Legacy redis property stats parsing failed:', error.message);
    return null;
  }
}

async function getLegacyRedisAggregatedStats(storageMode) {
  let raw;

  if (storageMode === 'redis-rest') {
    raw = await getRedisClient().get(LEGACY_AGGREGATED_STATS_KEY);
  } else if (storageMode === 'redis-url') {
    const client = await getDirectRedisClient();
    raw = await client.get(LEGACY_AGGREGATED_STATS_KEY);
  }

  if (!raw || typeof raw !== 'string') {
    return {};
  }

  try {
    return normalizeStatsMap(JSON.parse(raw));
  } catch (error) {
    console.warn('Legacy aggregated stats parsing failed:', error.message);
    return {};
  }
}

async function getRedisHashStats(storageMode, propertyId) {
  const key = getPropertyHashKey(propertyId);
  let rawHash = null;

  if (storageMode === 'redis-rest') {
    rawHash = await getRedisClient().hgetall(key);
  } else if (storageMode === 'redis-url') {
    const client = await getDirectRedisClient();
    rawHash = await client.hGetAll(key);
  }

  if (!rawHash || Object.keys(rawHash).length === 0) {
    return null;
  }

  return normalizeStatsRecord(propertyId, rawHash);
}

async function addTrackedPropertyId(storageMode, propertyId) {
  if (storageMode === 'redis-rest') {
    await getRedisClient().sadd(PROPERTY_IDS_SET_KEY, propertyId);
    return;
  }

  if (storageMode === 'redis-url') {
    const client = await getDirectRedisClient();
    await client.sAdd(PROPERTY_IDS_SET_KEY, propertyId);
  }
}

async function getTrackedPropertyIds(storageMode) {
  if (storageMode === 'redis-rest') {
    const raw = await getRedisClient().smembers(PROPERTY_IDS_SET_KEY);
    return Array.from(new Set((Array.isArray(raw) ? raw : []).map((id) => normalizePropertyId(id)).filter(Boolean)));
  }

  if (storageMode === 'redis-url') {
    const client = await getDirectRedisClient();
    const raw = await client.sMembers(PROPERTY_IDS_SET_KEY);
    return Array.from(new Set((Array.isArray(raw) ? raw : []).map((id) => normalizePropertyId(id)).filter(Boolean)));
  }

  return [];
}

async function setRedisHashStats(storageMode, stats) {
  const key = getPropertyHashKey(stats.propertyId);
  const payload = {
    propertyId: String(stats.propertyId),
    views: String(toSafeNumber(stats.views)),
    inquiries: String(toSafeNumber(stats.inquiries)),
    favorites: String(toSafeNumber(stats.favorites)),
    clicks: String(toSafeNumber(stats.clicks)),
    updatedAt: String(stats.updatedAt || new Date().toISOString()),
  };

  if (stats.resetAt) {
    payload.resetAt = String(stats.resetAt);
  }

  if (storageMode === 'redis-rest') {
    await getRedisClient().hset(key, payload);
  } else if (storageMode === 'redis-url') {
    const client = await getDirectRedisClient();
    await client.hSet(key, payload);
  }

  await addTrackedPropertyId(storageMode, String(stats.propertyId));
}

async function hydrateRedisStatsFromLegacy(storageMode, propertyId) {
  const directLegacy = await getLegacyRedisPropertyStats(storageMode, propertyId);
  if (directLegacy) {
    await setRedisHashStats(storageMode, directLegacy);
    return directLegacy;
  }

  const aggregatedLegacy = await getLegacyRedisAggregatedStats(storageMode);
  if (aggregatedLegacy[propertyId]) {
    await setRedisHashStats(storageMode, aggregatedLegacy[propertyId]);
    return aggregatedLegacy[propertyId];
  }

  return null;
}

async function getStats(propertyIdInput) {
  const propertyId = normalizePropertyId(propertyIdInput);
  if (!propertyId) return null;

  const storageMode = getStorageMode();

  if (isSharedStorageMode(storageMode)) {
    const redisStats = await getRedisHashStats(storageMode, propertyId);
    if (redisStats) {
      return redisStats;
    }

    const hydrated = await hydrateRedisStatsFromLegacy(storageMode, propertyId);
    if (hydrated) {
      return hydrated;
    }

    return null;
  }

  const localStats = await readLocalStats();
  return localStats[propertyId] || null;
}

async function migrateLegacyAggregatedToHashes(storageMode, legacyMap) {
  const normalizedMap = normalizeStatsMap(legacyMap);
  const entries = Object.entries(normalizedMap);

  await Promise.all(
    entries.map(async ([propertyId, stats]) => {
      await setRedisHashStats(storageMode, {
        ...stats,
        propertyId,
      });
    })
  );

  return normalizedMap;
}

async function getAllStats() {
  const storageMode = getStorageMode();

  if (isSharedStorageMode(storageMode)) {
    const propertyIds = await getTrackedPropertyIds(storageMode);

    if (propertyIds.length === 0) {
      const legacyAggregated = await getLegacyRedisAggregatedStats(storageMode);
      if (Object.keys(legacyAggregated).length > 0) {
        return migrateLegacyAggregatedToHashes(storageMode, legacyAggregated);
      }
      return {};
    }

    const statsEntries = await Promise.all(
      propertyIds.map(async (propertyId) => [propertyId, await getStats(propertyId)])
    );

    const statsMap = {};
    statsEntries.forEach(([propertyId, stats]) => {
      if (stats) {
        statsMap[propertyId] = stats;
      }
    });

    if (Object.keys(statsMap).length > 0) {
      return statsMap;
    }

    const legacyAggregated = await getLegacyRedisAggregatedStats(storageMode);
    if (Object.keys(legacyAggregated).length > 0) {
      return migrateLegacyAggregatedToHashes(storageMode, legacyAggregated);
    }

    return {};
  }

  return readLocalStats();
}

async function incrementStat(propertyIdInput, statTypeInput, value = 1) {
  const propertyId = normalizePropertyId(propertyIdInput);
  const statType = normalizeStatType(statTypeInput);

  if (!propertyId) {
    throw new Error('Invalid propertyId.');
  }

  if (!statType) {
    throw new Error('Invalid statType.');
  }

  const incrementBy = toSafeIncrement(value);
  if (incrementBy <= 0) {
    const existing = await getStats(propertyId);
    return existing || createEmptyStats(propertyId);
  }

  const storageMode = getStorageMode();

  await recordStatEvent(propertyId, statType, incrementBy, storageMode);

  if (isSharedStorageMode(storageMode)) {
    const key = getPropertyHashKey(propertyId);
    const updatedAt = new Date().toISOString();

    // One-time migration for legacy JSON-per-key data.
    const existingHash = await getRedisHashStats(storageMode, propertyId);
    if (!existingHash) {
      await hydrateRedisStatsFromLegacy(storageMode, propertyId);
    }

    if (storageMode === 'redis-rest') {
      const redis = getRedisClient();
      await redis.sadd(PROPERTY_IDS_SET_KEY, propertyId);
      await redis.hincrby(key, statType, incrementBy);
      await redis.hset(key, {
        propertyId,
        updatedAt,
      });
    } else {
      const client = await getDirectRedisClient();
      await client.sAdd(PROPERTY_IDS_SET_KEY, propertyId);
      const transaction = client.multi();
      transaction.hIncrBy(key, statType, incrementBy);
      transaction.hSet(key, {
        propertyId,
        updatedAt,
      });
      await transaction.exec();
    }

    return (await getStats(propertyId)) || {
      ...createEmptyStats(propertyId),
      [statType]: incrementBy,
      updatedAt,
    };
  }

  const localStats = await readLocalStats();
  const current = localStats[propertyId] || createEmptyStats(propertyId);

  current[statType] = toSafeNumber(current[statType]) + incrementBy;
  current.updatedAt = new Date().toISOString();

  localStats[propertyId] = current;
  await writeLocalStats(localStats);

  return current;
}

async function resetStats(propertyIdInput) {
  const propertyId = normalizePropertyId(propertyIdInput);
  if (!propertyId) {
    throw new Error('Invalid propertyId.');
  }

  const nowIso = new Date().toISOString();
  const resetRecord = {
    propertyId,
    views: 0,
    inquiries: 0,
    favorites: 0,
    clicks: 0,
    resetAt: nowIso,
    updatedAt: nowIso,
  };

  const storageMode = getStorageMode();

  if (isSharedStorageMode(storageMode)) {
    await setRedisHashStats(storageMode, resetRecord);
    return resetRecord;
  }

  const localStats = await readLocalStats();
  localStats[propertyId] = resetRecord;
  await writeLocalStats(localStats);
  return resetRecord;
}

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
  res.setHeader('Cache-Control', 'no-store');
}

async function handler(req, res) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const storageMode = getStorageMode();

  if (storageMode === 'unconfigured') {
    return res.status(503).json({
      success: false,
      error: 'Shared property statistics storage is not configured.',
      message:
        'Set KV_REDIS_URL or KV_REST_API_URL with KV_REST_API_TOKEN to keep statistics shared across browsers and devices.',
    });
  }

  try {
    if (req.method === 'GET') {
      const propertyId = normalizePropertyId(req.query?.propertyId);
      const trendRequested = req.query?.trend === 'true';

      if (trendRequested && propertyId) {
        let daysToFetch = 30;
        let aggregationUnit = 'day';
        const timeframe = String(req.query?.timeframe || '7d');

        if (timeframe === '24h') {
          daysToFetch = 1;
          aggregationUnit = 'hour';
        } else if (timeframe === '7d') {
          daysToFetch = 7;
          aggregationUnit = 'day';
        } else if (timeframe === '30d') {
          daysToFetch = 30;
          aggregationUnit = 'day';
        }

        const events = await getStatEvents(propertyId, daysToFetch, storageMode);
        const sortedEvents = [...events].sort((first, second) => Number(first.timestamp) - Number(second.timestamp));
        const buckets = new Map();

        sortedEvents.forEach((event) => {
          const eventDate = new Date(Number(event.timestamp));
          if (Number.isNaN(eventDate.getTime())) return;

          const bucketDate = new Date(eventDate);
          if (aggregationUnit === 'hour') {
            bucketDate.setMinutes(0, 0, 0);
          } else {
            bucketDate.setHours(0, 0, 0, 0);
          }

          const bucketKey = bucketDate.getTime();

          if (!buckets.has(bucketKey)) {
            buckets.set(bucketKey, {
              date:
                aggregationUnit === 'hour'
                  ? `${bucketDate.getHours().toString().padStart(2, '0')}:00`
                  : bucketDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              views: 0,
              inquiries: 0,
              favorites: 0,
              clicks: 0,
            });
          }

          const entry = buckets.get(bucketKey);
          const eventType = normalizeStatType(event.statType);
          if (!eventType) return;

          entry[eventType] += toSafeNumber(event.value);
        });

        const trendData = Array.from(buckets.entries())
          .sort((first, second) => first[0] - second[0])
          .map(([, value]) => value);

        return res.status(200).json(trendData);
      }

      if (propertyId) {
        const stats = await getStats(propertyId);
        return res.status(200).json(stats || createEmptyStats(propertyId));
      }

      const allStats = await getAllStats();
      return res.status(200).json(allStats);
    }

    if (req.method === 'POST') {
      const propertyId = normalizePropertyId(req.body?.propertyId);
      const statType = normalizeStatType(req.body?.statType);
      const value = toSafeIncrement(req.body?.value ?? 1);

      if (!propertyId || !statType) {
        return res.status(400).json({
          success: false,
          error: 'Missing or invalid propertyId/statType.',
        });
      }

      if (value <= 0 || value > 1000) {
        return res.status(400).json({
          success: false,
          error: 'Value must be a positive integer between 1 and 1000.',
        });
      }

      const updated = await incrementStat(propertyId, statType, value);
      return res.status(200).json({
        success: true,
        stats: updated,
      });
    }

    if (req.method === 'PUT') {
      const propertyId = normalizePropertyId(req.body?.propertyId);
      if (!propertyId) {
        return res.status(400).json({
          success: false,
          error: 'Missing or invalid propertyId.',
        });
      }

      const resetRecord = await resetStats(propertyId);
      return res.status(200).json({
        success: true,
        stats: resetRecord,
      });
    }

    return res.status(405).json({
      success: false,
      error: `Method ${req.method} not allowed.`,
    });
  } catch (error) {
    console.error('Property stats handler error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    });
  }
}

module.exports = handler;
module.exports.default = handler;
