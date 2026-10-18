import { NextResponse } from "next/server";

/**
 * Sign out. Clears the dev auth cookie (best-effort).
 */
export async function GET(req: Request) {
  const res = NextResponse.redirect(new URL("/", req.url));
  res.cookies.delete("ive_dev_user");
  return res;
}