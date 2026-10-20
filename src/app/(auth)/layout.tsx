import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { IveLogo } from "@/components/layout/ive-logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#FAF9F5] text-stone-900 antialiased dark:bg-[#121316] dark:text-stone-100">
      {/* Minimal Auth Header */}
      <header className="border-b-2 border-stone-900/10 bg-white/70 backdrop-blur-md dark:border-stone-800 dark:bg-stone-900/70">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4 sm:px-6">
          <IveLogo />
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-xl border-2 border-stone-900/20 bg-white px-3 py-1.5 text-xs font-bold text-stone-700 shadow-2xs transition-all hover:border-stone-900 hover:bg-stone-50 hover:text-stone-900 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300 dark:hover:border-stone-400 dark:hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>
      </header>

      {/* Main Auth Content */}
      <main className="flex flex-1 items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">{children}</div>
      </main>

      {/* Minimal Auth Footer */}
      <footer className="border-t border-stone-200 py-4 text-center text-xs text-stone-500 dark:border-stone-800 dark:text-stone-400">
        <p>© {new Date().getFullYear()} IVE-APP — Interactive Visual Education Application.</p>
      </footer>
    </div>
  );
}
