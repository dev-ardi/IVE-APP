"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";

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
    <form onSubmit={handleSubmit} className="flex w-full gap-2">
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Cari materi, topik, atau mata pelajaran…"
        aria-label="Kata kunci pencarian"
        className="h-10 w-full rounded-xl border border-border bg-card px-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
      />
      <button
        type="submit"
        className="h-10 shrink-0 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/80"
      >
        Cari
      </button>
    </form>
  );
}