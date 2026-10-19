import { NextResponse } from "next/server";
import { requireAuthz } from "@/server/auth";
import { getStudioLessons } from "@/modules/admin/service";
import { toAppError, toHttpStatus } from "@/lib/result";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/interactive/lessons
 * Returns dynamic list of lessons for Studio Zone A (design-cms.md §7.3).
 * Always queries database — never hardcoded constants.
 */
export async function GET() {
  try {
    const auth = await requireAuthz("sandbox:write");
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: toHttpStatus(auth.error.code) });

    const lessons = await getStudioLessons();
    return NextResponse.json({ data: lessons });
  } catch (err) {
    const e = toAppError(err, "Gagal memuat materi untuk Sandbox Studio.");
    return NextResponse.json({ error: e }, { status: toHttpStatus(e.code) });
  }
}
