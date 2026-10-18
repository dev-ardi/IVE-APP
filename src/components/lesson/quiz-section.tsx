"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import type { QuestionView } from "@/modules/quiz/service";

interface QuizResult {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  passed: boolean;
  feedback: { questionId: string; correct: boolean; correctAnswer: string }[];
}

interface QuizSectionProps {
  lessonId: string;
  initialQuestions: QuestionView[];
}

const PASS_THRESHOLD = 70;
const OPTION_LABELS = ["A", "B", "C", "D", "E", "F", "G", "H"];

/**
 * Lesson quiz (IVE_TAD_Phase_1.md §7.6, §19).
 * One question at a time; submits answers to /api/quiz/submit (server-authoritative).
 * Records completion via /api/progress when passed.
 * Keyboard accessible: option buttons focusable and selectable via keyboard.
 */
export function QuizSection({ lessonId, initialQuestions }: QuizSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const questions = initialQuestions;
  const total = questions.length;
  const current = questions[currentIndex];
  const selectedId = current ? (answers[current.id] ?? null) : null;

  const answeredCount = useMemo(
    () => Object.keys(answers).filter((id) => questions.some((q) => q.id === id)).length,
    [answers, questions],
  );

  const selectOption = useCallback(
    (optionId: string) => {
      if (!current) return;
      setAnswers((prev) => ({ ...prev, [current.id]: optionId }));
    },
    [current],
  );

  const submit = useCallback(async () => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId, answers }),
      });
      const body: { data?: QuizResult; error?: { message?: string } } | null = await res
        .json()
        .catch(() => null);

      if (!res.ok || !body?.data) {
        setError(body?.error?.message ?? "Ups, ada sedikit gangguan. Coba lagi.");
        return;
      }

      setResult(body.data);

      if (body.data.passed) {
        try {
          await fetch("/api/progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lessonId, progress: 100, completed: true }),
          });
        } catch {
          // progress is best-effort; quiz result already shown
        }
      }
    } catch {
      setError("Ups, ada sedikit gangguan. Coba lagi.");
    } finally {
      setSubmitting(false);
    }
  }, [lessonId, answers]);

  const goNext = useCallback(() => {
    if (currentIndex < total - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      void submit();
    }
  }, [currentIndex, total, submit]);

  const goPrevious = useCallback(() => {
    setCurrentIndex((i) => Math.max(0, i - 1));
  }, []);

  useEffect(() => {
    if (!result) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "1") setCurrentIndex(0);
      else if (e.key === "2") setCurrentIndex(1);
      else if (e.key === "3") setCurrentIndex(2);
      else if (e.key === "4") setCurrentIndex(3);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [result]);

  if (total === 0) {
    return (
      <section className="rounded-xl border border-border bg-card p-6">
        <p className="text-sm text-muted-foreground">Belum ada kuis untuk materi ini.</p>
      </section>
    );
  }

  if (result) {
    return (
      <section className="rounded-xl border border-border bg-card p-6">
        <div className="mb-5 text-center">
          <p className="text-sm text-muted-foreground">Skor kamu</p>
          <p className="text-4xl font-bold">{result.score}%</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Benar {result.correctAnswers} dari {result.totalQuestions} soal
          </p>
          <p
            className={`mt-3 inline-block rounded-lg px-4 py-1.5 text-sm font-medium ${
              result.passed
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "bg-destructive/10 text-destructive"
            }`}
          >
            {result.passed ? "Lulus!" : "Coba lagi"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Nilai kelulusan: {PASS_THRESHOLD}%
          </p>
        </div>

        <ol className="flex flex-col gap-3">
          {questions.map((q, idx) => {
            const feedback = result.feedback.find((f) => f.questionId === q.id);
            const correctOption = q.options.find((o) => o.id === feedback?.correctAnswer);
            return (
              <li
                key={q.id}
                className={`rounded-xl border p-4 ${
                  feedback?.correct
                    ? "border-emerald-500/40 bg-emerald-500/5"
                    : "border-destructive/40 bg-destructive/5"
                }`}
              >
                <div className="flex items-start gap-2">
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                      feedback?.correct
                        ? "bg-emerald-500 text-white"
                        : "bg-destructive text-white"
                    }`}
                    aria-hidden="true"
                  >
                    {feedback?.correct ? "✓" : "✕"}
                  </span>
                  <div>
                    <p className="text-sm font-medium">
                      {idx + 1}. {q.question}
                    </p>
                    {!feedback?.correct && correctOption ? (
                      <p className="mt-1 text-sm text-muted-foreground">
                        Jawaban benar: {correctOption.text}
                      </p>
                    ) : null}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        {!result.passed ? (
          <div className="mt-5 text-center">
            <Button
              onClick={() => {
                setResult(null);
                setAnswers({});
                setCurrentIndex(0);
              }}
            >
              Coba lagi
            </Button>
          </div>
        ) : null}
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Kuis</h2>
        <span className="text-sm text-muted-foreground">
          Soal {currentIndex + 1} dari {total}
        </span>
      </div>

      <div
        className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuenow={answeredCount}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label="Kemajuan kuis"
      >
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${(answeredCount / total) * 100}%` }}
        />
      </div>

      <p className="mb-4 text-base font-medium">{current.question}</p>

      <fieldset className="flex flex-col gap-2">
        <legend className="sr-only">Pilihan jawaban</legend>
        {current.options.map((option, idx) => {
          const isSelected = selectedId === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => selectOption(option.id)}
              aria-pressed={isSelected}
              className={`flex items-start gap-3 rounded-xl border px-3 py-2.5 text-left text-sm transition focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none ${
                isSelected
                  ? "border-primary bg-primary/5 text-foreground"
                  : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-muted"
              }`}
            >
              <span
                className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border text-xs font-semibold"
                aria-hidden="true"
              >
                {OPTION_LABELS[idx] ?? idx + 1}
              </span>
              <span>{option.text}</span>
            </button>
          );
        })}
      </fieldset>

      {error ? (
        <p role="alert" className="mt-4 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <div className="mt-5 flex items-center justify-between">
        <Button variant="outline" onClick={goPrevious} disabled={currentIndex === 0}>
          Sebelumnya
        </Button>
        <Button onClick={goNext} disabled={!selectedId || submitting}>
          {submitting
            ? "Memeriksa…"
            : currentIndex === total - 1
              ? "Jawab"
              : "Berikutnya"}
        </Button>
      </div>
    </section>
  );
}