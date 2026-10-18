import { NextResponse } from "next/server";
import { getSessionUser } from "@/server/auth";
import { submitQuiz, quizSubmitSchema } from "@/modules/quiz/service";
import { toAppError, toHttpStatus } from "@/lib/result";

// POST /api/quiz/submit  (IVE_TAD_Phase_1.md §19, §22)
// Server-authoritative scoring; accepts guests (local-only attempts).
export async function POST(req: Request) {
  try {
    const session = await getSessionUser();
    const userId = session?.id ?? null;

    const body = await req.json().catch(() => null);
    const parsed = quizSubmitSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "Data yang dikirim belum valid." } },
        { status: 400 },
      );
    }

    const result = await submitQuiz(userId, parsed.data);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: toHttpStatus(result.error.code) });
    return NextResponse.json({ data: result.data });
  } catch (err) {
    const e = toAppError(err, "Ups, ada sedikit gangguan. Coba lagi.");
    return NextResponse.json({ error: e }, { status: toHttpStatus(e.code) });
  }
}

export const dynamic = "force-dynamic";