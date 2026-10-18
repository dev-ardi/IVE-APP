import { NextResponse } from "next/server";
import { requireAdmin } from "@/server/auth";
import { updateLesson, archiveLesson, adminLessonSchema } from "@/modules/admin/service";
import { toAppError, toHttpStatus } from "@/lib/result";

// PATCH /api/admin/lessons/:id  (IVE_TAD_Phase_1.md §22)
export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: toHttpStatus(auth.error.code) });

    const { id } = await ctx.params;
    const body = await req.json().catch(() => null);
    const parsed = adminLessonSchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "Data yang dikirim belum valid." } },
        { status: 400 },
      );
    }

    const result = await updateLesson(id, parsed.data);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: toHttpStatus(result.error.code) });
    return NextResponse.json({ data: result.data });
  } catch (err) {
    const e = toAppError(err, "Ups, ada sedikit gangguan. Coba lagi.");
    return NextResponse.json({ error: e }, { status: toHttpStatus(e.code) });
  }
}

// DELETE /api/admin/lessons/:id  — soft-delete via archive (§22)
export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: toHttpStatus(auth.error.code) });

    const { id } = await ctx.params;
    const result = await archiveLesson(id);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: toHttpStatus(result.error.code) });
    return NextResponse.json({ data: result.data });
  } catch (err) {
    const e = toAppError(err, "Ups, ada sedikit gangguan. Coba lagi.");
    return NextResponse.json({ error: e }, { status: toHttpStatus(e.code) });
  }
}

export const dynamic = "force-dynamic";