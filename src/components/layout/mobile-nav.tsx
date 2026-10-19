"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface MobileNavProps {
  userRole?: string | null;
  userName?: string | null;
}

export function MobileNav({ userRole, userName }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Beranda" },
    { href: "/explore", label: "Jelajahi" },
    { href: "/lab", label: "Lab Simulasi" },
    { href: "/my-learning", label: "Pembelajaran Saya" },
    { href: "/search", label: "Pencarian" },
  ];

  return (
    <div className="flex items-center sm:hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background p-2 text-foreground/80 hover:bg-muted focus:outline-none"
        aria-label="Toggle menu navigasi"
      >
        {isOpen ? (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-x-0 top-16 z-50 border-b border-border bg-background/95 p-4 shadow-lg backdrop-blur-md transition-all">
          <nav className="flex flex-col gap-2">
            {links.map((link) => {
              const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                    active
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-foreground/80 hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            <div className="my-2 border-t border-border pt-2">
              {userName ? (
                <div className="flex flex-col gap-2 px-1">
                  <span className="text-xs text-muted-foreground">Masuk sebagai:</span>
                  <span className="text-sm font-semibold text-foreground">{userName}</span>
                  {userRole === "ADMIN" && (
                    <Link
                      href="/admin"
                      onClick={() => setIsOpen(false)}
                      className="text-xs font-medium text-amber-600 hover:underline"
                    >
                      Buka Panel Admin →
                    </Link>
                  )}
                  <Link
                    href="/api/auth/logout"
                    onClick={() => setIsOpen(false)}
                    className="mt-1 rounded-lg border border-border px-3 py-1.5 text-center text-xs font-medium text-muted-foreground hover:bg-muted"
                  >
                    Keluar
                  </Link>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="block rounded-lg bg-primary py-2 text-center text-sm font-semibold text-primary-foreground"
                >
                  Masuk Akun
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
