"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AIChatDrawer } from "./ai-chat-drawer";

interface LessonActionsProps {
  lessonId: string;
  isAuthenticated: boolean;
  initialIsFavorite?: boolean;
}

/**
 * Lesson-level actions row (IVE_TAD_Phase_1.md §7.10, §18).
 * Favorites toggle + Edu AI tutor drawer launcher.
 */
export function LessonActions({
  lessonId,
  isAuthenticated,
  initialIsFavorite = false,
}: LessonActionsProps) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/favorites");
        if (!res.ok) return;
        const body: { data?: { lessonId: string }[] } = await res.json().catch(() => null);
        if (cancelled || !body?.data) return;
        setIsFavorite(body.data.some((f) => f.lessonId === lessonId));
      } catch {
        // best-effort
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, lessonId]);

  const toggleFavorite = useCallback(async () => {
    if (!isAuthenticated || favoriteLoading) return;
    setFavoriteLoading(true);
    setError(null);
    try {
      if (isFavorite) {
        const res = await fetch(`/api/favorites/${lessonId}`, { method: "DELETE" });
        if (res.ok) {
          setIsFavorite(false);
        } else {
          const body = await res.json().catch(() => null);
          setError(body?.error?.message ?? "Ups, ada sedikit gangguan. Coba lagi.");
        }
      } else {
        const res = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lessonId }),
        });
        if (res.ok) {
          setIsFavorite(true);
        } else {
          const body = await res.json().catch(() => null);
          setError(body?.error?.message ?? "Ups, ada sedikit gangguan. Coba lagi.");
        }
      }
    } catch {
      setError("Ups, ada sedikit gangguan. Coba lagi.");
    } finally {
      setFavoriteLoading(false);
    }
  }, [isAuthenticated, favoriteLoading, isFavorite, lessonId]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          onClick={toggleFavorite}
          disabled={!isAuthenticated || favoriteLoading}
          aria-pressed={isFavorite}
          aria-label={isFavorite ? "Hapus dari favorit" : "Tambahkan ke favorit"}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill={isFavorite ? "currentColor" : "none"}
            aria-hidden="true"
          >
            <path
              d="M8 13.5s-5-3.1-5-6.5A2.5 2.5 0 018 5a2.5 2.5 0 015 2c0 3.4-5 6.5-5 6.5z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
          {favoriteLoading ? "Menyimpan…" : isFavorite ? "Tersimpan" : "Simpan"}
        </Button>

        <Button onClick={() => setAiOpen(true)} disabled={!isAuthenticated}>
          Tanya Edu AI
        </Button>
      </div>

      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <AIChatDrawer
        lessonId={lessonId}
        open={aiOpen}
        isAuthenticated={isAuthenticated}
        onClose={() => setAiOpen(false)}
      />
    </div>
  );
}