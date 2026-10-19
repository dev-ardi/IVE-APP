"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { LogIn, User, LogOut, ShieldCheck, GraduationCap, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { SessionUser } from "@/server/auth";

export function UserMenu({
  user,
  canAccessCms,
}: {
  user: SessionUser | null;
  canAccessCms?: boolean;
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setDropdownOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Guest State: Show "→ Masuk" button
  if (!user) {
    return (
      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
        <Link
          href="/login"
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border-2 border-stone-900 bg-blue-600 px-4 py-2 text-xs font-black text-white shadow-[2px_2px_0px_0px_rgba(24,24,27,0.9)] transition-colors hover:bg-blue-700 dark:border-white dark:bg-blue-500"
          aria-label="Masuk ke Akun"
        >
          <span>→ Masuk</span>
        </Link>
      </motion.div>
    );
  }

  // Authenticated State (Student or Admin): Profile icon on the far right with popup menu
  const isSuperAdmin = user.role === "SUPER_ADMIN";
  const isAdmin = user.role === "ADMIN" || isSuperAdmin;
  const displayName = user.name || user.email.split("@")[0];
  const initial = (displayName[0] || "U").toUpperCase();

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setDropdownOpen((prev) => !prev)}
        className="flex cursor-pointer items-center gap-2 rounded-xl border-2 border-stone-900 bg-white p-1.5 pr-2.5 text-xs font-black text-stone-900 shadow-[2px_2px_0px_0px_rgba(24,24,27,0.9)] transition-all hover:bg-stone-50 active:translate-x-[1px] active:translate-y-[1px] dark:border-stone-100 dark:bg-stone-900 dark:text-stone-100 dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.7)]"
        aria-expanded={dropdownOpen}
        aria-haspopup="true"
        aria-label={`Menu profil ${displayName}`}
        title={`Akun: ${displayName} (${user.role})`}
      >
        {/* Profile Avatar Icon */}
        <span
          className={`flex h-7 w-7 items-center justify-center rounded-lg border-2 border-stone-900 text-xs font-black ${
            isAdmin
              ? "bg-[#FFD84D] text-stone-950 dark:border-stone-100"
              : "bg-blue-600 text-white dark:border-white"
          }`}
        >
          {initial}
        </span>
        <span className="hidden lg:inline-block max-w-[120px] truncate font-bold text-xs">
          {displayName}
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-stone-600 transition-transform dark:text-stone-300 ${
            dropdownOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Profile Dropdown Menu */}
      <AnimatePresence>
        {dropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-64 rounded-2xl border-2 border-stone-900 bg-white p-3 shadow-[4px_4px_0px_0px_rgba(24,24,27,0.9)] dark:border-stone-100 dark:bg-stone-900 dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.85)] z-50"
          >
            {/* Header info */}
            <div className="border-b border-stone-200 pb-3 mb-2 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-xl border-2 border-stone-900 text-sm font-black ${
                    isAdmin
                      ? "bg-[#FFD84D] text-stone-950"
                      : "bg-blue-600 text-white"
                  }`}
                >
                  {initial}
                </span>
                <div className="flex flex-col min-w-0">
                  <span className="truncate text-xs font-black text-stone-900 dark:text-white">
                    {user.name || "Pengguna"}
                  </span>
                  <span className="truncate text-[11px] text-stone-500 dark:text-stone-400">
                    {user.email}
                  </span>
                </div>
              </div>

              {/* Role badge */}
              <div className="mt-2.5 flex items-center gap-1.5">
                {isAdmin ? (
                  <span className="inline-flex items-center gap-1 rounded-md border border-stone-900 bg-[#FFD84D] px-2 py-0.5 text-[10px] font-mono font-black text-stone-950">
                    <ShieldCheck className="h-3 w-3" />
                    {isSuperAdmin ? "SUPER ADMIN" : "ADMIN"}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-md border border-stone-200 bg-blue-50 px-2 py-0.5 text-[10px] font-mono font-bold text-blue-800 dark:border-stone-700 dark:bg-blue-950/60 dark:text-blue-300">
                    <GraduationCap className="h-3 w-3" />
                    SISWA / PELAJAR
                  </span>
                )}
              </div>
            </div>

            {/* Links / Actions */}
            <div className="flex flex-col gap-1">
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 rounded-xl border border-stone-900 bg-[#FFD84D] px-3 py-2 text-xs font-bold text-stone-950 hover:bg-[#FACC15] transition"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>Buka Dashboard CMS</span>
                </Link>
              )}

              <Link
                href="/my-learning"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800 transition"
              >
                <GraduationCap className="h-4 w-4" />
                <span>Pembelajaran Saya</span>
              </Link>

              <div className="my-1 border-t border-stone-100 dark:border-stone-800" />

              <Link
                href="/api/auth/logout"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40 transition"
              >
                <LogOut className="h-4 w-4" />
                <span>Keluar Akun</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}