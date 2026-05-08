import "dotenv/config";

const config = {
  port: Number(process.env.PORT) || 5000,
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "1d",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
  },
  redis: {
    url: process.env.REDIS_URL,
  },
  ai: {
    geminiApiKey: process.env.GEMINI_API_KEY,
    groqApiKey: process.env.GROQ_API_KEY,
    openRouterApiKey: process.env.OPENROUTER_API_KEY,
    timeoutMs: Number(process.env.AI_TIMEOUT_MS) || 10000,
  },
};

export default config;
