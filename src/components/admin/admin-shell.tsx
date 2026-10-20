"use client";

import React, { useState } from "react";
import { AdminSidebar } from "./sidebar";
import { AdminTopbar } from "./topbar";
import type { PublicUrlContext } from "@/lib/cms-public-url";

export interface AdminLayoutProps {
  userName?: string | null;
  userEmail?: string;
  userRole?: string;
  context?: PublicUrlContext;
  children: React.ReactNode;
}

/**
 * AdminLayout / AdminShell
 * 
 * Wrapper layout untuk seluruh halaman Admin CMS:
 * - h-screen, w-full, overflow-hidden (mencegah seluruh halaman ikut ter-scroll)
 * - Sidebar (kiri) & Header (atas) tetap fixed / tidak ikut ter-scroll
 * - Main Content Area adalah satu-satunya area yang overflow-y-auto
 * - Footer menempel di bagian paling bawah Main Content Area (mt-auto)
 */
export function AdminLayout({
  userName,
  userEmail,
  userRole,
  context,
  children,
}: AdminLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div
      className="cms-root flex h-screen w-full overflow-hidden bg-[#F4F1EA] text-[#1E2024] antialiased dark:bg-[#121316] dark:text-[#F4F1EA]"
      data-lenis-prevent="true"
    >
      {/* 1. Sidebar (Kiri) - Posisi tetap dan tidak ikut ter-scroll */}
      <AdminSidebar
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Wrapper: Header + Scrollable Area (Main + Footer) */}
      <div className="flex flex-1 flex-col h-full min-w-0 overflow-hidden">
        {/* 2. Header/Navbar (Atas) - Posisi tetap dan tidak ikut ter-scroll */}
        <header className="shrink-0 z-20">
          <AdminTopbar
            userName={userName}
            userEmail={userEmail}
            userRole={userRole}
            context={context}
            onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          />
        </header>

        {/* 3. Area Main Content (Satu-satunya area yang bisa di-scroll) */}
        <div className="flex-1 overflow-y-auto flex flex-col min-h-0">
          {/* Main Content Area */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
            {children}
          </main>

          {/* 4. Footer (Bawah) - Menempel di bagian paling bawah dari Main Content Area */}
          <footer className="mt-auto shrink-0 border-t-2 border-[#1E2024]/10 bg-card/60 px-6 py-4 text-xs font-mono text-muted-foreground backdrop-blur-xs dark:border-[#F4F1EA]/10">
            <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#1E2024] dark:text-[#F4F1EA]">IVE-APP CMS</span>
                <span>•</span>
                <span>Interactive Visual Education Admin</span>
              </div>
              <div className="flex items-center gap-3 text-[11px]">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Sistem Aktif
                </span>
                <span>•</span>
                <span>© {new Date().getFullYear()} IVE-APP</span>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

// Backward-compatible alias
export const AdminShell = AdminLayout;
export default AdminLayout;
