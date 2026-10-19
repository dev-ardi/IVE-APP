import Link from "next/link";
import { IveLogo } from "./ive-logo";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t-2 border-slate-900/10 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-8 px-3 py-12 sm:px-6">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="flex flex-col gap-2">
            <IveLogo size="sm" showSubtitle={false} />
            <p className="max-w-md text-xs font-medium leading-relaxed text-slate-600 dark:text-slate-400">
              Platform pembelajaran sains dan matematika interaktif untuk mendukung Indonesia Emas 2045 melalui eksplorasi visual, manipulasi konsep langsung, dan pemahaman bermakna.
            </p>
          </div>

          <nav className="flex flex-wrap items-center gap-6 text-sm font-bold text-slate-600 dark:text-slate-400" aria-label="Navigasi footer">
            <Link href="/" className="transition hover:text-blue-600 dark:hover:text-white">
              Beranda
            </Link>
            <Link href="/explore" className="transition hover:text-blue-600 dark:hover:text-white">
              Jelajahi
            </Link>
            <Link href="/lab" className="transition hover:text-blue-600 dark:hover:text-white">
              Lab Simulasi
            </Link>
            <Link href="/my-learning" className="transition hover:text-blue-600 dark:hover:text-white">
              Pembelajaran Saya
            </Link>
            <Link href="/search" className="transition hover:text-blue-600 dark:hover:text-white">
              Pencarian
            </Link>
            <Link href="/login" className="transition hover:text-blue-600 dark:hover:text-white">
              Masuk
            </Link>
          </nav>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 pt-6 text-xs font-medium text-slate-500 dark:border-slate-800 dark:text-slate-400 sm:flex-row">
          <p>© {new Date().getFullYear()} IVE-APP (Interactive Visual Education Application). Hak cipta dilindungi.</p>
          <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
            Dirancang untuk pembelajaran aktif, mandiri, dan bermakna.
          </p>
        </div>
      </div>
    </footer>
  );
}