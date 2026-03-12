const fs = require('fs/promises');
const path = require('path');
const { Redis } = require('@upstash/redis');
const { createClient } = require('redis');

const LOCAL_STORE_PATH = path.join(process.cwd(), 'data', 'mag-article-views.json');
const VIEW_KEY_PREFIX = 'mag:article:views:';

let redisClient;
let directRedisClientPromise;

function normalizeArticleId(value) {
  const articleId = String(value ?? '').trim();
  if (!articleId || !/^[A-Za-z0-9_-]+$/.test(articleId)) {
    return null;
  }
  return articleId;
}

function getViewKey(articleId) {
  return `${VIEW_KEY_PREFIX}${articleId}`;
}

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
      console.error('❌ Direct Redis client error:', error);
    });

    directRedisClientPromise = client.connect().then(() => client);
  }

  return directRedisClientPromise;
}

async function readLocalStore() {
  try {
    const raw = await fs.readFile(LOCAL_STORE_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (error) {
    if (error.code === 'ENOENT') {
      return {};
    }
    throw error;
  }
}

async function writeLocalStore(store) {
  await fs.mkdir(path.dirname(LOCAL_STORE_PATH), { recursive: true });
  await fs.writeFile(LOCAL_STORE_PATH, JSON.stringify(store, null, 2), 'utf8');
}

function extractPipelineValue(result) {
  if (Array.isArray(result) && result.length >= 2) {
    return result[1];
  }

  if (result && typeof result === 'object' && 'result' in result) {
    return result.result;
  }

  return result;
}

async function getCounts(articleIds) {
  const storage = getStorageMode();

  if (storage === 'redis-rest') {
    const pipeline = getRedisClient().pipeline();
    articleIds.forEach((articleId) => {
      pipeline.get(getViewKey(articleId));
    });

    const results = await pipeline.exec();
    const counts = {};

    articleIds.forEach((articleId, index) => {
      const rawValue = extractPipelineValue(results[index]);
      const parsed = Number(rawValue);
      counts[articleId] = Number.isFinite(parsed) ? parsed : 0;
    });

    return { counts, storage, shared: true };
  }

  if (storage === 'redis-url') {
    const client = await getDirectRedisClient();
    const values = await client.mGet(articleIds.map((articleId) => getViewKey(articleId)));
    const counts = {};

    articleIds.forEach((articleId, index) => {
      const parsed = Number(values[index]);
      counts[articleId] = Number.isFinite(parsed) ? parsed : 0;
    });

    return { counts, storage, shared: true };
  }

  const store = await readLocalStore();
  const counts = {};

  articleIds.forEach((articleId) => {
    const parsed = Number(store[articleId]);
    counts[articleId] = Number.isFinite(parsed) ? parsed : 0;
  });

  return { counts, storage, shared: false };
}

async function incrementCount(articleId) {
  const storage = getStorageMode();

  if (storage === 'redis-rest') {
    const next = await getRedisClient().incr(getViewKey(articleId));
    return {
      articleId,
      count: Number(next) || 0,
      storage,
      shared: true,
    };
  }

  if (storage === 'redis-url') {
    const client = await getDirectRedisClient();
    const next = await client.incr(getViewKey(articleId));
    return {
      articleId,
      count: Number(next) || 0,
      storage,
      shared: true,
    };
  }

  const store = await readLocalStore();
  const current = Number(store[articleId]);
  const next = (Number.isFinite(current) ? current : 0) + 1;

  store[articleId] = next;
  await writeLocalStore(store);

  return {
    articleId,
    count: next,
    storage,
    shared: false,
  };
}

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');
}

async function handler(req, res) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (getStorageMode() === 'unconfigured') {
      return res.status(503).json({
        success: false,
        error: 'Shared article view storage is not configured.',
        message: 'Set KV_REDIS_URL or KV_REST_API_URL with KV_REST_API_TOKEN to enable public MAG article views.',
      });
    }

    if (req.method === 'GET') {
      const rawIds = String(req.query?.ids ?? '');
      const articleIds = Array.from(
        new Set(
          rawIds
            .split(',')
            .map((value) => normalizeArticleId(value))
            .filter(Boolean)
        )
      );

      if (articleIds.length === 0) {
        return res.status(200).json({
          success: true,
          counts: {},
          storage: getStorageMode(),
          shared: getStorageMode().startsWith('redis'),
        });
      }

      const result = await getCounts(articleIds);
      return res.status(200).json({ success: true, ...result });
    }

    if (req.method === 'POST') {
      const articleId = normalizeArticleId(req.body?.articleId);

      if (!articleId) {
        return res.status(400).json({
          success: false,
          error: 'A valid articleId is required.',
        });
      }

      const result = await incrementCount(articleId);
      return res.status(200).json({ success: true, ...result });
    }

    return res.status(405).json({
      success: false,
      error: `Method ${req.method} not allowed.`,
    });
  } catch (error) {
    console.error('❌ Article views API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to process article view request.',
      message: error.message,
    });
  }
}

module.exports = handler;
module.exports.default = handler;