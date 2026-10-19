"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, CheckCircle2 } from "lucide-react";
import { CmsInput, CmsTextarea, CmsSelect, CmsFormField } from "@/components/admin/ui/input";
import { CmsButton } from "@/components/admin/ui/button";
import { CmsPanel } from "@/components/admin/ui/panel";
import { Difficulty, ContentStatus } from "@prisma/client";

interface QuestionOption {
  id: string;
  text: string;
}

interface QuestionFormProps {
  initialData?: {
    id: string;
    question: string;
    options: QuestionOption[] | unknown;
    correctAnswer: string;
    explanation?: string | null;
    difficulty?: Difficulty;
    order?: number;
    status?: ContentStatus;
    topicId?: string | null;
    lessonId?: string | null;
  };
  topics: { id: string; name: string; subject: { name: string } }[];
  lessons: { id: string; title: string; topicId?: string | null }[];
  isEdit?: boolean;
}

export function QuestionForm({
  initialData,
  topics,
  lessons,
  isEdit = false,
}: QuestionFormProps) {
  const router = useRouter();

  const [question, setQuestion] = useState(initialData?.question || "");
  const [topicId, setTopicId] = useState(initialData?.topicId || topics[0]?.id || "");
  const [lessonId, setLessonId] = useState(initialData?.lessonId || "");
  const [difficulty, setDifficulty] = useState<Difficulty>(
    initialData?.difficulty || Difficulty.BEGINNER,
  );
  const [order, setOrder] = useState<number>(initialData?.order ?? 0);
  const [status, setStatus] = useState<ContentStatus>(
    initialData?.status || ContentStatus.PUBLISHED,
  );
  const [explanation, setExplanation] = useState(initialData?.explanation || "");

  const [options, setOptions] = useState<QuestionOption[]>(() => {
    if (Array.isArray(initialData?.options) && initialData.options.length >= 2) {
      return initialData.options as QuestionOption[];
    }
    return [
      { id: "opt_a", text: "" },
      { id: "opt_b", text: "" },
      { id: "opt_c", text: "" },
      { id: "opt_d", text: "" },
    ];
  });

  const [correctAnswer, setCorrectAnswer] = useState<string>(
    initialData?.correctAnswer || "opt_a",
  );

  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  // Filter lessons belonging to the selected topic
  const availableLessons = lessons.filter((l) => !topicId || l.topicId === topicId);

  const handleOptionChange = (idx: number, text: string) => {
    setOptions((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], text };
      return copy;
    });
  };

  const addOption = () => {
    const nextChar = String.fromCharCode(97 + options.length);
    setOptions((prev) => [...prev, { id: `opt_${nextChar}`, text: "" }]);
  };

  const removeOption = (idx: number) => {
    if (options.length <= 2) {
      alert("Minimal harus ada 2 opsi pilihan.");
      return;
    }
    const removedId = options[idx].id;
    const remaining = options.filter((_, i) => i !== idx);
    setOptions(remaining);
    if (correctAnswer === removedId) {
      setCorrectAnswer(remaining[0].id);
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!question.trim()) {
      setError("Pertanyaan soal wajib diisi.");
      return;
    }

    const emptyOpt = options.find((o) => !o.text.trim());
    if (emptyOpt) {
      setError("Semua opsi pilihan jawaban harus memiliki teks.");
      return;
    }

    if (!options.some((o) => o.id === correctAnswer)) {
      setError("Kunci jawaban benar harus dipilih dari opsi yang ada.");
      return;
    }

    setIsPending(true);
    try {
      const endpoint = isEdit
        ? `/api/admin/questions/${initialData?.id}`
        : "/api/admin/questions";
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: question.trim(),
          topicId: topicId || null,
          lessonId: lessonId || null,
          options,
          correctAnswer,
          explanation: explanation.trim() || null,
          difficulty,
          order: Number(order) || 0,
          status,
        }),
      });

      const body = await res.json().catch(() => null);
      if (!res.ok) {
        setError(body?.error?.message || "Gagal menyimpan soal.");
        setIsPending(false);
        return;
      }

      router.push("/admin/questions");
      router.refresh();
    } catch {
      setError("Terjadi kesalahan jaringan.");
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl flex flex-col gap-6">
      <CmsPanel title={isEdit ? "Edit Soal Pilihan Ganda" : "Buat Soal Pilihan Ganda Baru"}>
        {error && (
          <div className="mb-4 rounded-lg border-2 border-[#FF6B6B] bg-red-50 p-3 text-xs font-bold text-red-700 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CmsFormField label="Topik Pembelajaran" id="q-topic">
              <CmsSelect
                id="q-topic"
                value={topicId}
                onChange={(e) => {
                  setTopicId(e.target.value);
                  setLessonId("");
                }}
              >
                <option value="">-- Tanpa Topik Khusus --</option>
                {topics.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.subject.name} - {t.name}
                  </option>
                ))}
              </CmsSelect>
            </CmsFormField>

            <CmsFormField label="Materi Tertaut (opsional)" id="q-lesson">
              <CmsSelect
                id="q-lesson"
                value={lessonId}
                onChange={(e) => setLessonId(e.target.value)}
              >
                <option value="">-- Bank Soal Umum Topik --</option>
                {availableLessons.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.title}
                  </option>
                ))}
              </CmsSelect>
            </CmsFormField>
          </div>

          <CmsFormField label="Teks Pertanyaan" required id="q-text">
            <CmsTextarea
              id="q-text"
              rows={3}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Tuliskan pertanyaan soal latihan atau kuis di sini..."
            />
          </CmsFormField>

          {/* Options List with Radio for Correct Answer */}
          <div className="flex flex-col gap-3 rounded-xl border-2 border-[#1E2024] bg-muted/20 p-4 dark:border-[#F4F1EA]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
                Opsi Pilihan Jawaban (Pilih Lingkaran untuk Kunci Benar)
              </span>
              <button
                type="button"
                onClick={addOption}
                className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Tambah Opsi</span>
              </button>
            </div>

            <div className="flex flex-col gap-2.5">
              {options.map((opt, idx) => {
                const isCorrect = opt.id === correctAnswer;
                return (
                  <div
                    key={opt.id}
                    className={`flex items-center gap-2.5 rounded-lg border-2 p-2 transition-all ${
                      isCorrect
                        ? "border-[#7BE0A4] bg-[#7BE0A4]/20 shadow-[2px_2px_0px_0px_#1E2024] dark:border-[#7BE0A4]"
                        : "border-border bg-card"
                    }`}
                  >
                    <label className="flex items-center gap-1.5 cursor-pointer font-mono font-bold text-xs uppercase">
                      <input
                        type="radio"
                        name="correctAnswerRadio"
                        checked={isCorrect}
                        onChange={() => setCorrectAnswer(opt.id)}
                        className="h-4 w-4 accent-[#2F9E67] cursor-pointer"
                      />
                      <span>{String.fromCharCode(65 + idx)}.</span>
                    </label>

                    <CmsInput
                      value={opt.text}
                      onChange={(e) => handleOptionChange(idx, e.target.value)}
                      placeholder={`Teks pilihan ${String.fromCharCode(65 + idx)}...`}
                      className="flex-1"
                    />

                    {isCorrect && (
                      <span className="flex items-center gap-1 rounded bg-[#7BE0A4] px-1.5 py-0.5 text-[10px] font-mono font-black text-stone-900">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>BENAR</span>
                      </span>
                    )}

                    {options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(idx)}
                        className="rounded p-1 text-muted-foreground hover:text-red-500"
                        title="Hapus opsi"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Explanation */}
          <CmsFormField label="Pembahasan / Penjelasan Jawaban (Feedback yang Mendidik)" id="q-expl">
            <CmsTextarea
              id="q-expl"
              rows={3}
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Jelaskan mengapa jawaban tersebut benar dan langkah logis penyelesaiannya..."
            />
          </CmsFormField>

          {/* Difficulty, Order, Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <CmsFormField label="Tingkat Kesulitan" id="q-diff">
              <CmsSelect
                id="q-diff"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
              >
                <option value="BEGINNER">Pemula (BEGINNER)</option>
                <option value="INTERMEDIATE">Menengah (INTERMEDIATE)</option>
                <option value="ADVANCED">Lanjutan (ADVANCED)</option>
              </CmsSelect>
            </CmsFormField>

            <CmsFormField label="Urutan" id="q-order">
              <CmsInput
                id="q-order"
                type="number"
                min={0}
                value={order}
                onChange={(e) => setOrder(parseInt(e.target.value, 10) || 0)}
              />
            </CmsFormField>

            <CmsFormField label="Status" id="q-status">
              <CmsSelect
                id="q-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as ContentStatus)}
              >
                <option value="PUBLISHED">Dipublikasikan (PUBLISHED)</option>
                <option value="DRAFT">Draf (DRAFT)</option>
                <option value="ARCHIVED">Diarsipkan (ARCHIVED)</option>
              </CmsSelect>
            </CmsFormField>
          </div>
        </div>
      </CmsPanel>

      <div className="flex items-center justify-end gap-3">
        <CmsButton
          type="button"
          variant="secondary"
          onClick={() => router.push("/admin/questions")}
        >
          Batal
        </CmsButton>
        <CmsButton type="submit" variant="primary" isLoading={isPending}>
          {isEdit ? "Simpan Perubahan Soal" : "Simpan Soal ke Bank Soal"}
        </CmsButton>
      </div>
    </form>
  );
}
