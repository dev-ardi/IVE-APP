import { NextResponse } from "next/server";
import { requireAuthz } from "@/server/auth";
import { listAllQuestions, createQuestion, adminQuestionSchema } from "@/modules/admin/service";
import { toAppError, toHttpStatus } from "@/lib/result";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const auth = await requireAuthz("content:read");
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: toHttpStatus(auth.error.code) });

    const { searchParams } = new URL(req.url);
    const topicId = searchParams.get("topicId") ?? undefined;
    const lessonId = searchParams.get("lessonId") ?? undefined;

    const questions = await listAllQuestions(topicId, lessonId);
    return NextResponse.json({ data: questions });
  } catch (err) {
    const e = toAppError(err, "Gagal memuat bank soal.");
    return NextResponse.json({ error: e }, { status: toHttpStatus(e.code) });
  }
}

export async function POST(req: Request) {
  try {
    const auth = await requireAuthz("content:write");
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: toHttpStatus(auth.error.code) });

    const body = await req.json().catch(() => null);
    const parsed = adminQuestionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0]?.message || "Data soal belum valid." } },
        { status: 400 },
      );
    }

    const result = await createQuestion(parsed.data);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: toHttpStatus(result.error.code) });
    return NextResponse.json({ data: result.data }, { status: 201 });
  } catch (err) {
    const e = toAppError(err, "Gagal menambahkan soal.");
    return NextResponse.json({ error: e }, { status: toHttpStatus(e.code) });
  }
}