import { NextResponse } from "next/server";
import { requireAuthz } from "@/server/auth";
import { getDashboardStats } from "@/modules/admin/service";
import { toAppError, toHttpStatus } from "@/lib/result";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const auth = await requireAuthz("cms:access");
    if (!auth.ok) {
      return NextResponse.json({ error: auth.error }, { status: toHttpStatus(auth.error.code) });
    }

    const stats = await getDashboardStats();
    return NextResponse.json({ data: stats });
  } catch (err) {
    const e = toAppError(err, "Gagal memuat statistik dashboard.");
    return NextResponse.json({ error: e }, { status: toHttpStatus(e.code) });
  }
}
