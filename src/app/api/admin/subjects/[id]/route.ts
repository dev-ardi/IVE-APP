import { NextResponse } from "next/server";
import { requireAuthz } from "@/server/auth";
import { getSubjectById, updateSubject, deleteSubject, adminSubjectSchema } from "@/modules/admin/service";
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
    const subject = await getSubjectById(id);
    if (!subject) {
      return NextResponse.json({ error: { message: "Mata pelajaran tidak ditemukan." } }, { status: 404 });
    }
    return NextResponse.json({ data: subject });
  } catch (err) {
    const e = toAppError(err, "Gagal memuat mata pelajaran.");
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
    const parsed = adminSubjectSchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: { message: "Data tidak valid." } }, { status: 400 });
    }

    const result = await updateSubject(id, parsed.data);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: toHttpStatus(result.error.code) });
    return NextResponse.json({ data: result.data });
  } catch (err) {
    const e = toAppError(err, "Gagal memperbarui mata pelajaran.");
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
    const result = await deleteSubject(id);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: toHttpStatus(result.error.code) });
    return NextResponse.json({ data: result.data });
  } catch (err) {
    const e = toAppError(err, "Gagal menghapus mata pelajaran.");
    return NextResponse.json({ error: e }, { status: toHttpStatus(e.code) });
  }
}
