import { getSessionUser } from "@/server/auth";
import { UserMenu } from "./user-menu";
import { MobileNav } from "./mobile-nav";
import { IveLogo } from "./ive-logo";
import { ExpandableSearch } from "./expandable-search";
import { ScrollProgress } from "./scroll-progress";
import { NavLinks } from "./nav-links";

import { can } from "@/modules/authz";
import { CmsAccessButton } from "./cms-access-button";

export async function SiteHeader() {
  const user = await getSessionUser();
  const canAccessCms = can(user, "cms:access");

  return (
    <>
      <ScrollProgress />
      <header className="sticky top-0 z-40 border-b-2 border-stone-900/10 bg-[#FAF9F5]/90 backdrop-blur-md dark:border-slate-800/80 dark:bg-[#121316]/90">
        <div className="relative mx-auto flex h-16 w-full max-w-[1400px] items-center justify-between px-3 sm:px-6">
          {/* Left: Brand Logo (z-20 so it stays above absolute center container) */}
          <div className="flex shrink-0 items-center z-20">
            <IveLogo />
          </div>

          {/* Center: Main Navigation (Absolute center pinned with animated sliding indicator) */}
          <nav
            className="pointer-events-none absolute inset-x-0 mx-auto hidden items-center justify-center md:flex z-10"
            aria-label="Navigasi utama"
          >
            <NavLinks />
          </nav>

          {/* Right: Expandable Search, User Profile, Mobile Nav (z-20) */}
          <div className="flex shrink-0 items-center gap-3 z-20">
            <ExpandableSearch />

            <CmsAccessButton initialCanAccess={canAccessCms} variant="desktop" />

            <div className="hidden sm:flex items-center">
              <UserMenu user={user} canAccessCms={canAccessCms} />
            </div>

            <MobileNav canAccessCms={canAccessCms} userName={user?.name ?? user?.email} />
          </div>
        </div>
      </header>
    </>
  );
}