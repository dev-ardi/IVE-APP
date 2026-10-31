"use client";

import React, { useState, useMemo } from "react";
import { Search, RotateCcw, Compass } from "lucide-react";
import { Card } from "@/components/products/card";
import { DifficultyBadge } from "@/components/products/difficulty-badge";
import { SubjectIcon, getSubjectTheme } from "@/components/ui/subject-theme";
import { SectionHeader } from "@/components/ui/section-header";
import type { SubjectSummary } from "@/modules/subjects/service";
import type { LessonSummary } from "@/modules/lessons/service";

const DIFFICULTY_OPTIONS = [
  { id: "all", label: "Semua Tingkat" },
  { id: "BEGINNER", label: "Pemula" },
  { id: "INTERMEDIATE", label: "Menengah" },
  { id: "ADVANCED", label: "Lanjutan" },
];

interface ExploreClientProps {
  initialSubjects: SubjectSummary[];
  initialLessons: LessonSummary[];
}

export function ExploreClient({ initialSubjects, initialLessons }: ExploreClientProps) {
  const [search, setSearch] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");

  const filteredLessons = useMemo(() => {
    return initialLessons.filter((lesson) => {
      const matchSubject =
        selectedSubject === "all" || lesson.subjectSlug === selectedSubject;
      const matchDiff =
        selectedDifficulty === "all" || lesson.difficulty === selectedDifficulty;
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        lesson.title.toLowerCase().includes(q) ||
        (lesson.description && lesson.description.toLowerCase().includes(q)) ||
        (lesson.keywords && lesson.keywords.some((k) => k.toLowerCase().includes(q)));
      return matchSubject && matchDiff && matchSearch;
    });
  }, [initialLessons, selectedSubject, selectedDifficulty, search]);

  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-8 px-3 py-10 sm:px-6 sm:py-14">
      {/* Page Header */}
      <SectionHeader
        badge="KATALOG MATERI BELAJAR • JENJANG UMUM"
        badgeIcon={Compass}
        badgeVariant="blue"
        heading="Jelajahi Eksperimen & Konsep Sains"
        text="Temukan topik fisika, kimia, biologi, matematika, hingga sains umum mutakhir. Semua materi dilengkapi komponen simulasi interaktif dan penjelasan mandiri."
      />

      {/* Search & Filter Toolbar with Neobrutalist design */}
      <div className="flex flex-col gap-5 rounded-2xl border-2 border-slate-900/10 bg-white p-5 shadow-[3px_3px_0px_0px_rgba(15,23,42,0.9)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.7)]">
        {/* Search input */}
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-slate-500 dark:text-slate-400">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari konsep (contoh: parabola, suhu, krebs, nuklir, trigonometri)..."
            className="w-full rounded-xl border-2 border-slate-300 bg-slate-50 py-3 pr-4 pl-10 text-sm font-semibold text-slate-900 placeholder:text-slate-500 focus:border-slate-900 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-400 dark:focus:border-slate-200"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute inset-y-0 right-3.5 flex cursor-pointer items-center text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white"
            >
              Hapus
            </button>
          )}
        </div>

        {/* Subject pills */}
        <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
          <span className="mr-1 text-xs font-black text-slate-700 dark:text-slate-300">Mata Pelajaran:</span>
          <button
            type="button"
            onClick={() => setSelectedSubject("all")}
            className={`cursor-pointer rounded-xl border-2 px-3.5 py-1.5 text-xs font-bold transition-all ${
              selectedSubject === "all"
                ? "border-slate-900 bg-blue-600 text-white shadow-[2px_2px_0px_0px_rgba(15,23,42,0.9)] dark:border-white"
                : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-400 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            }`}
          >
            Semua ({initialLessons.length})
          </button>
          {initialSubjects.map((sub) => {
            const count = initialLessons.filter((l) => l.subjectSlug === sub.slug).length;
            const isSelected = selectedSubject === sub.slug;

            return (
              <button
                key={sub.slug}
                type="button"
                onClick={() => setSelectedSubject(sub.slug)}
                className={`flex cursor-pointer items-center gap-1.5 rounded-xl border-2 px-3 py-1.5 text-xs font-bold transition-all ${
                  isSelected
                    ? "border-slate-900 bg-slate-900 text-white shadow-[2px_2px_0px_0px_rgba(15,23,42,0.9)] dark:border-white dark:bg-white dark:text-slate-900"
                    : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-400 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                }`}
              >
                <SubjectIcon slug={sub.slug} size={15} />
                <span>{sub.name}</span>
                <span className="text-[11px] opacity-75">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Difficulty pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-black text-slate-700 dark:text-slate-300">Tingkat Kesulitan:</span>
          {DIFFICULTY_OPTIONS.map((diff) => (
            <button
              key={diff.id}
              type="button"
              onClick={() => setSelectedDifficulty(diff.id)}
              className={`cursor-pointer rounded-lg border px-3 py-1 text-xs font-bold transition ${
                selectedDifficulty === diff.id
                  ? "border-blue-600 bg-blue-50 text-blue-800 dark:border-blue-400 dark:bg-blue-950/60 dark:text-blue-200"
                  : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              {diff.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
        <span>
          Menampilkan <strong className="text-slate-900 dark:text-white">{filteredLessons.length}</strong> materi pembelajaran
        </span>
        {(selectedSubject !== "all" || selectedDifficulty !== "all" || search) && (
          <button
            type="button"
            onClick={() => {
              setSelectedSubject("all");
              setSelectedDifficulty("all");
              setSearch("");
            }}
            className="flex cursor-pointer items-center gap-1 font-bold text-blue-600 hover:underline dark:text-blue-400"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Semua Filter</span>
          </button>
        )}
      </div>

      {/* Results Grid */}
      {filteredLessons.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/50 p-12 text-center dark:border-slate-700 dark:bg-slate-900/50">
          <Search className="h-10 w-10 text-slate-400" />
          <h3 className="mt-4 text-base font-extrabold text-slate-900 dark:text-white">Tidak ada materi yang cocok</h3>
          <p className="mt-1 max-w-sm text-xs font-medium text-slate-600 dark:text-slate-400">
            Coba ubah kata kunci pencarian Anda atau pilih filter mata pelajaran yang lain.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedSubject("all");
              setSelectedDifficulty("all");
              setSearch("");
            }}
            className="mt-4 cursor-pointer rounded-xl border-2 border-slate-900 bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-[2px_2px_0px_0px_rgba(15,23,42,0.9)] hover:bg-blue-700"
          >
            Tampilkan Semua Materi
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredLessons.map((lesson) => {
            const subj = initialSubjects.find((s) => s.slug === lesson.subjectSlug);
            const subjectSlug = lesson.subjectSlug ?? "umum";
            const theme = getSubjectTheme(subjectSlug);
            const levelSlug = lesson.levelSlug || "umum";
            const topicSlug = lesson.topicSlug || "umum";

            return (
              <Card
                key={lesson.slug}
                href={`/learn/${levelSlug}/${lesson.subjectSlug}/${topicSlug}/${lesson.slug}`}
                icon={<SubjectIcon slug={subjectSlug} size={22} />}
                badge={
                  <div className="flex items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Interaktif
                    </span>
                    <DifficultyBadge difficulty={lesson.difficulty} />
                  </div>
                }
                title={lesson.title}
                description={lesson.description}
                footer={
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                    <span className={`rounded-md border px-2 py-0.5 ${theme.badgeBg} ${theme.badgeText} ${theme.badgeBorder}`}>
                      {subj?.name ?? lesson.subjectSlug}
                    </span>
                    <span>⏱️ {lesson.durationMinutes || 10} menit</span>
                  </div>
                }
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
