import Link from "next/link";
import { getSessionUser } from "@/server/auth";
import { UserMenu } from "./user-menu";
import { MobileNav } from "./mobile-nav";

export async function SiteHeader() {
  const user = await getSessionUser();

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-6">
          <Link href="/" className="group flex items-center gap-2.5 font-bold tracking-tight">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-indigo-500 text-sm font-black text-white shadow-xs shadow-primary/30 transition group-hover:scale-105">
              IV
            </span>
            <div className="flex flex-col">
              <span className="text-lg font-extrabold tracking-tight text-foreground leading-none">
                IVE<span className="text-primary">-APP</span>
              </span>
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
                Interactive Visual Ed
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 md:flex" aria-label="Navigasi utama">
            <Link
              href="/"
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-foreground/80 transition hover:bg-muted hover:text-foreground"
            >
              Beranda
            </Link>
            <Link
              href="/explore"
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-foreground/80 transition hover:bg-muted hover:text-foreground"
            >
              Jelajahi
            </Link>
            <Link
              href="/lab"
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-foreground/80 transition hover:bg-muted hover:text-foreground"
            >
              <span>🧪</span>
              <span>Lab Simulasi</span>
            </Link>
            <Link
              href="/my-learning"
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-foreground/80 transition hover:bg-muted hover:text-foreground"
            >
              Pembelajaran Saya
            </Link>
          </nav>
        </div>

        {/* Right side: Search, User Menu, and Mobile toggle */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/search"
            className="flex items-center gap-2 rounded-lg border border-border/80 bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground transition hover:border-border hover:bg-muted hover:text-foreground"
            aria-label="Cari materi pelajaran"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="hidden sm:inline">Cari materi...</span>
          </Link>

          <div className="hidden sm:flex items-center">
            <UserMenu user={user} />
          </div>

          <MobileNav userRole={user?.role} userName={user?.name ?? user?.email} />
        </div>
      </div>
    </header>
  );
}