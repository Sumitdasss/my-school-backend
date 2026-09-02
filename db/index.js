import "dotenv/config";

import ws from "ws";
import {
  Pool,
  neonConfig,
} from "@neondatabase/serverless";

import { drizzle } from "drizzle-orm/neon-serverless";


if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing");
}


// Node.js environment-এর জন্য WebSocket
neonConfig.webSocketConstructor = ws;


// Create Pool
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,

  // Vercel Serverless-এর জন্য ছোট pool
  max: 1,

  idleTimeoutMillis: 10000,

  connectionTimeoutMillis: 10000,
});


// Connect Drizzle with Pool
export const db = drizzle({
  client: pool,
});