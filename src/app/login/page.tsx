import Link from "next/link";
import { isSupabaseEnabled } from "@/lib/env";

export const metadata = { title: "Masuk", robots: { index: false } };

export default function LoginPage() {
  if (!isSupabaseEnabled()) {
    return (
      <div className="mx-auto flex max-w-md flex-col gap-6 px-4 py-16">
        <div className="rounded-xl border border-border p-6">
          <h1 className="text-xl font-semibold">Masuk (mode pengembangan)</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Supabase Auth belum dikonfigurasi, jadi kamu bisa masuk sebagai salah satu akun seed di
            bawah ini.
          </p>
          <div className="mt-4 flex flex-col gap-2">
            <Link
              href="/api/auth/dev-login?email=siswa@ive.example&next=/learn"
              className="rounded-lg bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground hover:bg-primary/80"
            >
              Masuk sebagai Siswa
            </Link>
            <Link
              href="/api/auth/dev-login?email=admin@ive.example&next=/admin"
              className="rounded-lg border border-border px-4 py-2 text-center text-sm font-medium hover:bg-muted"
            >
              Masuk sebagai Admin
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 px-4 py-16">
      <div className="rounded-xl border border-border p-6 text-center">
        <h1 className="text-xl font-semibold">Masuk</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Autentikasi Supabase akan tampil di sini. (Integrasi OAuth siap dihubungkan.)
        </p>
      </div>
    </div>
  );
}