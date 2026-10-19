"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  FolderTree,
  Layers,
  HelpCircle,
  Library,
  FlaskConical,
  X,
} from "lucide-react";

interface AdminSidebarProps {
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
  highlight?: boolean;
}

export function AdminSidebar({
  isOpenMobile = false,
  onCloseMobile,
}: AdminSidebarProps) {
  const pathname = usePathname();

  const navGroups: Array<{ group: string; items: NavItem[] }> = [
    {
      group: "KONTEN",
      items: [
        { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
        { href: "/admin/subjects", label: "Mata Pelajaran", icon: BookOpen },
        { href: "/admin/topics", label: "Topik", icon: FolderTree },
        { href: "/admin/lessons", label: "Materi", icon: Layers },
        { href: "/admin/questions", label: "Bank Soal", icon: HelpCircle },
        { href: "/admin/sources", label: "Sumber", icon: Library },
      ],
    },
    {
      group: "INTERAKTIF",
      items: [
        {
          href: "/admin/interactive",
          label: "Sandbox Interaktif",
          icon: FlaskConical,
          highlight: true,
        },
      ],
    },
  ];

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between bg-card text-[#1E2024] dark:text-[#F4F1EA]">
      {/* Brand Header */}
      <div>
        <div className="flex h-16 items-center justify-between border-b-[3px] border-[#1E2024] px-5 dark:border-[#F4F1EA]">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-[#1E2024] bg-primary text-xs font-black text-white shadow-[2px_2px_0px_0px_#1E2024] dark:border-[#F4F1EA]">
              IV
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-black tracking-tight text-[#1E2024] dark:text-[#F4F1EA]">
                IVE-APP
              </span>
              <span className="rounded border border-[#1E2024] bg-[#FFD84D] px-1.5 py-0.2 text-[10px] font-mono font-black text-[#1E2024]">
                CMS
              </span>
            </div>
          </Link>
          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              aria-label="Tutup menu navigasi"
              className="flex h-8 w-8 items-center justify-center rounded border border-[#1E2024] lg:hidden"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Nav Links */}
        <nav className="flex flex-col gap-6 p-4">
          {navGroups.map((group) => (
            <div key={group.group} className="flex flex-col gap-1.5">
              <span className="px-3 text-[11px] font-mono font-black uppercase tracking-wider text-muted-foreground">
                {group.group}
              </span>
              <div className="flex flex-col gap-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.exact
                    ? pathname === item.href
                    : pathname === item.href || pathname.startsWith(`${item.href}/`);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onCloseMobile}
                      className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-xs font-bold transition-all ${
                        isActive
                          ? "border-[2px] border-[#1E2024] bg-primary text-white shadow-[3px_3px_0px_0px_#1E2024] dark:border-[#F4F1EA] dark:shadow-[3px_3px_0px_0px_rgba(244,241,234,0.85)]"
                          : item.highlight
                            ? "border-[2px] border-amber-400 bg-amber-50 text-amber-900 hover:border-[#1E2024] hover:shadow-[2px_2px_0px_0px_#1E2024] dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-200"
                            : "border-[2px] border-transparent text-[#1E2024]/80 hover:border-[#1E2024] hover:bg-muted/40 hover:text-[#1E2024] dark:text-[#F4F1EA]/80 dark:hover:border-[#F4F1EA] dark:hover:text-[#F4F1EA]"
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="border-t-2 border-[#1E2024]/10 p-4 text-[11px] font-mono text-muted-foreground dark:border-[#F4F1EA]/10">
        <div>IVE-APP CMS v1.0</div>
        <div className="text-[10px] text-muted-foreground/80">Mode C — Terhubung ke Database</div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 border-r-[3px] border-[#1E2024] bg-card dark:border-[#F4F1EA]">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex lg:hidden"
        >
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <aside className="relative z-10 w-72 h-full border-r-[3px] border-[#1E2024] bg-card shadow-xl dark:border-[#F4F1EA]">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
