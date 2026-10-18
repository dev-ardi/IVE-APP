import { NextResponse } from "next/server";
import { requireUser } from "@/server/auth";
import { listProgress, upsertProgress, progressUpdateSchema } from "@/modules/progress/service";
import { toAppError, toHttpStatus } from "@/lib/result";

// GET /api/progress  (IVE_TAD_Phase_1.md §20, §22)
export async function GET() {
  try {
    const auth = await requireUser();
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: toHttpStatus(auth.error.code) });
    const data = await listProgress(auth.data.userId);
    return NextResponse.json({ data });
  } catch (err) {
    const e = toAppError(err, "Ups, ada sedikit gangguan. Coba lagi.");
    return NextResponse.json({ error: e }, { status: toHttpStatus(e.code) });
  }
}

// POST /api/progress  (IVE_TAD_Phase_1.md §20, §22)
export async function POST(req: Request) {
  try {
    const auth = await requireUser();
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: toHttpStatus(auth.error.code) });

    const body = await req.json().catch(() => null);
    const parsed = progressUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "Data yang dikirim belum valid." } },
        { status: 400 },
      );
    }

    const result = await upsertProgress(auth.data.userId, parsed.data);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: toHttpStatus(result.error.code) });
    return NextResponse.json({ data: result.data }, { status: 200 });
  } catch (err) {
    const e = toAppError(err, "Ups, ada sedikit gangguan. Coba lagi.");
    return NextResponse.json({ error: e }, { status: toHttpStatus(e.code) });
  }
}

export const dynamic = "force-dynamic";