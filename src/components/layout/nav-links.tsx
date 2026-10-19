"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Compass, FlaskConical, BookMarked, Home } from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  matcher: (pathname: string) => boolean;
}

const NAV_ITEMS: NavItem[] = [
  {
    href: "/",
    label: "Beranda",
    icon: Home,
    matcher: (pathname: string) => pathname === "/",
  },
  {
    href: "/explore",
    label: "Jelajahi",
    icon: Compass,
    matcher: (pathname: string) =>
      pathname === "/explore" || (pathname.startsWith("/learn") && !pathname.startsWith("/lab")),
  },
  {
    href: "/lab",
    label: "Lab Simulasi",
    icon: FlaskConical,
    matcher: (pathname: string) => pathname.startsWith("/lab"),
  },
  {
    href: "/my-learning",
    label: "Pembelajaran Saya",
    icon: BookMarked,
    matcher: (pathname: string) => pathname.startsWith("/my-learning"),
  },
];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <div className="pointer-events-auto relative flex items-center gap-1 rounded-full border border-stone-900/10 bg-white/95 p-1 shadow-2xs backdrop-blur-md dark:border-stone-800 dark:bg-stone-900/95">
      {NAV_ITEMS.map((item) => {
        const isActive = item.matcher(pathname);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`group relative inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[13.5px] font-bold transition-colors duration-200 ${
              isActive
                ? "text-white"
                : "text-stone-700 hover:text-stone-950 dark:text-stone-300 dark:hover:text-white"
            }`}
          >
            {/* Sliding animated background indicator */}
            {isActive && (
              <motion.span
                layoutId="navbar-active-pill"
                className="absolute inset-0 rounded-full border border-blue-700/60 bg-blue-600 shadow-[2px_2px_0px_0px_rgba(24,24,27,0.85)] dark:border-blue-400 dark:bg-blue-600 dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.6)]"
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 32,
                }}
              />
            )}

            {/* Icon and label placed above the moving pill */}
            <span className="relative z-10 flex items-center gap-1.5">
              <Icon
                className={`h-4 w-4 transition-transform duration-200 group-hover:scale-110 ${
                  isActive
                    ? "text-white"
                    : item.href === "/lab"
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-stone-500 dark:text-stone-400"
                }`}
              />
              <span>{item.label}</span>
            </span>
          </Link>
        );
      })}
    </div>
  );
}
