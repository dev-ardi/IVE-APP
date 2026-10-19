"use client";

import { useCallback, useEffect, useState } from "react";
import { AIChatDrawer } from "./ai-chat-drawer";

interface LessonActionsProps {
  lessonId: string;
  lessonTitle?: string;
  isAuthenticated: boolean;
  initialIsFavorite?: boolean;
}

export function LessonActions({
  lessonId,
  lessonTitle = "Materi Pelajaran",
  isAuthenticated,
  initialIsFavorite = false,
}: LessonActionsProps) {
  const [isFavorite, setIsFavorite] = useState<boolean>(() => {
    if (typeof window === "undefined") return initialIsFavorite;
    try {
      const saved = JSON.parse(localStorage.getItem("ive_favorites") || "[]");
      return saved.includes(lessonId);
    } catch {
      return initialIsFavorite;
    }
  });
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [completed, setCompleted] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      const list = JSON.parse(localStorage.getItem("ive_completed") || "[]");
      return list.includes(lessonId);
    } catch {
      return false;
    }
  });

  // Sync favorites with backend for authenticated users
  useEffect(() => {
    if (!isAuthenticated) return;

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/favorites");
        if (!res.ok) return;
        const body = await res.json().catch(() => null);
        if (cancelled || !body?.data) return;
        setIsFavorite(body.data.some((f: { lessonId: string }) => f.lessonId === lessonId));
      } catch {
        // best-effort
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, lessonId]);

  const toggleFavorite = useCallback(async () => {
    if (favoriteLoading) return;
    setFavoriteLoading(true);

    if (!isAuthenticated) {
      try {
        const saved = JSON.parse(localStorage.getItem("ive_favorites") || "[]");
        let updated: string[];
        if (saved.includes(lessonId)) {
          updated = saved.filter((id: string) => id !== lessonId);
          setIsFavorite(false);
        } else {
          updated = [...saved, lessonId];
          setIsFavorite(true);
        }
        localStorage.setItem("ive_favorites", JSON.stringify(updated));
      } catch {
        // ignore
      }
      setFavoriteLoading(false);
      return;
    }

    try {
      if (isFavorite) {
        const res = await fetch(`/api/favorites/${lessonId}`, { method: "DELETE" });
        if (res.ok) setIsFavorite(false);
      } else {
        const res = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lessonId }),
        });
        if (res.ok) setIsFavorite(true);
      }
    } catch {
      // ignore
    } finally {
      setFavoriteLoading(false);
    }
  }, [isAuthenticated, favoriteLoading, isFavorite, lessonId]);

  const toggleComplete = () => {
    if (typeof window === "undefined") return;
    try {
      const list = JSON.parse(localStorage.getItem("ive_completed") || "[]");
      let updated: string[];
      if (list.includes(lessonId)) {
        updated = list.filter((id: string) => id !== lessonId);
        setCompleted(false);
      } else {
        updated = [...list, lessonId];
        setCompleted(true);
      }
      localStorage.setItem("ive_completed", JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {/* Favorite Button */}
        <button
          type="button"
          onClick={toggleFavorite}
          disabled={favoriteLoading}
          aria-pressed={isFavorite}
          className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold transition ${
            isFavorite
              ? "border-rose-300 bg-rose-50 text-rose-600 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-400"
              : "border-border bg-card text-foreground/80 hover:bg-muted hover:text-foreground"
          }`}
        >
          <svg
            className={`h-4 w-4 ${isFavorite ? "fill-rose-500 text-rose-500" : "fill-none text-current"}`}
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <span>{isFavorite ? "Tersimpan di Favorit" : "Simpan Materi"}</span>
        </button>

        {/* Mark Completed Button */}
        <button
          type="button"
          onClick={toggleComplete}
          className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold transition ${
            completed
              ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300"
              : "border-border bg-card text-foreground/80 hover:bg-muted"
          }`}
        >
          <span>{completed ? "✓ Selesai Dipelajari" : "Tandai Selesai"}</span>
        </button>

        {/* Ask AI Button */}
        <button
          type="button"
          onClick={() => setAiOpen(true)}
          className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-purple-700 active:scale-95"
        >
          <span>🤖</span>
          <span>Tanya AI Tutor</span>
        </button>
      </div>

      <AIChatDrawer
        lessonId={lessonId}
        lessonTitle={lessonTitle}
        open={aiOpen}
        isAuthenticated={isAuthenticated}
        onClose={() => setAiOpen(false)}
      />
    </div>
  );
}