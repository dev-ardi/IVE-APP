import { NextResponse } from "next/server";
import { requireAuthz } from "@/server/auth";
import { getTopicById, updateTopic, deleteTopic, adminTopicSchema } from "@/modules/admin/service";
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
    const topic = await getTopicById(id);
    if (!topic) {
      return NextResponse.json({ error: { message: "Topik tidak ditemukan." } }, { status: 404 });
    }
    return NextResponse.json({ data: topic });
  } catch (err) {
    const e = toAppError(err, "Gagal memuat topik.");
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
    const parsed = adminTopicSchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: { message: "Data tidak valid." } }, { status: 400 });
    }

    const result = await updateTopic(id, parsed.data);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: toHttpStatus(result.error.code) });
    return NextResponse.json({ data: result.data });
  } catch (err) {
    const e = toAppError(err, "Gagal memperbarui topik.");
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
    const result = await deleteTopic(id);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: toHttpStatus(result.error.code) });
    return NextResponse.json({ data: result.data });
  } catch (err) {
    const e = toAppError(err, "Gagal menghapus topik.");
    return NextResponse.json({ error: e }, { status: toHttpStatus(e.code) });
  }
}
