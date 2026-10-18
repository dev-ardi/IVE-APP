import { NextResponse } from "next/server";
import { requireUser } from "@/server/auth";
import { removeFavorite } from "@/modules/favorites/service";
import { toAppError, toHttpStatus } from "@/lib/result";

// DELETE /api/favorites/:lessonId  (IVE_TAD_Phase_1.md §22)
export async function DELETE(_req: Request, ctx: { params: Promise<{ lessonId: string }> }) {
  try {
    const auth = await requireUser();
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: toHttpStatus(auth.error.code) });

    const { lessonId } = await ctx.params;
    const result = await removeFavorite(auth.data.userId, lessonId);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: toHttpStatus(result.error.code) });
    return NextResponse.json({ data: { favorited: false } });
  } catch (err) {
    const e = toAppError(err, "Ups, ada sedikit gangguan. Coba lagi.");
    return NextResponse.json({ error: e }, { status: toHttpStatus(e.code) });
  }
}

export const dynamic = "force-dynamic";