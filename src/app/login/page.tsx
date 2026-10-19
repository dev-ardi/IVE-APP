import Link from "next/link";
import { isSupabaseEnabled } from "@/lib/env";

export const metadata = {
  title: "Masuk ke Akun — IVE-APP",
  description: "Masuk ke akun IVE-APP untuk menyinkronkan progres belajar, favorit, dan riwayat latihan Anda.",
  robots: { index: false },
};

export default function LoginPage() {
  const supabaseActive = isSupabaseEnabled();

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-8 px-4 py-12 sm:px-6 sm:py-20">
      <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-10 shadow-sm">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center gap-2 mb-6">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-xl font-black text-primary-foreground shadow-sm">
            IV
          </span>
          <h1 className="text-2xl font-black tracking-tight text-foreground mt-2">
            Masuk ke IVE-APP
          </h1>
          <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
            Akses kembali progres belajar Anda di semua perangkat, simpan materi favorit, dan dapatkan umpan balik latihan yang terpersonalisasi.
          </p>
        </div>

        {/* Benefits list */}
        <div className="mb-6 rounded-2xl border border-border/70 bg-muted/30 p-4 text-xs text-foreground/80 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-emerald-500 font-bold">✓</span>
            <span>Semua materi publik dapat dipelajari gratis tanpa batas.</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-500 font-bold">✓</span>
            <span>Sinkronisasi riwayat kuis dan status penyelesaian materi.</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-500 font-bold">✓</span>
            <span>Akses interaktif penuh ke AI Tutor dengan konteks belajar.</span>
          </div>
        </div>

        {!supabaseActive ? (
          <div className="flex flex-col gap-3">
            <div className="rounded-xl border border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20 p-3 text-xs text-amber-800 dark:text-amber-300">
              ℹ️ <strong>Mode Pengujian Lokal:</strong> Autentikasi Supabase belum dikonfigurasi di file environment. Anda dapat masuk langsung menggunakan sesi simulasi di bawah:
            </div>
            <div className="flex flex-col gap-2.5 pt-2">
              <Link
                href="/api/auth/dev-login?email=siswa@ive.example&next=/explore"
                className="w-full rounded-xl bg-primary py-3 text-center text-xs font-bold text-primary-foreground shadow-xs transition hover:bg-primary/90"
              >
                Masuk sebagai Pelajar / Siswa
              </Link>
              <Link
                href="/api/auth/dev-login?email=admin@ive.example&next=/admin"
                className="w-full rounded-xl border border-border bg-background py-2.5 text-center text-xs font-semibold text-foreground/80 hover:bg-muted transition"
              >
                Masuk sebagai Admin Pengelola
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 text-center">
            <p className="text-xs text-muted-foreground">
              Layanan autentikasi Supabase telah aktif. Silakan masuk melalui provider terdaftar.
            </p>
          </div>
        )}

        <div className="mt-8 border-t border-border pt-4 text-center">
          <Link href="/" className="text-xs font-medium text-primary hover:underline">
            ← Kembali ke Beranda Tanpa Masuk
          </Link>
        </div>
      </div>
    </div>
  );
}