import { NextRequest, NextResponse } from "next/server";
import { listSubjectsByLevel } from "@/modules/subjects/service";
import { toAppError, toHttpStatus } from "@/lib/result";

// GET /api/subjects  and  GET /api/subjects/:slug (IVE_TAD_Phase_1.md §22)
export async function GET(_req: NextRequest, ctx: { params: Promise<{ slug?: string }> }) {
  try {
    const { slug } = await ctx.params;
    if (!slug) {
      const subjects = await listSubjectsByLevel("sma");
      return NextResponse.json({ data: subjects });
    }
    const subjects = await listSubjectsByLevel(slug);
    return NextResponse.json({ data: subjects });
  } catch (err) {
    const e = toAppError(err, "Ups, ada sedikit gangguan. Coba lagi.");
    return NextResponse.json({ error: e }, { status: toHttpStatus(e.code) });
  }
}

export const dynamic = "force-dynamic";