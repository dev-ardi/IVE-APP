import Link from "next/link";
import { Compass, FlaskConical, BookMarked, Home } from "lucide-react";
import { getSessionUser } from "@/server/auth";
import { UserMenu } from "./user-menu";
import { MobileNav } from "./mobile-nav";
import { IveLogo } from "./ive-logo";
import { ExpandableSearch } from "./expandable-search";
import { ScrollProgress } from "./scroll-progress";

export async function SiteHeader() {
  const user = await getSessionUser();

  return (
    <>
      <ScrollProgress />
      <header className="sticky top-0 z-40 border-b-2 border-stone-900/10 bg-[#FAF9F5]/90 backdrop-blur-md dark:border-slate-800/80 dark:bg-[#121316]/90">
        <div className="relative mx-auto flex h-16 w-full max-w-[1400px] items-center justify-between px-3 sm:px-6">
          {/* Left: Brand Logo (z-20 so it stays above absolute center container) */}
          <div className="flex shrink-0 items-center z-20">
            <IveLogo />
          </div>

          {/* Center: Main Navigation (Absolute center pinned so expanding/collapsing search bar never shifts or snaps the menu) */}
          <nav
            className="pointer-events-none absolute inset-x-0 mx-auto hidden items-center justify-center md:flex z-10"
            aria-label="Navigasi utama"
          >
            <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-stone-900/10 bg-white/90 p-1 shadow-2xs backdrop-blur-md dark:border-stone-800 dark:bg-stone-900/90">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13.5px] font-bold text-stone-700 transition hover:bg-stone-100 hover:text-stone-950 dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:text-white"
              >
                <Home className="h-4 w-4 text-stone-500 dark:text-stone-400" />
                <span>Beranda</span>
              </Link>

              <Link
                href="/explore"
                className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13.5px] font-bold text-stone-700 transition hover:bg-stone-100 hover:text-stone-950 dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:text-white"
              >
                <Compass className="h-4 w-4 text-stone-500 dark:text-stone-400" />
                <span>Jelajahi</span>
              </Link>

              <Link
                href="/lab"
                className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13.5px] font-bold text-blue-700 transition hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/60"
              >
                <FlaskConical className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span>Lab Simulasi</span>
              </Link>

              <Link
                href="/my-learning"
                className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13.5px] font-bold text-stone-700 transition hover:bg-stone-100 hover:text-stone-950 dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:text-white"
              >
                <BookMarked className="h-4 w-4 text-stone-500 dark:text-stone-400" />
                <span>Pembelajaran Saya</span>
              </Link>
            </div>
          </nav>

          {/* Right: Expandable Search, User Profile, Mobile Nav (z-20) */}
          <div className="flex shrink-0 items-center gap-3 z-20">
            <ExpandableSearch />

            <div className="hidden sm:flex items-center">
              <UserMenu user={user} />
            </div>

            <MobileNav userRole={user?.role} userName={user?.name ?? user?.email} />
          </div>
        </div>
      </header>
    </>
  );
}