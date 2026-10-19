import { NextResponse } from "next/server";
import { requireAuthz } from "@/server/auth";
import { getSourceById, updateSource, deleteSource, adminSourceSchema } from "@/modules/admin/service";
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
    const source = await getSourceById(id);
    if (!source) {
      return NextResponse.json({ error: { message: "Sumber rujukan tidak ditemukan." } }, { status: 404 });
    }
    return NextResponse.json({ data: source });
  } catch (err) {
    const e = toAppError(err, "Gagal memuat sumber.");
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
    const parsed = adminSourceSchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: { message: parsed.error.issues[0]?.message || "Data sumber tidak valid." } },
        { status: 400 },
      );
    }

    const result = await updateSource(id, parsed.data);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: toHttpStatus(result.error.code) });
    return NextResponse.json({ data: result.data });
  } catch (err) {
    const e = toAppError(err, "Gagal memperbarui sumber.");
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
    const result = await deleteSource(id);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: toHttpStatus(result.error.code) });
    return NextResponse.json({ data: result.data });
  } catch (err) {
    const e = toAppError(err, "Gagal menghapus sumber.");
    return NextResponse.json({ error: e }, { status: toHttpStatus(e.code) });
  }
}
