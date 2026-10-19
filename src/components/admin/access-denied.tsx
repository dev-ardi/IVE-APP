import Link from "next/link";
import { ShieldAlert, ArrowLeft, LogOut } from "lucide-react";

export function AdminAccessDenied({
  userName,
  userEmail,
  userRole,
}: {
  userName?: string | null;
  userEmail?: string;
  userRole?: string;
}) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#F4F1EA] p-4 text-[#1E2024] dark:bg-[#121316] dark:text-[#F4F1EA]">
      <div className="w-full max-w-md rounded-xl border-[3px] border-[#1E2024] bg-white p-6 shadow-[6px_6px_0px_0px_#1E2024] dark:border-[#F4F1EA] dark:bg-[#1C1E22] dark:shadow-[6px_6px_0px_0px_rgba(244,241,234,0.85)]">
        <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-lg border-[3px] border-[#1E2024] bg-[#FF6B6B] shadow-[3px_3px_0px_0px_#1E2024] dark:border-[#F4F1EA]">
          <ShieldAlert className="h-8 w-8 text-[#1E2024]" />
        </div>

        <div className="mb-2 inline-block rounded-md border-2 border-[#1E2024] bg-[#FFD84D] px-2 py-0.5 text-xs font-black uppercase tracking-wider text-[#1E2024]">
          403 — Akses Ditolak
        </div>

        <h1 className="text-2xl font-black tracking-tight text-[#1E2024] dark:text-[#F4F1EA]">
          Anda Tidak Memiliki Akses CMS
        </h1>

        <p className="mt-2 text-sm leading-relaxed text-[#1E2024]/80 dark:text-[#F4F1EA]/80">
          Akun Anda saat ini masuk sebagai{" "}
          <strong className="font-bold text-[#1E2024] dark:text-white">
            {userName || userEmail || "Pengguna"}
          </strong>{" "}
          dengan role{" "}
          <span className="inline-block rounded border border-[#1E2024] bg-stone-100 px-1.5 py-0.5 text-xs font-mono font-bold text-[#1E2024] dark:bg-stone-800 dark:text-stone-200">
            {userRole || "USER"}
          </span>
          . Hanya pengguna dengan role <strong>ADMIN</strong> atau <strong>SUPER ADMIN</strong> yang dapat mengelola konten di CMS IVE-APP.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <Link
            href="/"
            className="flex h-11 items-center justify-center gap-2 rounded-lg border-[3px] border-[#1E2024] bg-[#7BE0A4] font-black text-[#1E2024] shadow-[4px_4px_0px_0px_#1E2024] transition-all hover:bg-[#68d193] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none dark:border-[#F4F1EA]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Kembali ke Public Site</span>
          </Link>

          <Link
            href="/api/auth/logout"
            className="flex h-11 items-center justify-center gap-2 rounded-lg border-2 border-stone-300 bg-white font-bold text-stone-700 transition hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300"
          >
            <LogOut className="h-4 w-4" />
            <span>Keluar & Ganti Akun</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
