"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, LogOut, ChevronRight, Menu } from "lucide-react";
import { RoleBadge } from "./ui/badge";
import { getPublicUrl, type PublicUrlContext } from "@/lib/cms-public-url";

interface AdminTopbarProps {
  userName?: string | null;
  userEmail?: string;
  userRole?: string;
  context?: PublicUrlContext;
  onOpenMobileMenu?: () => void;
  hasUnsavedChanges?: boolean;
}

export function AdminTopbar({
  userName,
  userEmail,
  userRole = "ADMIN",
  context,
  onOpenMobileMenu,
  hasUnsavedChanges = false,
}: AdminTopbarProps) {
  const pathname = usePathname();
  const publicDest = getPublicUrl(context);

  // Compute breadcrumb based on pathname
  const segments = pathname.replace(/^\/admin\/?/, "").split("/").filter(Boolean);
  const breadcrumbMap: Record<string, string> = {
    subjects: "Mata Pelajaran",
    topics: "Topik",
    lessons: "Materi",
    questions: "Bank Soal",
    sources: "Sumber",
    interactive: "Sandbox Interaktif",
    new: "Tambah Baru",
  };

  const handlePublicClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (hasUnsavedChanges) {
      const confirmLeave = window.confirm(
        "Tinggalkan CMS? Perubahan yang belum disimpan akan hilang.",
      );
      if (!confirmLeave) {
        e.preventDefault();
      }
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b-[3px] border-[#1E2024] bg-card px-4 sm:px-6 dark:border-[#F4F1EA]">
      {/* Left: Mobile Drawer Trigger & Breadcrumb */}
      <div className="flex items-center gap-3">
        {onOpenMobileMenu && (
          <button
            type="button"
            onClick={onOpenMobileMenu}
            aria-label="Buka menu navigasi CMS"
            className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-[#1E2024] bg-card text-[#1E2024] shadow-[2px_2px_0px_0px_#1E2024] lg:hidden dark:border-[#F4F1EA] dark:text-[#F4F1EA]"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-1.5 text-xs font-mono">
          <Link
            href="/admin"
            className="font-bold text-muted-foreground hover:text-[#1E2024] dark:hover:text-[#F4F1EA]"
          >
            BERANDA CMS
          </Link>
          {segments.map((seg, idx) => {
            const label = breadcrumbMap[seg] || seg;
            const isLast = idx === segments.length - 1;
            return (
              <span key={seg} className="flex items-center gap-1.5">
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                <span
                  className={
                    isLast
                      ? "font-black text-[#1E2024] dark:text-[#F4F1EA]"
                      : "font-semibold text-muted-foreground"
                  }
                >
                  {label.toUpperCase()}
                </span>
              </span>
            );
          })}
        </nav>
      </div>

      {/* Right: "Lihat Public Site" + Identity + Logout */}
      <div className="flex items-center gap-3">
        {/* Contextual "Lihat Public Site" Button (design-cms.md §2.3C) */}
        <Link
          href={publicDest.url}
          onClick={handlePublicClick}
          title={publicDest.tooltip || "Kembali ke Public Site"}
          className="inline-flex min-h-[38px] h-[38px] items-center gap-1.5 rounded-lg border-2 border-[#1E2024] bg-card px-3 text-xs font-black text-[#1E2024] shadow-[2.5px_2.5px_0px_0px_#1E2024] transition-all hover:bg-stone-100 active:translate-x-[1.5px] active:translate-y-[1.5px] active:shadow-none focus-visible:outline-3 focus-visible:outline-blue-600 focus-visible:outline-offset-2 dark:border-[#F4F1EA] dark:text-[#F4F1EA] dark:shadow-[2.5px_2.5px_0px_0px_rgba(244,241,234,0.85)] dark:hover:bg-stone-800"
        >
          <ExternalLink className="h-3.5 w-3.5 text-[#1E2024] dark:text-[#F4F1EA]" />
          <span className="hidden sm:inline">Lihat Public Site</span>
          <span className="sm:hidden">Public</span>
        </Link>

        {/* User Badge */}
        <div className="hidden md:flex items-center gap-2 border-l-2 border-[#1E2024]/20 pl-3 dark:border-[#F4F1EA]/20">
          <div className="flex flex-col text-right">
            <span className="text-xs font-black text-[#1E2024] dark:text-[#F4F1EA]">
              {userName || userEmail?.split("@")[0]}
            </span>
          </div>
          <RoleBadge role={userRole} />
        </div>

        {/* Logout */}
        <Link
          href="/api/auth/logout"
          title="Keluar dari CMS"
          className="flex h-[38px] w-[38px] items-center justify-center rounded-lg border-2 border-[#1E2024] bg-card text-[#1E2024] shadow-[2px_2px_0px_0px_#1E2024] transition-all hover:bg-[#FF6B6B]/20 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none dark:border-[#F4F1EA] dark:text-[#F4F1EA]"
        >
          <LogOut className="h-4 w-4" />
        </Link>
      </div>
    </header>
  );
}
