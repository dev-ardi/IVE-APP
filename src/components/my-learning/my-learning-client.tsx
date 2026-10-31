"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Cloud, Heart, CheckCircle2, ArrowRight, BookOpen, GraduationCap } from "lucide-react";
import { Card } from "@/components/products/card";
import { DifficultyBadge } from "@/components/products/difficulty-badge";
import { SubjectIcon, getSubjectTheme } from "@/components/ui/subject-theme";
import { SectionHeader } from "@/components/ui/section-header";
import { ModularCard } from "@/components/ui/modular-card";
import type { SubjectSummary } from "@/modules/subjects/service";
import type { LessonSummary } from "@/modules/lessons/service";

interface MyLearningClientProps {
  subjects: SubjectSummary[];
  allLessons: LessonSummary[];
}

export function MyLearningClient({ subjects, allLessons }: MyLearningClientProps) {
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

  const favoriteLessons = allLessons.filter(
    (l) => favoriteIds.includes(l.id) || favoriteIds.includes(l.slug)
  );

  const completedLessons = allLessons.filter(
    (l) => completedIds.includes(l.id) || completedIds.includes(l.slug)
  );

  const stats = [
    {
      id: "completed",
      label: "Materi Selesai",
      count: completedLessons.length,
      icon: CheckCircle2,
      color: "text-emerald-600 dark:text-emerald-400",
    },
    {
      id: "favorites",
      label: "Materi Favorit",
      count: favoriteLessons.length,
      icon: Heart,
      color: "text-rose-600 dark:text-rose-400",
    },
    {
      id: "total",
      label: "Total Katalog",
      count: allLessons.length,
      icon: BookOpen,
      color: "text-blue-600 dark:text-blue-400",
    },
  ];

  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-10 px-3 py-10 sm:px-6 sm:py-14">
      {/* Header */}
      <div className="flex flex-col gap-6">
        <SectionHeader
          badge="AREA BELAJAR PRIBADI"
          badgeIcon={GraduationCap}
          badgeVariant="blue"
          heading="Pembelajaran Saya"
          text="Pantau materi yang telah Anda selesaikan dan akses materi favorit yang disimpan untuk dipelajari kembali kapan saja."
        />

        {/* Guest Sync Banner with Soft Neobrutalism border */}
        <div className="flex flex-col justify-between gap-4 rounded-2xl border-2 border-slate-900/15 bg-blue-50/70 p-5 shadow-[2px_2px_0px_0px_rgba(15,23,42,0.8)] dark:border-blue-900/60 dark:bg-blue-950/40 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-200 bg-white text-blue-700 dark:border-blue-800 dark:bg-blue-900 dark:text-blue-200">
              <Cloud className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                Progres Disimpan di Perangkat Ini (LocalStorage)
              </span>
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                Masuk ke akun untuk menyinkronkan progres materi dan riwayat kuis Anda di semua perangkat secara permanen.
              </span>
            </div>
          </div>
          <Link
            href="/login"
            className="inline-flex cursor-pointer items-center justify-center gap-1.5 self-start rounded-xl border-2 border-slate-900 bg-blue-600 px-5 py-2.5 text-xs font-black text-white shadow-[2px_2px_0px_0px_rgba(15,23,42,0.9)] hover:bg-blue-700 sm:self-auto"
          >
            <span>Masuk & Sinkronkan</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Progress Counters mapped via ModularCard */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {stats.map((s, idx) => (
          <ModularCard
            key={s.id}
            id={s.id}
            variant="default"
            className={idx === 2 ? "col-span-2 sm:col-span-1 p-5" : "p-5"}
            icon={<s.icon className={`h-4 w-4 ${s.color}`} />}
            subheading={s.label}
            metric={s.count}
            metricColor={s.color}
          />
        ))}
      </div>

      {/* Section: Favorit */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-rose-600 fill-rose-600" />
            <h2 className="text-lg font-black text-slate-900 dark:text-white">Materi Favorit Tersimpan</h2>
          </div>
          {favoriteLessons.length > 0 && (
            <span className="text-xs font-bold text-slate-500">{favoriteLessons.length} materi</span>
          )}
        </div>

        {favoriteLessons.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/50 p-8 text-center text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-400">
            <p>Belum ada materi yang Anda simpan sebagai favorit.</p>
            <p className="mt-1">
              Klik tombol simpan favorit pada halaman materi saat belajar untuk melihatnya di sini.
            </p>
            <Link
              href="/explore"
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl border-2 border-slate-900 bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-[2px_2px_0px_0px_rgba(15,23,42,0.9)] hover:bg-blue-700"
            >
              <span>Jelajahi Katalog Materi</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {favoriteLessons.map((lesson) => {
              const subj = subjects.find((s) => s.slug === lesson.subjectSlug);
              const theme = getSubjectTheme(lesson.subjectSlug || "");
              const levelSlug = lesson.levelSlug || "umum";
              const topicSlug = lesson.topicSlug || "umum";

              return (
                <Card
                  key={lesson.slug}
                  href={`/learn/${levelSlug}/${lesson.subjectSlug}/${topicSlug}/${lesson.slug}`}
                  icon={<SubjectIcon slug={lesson.subjectSlug || "fisika"} size={22} />}
                  badge={<DifficultyBadge difficulty={lesson.difficulty} />}
                  title={lesson.title}
                  description={lesson.description}
                  footer={
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                      <span className={`rounded-md border px-2 py-0.5 ${theme.badgeBg} ${theme.badgeText} ${theme.badgeBorder}`}>
                        {subj?.name ?? lesson.subjectSlug}
                      </span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">Lanjutkan Belajar →</span>
                    </div>
                  }
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Section: Selesai Dipelajari */}
      <div className="flex flex-col gap-4 border-t border-slate-200 pt-6 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <h2 className="text-lg font-black text-slate-900 dark:text-white">Materi yang Sudah Diselesaikan</h2>
          </div>
          {completedLessons.length > 0 && (
            <span className="text-xs font-bold text-slate-500">{completedLessons.length} materi</span>
          )}
        </div>

        {completedLessons.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/50 p-8 text-center text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-400">
            <p>Anda belum menandai materi sebagai selesai.</p>
            <p className="mt-1">
              Selesaikan eksplorasi simulasi dan kerjakan kuis latihan untuk menandai pemahaman Anda.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {completedLessons.map((lesson) => {
              const subj = subjects.find((s) => s.slug === lesson.subjectSlug);
              const theme = getSubjectTheme(lesson.subjectSlug || "");
              const levelSlug = lesson.levelSlug || "umum";
              const topicSlug = lesson.topicSlug || "umum";

              return (
                <Card
                  key={lesson.slug}
                  href={`/learn/${levelSlug}/${lesson.subjectSlug}/${topicSlug}/${lesson.slug}`}
                  icon={<SubjectIcon slug={lesson.subjectSlug || "fisika"} size={22} />}
                  badge={
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                      <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                      Selesai
                    </span>
                  }
                  title={lesson.title}
                  description={lesson.description}
                  footer={
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                      <span className={`rounded-md border px-2 py-0.5 ${theme.badgeBg} ${theme.badgeText} ${theme.badgeBorder}`}>
                        {subj?.name ?? lesson.subjectSlug}
                      </span>
                      <span className="font-bold text-blue-600 hover:underline dark:text-blue-400">
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
