"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50";
const labelClass = "mb-1 block text-sm font-medium";

type OptionDraft = { id: string; text: string };

function makeId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `o_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

export function QuestionForm({ lessonId }: { lessonId: string }) {
  const router = useRouter();
  const [options, setOptions] = useState<OptionDraft[]>([
    { id: makeId(), text: "" },
    { id: makeId(), text: "" },
  ]);
  const [correctAnswer, setCorrectAnswer] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function addOption() {
    setOptions((prev) => [...prev, { id: makeId(), text: "" }]);
  }

  function updateOption(id: string, text: string) {
    setOptions((prev) => prev.map((o) => (o.id === id ? { ...o, text } : o)));
  }

  function removeOption(id: string) {
    setOptions((prev) => prev.filter((o) => o.id !== id));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);

    const fd = new FormData(e.currentTarget);
    const question = (fd.get("question") as string).trim();
    const explanation = (fd.get("explanation") as string).trim();
    const difficulty = fd.get("difficulty") as string;

    const cleanedOptions = options.map((o) => ({ id: o.id, text: o.text.trim() })).filter((o) => o.text);

    if (!question) {
      setError("Pertanyaan wajib diisi.");
      setPending(false);
      return;
    }
    if (cleanedOptions.length < 2) {
      setError("Minimal dua opsi jawaban.");
      setPending(false);
      return;
    }
    if (!correctAnswer) {
      setError("Pilih jawaban benar.");
      setPending(false);
      return;
    }
    if (!cleanedOptions.some((o) => o.id === correctAnswer)) {
      setError("Jawaban benar harus merujuk pada salah satu opsi.");
      setPending(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId,
          question,
          options: cleanedOptions,
          correctAnswer,
          explanation: explanation || null,
          difficulty: difficulty || undefined,
          order: 0,
        }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) {
        setError(body?.error?.message ?? "Ups, ada sedikit gangguan. Coba lagi.");
        setPending(false);
        return;
      }
      router.push("/admin/lessons");
      router.refresh();
    } catch {
      setError("Ups, ada sedikit gangguan. Coba lagi.");
      setPending(false);
    }
  }

  return (
    <div className="flex max-w-xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Tambah Soal</h1>
        <p className="text-sm text-muted-foreground">Soal untuk materi {lessonId}.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        <div>
          <label htmlFor="question" className={labelClass}>
            Pertanyaan
          </label>
          <textarea id="question" name="question" className={inputClass} rows={3} required placeholder="Tulis pertanyaan…" />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Opsi Jawaban</span>
            <button
              type="button"
              onClick={addOption}
              className="rounded-md border border-border px-2.5 py-1 text-xs font-medium hover:bg-muted"
            >
              + Tambah Opsi
            </button>
          </div>
          {options.map((option, index) => (
            <div key={option.id} className="flex items-center gap-2">
              <input
                type="radio"
                name="correctAnswer"
                value={option.id}
                checked={correctAnswer === option.id}
                onChange={() => setCorrectAnswer(option.id)}
                aria-label={`Jadikan opsi ${index + 1} sebagai jawaban benar`}
              />
              <input
                value={option.text}
                onChange={(e) => updateOption(option.id, e.target.value)}
                className={inputClass}
                placeholder={`Opsi ${index + 1}`}
              />
              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeOption(option.id)}
                  className="rounded-md px-2 py-1 text-xs font-medium text-destructive hover:bg-destructive/10"
                >
                  Hapus
                </button>
              )}
            </div>
          ))}
          <p className="text-xs text-muted-foreground">Tandai satu opsi sebagai jawaban benar.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="difficulty" className={labelClass}>
              Kesulitan
            </label>
            <select id="difficulty" name="difficulty" className={inputClass} defaultValue="BEGINNER">
              <option value="BEGINNER">Pemula</option>
              <option value="INTERMEDIATE">Menengah</option>
              <option value="ADVANCED">Lanjutan</option>
            </select>
          </div>
          <div>
            <label htmlFor="explanation" className={labelClass}>
              Penjelasan (opsional)
            </label>
            <input id="explanation" name="explanation" className={inputClass} placeholder="Alasan jawaban benar" />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/80 disabled:opacity-50"
          >
            {pending ? "Menyimpan…" : "Simpan Soal"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/lessons")}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}