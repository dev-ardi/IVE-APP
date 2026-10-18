import { NextResponse } from "next/server";
import { requireAdmin } from "@/server/auth";
import { createQuestion, adminQuestionSchema } from "@/modules/admin/service";
import { toAppError, toHttpStatus } from "@/lib/result";

// POST /api/admin/questions  (IVE_TAD_Phase_1.md §22)
export async function POST(req: Request) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: toHttpStatus(auth.error.code) });

    const body = await req.json().catch(() => null);
    const parsed = adminQuestionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "Data yang dikirim belum valid." } },
        { status: 400 },
      );
    }

    const result = await createQuestion(parsed.data);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: toHttpStatus(result.error.code) });
    return NextResponse.json({ data: result.data }, { status: 201 });
  } catch (err) {
    const e = toAppError(err, "Ups, ada sedikit gangguan. Coba lagi.");
    return NextResponse.json({ error: e }, { status: toHttpStatus(e.code) });
  }
}

export const dynamic = "force-dynamic";