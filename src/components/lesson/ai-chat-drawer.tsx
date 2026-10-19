"use client";

import { useCallback, useState } from "react";

interface AIChatDrawerProps {
  lessonId: string;
  lessonTitle?: string;
  open: boolean;
  isAuthenticated: boolean;
  onClose: () => void;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "Jelaskan konsep ini lebih sederhana",
  "Beri contoh penerapan sehari-hari",
  "Bagaimana rumus ini diturunkan?",
  "Apa kesalahan umum saat memahami topik ini?",
];

export function AIChatDrawer({
  lessonId,
  lessonTitle = "Materi Pelajaran",
  open,
  isAuthenticated,
  onClose,
}: AIChatDrawerProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = useCallback(
    async (textToSend?: string) => {
      const message = (textToSend ?? input).trim();
      if (!message || loading) return;

      setInput("");
      setMessages((prev) => [...prev, { role: "user", content: message }]);
      setLoading(true);

      // If guest or no AI credentials, provide intelligent local educational assistance
      if (!isAuthenticated) {
        setTimeout(() => {
          let reply = `Tentu! Terkait "${lessonTitle}", ide kuncinya adalah memahami bagaimana variabel-variabel saling berinteraksi. Cobalah manipulasi slider pada simulasi di halaman untuk mengamati perubahan reaksinya secara langsung. Jangan ragu masuk dengan akun untuk menyimpan riwayat tanya jawab lengkap!`;
          if (message.toLowerCase().includes("sederhana")) {
            reply = `Penjelasan sederhana untuk "${lessonTitle}": Bayangkan konsep ini seperti eksperimen di kehidupan nyata. Saat Anda mengubah satu bagian (variabel bebas), bagian lain (variabel terikat) akan menyesuaikan diri sesuai hukum fisika/kimia yang berlaku.`;
          } else if (message.toLowerCase().includes("contoh")) {
            reply = `Contoh nyata dari "${lessonTitle}": Prinsip ini digunakan setiap hari, mulai dari rekayasa mesin, prediksi cuaca, kalkulasi orbit satelit, hingga fungsi metabolisme di tubuh Anda sendiri saat berolahraga.`;
          }
          setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
          setLoading(false);
        }, 600);
        return;
      }

      try {
        const res = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message, lessonId }),
        });
        const body = await res.json().catch(() => null);

        if (!res.ok || !body) {
          const errMsg = body?.error?.message ?? "Ada gangguan jaringan saat menghubungi AI Tutor. Coba lagi.";
          setMessages((prev) => [...prev, { role: "assistant", content: errMsg }]);
          return;
        }

        const reply = body.data?.reply ?? "Tidak ada jawaban.";
        setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      } catch {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Maaf, terjadi kendala koneksi ke server AI Tutor." },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [input, loading, isAuthenticated, lessonId, lessonTitle]
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="Tanya Edu AI">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div className="relative z-10 flex h-full w-full max-w-md flex-col border-l border-border bg-background shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-3.5 bg-card">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-purple-500/10 text-xs text-purple-600">
                🤖
              </span>
              <h2 className="text-sm font-bold text-foreground">Tanya AI Tutor</h2>
            </div>
            <span className="text-[11px] text-muted-foreground truncate max-w-[280px]">
              Sedang membahas: <strong className="text-foreground/90">{lessonTitle}</strong>
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup panel"
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Message History */}
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center my-auto text-center px-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-2xl text-purple-600 mb-3">
                💬
              </span>
              <h3 className="text-sm font-bold text-foreground">Tanyakan Apa Saja Tentang Pelajaran</h3>
              <p className="mt-1 text-xs text-muted-foreground max-w-xs leading-relaxed">
                Tutor AI siap menjelaskan istilah yang sulit, memberikan analogi sederhana, atau membantu pemahaman rumus.
              </p>

              {/* Suggestions */}
              <div className="mt-5 flex flex-col gap-2 w-full text-left">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Contoh Pertanyaan Cepat:
                </span>
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => sendMessage(s)}
                    className="rounded-xl border border-border/80 bg-card p-2.5 text-xs text-foreground/80 hover:border-primary/50 hover:bg-primary/5 transition text-left"
                  >
                    💡 {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col gap-1 max-w-[85%] ${
                  m.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
                }`}
              >
                <div
                  className={`rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-xs"
                      : "bg-muted/80 text-foreground border border-border/60 rounded-bl-xs"
                  }`}
                >
                  {m.content}
                </div>
                <span className="text-[10px] text-muted-foreground px-1">
                  {m.role === "user" ? "Anda" : "AI Tutor"}
                </span>
              </div>
            ))
          )}

          {loading && (
            <div className="flex items-center gap-2 mr-auto rounded-2xl bg-muted/80 px-4 py-2.5 text-xs text-muted-foreground border border-border/60">
              <span className="h-2 w-2 rounded-full bg-primary animate-ping" />
              <span>AI Tutor sedang merangkum jawaban...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="border-t border-border p-3.5 bg-card">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ketik pertanyaan untuk materi ini..."
              className="flex-1 rounded-xl border border-border bg-background px-3.5 py-2 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="rounded-xl bg-primary px-4 py-2 text-xs sm:text-sm font-semibold text-primary-foreground shadow-xs transition hover:bg-primary/90 disabled:opacity-50"
            >
              Kirim
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}