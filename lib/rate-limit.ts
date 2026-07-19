const WINDOW_MS = 60_000
const MAX_REQUESTS = 5

// In-memory sliding-window limiter, keyed per client. Resets on server
// restart and isn't shared across instances in a multi-instance deployment —
// fine for this app's scale, not a substitute for a shared store (e.g.
// Upstash/Redis) if it ever needs to run behind multiple serverless instances.
const requestLog = new Map<string, number[]>()

export function checkRateLimit(key: string): { allowed: boolean; retryAfterMs: number } {
  const now = Date.now()
  const timestamps = (requestLog.get(key) ?? []).filter((t) => now - t < WINDOW_MS)

  if (timestamps.length >= MAX_REQUESTS) {
    requestLog.set(key, timestamps)
    return { allowed: false, retryAfterMs: WINDOW_MS - (now - timestamps[0]) }
  }

  timestamps.push(now)
  requestLog.set(key, timestamps)
  return { allowed: true, retryAfterMs: 0 }
}
