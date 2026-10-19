"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { SUBJECT_THEMES, SubjectIcon } from "@/components/ui/subject-theme";

interface SubjectSummary {
  name: string;
  slug: string;
  lessonCount: number;
}

export function SubjectShowcaseSection({ subjects }: { subjects: SubjectSummary[] }) {
  return (
    <section className="relative overflow-hidden border-b-2 border-stone-900/10 bg-[#FAF4E8] py-20 dark:border-stone-800 dark:bg-[#1E1711]">
      <div className="relative mx-auto w-full max-w-[1400px] px-3 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-2">
            <div className="inline-flex items-center gap-1.5 self-start rounded-full border border-amber-500/30 bg-amber-100/80 px-3 py-0.5 text-xs font-black uppercase tracking-wider text-amber-900 dark:bg-amber-950/60 dark:text-amber-300">
              <Sparkles className="h-3.5 w-3.5" />
              <span>BIDANG ILMU & IDENTITAS WARNA</span>
            </div>
            <h2 className="text-3xl font-black tracking-tight text-stone-900 sm:text-4xl dark:text-white">
              Karakter Sains di Setiap Mata Pelajaran
            </h2>
            <p className="max-w-xl text-sm font-medium text-stone-600 dark:text-stone-300">
              Setiap mata pelajaran memiliki tema warna dan karakter visual tersendiri, dirancang untuk memudahkan identifikasi kognitif saat belajar.
            </p>
          </div>

          <Link
            href="/explore"
            className="inline-flex items-center gap-1.5 self-start text-xs font-black text-amber-900 hover:underline dark:text-amber-300 sm:self-auto"
          >
            <span>Lihat Semua Katalog Materi</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* 5 Distinct Subject Theme Cards */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {subjects.map((sub, idx) => {
            const theme = SUBJECT_THEMES[sub.slug] ?? {
              name: sub.name,
              slug: sub.slug,
              tagline: "Eksplorasi Konsep Ilmiah",
              bgTint: "bg-white",
              cardBg: "bg-white",
              cardBorder: "border-stone-300",
              badgeBg: "bg-stone-100",
              badgeText: "text-stone-800",
              badgeBorder: "border-stone-300",
              iconBg: "bg-stone-200",
              iconColor: "text-stone-700",
              cardBorderHover: "hover:border-stone-500",
              shadowColor: "shadow-[3.5px_3.5px_0px_0px_rgba(24,24,27,0.85)]",
              accentBg: "bg-stone-800 text-white",
            };

            return (
              <motion.div
                key={sub.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className={`group relative flex flex-col justify-between rounded-3xl border-2 ${theme.cardBorder} ${theme.cardBg} p-6 transition-all duration-200 shadow-[3.5px_3.5px_0px_0px_rgba(24,24,27,0.85)] dark:shadow-[3.5px_3.5px_0px_0px_rgba(255,255,255,0.7)]`}
              >
                <div className="flex flex-col gap-4">
                  {/* Subject Icon Container with idle float */}
                  <div className="flex items-center justify-between">
                    <motion.div
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: idx * 0.3 }}
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl border-2 ${theme.badgeBorder} ${theme.iconBg} shadow-2xs`}
                    >
                      <SubjectIcon slug={sub.slug} size={30} />
                    </motion.div>

                    <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${theme.badgeBg} ${theme.badgeText} ${theme.badgeBorder}`}>
                      {sub.lessonCount} Materi
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-black tracking-tight text-stone-900 dark:text-white">
                      {theme.name}
                    </h3>
                    <p className="mt-1.5 text-xs font-medium leading-relaxed text-stone-600 dark:text-stone-300">
                      {theme.tagline}
                    </p>
                  </div>
                </div>

                <div className="mt-6 border-t border-stone-900/10 pt-4 dark:border-stone-700/50">
                  <Link
                    href={`/learn/umum/${sub.slug}`}
                    className={`inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl border-2 border-stone-900 py-2.5 text-center text-xs font-black shadow-[2px_2px_0px_0px_rgba(24,24,27,0.9)] transition-all ${theme.accentBg}`}
                  >
                    <span>Masuk {theme.name}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
