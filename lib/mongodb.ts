/**
 * lib/mongodb.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * PURPOSE
 *   Provides a single, cached Mongoose connection to MongoDB Atlas.
 */

import dns from "node:dns";
import mongoose from "mongoose";
import { env } from "./env";

// Force Node.js to use public DNS servers for MongoDB Atlas SRV lookup
dns.setServers(["1.1.1.1", "8.8.8.8"]);

// ─── Guard: fail loudly if the URI is missing ────────────────────────────────
const MONGODB_URI = env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Missing env var: MONGODB_URI — add it to .env.local"
  );
}

// ─── Cache type ──────────────────────────────────────────────────────────────
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Augment the global object so the cache survives hot-reloads
declare global {
  // eslint-disable-next-line no-var
  var _mongooseCache: MongooseCache | undefined;
}

// Initialise the cache once per process
const cached: MongooseCache = global._mongooseCache ?? {
  conn: null,
  promise: null,
};

global._mongooseCache = cached;

// ─── connectDB ───────────────────────────────────────────────────────────────
export async function connectDB(): Promise<typeof mongoose> {
  // Already connected
  if (cached.conn) return cached.conn;

  // Start a new connection
  if (!cached.promise) {
    console.log("Mongo URI:", MONGODB_URI);

    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
      })
      .then((mongooseInstance) => {
        console.log("✅ MongoDB connected successfully");
        console.log(
          "Connected Host:",
          mongooseInstance.connection.host
        );
        return mongooseInstance;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    console.error("===== MONGOOSE ERROR =====");
    console.error(err);

    if (err instanceof Error) {
      console.error("Message:", err.message);
      console.error("Name:", err.name);
      console.error("Stack:", err.stack);
    }

    cached.promise = null;
    throw err;
  }

  return cached.conn;
}