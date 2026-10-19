"use client";

import { useState, useRef, useEffect } from "react";
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
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        if (!query.trim()) {
          setIsOpen(false);
        }
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className={cn("relative flex items-center", className)}>
      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.form
            onSubmit={handleSubmit}
            initial={{ width: 42, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 42, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            className="flex items-center overflow-hidden rounded-xl border-2 border-stone-900 bg-white p-1 shadow-[2.5px_2.5px_0px_0px_rgba(24,24,27,0.9)] dark:border-stone-200 dark:bg-stone-900 dark:shadow-[2.5px_2.5px_0px_0px_rgba(255,255,255,0.7)] sm:w-[320px]"
          >
            <motion.div
              animate={{ rotate: [0, -10, 0] }}
              transition={{ duration: 0.3 }}
            >
              <Search className="ml-2.5 h-4 w-4 shrink-0 text-stone-700 dark:text-stone-300" aria-hidden="true" />
            </motion.div>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari konsep, rumus, topik..."
              className="w-full bg-transparent px-2.5 py-1 text-sm font-semibold text-stone-900 placeholder:text-stone-500 focus:outline-none dark:text-white dark:placeholder:text-stone-400"
              aria-label="Cari materi pelajaran"
            />
            {query.trim() && (
              <motion.button
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-blue-600 text-white shadow-2xs hover:bg-blue-700"
                title="Cari"
                aria-label="Kirim pencarian"
              >
                <ArrowRight className="h-3.5 w-3.5" />
              </motion.button>
            )}
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setIsOpen(false);
              }}
              className="ml-1 flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-lg text-stone-500 transition hover:bg-stone-100 hover:text-stone-900 dark:hover:bg-stone-800 dark:hover:text-white"
              aria-label="Tutup pencarian"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.form>
        ) : (
          <motion.button
            key="search-trigger"
            type="button"
            onClick={() => setIsOpen(true)}
            initial={{ scale: 0.95, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.06, rotate: 5 }}
            whileTap={{ scale: 0.94 }}
            className="flex h-9.5 w-9.5 cursor-pointer items-center justify-center rounded-xl border-2 border-stone-900 bg-white text-stone-800 shadow-[2px_2px_0px_0px_rgba(24,24,27,0.9)] transition-colors hover:bg-blue-50 hover:text-blue-600 dark:border-stone-200 dark:bg-stone-900 dark:text-stone-200 dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.7)] dark:hover:bg-stone-800"
            aria-label="Buka pencarian materi"
            title="Cari materi pelajaran"
          >
            <Search className="h-4 w-4" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
