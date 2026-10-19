import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-card/50">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 font-bold">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-xs font-black text-primary-foreground">
                IV
              </span>
              <span className="text-base font-extrabold tracking-tight">IVE-APP</span>
            </div>
            <p className="max-w-md text-xs text-muted-foreground leading-relaxed">
              Platform pembelajaran sains dan matematika interaktif untuk mendukung Indonesia Emas 2045 melalui eksplorasi visual, manipulasi konsep, dan pemahaman bermakna.
            </p>
          </div>

          <nav className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground" aria-label="Navigasi footer">
            <Link href="/" className="transition hover:text-foreground">
              Beranda
            </Link>
            <Link href="/explore" className="transition hover:text-foreground">
              Jelajahi
            </Link>
            <Link href="/lab" className="transition hover:text-foreground">
              Lab Simulasi
            </Link>
            <Link href="/my-learning" className="transition hover:text-foreground">
              Pembelajaran Saya
            </Link>
            <Link href="/search" className="transition hover:text-foreground">
              Pencarian
            </Link>
            <Link href="/login" className="transition hover:text-foreground">
              Masuk
            </Link>
          </nav>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-border/80 pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} IVE-APP (Interactive Visual Education Application). Hak cipta dilindungi.</p>
          <p className="text-[11px]">Dirancang untuk pembelajaran aktif, mandiri, dan bermakna.</p>
        </div>
      </div>
    </footer>
  );
}