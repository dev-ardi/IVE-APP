import { NextResponse } from "next/server";
import { requireAuthz } from "@/server/auth";
import { linkLessonSource, unlinkLessonSource } from "@/modules/admin/service";
import { toAppError, toHttpStatus } from "@/lib/result";

export const dynamic = "force-dynamic";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireAuthz("content:write");
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: toHttpStatus(auth.error.code) });

    const { id: lessonId } = await params;
    const body = await req.json().catch(() => null);
    const sourceId = body?.sourceId;
    const citationNote = body?.citationNote;

    if (!sourceId || typeof sourceId !== "string") {
      return NextResponse.json({ error: { message: "ID sumber wajib disertakan." } }, { status: 400 });
    }

    const result = await linkLessonSource(lessonId, sourceId, citationNote);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: toHttpStatus(result.error.code) });
    return NextResponse.json({ data: result.data });
  } catch (err) {
    const e = toAppError(err, "Gagal menautkan sumber ke materi.");
    return NextResponse.json({ error: e }, { status: toHttpStatus(e.code) });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireAuthz("content:write");
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: toHttpStatus(auth.error.code) });

    const { id: lessonId } = await params;
    const { searchParams } = new URL(req.url);
    const sourceId = searchParams.get("sourceId");

    if (!sourceId) {
      return NextResponse.json({ error: { message: "Parameter sourceId wajib disertakan." } }, { status: 400 });
    }

    const result = await unlinkLessonSource(lessonId, sourceId);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: toHttpStatus(result.error.code) });
    return NextResponse.json({ data: result.data });
  } catch (err) {
    const e = toAppError(err, "Gagal melepas tautan sumber.");
    return NextResponse.json({ error: e }, { status: toHttpStatus(e.code) });
  }
}
