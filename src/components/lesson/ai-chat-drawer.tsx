"use client";

import { useCallback, useState } from "react";

interface AIChatDrawerProps {
  lessonId: string;
  open: boolean;
  isAuthenticated: boolean;
  onClose: () => void;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/**
 * Slide-over Edu AI tutor panel (IVE_TAD_Phase_1.md §18, §25).
 * Plain Tailwind fixed right-edge drawer. Sends POST /api/ai/chat.
 * Keyboard accessible: focus textarea on open, Esc closes.
 */
export function AIChatDrawer({
  lessonId,
  open,
  isAuthenticated,
  onClose,
}: AIChatDrawerProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = useCallback(async () => {
    const message = input.trim();
    if (!message || loading || !isAuthenticated) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, lessonId }),
      });
      const body: { data?: { reply?: string }; error?: { code?: string; message?: string } } | null =
        await res.json().catch(() => null);

      if (!res.ok || !body) {
        const message = body?.error?.message ?? "Ups, ada sedikit gangguan. Coba lagi.";
        setMessages((prev) => [...prev, { role: "assistant", content: message }]);
        return;
      }

      const reply = body.data?.reply ?? "";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Ups, ada sedikit gangguan. Coba lagi." }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, isAuthenticated, lessonId]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Tanya Edu AI">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
        }}
      />
      <div className="absolute inset-y-0 right-0 flex w-full max-w-md translate-x-0 flex-col border-l border-border bg-background shadow-xl">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="text-base font-semibold">Tanya Edu AI</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="rounded-lg p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4">
          {!isAuthenticated ? (
            <p className="mx-auto my-auto max-w-xs text-center text-sm text-muted-foreground">
              Masuk dulu untuk bertanya ke Edu AI.
            </p>
          ) : messages.length === 0 ? (
            <p className="mx-auto my-auto max-w-xs text-center text-sm text-muted-foreground">
              Tanyakan apa saja tentang materi ini kepada Edu AI.
            </p>
          ) : (
            messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                  m.role === "user"
                    ? "self-end bg-primary text-primary-foreground"
                    : "self-start bg-muted text-foreground"
                }`}
              >
                {m.content}
              </div>
            ))
          )}

          {loading ? (
            <div className="flex items-center gap-1.5 self-start rounded-xl bg-muted px-3 py-2">
              <TypingDots />
            </div>
          ) : null}
        </div>

        <div className="border-t border-border p-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void send();
            }}
            className="flex items-end gap-2"
          >
            <label htmlFor="ai-chat-input" className="sr-only">
              Tulis pertanyaan untuk Edu AI
            </label>
            <textarea
              id="ai-chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send();
                }
              }}
              disabled={!isAuthenticated}
              rows={1}
              placeholder="Tanyakan ke Edu AI…"
              ref={(el) => {
                if (el && open) el.focus();
              }}
              className="max-h-32 flex-1 resize-none rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!isAuthenticated || loading || !input.trim()}
              className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/80 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
            >
              Kirim
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <span className="flex items-center gap-1" aria-label="Mengetik">
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:0ms]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:150ms]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:300ms]" />
    </span>
  );
}