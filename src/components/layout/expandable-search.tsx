"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ExpandableSearchProps {
  className?: string;
}

export function ExpandableSearch({ className }: ExpandableSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Auto-focus when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        mobileInputRef.current?.focus();
      }, 60);
    }
  }, [isOpen]);

  const close = useCallback(() => {
    setIsOpen(false);
    setQuery("");
  }, []);

  // Click-outside and Escape key
  useEffect(() => {
    if (!isOpen) return;
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        if (!query.trim()) close();
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [isOpen, query, close]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      close();
    }
  };

  // Shared search input bar (ref is optional — passed from caller)
  const SearchBar = ({
    ref: inputRefProp,
    extraClass,
  }: {
    ref?: React.RefObject<HTMLInputElement | null>;
    extraClass?: string;
  }) => (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "flex items-center overflow-hidden rounded-xl border-2 border-stone-900 bg-white p-1",
        "shadow-[2.5px_2.5px_0px_0px_rgba(24,24,27,0.9)]",
        "dark:border-stone-200 dark:bg-stone-900 dark:shadow-[2.5px_2.5px_0px_0px_rgba(255,255,255,0.7)]",
        extraClass
      )}
    >
      <Search className="ml-2.5 h-4 w-4 shrink-0 text-stone-700 dark:text-stone-300" aria-hidden="true" />
      <input
        ref={inputRefProp}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Cari konsep, rumus, topik..."
        className="w-full bg-transparent px-2.5 py-1 text-sm font-semibold text-stone-900 placeholder:text-stone-500 focus:outline-none dark:text-white dark:placeholder:text-stone-400"
        aria-label="Cari materi pelajaran"
      />
      {query.trim() && (
        <button
          type="submit"
          className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          aria-label="Kirim pencarian"
        >
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      )}
      <button
        type="button"
        onClick={close}
        className="ml-1 flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-lg text-stone-500 transition hover:bg-stone-100 hover:text-stone-900 dark:hover:bg-stone-800 dark:hover:text-white"
        aria-label="Tutup pencarian"
      >
        <X className="h-4 w-4" />
      </button>
    </form>
  );

  const TriggerBtn = () => (
    <motion.button
      type="button"
      onClick={() => setIsOpen(true)}
      whileHover={{ scale: 1.06, rotate: 5 }}
      whileTap={{ scale: 0.94 }}
      className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border-2 border-stone-900 bg-white text-stone-800 shadow-[2px_2px_0px_0px_rgba(24,24,27,0.9)] transition-colors hover:bg-blue-50 hover:text-blue-600 dark:border-stone-200 dark:bg-stone-900 dark:text-stone-200 dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.7)] dark:hover:bg-stone-800"
      aria-label="Buka pencarian materi"
      title="Cari materi pelajaran"
    >
      <Search className="h-4 w-4" />
    </motion.button>
  );

  return (
    <>
      {/* ── Desktop (md+): inline expanding bar — never covers nav ── */}
      <div ref={containerRef} className={cn("relative hidden md:flex items-center", className)}>
        <AnimatePresence initial={false} mode="wait">
          {isOpen ? (
            <motion.div
              key="desktop-open"
              initial={{ opacity: 0, width: 40 }}
              animate={{ opacity: 1, width: 300 }}
              exit={{ opacity: 0, width: 40 }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
              className="overflow-hidden"
            >
              <SearchBar ref={inputRef} extraClass="w-full" />
            </motion.div>
          ) : (
            <motion.div key="desktop-closed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <TriggerBtn />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Mobile (<md): trigger + full-width overlay BELOW header, not overlapping nav ── */}
      <div className="flex items-center md:hidden">
        <TriggerBtn />
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="mobile-search-overlay"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ type: "spring", stiffness: 420, damping: 30 }}
              // Fixed below the 64px header; z-50 to appear above page content but NOT above the nav
              className="fixed left-0 right-0 top-[64px] z-40 border-b-2 border-stone-900/10 bg-[#F4F1EA]/95 px-3 py-2 backdrop-blur-md dark:bg-[#121316]/95"
            >
              <SearchBar ref={mobileInputRef} extraClass="w-full" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
