import { createClient } from "redis";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

// Dynamic availability flag for runtime resilience
let redisAvailable = false;

export const redisClient = createClient({
  url: redisUrl,
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        console.error("Redis: Too many reconnection attempts, giving up");
        redisAvailable = false;
        return new Error("Too many retries");
      }
      const delay = Math.min(retries * 100, 3000);
      console.log(`Redis: Reconnecting in ${delay}ms...`);
      return delay;
    },
  },
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error:", err);
  redisAvailable = false;
});

redisClient.on("connect", () => {
  console.log("✓ Redis connected");
});

redisClient.on("reconnecting", () => {
  console.log("Redis reconnecting...");
  redisAvailable = false;
});

redisClient.on("ready", () => {
  console.log("✓ Redis client ready");
  redisAvailable = true;
});

redisClient.on("end", () => {
  console.log("Redis connection closed");
  redisAvailable = false;
});

export function isRedisAvailable(): boolean {
  return redisAvailable && redisClient.isOpen;
}

export async function connectRedis(): Promise<void> {
  try {
    await redisClient.connect();
  } catch (error) {
    console.error("Failed to connect to Redis:", error);
    throw error;
  }
}

export async function disconnectRedis(): Promise<void> {
  await redisClient.quit();
}
