import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const res = NextResponse.redirect(new URL("/", req.url));
  res.cookies.delete("ive_dev_user");
  return res;
}

export async function POST(req: Request) {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete("ive_dev_user");
  return res;
}