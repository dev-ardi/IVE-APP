"use client";

import React, { useState } from "react";
import { AdminSidebar } from "./sidebar";
import { AdminTopbar } from "./topbar";
import type { PublicUrlContext } from "@/lib/cms-public-url";

export function AdminShell({
  userName,
  userEmail,
  userRole,
  context,
  children,
}: {
  userName?: string | null;
  userEmail?: string;
  userRole?: string;
  context?: PublicUrlContext;
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div
      className="cms-root flex min-h-screen w-full bg-[#F4F1EA] text-[#1E2024] antialiased dark:bg-[#121316] dark:text-[#F4F1EA]"
      data-lenis-prevent="true"
    >
      {/* Sidebar */}
      <AdminSidebar
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-x-hidden min-w-0">
        <AdminTopbar
          userName={userName}
          userEmail={userEmail}
          userRole={userRole}
          context={context}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
