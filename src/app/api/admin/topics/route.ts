import { NextResponse } from "next/server";
import { requireAuthz } from "@/server/auth";
import { createTopic, adminTopicSchema, listAllTopics } from "@/modules/admin/service";
import { toAppError, toHttpStatus } from "@/lib/result";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const auth = await requireAuthz("content:read");
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: toHttpStatus(auth.error.code) });

    const { searchParams } = new URL(req.url);
    const subjectId = searchParams.get("subjectId") ?? undefined;
    const topics = await listAllTopics(subjectId);
    return NextResponse.json({ data: topics });
  } catch (err) {
    const e = toAppError(err, "Gagal memuat topik.");
    return NextResponse.json({ error: e }, { status: toHttpStatus(e.code) });
  }
}

export async function POST(req: Request) {
  try {
    const auth = await requireAuthz("content:write");
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: toHttpStatus(auth.error.code) });

    const body = await req.json().catch(() => null);
    const parsed = adminTopicSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "Data yang dikirim belum valid." } },
        { status: 400 },
      );
    }

    const result = await createTopic(parsed.data);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: toHttpStatus(result.error.code) });
    return NextResponse.json({ data: result.data }, { status: 201 });
  } catch (err) {
    const e = toAppError(err, "Gagal membuat topik.");
    return NextResponse.json({ error: e }, { status: toHttpStatus(e.code) });
  }
}