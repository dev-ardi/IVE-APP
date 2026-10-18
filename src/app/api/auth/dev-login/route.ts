import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { signDevUser } from "@/server/auth";
import { isSupabaseEnabled } from "@/lib/env";

/**
 * DEV-ONLY auth helper. When Supabase is not configured, this sets a signed
 * dev cookie that identifies the given seeded user. NOT for production.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email") ?? "siswa@ive.example";
  const redirect = searchParams.get("next") ?? "/";

  if (isSupabaseEnabled()) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json(
      { error: "User not found. Run seed first (npm run db:seed)." },
      { status: 404 },
    );
  }

  const token = signDevUser(user.id);
  const res = NextResponse.redirect(new URL(redirect, req.url));
  res.cookies.set("ive_dev_user", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}