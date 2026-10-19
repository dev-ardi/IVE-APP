"use client";

import Link from "next/link";
import { LogIn, Shield, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import type { SessionUser } from "@/server/auth";

export function UserMenu({ user }: { user: SessionUser | null }) {
  if (!user) {
    return (
      <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
        <Link
          href="/login"
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border-2 border-stone-900 bg-blue-600 px-4 py-2 text-xs font-black text-white shadow-[2px_2px_0px_0px_rgba(24,24,27,0.9)] transition-colors hover:bg-blue-700 dark:border-white dark:bg-blue-500"
        >
          <LogIn className="h-3.5 w-3.5" />
          <span>Masuk</span>
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {user.role === "ADMIN" ? (
        <Link
          href="/admin"
          className="inline-flex items-center gap-1 rounded-lg border border-amber-300 bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-800 transition hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-200"
        >
          <Shield className="h-3 w-3" />
          <span>Admin</span>
        </Link>
      ) : null}
      <span className="rounded-xl border border-stone-200 bg-white px-3 py-1 text-xs font-bold text-stone-800 shadow-2xs dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200">
        {user.name ?? user.email}
      </span>
      <Link
        href="/api/auth/logout"
        className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-stone-500 transition hover:bg-stone-100 hover:text-stone-900 dark:hover:bg-stone-800 dark:hover:text-white"
        title="Keluar"
      >
        <LogOut className="h-3.5 w-3.5" />
        <span className="hidden lg:inline">Keluar</span>
      </Link>
    </div>
  );
}