import { Redis } from "@upstash/redis";
import { Client } from "@upstash/qstash";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export const qstash = new Client({
  token: process.env.QSTASH_TOKEN,
  baseUrl: process.env.QSTASH_URL,
});

export const getFullUrl = (path) => {
  const baseUrl = process.env.APP_URL || "http://localhost:3000";

  // Ensure the baseUrl starts with a valid scheme
  const absoluteBase = baseUrl.startsWith("http")
    ? baseUrl
    : `http://${baseUrl}`;

  // Join the base and path, ensuring no double slashes
  return `${absoluteBase.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
};
