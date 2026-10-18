import { NextResponse } from "next/server";
import { requireUser } from "@/server/auth";
import { chat, aiChatSchema } from "@/modules/ai/service";
import { toAppError, toHttpStatus } from "@/lib/result";
import { env, isRedisEnabled } from "@/lib/env";

// POST /api/ai/chat  (IVE_TAD_Phase_1.md §20, §22, §25)
// Server-side AI call, rate limited by user. No secrets exposed.
export async function POST(req: Request) {
  try {
    const auth = await requireUser();
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: toHttpStatus(auth.error.code) });

    // Rate limit (Redis if configured, else in-memory dev fallback §31).
    const limited = await isRateLimited(auth.data.userId);
    if (limited) {
      return NextResponse.json(
        { error: { code: "RATE_LIMITED", message: "Terlalu banyak permintaan. Coba lagi sebentar." } },
        { status: 429 },
      );
    }

    const body = await req.json().catch(() => null);
    const parsed = aiChatSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "Data yang dikirim belum valid." } },
        { status: 400 },
      );
    }

    const result = await chat(auth.data.userId, parsed.data);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: toHttpStatus(result.error.code) });
    return NextResponse.json({ data: result.data });
  } catch (err) {
    const e = toAppError(err, "Ups, ada sedikit gangguan. Coba lagi.");
    return NextResponse.json({ error: e }, { status: toHttpStatus(e.code) });
  }
}

/**
 * Minimal rate limiter. Uses an in-memory Map when Redis is not configured
 * (documented development fallback per §31). Not suitable for multi-instance prod.
 */
const devBuckets = new Map<string, { count: number; resetAt: number }>();

async function isRateLimited(key: string): Promise<boolean> {
  const max = env.RATE_LIMIT_MAX;
  const windowMs = env.RATE_LIMIT_WINDOW_MS;

  if (isRedisEnabled()) {
    try {
      // ioredis lazy import to avoid coupling when Redis is absent.
      const { Redis } = await import("ioredis");
      const redis = new Redis(env.REDIS_URL, { lazyConnect: true, maxRetriesPerRequest: 1 });
      await redis.ping();
      const bucketKey = `rl:ai:${key}`;
      const count = await redis.incr(bucketKey);
      if (count === 1) await redis.pexpire(bucketKey, windowMs);
      await redis.quit();
      return count > max;
    } catch {
      // Redis unavailable → fall through to dev limiter.
    }
  }

  const now = Date.now();
  const bucket = devBuckets.get(key);
  if (!bucket || bucket.resetAt < now) {
    devBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }
  bucket.count += 1;
  return bucket.count > max;
}

export const dynamic = "force-dynamic";