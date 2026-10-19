"use client";

import { useState, useMemo } from "react";
import { DUMMY_DATA } from "@/data/dummy-data";
import { Card } from "@/components/products/card";
import { DifficultyBadge } from "@/components/products/difficulty-badge";

export default function ExplorePage() {
  const [search, setSearch] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");

  const subjects = DUMMY_DATA.subjects;
  const allLessons = DUMMY_DATA.lessons;

  const filteredLessons = useMemo(() => {
    return allLessons.filter((lesson) => {
      const matchSubject =
        selectedSubject === "all" || lesson.subjectSlug === selectedSubject;
      const matchDiff =
        selectedDifficulty === "all" || lesson.difficulty === selectedDifficulty;
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        lesson.title.toLowerCase().includes(q) ||
        lesson.description.toLowerCase().includes(q) ||
        lesson.keywords.some((k) => k.toLowerCase().includes(q));
      return matchSubject && matchDiff && matchSearch;
    });
  }, [allLessons, selectedSubject, selectedDifficulty, search]);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 sm:py-14">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
          <span>Katalog Materi Belajar</span>
          <span>•</span>
          <span>Jenjang Umum</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Jelajahi Eksperimen & Konsep Sains
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground leading-relaxed">
          Temukan topik fisika, kimia, biologi, matematika, hingga pengetahuan umum mutakhir. Semua materi dilengkapi komponen interaktif dan penjelasan mandiri.
        </p>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-xs">
        {/* Search input */}
        <div className="relative">
          <span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari konsep (contoh: parabola, suhu, krebs, nuklir, sinus)..."
            className="w-full rounded-xl border border-border bg-background pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute inset-y-0 right-3 flex items-center text-xs text-muted-foreground hover:text-foreground"
            >
              Hapus
            </button>
          )}
        </div>

        {/* Subject pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-border/60">
          <span className="text-xs font-semibold text-muted-foreground mr-1">Mata Pelajaran:</span>
          <button
            type="button"
            onClick={() => setSelectedSubject("all")}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              selectedSubject === "all"
                ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                : "border border-border bg-background text-foreground/80 hover:bg-muted"
            }`}
          >
            Semua ({allLessons.length})
          </button>
          {subjects.map((sub) => {
            const count = allLessons.filter((l) => l.subjectSlug === sub.slug).length;
            return (
              <button
                key={sub.slug}
                type="button"
                onClick={() => setSelectedSubject(sub.slug)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  selectedSubject === sub.slug
                    ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                    : "border border-border bg-background text-foreground/80 hover:bg-muted"
                }`}
              >
                <span>{sub.icon}</span>
                <span>{sub.name}</span>
                <span className="opacity-70 text-[10px]">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Difficulty pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground mr-1">Tingkat Kesulitan:</span>
          {[
            { id: "all", label: "Semua Tingkat" },
            { id: "BEGINNER", label: "Pemula" },
            { id: "INTERMEDIATE", label: "Menengah" },
            { id: "ADVANCED", label: "Lanjutan" },
          ].map((diff) => (
            <button
              key={diff.id}
              type="button"
              onClick={() => setSelectedDifficulty(diff.id)}
              className={`rounded-lg px-2.5 py-1 text-xs transition ${
                selectedDifficulty === diff.id
                  ? "border border-primary bg-primary/10 font-semibold text-primary"
                  : "border border-border/80 bg-background text-muted-foreground hover:bg-muted"
              }`}
            >
              {diff.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Menampilkan <strong>{filteredLessons.length}</strong> materi</span>
        {(selectedSubject !== "all" || selectedDifficulty !== "all" || search) && (
          <button
            type="button"
            onClick={() => {
              setSelectedSubject("all");
              setSelectedDifficulty("all");
              setSearch("");
            }}
            className="text-primary hover:underline font-medium"
          >
            Reset Semua Filter
          </button>
        )}
      </div>

      {/* Results Grid */}
      {filteredLessons.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 p-12 text-center">
          <span className="text-4xl">🔍</span>
          <h3 className="mt-4 text-base font-bold text-foreground">Tidak ada materi yang cocok</h3>
          <p className="mt-1 text-xs text-muted-foreground max-w-sm">
            Coba ubah kata kunci pencarian Anda atau pilih filter mata pelajaran yang lain.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedSubject("all");
              setSelectedDifficulty("all");
              setSearch("");
            }}
            className="mt-4 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90"
          >
            Tampilkan Semua Materi
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredLessons.map((lesson) => {
            const subj = subjects.find((s) => s.slug === lesson.subjectSlug);
            return (
              <Card
                key={lesson.slug}
                href={`/learn/${lesson.levelSlug}/${lesson.subjectSlug}/${lesson.topicSlug}/${lesson.slug}`}
                icon={subj?.icon ?? "📖"}
                badge={
                  <div className="flex items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Interaktif
                    </span>
                    <DifficultyBadge difficulty={lesson.difficulty} />
                  </div>
                }
                title={lesson.title}
                description={lesson.description}
                footer={
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-medium text-foreground/80">
                      {subj?.name ?? lesson.subjectSlug}
                    </span>
                    <span>⏱️ {lesson.durationMinutes} menit</span>
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
