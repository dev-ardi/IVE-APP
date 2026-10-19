import { NextResponse } from "next/server";
import { requireAuthz } from "@/server/auth";
import { getLessonById, updateLesson, archiveLesson, adminLessonSchema } from "@/modules/admin/service";
import { toAppError, toHttpStatus } from "@/lib/result";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireAuthz("content:read");
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: toHttpStatus(auth.error.code) });

    const { id } = await params;
    const lesson = await getLessonById(id);
    if (!lesson) {
      return NextResponse.json({ error: { message: "Materi tidak ditemukan." } }, { status: 404 });
    }
    return NextResponse.json({ data: lesson });
  } catch (err) {
    const e = toAppError(err, "Gagal memuat materi.");
    return NextResponse.json({ error: e }, { status: toHttpStatus(e.code) });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireAuthz("content:write");
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: toHttpStatus(auth.error.code) });

    const { id } = await params;
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
    const e = toAppError(err, "Gagal memperbarui materi.");
    return NextResponse.json({ error: e }, { status: toHttpStatus(e.code) });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireAuthz("content:write");
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: toHttpStatus(auth.error.code) });

    const { id } = await params;
    const result = await archiveLesson(id);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: toHttpStatus(result.error.code) });
    return NextResponse.json({ data: result.data });
  } catch (err) {
    const e = toAppError(err, "Gagal mengarsipkan materi.");
    return NextResponse.json({ error: e }, { status: toHttpStatus(e.code) });
  }
}