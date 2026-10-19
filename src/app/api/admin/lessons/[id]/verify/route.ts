import { NextResponse } from "next/server";
import { requireAuthz } from "@/server/auth";
import { verifyPublishGates } from "@/modules/admin/service";
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
    const report = await verifyPublishGates(id);
    return NextResponse.json({ data: report });
  } catch (err) {
    const e = toAppError(err, "Gagal memverifikasi syarat publikasi materi.");
    return NextResponse.json({ error: e }, { status: toHttpStatus(e.code) });
  }
}
