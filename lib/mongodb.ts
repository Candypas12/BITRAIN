/**
 * lib/mongodb.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * PURPOSE
 *   Provides a single, cached Mongoose connection to MongoDB Atlas.
 *
 * WHY MONGOOSE?
 *   Mongoose adds schema validation, model structure, and query helpers on top
 *   of the raw MongoDB driver.  For BITRAIN this means User, Chat, and Message
 *   documents are always validated before they touch the database.
 *
 * WHY CONNECTION CACHING?
 *   Next.js App Router runs in a serverless environment.  Without caching,
 *   every hot-reload (dev) or warm Lambda invocation (prod) would open a brand-
 *   new TCP connection, quickly exhausting MongoDB Atlas's 500-connection pool.
 *   We store the Promise in `global._mongooseCache` so it survives across
 *   module re-evaluations in development and is reused in production.
 *
 * REQUIRED ENV VAR
 *   MONGODB_URI — Full Atlas URI, e.g.
 *   mongodb+srv://<user>:<pass>@cluster0.xxx.mongodb.net/bitrain?retryWrites=true&w=majority
 */

import mongoose from "mongoose";

// ─── Guard: fail loudly if the URI is missing ────────────────────────────────
import { env } from "./env";

const MONGODB_URI = env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    " Missing env var: MONGODB_URI — add it to .env.local"
  );
}

// ─── Cache type ───────────────────────────────────────────────────────────────
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Augment the global object so the cache survives hot-reloads in Next.js dev
declare global {
  // eslint-disable-next-line no-var
  var _mongooseCache: MongooseCache | undefined;
}

// Initialise the cache once per process
const cached: MongooseCache = global._mongooseCache ?? { conn: null, promise: null };
global._mongooseCache = cached;

// ─── connectDB ────────────────────────────────────────────────────────────────
/**
 * connectDB()
 *
 * Call this at the top of every API route / Server Action that touches the DB.
 * Returns the existing Mongoose connection if one is already open.
 */
export async function connectDB(): Promise<typeof mongoose> {
  // Already connected — return immediately
  if (cached.conn) return cached.conn;

  // Start a new connection (or reuse an in-flight one)
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI as string, {
        bufferCommands: false, // don't buffer; fail fast if DB is down
      })
      .then((m) => {
        console.log("✅ MongoDB connected successfully");
        return m;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    // Reset so the next call can retry
    cached.promise = null;
    throw err;
  }

  return cached.conn;
}
