"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Home, Compass, FlaskConical, BookMarked, Search, LogIn, LogOut, Shield } from "lucide-react";

interface MobileNavProps {
  userRole?: string | null;
  userName?: string | null;
}

export function MobileNav({ userRole, userName }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Beranda", icon: Home },
    { href: "/explore", label: "Jelajahi", icon: Compass },
    { href: "/lab", label: "Lab Simulasi", icon: FlaskConical },
    { href: "/my-learning", label: "Pembelajaran Saya", icon: BookMarked },
    { href: "/search", label: "Pencarian", icon: Search },
  ];

  return (
    <div className="flex items-center md:hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex h-9.5 w-9.5 cursor-pointer items-center justify-center rounded-xl border-2 border-slate-900 bg-white text-slate-800 shadow-[2px_2px_0px_0px_rgba(15,23,42,0.9)] hover:bg-slate-50 focus:outline-none dark:border-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.7)]"
        aria-label="Toggle menu navigasi"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {isOpen && (
        <div className="fixed inset-x-0 top-16 z-50 border-b-2 border-slate-900/10 bg-white/95 p-4 shadow-xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/95">
          <nav className="flex flex-col gap-1.5">
            {links.map((link) => {
              const Icon = link.icon;
              const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-bold transition ${
                    active
                      ? "border border-blue-600 bg-blue-50 text-blue-800 dark:border-blue-400 dark:bg-blue-950/60 dark:text-blue-200"
                      : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            <div className="my-2 border-t border-slate-100 pt-3 dark:border-slate-800">
              {userName ? (
                <div className="flex flex-col gap-2 px-1">
                  <span className="text-xs font-semibold text-slate-500">Masuk sebagai:</span>
                  <span className="text-sm font-black text-slate-900 dark:text-white">{userName}</span>
                  {userRole === "ADMIN" && (
                    <Link
                      href="/admin"
                      onClick={() => setIsOpen(false)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:underline"
                    >
                      <Shield className="h-3.5 w-3.5" />
                      <span>Buka Panel Admin</span>
                    </Link>
                  )}
                  <Link
                    href="/api/auth/logout"
                    onClick={() => setIsOpen(false)}
                    className="mt-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 py-2 text-center text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Keluar Akun</span>
                  </Link>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl border-2 border-slate-900 bg-blue-600 py-2.5 text-center text-sm font-black text-white shadow-[2px_2px_0px_0px_rgba(15,23,42,0.9)] hover:bg-blue-700"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Masuk Akun</span>
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
