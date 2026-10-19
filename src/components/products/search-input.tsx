"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Search } from "lucide-react";

export function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("q") ?? "");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = value.trim();
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  }

  return (
    <form onSubmit={handleSubmit} className="relative flex w-full items-center gap-2">
      <div className="relative w-full">
        <Search className="pointer-events-none absolute inset-y-0 left-3.5 my-auto h-4 w-4 text-slate-500 dark:text-slate-400" />
        <input
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Cari konsep sains, rumus matematika, atau simulasi…"
          aria-label="Kata kunci pencarian"
          className="h-11 w-full rounded-xl border-2 border-slate-300 bg-white pr-4 pl-10 text-sm font-semibold text-slate-900 placeholder:text-slate-500 focus:border-slate-900 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-400 dark:focus:border-slate-200"
        />
      </div>
      <button
        type="submit"
        className="inline-flex h-11 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-xl border-2 border-slate-900 bg-blue-600 px-6 text-sm font-black text-white shadow-[2px_2px_0px_0px_rgba(15,23,42,0.9)] transition-all hover:bg-blue-700 active:translate-y-0.5 dark:border-white"
      >
        <Search className="h-4 w-4" />
        <span>Cari</span>
      </button>
    </form>
  );
}