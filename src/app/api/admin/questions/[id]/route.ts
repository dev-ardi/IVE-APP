import { NextResponse } from "next/server";
import { requireAuthz } from "@/server/auth";
import { getQuestionById, updateQuestion, deleteQuestion, adminQuestionSchema } from "@/modules/admin/service";
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
    const question = await getQuestionById(id);
    if (!question) {
      return NextResponse.json({ error: { message: "Soal tidak ditemukan." } }, { status: 404 });
    }
    return NextResponse.json({ data: question });
  } catch (err) {
    const e = toAppError(err, "Gagal memuat soal.");
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
    const parsed = adminQuestionSchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: { message: parsed.error.issues[0]?.message || "Data soal tidak valid." } },
        { status: 400 },
      );
    }

    const result = await updateQuestion(id, parsed.data);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: toHttpStatus(result.error.code) });
    return NextResponse.json({ data: result.data });
  } catch (err) {
    const e = toAppError(err, "Gagal memperbarui soal.");
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
    const result = await deleteQuestion(id);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: toHttpStatus(result.error.code) });
    return NextResponse.json({ data: result.data });
  } catch (err) {
    const e = toAppError(err, "Gagal menghapus soal.");
    return NextResponse.json({ error: e }, { status: toHttpStatus(e.code) });
  }
}
