import { getSessionUser } from "@/server/auth";
import { UserMenu } from "./user-menu";
import { MobileNav } from "./mobile-nav";
import { IveLogo } from "./ive-logo";
import { ExpandableSearch } from "./expandable-search";
import { ScrollProgress } from "./scroll-progress";
import { NavLinks } from "./nav-links";
import { NavEntranceWrapper } from "./nav-entrance-wrapper";
import { can } from "@/modules/authz";
import { CmsAccessButton } from "./cms-access-button";

export async function SiteHeader() {
  const user = await getSessionUser();
  const canAccessCms = can(user, "cms:access");

  return (
    <>
      <ScrollProgress />
      <NavEntranceWrapper>
        <header className="sticky top-0 z-40 bg-[#F4F1EA]/100 backdrop-blur-sm dark:border-slate-800/80 dark:bg-[#121316]/90">
          <div className="relative mx-auto flex h-16 w-full max-w-[1400px] items-center justify-between px-3 sm:px-6">
            {/* Left: Brand Logo */}
            <div className="flex shrink-0 items-center z-20">
              <IveLogo />
            </div>

            {/* Center: Main Navigation */}
            <nav
              className="pointer-events-none absolute inset-x-0 mx-auto hidden items-center justify-center md:flex z-10"
              aria-label="Navigasi utama"
            >
              <NavLinks />
            </nav>

            {/* Right: Search, Profile, Mobile Nav */}
            <div className="flex shrink-0 items-center gap-3 z-20">
              <ExpandableSearch />
              <CmsAccessButton initialCanAccess={canAccessCms} variant="desktop" />
              <div className="hidden sm:flex items-center">
                <UserMenu user={user} canAccessCms={canAccessCms} />
              </div>
              <MobileNav
                canAccessCms={canAccessCms}
                userName={user?.name ?? user?.email}
                userRole={user?.role}
              />
            </div>
          </div>
        </header>
      </NavEntranceWrapper>
    </>
  );
}