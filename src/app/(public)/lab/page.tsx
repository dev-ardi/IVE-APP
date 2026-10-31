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
import { SectionHeader } from "@/components/ui/section-header";
import { ModularCard } from "@/components/ui/modular-card";

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
      <SectionHeader
        badge="LABORATORIUM INTERAKTIF • SANDBOX MODE BEBAS"
        badgeIcon={FlaskConical}
        badgeVariant="blue"
        heading="Lab Simulasi & Eksperimen Bebas"
        text="Ruang eksplorasi cepat untuk Anda yang ingin langsung mencoba simulasi visual dan menguji variabel tanpa harus membaca seluruh materi teori terlebih dahulu."
      />

      {/* Grid of Experiments with Modular Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {lessons.map((exp) => {
          const theme = getSubjectTheme(exp.subject.slug);
          const levelSlug = exp.educationLevel.slug || "umum";
          const topicSlug = exp.topic?.slug || "umum";
          const lessonUrl = `/learn/${levelSlug}/${exp.subject.slug}/${topicSlug}/${exp.slug}`;

          return (
            <ModularCard
              key={exp.id}
              id={exp.id}
              variant="default"
              icon={
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl border border-slate-900/10 transition-transform group-hover:scale-105 ${theme.bgTint} ${theme.badgeText}`}
                >
                  <SubjectIcon slug={exp.subject.slug} size={24} />
                </div>
              }
              badge={
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
              }
              heading={exp.title}
              text={exp.description}
              headingClassName="text-lg font-black transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400"
              textClassName="line-clamp-3 text-[13.5px]"
              footer={
                <div className="flex flex-col gap-2.5">
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
              }
            />
          );
        })}
      </div>
    </div>
  );
}
