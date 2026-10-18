import { z } from "zod";

/**
 * Typed, validated access to server-side environment variables.
 * Secrets stay server-only; values prefixed NEXT_PUBLIC_ are safe to expose.
 */

const serverSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

  // Supabase Auth — optional for local dev (falls back to a signed dev token).
  NEXT_PUBLIC_SUPABASE_URL: z.string().optional().default(""),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional().default(""),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional().default(""),
  AUTH_SECRET: z.string().optional().default(""),

  // AI provider (OpenAI-compatible, server-side only).
  AI_API_KEY: z.string().optional().default(""),
  AI_BASE_URL: z.string().optional().default("https://api.openai.com/v1"),
  AI_MODEL: z.string().optional().default("gpt-4o-mini"),
  AI_MAX_CONTEXT_TOKENS: z.coerce.number().optional().default(4000),

  // Object storage.
  STORAGE_ACCESS_KEY_ID: z.string().optional().default(""),
  STORAGE_SECRET_ACCESS_KEY: z.string().optional().default(""),
  STORAGE_BUCKET: z.string().optional().default(""),

  // Redis.
  REDIS_URL: z.string().optional().default(""),

  // Rate limiting.
  RATE_LIMIT_WINDOW_MS: z.coerce.number().optional().default(60_000),
  RATE_LIMIT_MAX: z.coerce.number().optional().default(20),
});

type ServerEnv = z.infer<typeof serverSchema>;

function loadEnv(): ServerEnv {
  const parsed = serverSchema.safeParse(process.env);
  if (!parsed.success) {
    // Do not leak secret values in the error message.
    const issues = parsed.error.issues.map((i) => i.path.join("."));
    throw new Error(`Invalid environment configuration: ${issues.join(", ")}`);
  }
  return parsed.data;
}

export const env = loadEnv();

export const isAIEnabled = () => Boolean(env.AI_API_KEY);
export const isSupabaseEnabled = () =>
  Boolean(env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
export const isRedisEnabled = () => Boolean(env.REDIS_URL);