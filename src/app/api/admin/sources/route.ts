import { NextResponse } from "next/server";
import { requireAuthz } from "@/server/auth";
import { listAllSources, createSource, adminSourceSchema } from "@/modules/admin/service";
import { toAppError, toHttpStatus } from "@/lib/result";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const auth = await requireAuthz("content:read");
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: toHttpStatus(auth.error.code) });

    const sources = await listAllSources();
    return NextResponse.json({ data: sources });
  } catch (err) {
    const e = toAppError(err, "Gagal memuat daftar sumber.");
    return NextResponse.json({ error: e }, { status: toHttpStatus(e.code) });
  }
}

export async function POST(req: Request) {
  try {
    const auth = await requireAuthz("content:write");
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: toHttpStatus(auth.error.code) });

    const body = await req.json().catch(() => null);
    const parsed = adminSourceSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: { message: parsed.error.issues[0]?.message || "Data sumber tidak valid." } },
        { status: 400 },
      );
    }

    const result = await createSource(parsed.data);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: toHttpStatus(result.error.code) });
    return NextResponse.json({ data: result.data }, { status: 201 });
  } catch (err) {
    const e = toAppError(err, "Gagal membuat sumber.");
    return NextResponse.json({ error: e }, { status: toHttpStatus(e.code) });
  }
}
