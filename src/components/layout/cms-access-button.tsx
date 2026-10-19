"use client";

import Link from "next/link";
import { LayoutDashboard } from "lucide-react";
import { useEffect, useState } from "react";

interface CmsAccessButtonProps {
  initialCanAccess?: boolean;
  variant?: "desktop" | "mobile" | "menu";
  className?: string;
  onNavigate?: () => void;
}

export function CmsAccessButton({
  initialCanAccess,
  variant = "desktop",
  className = "",
  onNavigate,
}: CmsAccessButtonProps) {
  const [canAccess, setCanAccess] = useState<boolean>(initialCanAccess ?? false);

  useEffect(() => {
    let isMounted = true;
    fetch("/api/auth/session", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data && typeof data.canAccessCms === "boolean") {
          setCanAccess(data.canAccessCms);
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  if (!canAccess) {
    if (variant === "desktop") {
      // Fixed-width/invisible placeholder to prevent layout shift
      return <div className="hidden sm:block" aria-hidden="true" />;
    }
    return null;
  }

  if (variant === "mobile") {
    return (
      <Link
        href="/admin"
        onClick={onNavigate}
        className={`flex w-full items-center justify-center gap-2 rounded-xl border-2 border-stone-900 bg-[#FFD84D] px-4 py-2.5 text-xs font-black text-stone-900 shadow-[3px_3px_0px_0px_#1E2024] transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none hover:bg-[#FACC15] dark:border-stone-100 dark:text-stone-950 dark:shadow-[3px_3px_0px_0px_rgba(244,241,234,0.9)] min-h-[44px] ${className}`}
      >
        <LayoutDashboard className="h-4 w-4 shrink-0 text-stone-950" />
        <span>Akses CMS</span>
      </Link>
    );
  }

  if (variant === "menu") {
    return (
      <Link
        href="/admin"
        onClick={onNavigate}
        className={`flex items-center gap-2 rounded-lg border-2 border-stone-900 bg-[#FFD84D] px-2.5 py-1.5 text-xs font-bold text-stone-900 shadow-[2px_2px_0px_0px_#1E2024] hover:bg-[#FACC15] dark:border-stone-100 dark:text-stone-950 ${className}`}
      >
        <LayoutDashboard className="h-3.5 w-3.5 shrink-0 text-stone-950" />
        <span>Akses CMS</span>
      </Link>
    );
  }

  return (
    <div className="hidden sm:flex items-center">
      <Link
        href="/admin"
        onClick={onNavigate}
        className={`inline-flex items-center gap-1.5 rounded-lg border-2 border-stone-900 bg-[#FFD84D] px-3 py-1.5 text-xs font-black text-stone-900 shadow-[3px_3px_0px_0px_#1E2024] transition-all hover:bg-[#FACC15] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none focus-visible:outline-3 focus-visible:outline-blue-600 focus-visible:outline-offset-2 dark:border-stone-100 dark:text-stone-950 dark:shadow-[3px_3px_0px_0px_rgba(244,241,234,0.9)] ${className}`}
        aria-label="Akses CMS"
      >
        <LayoutDashboard className="h-3.5 w-3.5 shrink-0 text-stone-950" />
        <span>Akses CMS</span>
      </Link>
    </div>
  );
}
