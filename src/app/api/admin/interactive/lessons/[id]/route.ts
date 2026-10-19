import { NextResponse } from "next/server";
import { requireAuthz } from "@/server/auth";
import {
  getStudioLessonContext,
  attachInteractiveBlockToLesson,
} from "@/modules/admin/service";
import { toAppError, toHttpStatus } from "@/lib/result";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/interactive/lessons/[id]
 * Returns context for Zone C (formula blocks, sources, existing sandboxes).
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireAuthz("sandbox:write");
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: toHttpStatus(auth.error.code) });

    const { id } = await params;
    const context = await getStudioLessonContext(id);
    if (!context) {
      return NextResponse.json({ error: { message: "Materi tidak ditemukan." } }, { status: 404 });
    }
    return NextResponse.json({ data: context });
  } catch (err) {
    const e = toAppError(err, "Gagal memuat konteks materi.");
    return NextResponse.json({ error: e }, { status: toHttpStatus(e.code) });
  }
}

/**
 * POST /api/admin/interactive/lessons/[id]
 * "Sisipkan ke Materi" — creates/updates interactive block with stable ID (no duplicate).
 */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireAuthz("sandbox:write");
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: toHttpStatus(auth.error.code) });

    const { id: lessonId } = await params;
    const body = await req.json().catch(() => null);

    const componentKey = body?.componentKey;
    const config = body?.config;
    const existingBlockId = body?.existingBlockId;

    if (!componentKey || typeof componentKey !== "string") {
      return NextResponse.json({ error: { message: "Kunci komponen interaktif wajib ada." } }, { status: 400 });
    }

    if (!config || typeof config !== "object") {
      return NextResponse.json({ error: { message: "Konfigurasi sandbox tidak valid." } }, { status: 400 });
    }

    // Fallback text check (mandatory per design-cms.md §7.5)
    if (!config.textFallback || typeof config.textFallback !== "string" || !config.textFallback.trim()) {
      return NextResponse.json(
        { error: { message: "Fallback teks/penjelasan tekstual wajib diisi sebelum disisipkan ke materi." } },
        { status: 400 },
      );
    }

    const result = await attachInteractiveBlockToLesson({
      lessonId,
      componentKey,
      config,
      existingBlockId,
    });

    if (!result.ok) return NextResponse.json({ error: result.error }, { status: toHttpStatus(result.error.code) });
    return NextResponse.json({ data: result.data });
  } catch (err) {
    const e = toAppError(err, "Gagal menyisipkan sandbox ke materi.");
    return NextResponse.json({ error: e }, { status: toHttpStatus(e.code) });
  }
}
