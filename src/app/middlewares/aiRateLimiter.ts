import httpStatus from "http-status";
import { createClient, RedisClientType } from "redis";
import config from "../../config";
import AppError from "../../errors/AppError";
import catchAsync from "../../shared/catchAsync";

let redisClient: RedisClientType | null = null;
const memoryStore = new Map<string, { count: number; resetAt: number }>();

const getRedisClient = async () => {
  if (!config.redis.url) {
    return null;
  }

  if (!redisClient) {
    redisClient = createClient({ url: config.redis.url });
    redisClient.on("error", () => {
      redisClient = null;
    });
  }

  if (!redisClient.isOpen) {
    await redisClient.connect();
  }

  return redisClient;
};

const aiRateLimiter = catchAsync(async (req, res, next) => {
  const identifier = req.user?.id || req.ip || "anonymous";
  const key = `ai-rate-limit:${identifier}`;
  const limit = 20;
  const windowSeconds = 60 * 60;

  const client = await getRedisClient();

  if (client) {
    const count = await client.incr(key);

    if (count === 1) {
      await client.expire(key, windowSeconds);
    }

    const ttl = await client.ttl(key);
    res.setHeader("X-RateLimit-Limit", String(limit));
    res.setHeader("X-RateLimit-Remaining", String(Math.max(limit - count, 0)));
    res.setHeader("X-RateLimit-Reset", String(Math.max(ttl, 0)));

    if (count > limit) {
      throw new AppError(
        httpStatus.TOO_MANY_REQUESTS,
        "AI request limit exceeded. Try again later.",
      );
    }

    next();
    return;
  }

  const now = Date.now();
  const current = memoryStore.get(key);

  if (!current || current.resetAt <= now) {
    memoryStore.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
    next();
    return;
  }

  current.count += 1;

  if (current.count > limit) {
    throw new AppError(
      httpStatus.TOO_MANY_REQUESTS,
      "AI request limit exceeded. Try again later.",
    );
  }

  next();
});

export default aiRateLimiter;
