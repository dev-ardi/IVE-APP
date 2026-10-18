import { NextResponse } from "next/server";
import { searchContent } from "@/modules/search/service";
import { toAppError, toHttpStatus } from "@/lib/result";

// GET /api/search?q=... (IVE_TAD_Phase_1.md §22, §27)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") ?? "";
    const limitRaw = searchParams.get("limit");
    const limit = limitRaw ? Math.max(1, Math.min(50, Number(limitRaw) || 20)) : 20;
    const results = await searchContent(q, limit);
    return NextResponse.json({ data: results });
  } catch (err) {
    const e = toAppError(err, "Ups, ada sedikit gangguan. Coba lagi.");
    return NextResponse.json({ error: e }, { status: toHttpStatus(e.code) });
  }
}

export const dynamic = "force-dynamic";