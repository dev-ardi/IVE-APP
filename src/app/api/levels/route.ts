import { NextResponse } from "next/server";
import { listLevelsWithSubjectCounts } from "@/modules/levels/service";
import { toAppError } from "@/lib/result";

// GET /api/levels  (IVE_TAD_Phase_1.md §22)
export async function GET() {
  try {
    const levels = await listLevelsWithSubjectCounts();
    return NextResponse.json({ data: levels });
  } catch (err) {
    const e = toAppError(err, "Ups, ada sedikit gangguan. Coba lagi.");
    return NextResponse.json({ error: e }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";