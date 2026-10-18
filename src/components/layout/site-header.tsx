import Link from "next/link";
import { getSessionUser } from "@/server/auth";
import { UserMenu } from "./user-menu";

export async function SiteHeader() {
  const user = await getSessionUser();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold tracking-tight">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-lg font-extrabold text-primary-foreground">
            IV
          </span>
          <span className="text-lg">IVE</span>
        </Link>

        <nav className="hidden items-center gap-1 sm:flex" aria-label="Navigasi utama">
          <Link
            href="/learn"
            className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition hover:bg-muted hover:text-foreground"
          >
            Belajar
          </Link>
          <Link
            href="/search"
            className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition hover:bg-muted hover:text-foreground"
          >
            Cari
          </Link>
        </nav>

        <UserMenu user={user} />
      </div>
    </header>
  );
}