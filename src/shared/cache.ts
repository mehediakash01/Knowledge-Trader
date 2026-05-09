import { createClient, RedisClientType } from "redis";
import config from "../config";
import logger from "./logger";

let redisClient: RedisClientType | null = null;
let connectPromise: Promise<void> | null = null;
const memoryCache = new Map<string, { value: string; expiresAt: number }>();

const getRedisClient = async () => {
  if (!config.redis.url) {
    return null;
  }

  if (!redisClient) {
    redisClient = createClient({ url: config.redis.url });
    
    redisClient.on("error", (error) => {
      // We don't set redisClient = null here so node-redis can auto-reconnect,
      // and we avoid leaking multiple clients that loop connections in the background.
      logger.error({ 
        message: "Redis cache error", 
        error: error instanceof Error ? error.message : String(error)
      });
    });

    connectPromise = redisClient.connect().catch((err) => {
      logger.error({ 
        message: "Redis initial connect error", 
        error: err instanceof Error ? err.message : String(err) 
      });
    });
  }

  if (connectPromise && !redisClient.isReady) {
    await connectPromise;
  }

  return redisClient.isReady ? redisClient : null;
};

const get = async <T>(key: string): Promise<T | null> => {
  const client = await getRedisClient();

  if (client) {
    const cached = await client.get(key);
    return cached ? (JSON.parse(cached) as T) : null;
  }

  const cached = memoryCache.get(key);

  if (!cached || cached.expiresAt < Date.now()) {
    memoryCache.delete(key);
    return null;
  }

  return JSON.parse(cached.value) as T;
};

const set = async (key: string, value: unknown, ttlSeconds: number) => {
  const serialized = JSON.stringify(value);
  const client = await getRedisClient();

  if (client) {
    await client.set(key, serialized, { EX: ttlSeconds });
    return;
  }

  memoryCache.set(key, {
    value: serialized,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
};

const delByPrefix = async (prefix: string) => {
  const client = await getRedisClient();

  if (client) {
    const keys = await client.keys(`${prefix}*`);

    if (keys.length) {
      await client.del(keys);
    }

    return;
  }

  for (const key of memoryCache.keys()) {
    if (key.startsWith(prefix)) {
      memoryCache.delete(key);
    }
  }
};

export const cache = {
  get,
  set,
  delByPrefix,
};
