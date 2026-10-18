import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:px-6">
        <p>© {new Date().getFullYear()} IVE — Visual Education Interactive</p>
        <nav className="flex items-center gap-4" aria-label="Navigasi footer">
          <Link href="/learn" className="transition hover:text-foreground">
            Belajar
          </Link>
          <Link href="/search" className="transition hover:text-foreground">
            Cari
          </Link>
          <Link href="/login" className="transition hover:text-foreground">
            Masuk
          </Link>
        </nav>
      </div>
    </footer>
  );
}