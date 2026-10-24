import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import {
  FlaskConical,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { prisma } from "@/lib/db";
import { getSubjectTheme, SubjectIcon } from "@/components/ui/subject-theme";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Lab Simulasi Sains & Interaktif",
  description:
    "Eksplorasi simulasi sains, fisika, kimia, matematika, dan biologi langsung di laboratorium visual IVE-APP.",
};

export default async function LabPage() {
  // Query experiments and interactive lessons directly from PostgreSQL
  const lessons = await prisma.lesson.findMany({
    where: {
      status: "PUBLISHED",
      educationLevel: { isActive: true },
      OR: [
        { kind: "EXPERIMENT" },
        { slug: { in: ["gerak-parabola", "gravitasi-newton", "konversi-suhu", "trigonometri", "fisi-nuklir", "siklus-krebs", "struktur-atom-dan-tabel-periodik"] } },
      ],
    },
    include: {
      subject: true,
      topic: true,
      educationLevel: true,
    },
    orderBy: [{ kind: "asc" }, { order: "asc" }],
  });

  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-10 px-3 py-10 sm:px-6 sm:py-14">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-blue-700 dark:text-blue-400">
          <FlaskConical className="h-4 w-4" />
          <span>Laboratorium Interaktif</span>
          <span>•</span>
          <span>Sandbox Mode Bebas</span>
        </div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          Lab Simulasi & Eksperimen Bebas
        </h1>
        <p className="max-w-2xl text-base font-medium leading-relaxed text-slate-600 dark:text-slate-300">
          Ruang eksplorasi cepat untuk Anda yang ingin langsung mencoba simulasi visual dan menguji variabel tanpa harus membaca seluruh materi teori terlebih dahulu.
        </p>
      </div>

      {/* Grid of Experiments with Soft Neobrutalism Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {lessons.map((exp) => {
          const theme = getSubjectTheme(exp.subject.slug);
          const levelSlug = exp.educationLevel.slug || "umum";
          const topicSlug = exp.topic?.slug || "umum";
          const lessonUrl = `/learn/${levelSlug}/${exp.subject.slug}/${topicSlug}/${exp.slug}`;

          return (
            <div
              key={exp.id}
              className="group flex flex-col justify-between rounded-2xl border-2 border-slate-900/10 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-slate-900 hover:shadow-[3px_3px_0px_0px_rgba(15,23,42,0.9)] dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-200 dark:hover:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.7)]"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl border border-slate-900/10 transition-transform group-hover:scale-105 ${theme.bgTint} ${theme.badgeText}`}
                  >
                    <SubjectIcon slug={exp.subject.slug} size={24} />
                  </div>
                  <div className="flex items-center gap-1.5">
                    {exp.kind === "EXPERIMENT" && (
                      <span className="rounded-full border border-sky-300 bg-sky-50 px-2.5 py-0.5 text-[11px] font-black text-sky-800 dark:border-sky-800 dark:bg-sky-950/60 dark:text-sky-300">
                        Lab Eksperimen
                      </span>
                    )}
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${theme.badgeBorder} ${theme.badgeBg} ${theme.badgeText}`}
                    >
                      {exp.subject.name}
                    </span>
                  </div>
                </div>

                <h2 className="text-lg font-black tracking-tight text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                  {exp.title}
                </h2>

                <p className="text-[13.5px] font-medium leading-relaxed text-slate-600 dark:text-slate-300 line-clamp-3">
                  {exp.description}
                </p>
              </div>

              <div className="mt-6 flex flex-col gap-2.5 border-t border-slate-100 pt-4 dark:border-slate-800">
                <Link
                  href={`/lab/${exp.slug}`}
                  className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-slate-900 bg-blue-600 py-3 text-center text-xs font-black text-white shadow-[2px_2px_0px_0px_rgba(15,23,42,0.9)] transition-all hover:bg-blue-700 active:translate-y-0.5"
                >
                  <span>Buka Simulasi Penuh</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href={lessonUrl}
                  className="inline-flex w-full items-center justify-center gap-1.5 py-1 text-center text-xs font-bold text-slate-600 hover:text-slate-950 hover:underline dark:text-slate-400 dark:hover:text-white"
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>Baca Materi Teori Lengkap</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
