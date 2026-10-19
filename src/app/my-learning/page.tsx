"use client";

import { useState } from "react";
import Link from "next/link";
import { DUMMY_DATA } from "@/data/dummy-data";
import { Card } from "@/components/products/card";
import { DifficultyBadge } from "@/components/products/difficulty-badge";

export default function MyLearningPage() {
  const [favoriteIds] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem("ive_favorites") || "[]");
    } catch {
      return [];
    }
  });

  const [completedIds] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem("ive_completed") || "[]");
    } catch {
      return [];
    }
  });

  const allLessons = DUMMY_DATA.lessons;
  const subjects = DUMMY_DATA.subjects;

  const favoriteLessons = allLessons.filter(
    (l) => favoriteIds.includes(l.id) || favoriteIds.includes(l.slug)
  );

  const completedLessons = allLessons.filter(
    (l) => completedIds.includes(l.id) || completedIds.includes(l.slug)
  );

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-10 sm:px-6 sm:py-14">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <span className="text-xs font-bold uppercase tracking-wider text-primary">
          Area Belajar Pribadi
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Pembelajaran Saya
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground leading-relaxed">
          Pantau materi yang telah Anda selesaikan dan akses materi favorit yang disimpan untuk dipelajari kembali kapan saja.
        </p>

        {/* Guest Sync Banner */}
        <div className="mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-primary/20 bg-primary/5 p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-xl text-primary">
              ☁️
            </span>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-foreground">
                Progres Disimpan di Perangkat Ini
              </span>
              <span className="text-xs text-muted-foreground">
                Masuk ke akun untuk menyinkronkan progres dan riwayat kuis Anda di semua perangkat.
              </span>
            </div>
          </div>
          <Link
            href="/login"
            className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 text-center whitespace-nowrap self-start sm:self-auto"
          >
            Masuk / Sinkronkan
          </Link>
        </div>
      </div>

      {/* Progress Counters */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5">
          <span className="text-xs font-medium text-muted-foreground">Materi Selesai</span>
          <p className="mt-2 text-3xl font-extrabold text-foreground">
            {completedLessons.length}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <span className="text-xs font-medium text-muted-foreground">Materi Favorit</span>
          <p className="mt-2 text-3xl font-extrabold text-rose-500">
            {favoriteLessons.length}
          </p>
        </div>
        <div className="col-span-2 sm:col-span-1 rounded-2xl border border-border bg-card p-5">
          <span className="text-xs font-medium text-muted-foreground">Total Katalog</span>
          <p className="mt-2 text-3xl font-extrabold text-primary">
            {allLessons.length}
          </p>
        </div>
      </div>

      {/* Section: Favorit */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base">❤️</span>
            <h2 className="text-lg font-bold text-foreground">Materi Favorit Tersimpan</h2>
          </div>
          {favoriteLessons.length > 0 && (
            <span className="text-xs text-muted-foreground">{favoriteLessons.length} materi</span>
          )}
        </div>

        {favoriteLessons.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/60 p-8 text-center text-xs text-muted-foreground">
            <p>Belum ada materi yang Anda simpan sebagai favorit.</p>
            <p className="mt-1">
              Klik ikon hati pada halaman materi saat belajar untuk menyimpannya di sini.
            </p>
            <Link
              href="/explore"
              className="mt-4 inline-block rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
            >
              Jelajahi Materi Sekarang →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {favoriteLessons.map((lesson) => {
              const subj = subjects.find((s) => s.slug === lesson.subjectSlug);
              return (
                <Card
                  key={lesson.slug}
                  href={`/learn/${lesson.levelSlug}/${lesson.subjectSlug}/${lesson.topicSlug}/${lesson.slug}`}
                  icon={subj?.icon ?? "📖"}
                  badge={<DifficultyBadge difficulty={lesson.difficulty} />}
                  title={lesson.title}
                  description={lesson.description}
                  footer={
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{subj?.name ?? lesson.subjectSlug}</span>
                      <span className="font-semibold text-primary">Lanjutkan Belajar →</span>
                    </div>
                  }
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Section: Selesai Dipelajari */}
      <div className="flex flex-col gap-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base">✅</span>
            <h2 className="text-lg font-bold text-foreground">Materi yang Sudah Diselesaikan</h2>
          </div>
          {completedLessons.length > 0 && (
            <span className="text-xs text-muted-foreground">{completedLessons.length} materi</span>
          )}
        </div>

        {completedLessons.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/60 p-8 text-center text-xs text-muted-foreground">
            <p>Anda belum menandai materi sebagai selesai.</p>
            <p className="mt-1">
              Selesaikan membaca materi dan coba kuis latihan untuk menandai pencapaian belajar Anda.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {completedLessons.map((lesson) => {
              const subj = subjects.find((s) => s.slug === lesson.subjectSlug);
              return (
                <Card
                  key={lesson.slug}
                  href={`/learn/${lesson.levelSlug}/${lesson.subjectSlug}/${lesson.topicSlug}/${lesson.slug}`}
                  icon={subj?.icon ?? "📖"}
                  badge={
                    <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
                      ✓ Selesai
                    </span>
                  }
                  title={lesson.title}
                  description={lesson.description}
                  footer={
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{subj?.name ?? lesson.subjectSlug}</span>
                      <span className="text-xs text-primary font-medium hover:underline">
                        Pelajari Ulang →
                      </span>
                    </div>
                  }
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
