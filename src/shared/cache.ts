import { createClient, RedisClientType } from "redis";
import config from "../config";
import logger from "./logger";

let redisClient: RedisClientType | null = null;
const memoryCache = new Map<string, { value: string; expiresAt: number }>();

const getRedisClient = async () => {
  if (!config.redis.url) {
    return null;
  }

  if (!redisClient) {
    redisClient = createClient({ url: config.redis.url });
    redisClient.on("error", (error) => {
      logger.error({ message: "Redis cache error", error });
      redisClient = null;
    });
  }

  if (!redisClient.isOpen) {
    await redisClient.connect();
  }

  return redisClient;
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
