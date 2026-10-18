import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { env, isSupabaseEnabled } from "@/lib/env";
import { prisma } from "@/lib/db";
import { Result, ok, fail, ErrorCode } from "@/lib/result";
import type { Role } from "@prisma/client";

/**
 * Identity abstraction over Supabase Auth with a local dev fallback.
 * The rest of the app depends on this interface, never on Supabase directly (§25).
 */

export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  role: Role;
}

let devAuthSecret = "";

async function supabaseClient() {
  const cookieStore = await cookies();
  return createServerClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet) => {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Server Component context: cookie setting is best-effort.
        }
      },
    },
  });
}

/**
 * Resolve the current user from either Supabase Auth or the local dev
 * fallback cookie. Returns null when unauthenticated.
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  if (isSupabaseEnabled()) {
    try {
      const sb = await supabaseClient();
      const {
        data: { session },
      } = await sb.auth.getSession();
      if (!session?.user) return null;
      const profile = await prisma.user.findUnique({
        where: { email: session.user.email ?? "" },
      });
      const role = profile?.role ?? "USER";
      return {
        id: session.user.id,
        email: session.user.email ?? "",
        name: profile?.name ?? session.user.user_metadata?.name ?? null,
        avatar: profile?.avatar ?? null,
        role,
      };
    } catch {
      return null;
    }
  }

  return readDevUser();
}

/**
 * Require an authenticated user. Returns a Fail result when unauthenticated.
 */
export async function requireUser(): Promise<
  Result<SessionUser & { userId: string }>
> {
  const user = await getSessionUser();
  if (!user) return fail(ErrorCode.UNAUTHORIZED, "Silakan masuk terlebih dahulu.");
  return ok({ ...user, userId: user.id });
}

/**
 * Require an authenticated ADMIN user (server-side authorization, §21).
 * Never trust client-side role flags.
 */
export async function requireAdmin(): Promise<
  Result<SessionUser & { userId: string }>
> {
  const user = await getSessionUser();
  if (!user) return fail(ErrorCode.UNAUTHORIZED, "Silakan masuk terlebih dahulu.");
  if (user.role !== "ADMIN") {
    return fail(ErrorCode.FORBIDDEN, "Anda tidak memiliki akses ke halaman ini.");
  }
  return ok({ ...user, userId: user.id });
}

// ---------------------------------------------------------------------------
// Local dev fallback auth (no Supabase configured):
// reads a signed dev cookie carrying the user id. Not for production §21.
// ---------------------------------------------------------------------------

export function getDevAuthSecret(): string {
  if (devAuthSecret) return devAuthSecret;
  devAuthSecret = env.AUTH_SECRET || "ive-local-dev-secret";
  return devAuthSecret;
}

export async function readDevUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get("ive_dev_user")?.value;
  if (!raw) return null;
  try {
    const payload = JSON.parse(Buffer.from(raw, "base64url").toString("utf-8"));
    if (payload.exp && Date.now() > payload.exp) return null;
    if (typeof payload.id !== "string") return null;
    const profile = await prisma.user.findUnique({ where: { id: payload.id } });
    if (!profile) return null;
    return {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      avatar: profile.avatar,
      role: profile.role,
    };
  } catch {
    return null;
  }
}

/**
 * Create a signed dev-auth cookie value for the given user id.
 */
export function signDevUser(userId: string): string {
  const payload = {
    id: userId,
    exp: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
  };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return body;
}