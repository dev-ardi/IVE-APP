"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { RenderFormula } from "@/modules/content/render-formula";
import { SectionHeader } from "@/components/ui/section-header";
import {
  SUBJECT_SHOWCASE_ITEMS,
  type SubjectShowcaseItem,
} from "@/data/home/subject-showcase.data";

interface SubjectSummary {
  name: string;
  slug: string;
  lessonCount: number;
}

export function SubjectShowcaseSection({
  subjects,
}: {
  subjects: SubjectSummary[];
}) {
  return (
    <section className="relative overflow-hidden border-b-2 border-stone-900/10 bg-[#FAF4E8] py-20 dark:border-stone-800 dark:bg-[#1E1711] sm:py-24">
      {/* Subtle ambient light */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 top-1/3 h-96 w-96 rounded-full bg-amber-300/20 blur-3xl dark:bg-amber-900/10"
      />

      <div className="relative mx-auto w-full max-w-[1400px] px-3 sm:px-6 lg:px-8">
        {/* Section Header */}
        <SectionHeader
          align="between"
          heading="Identitas Visual & Keilmuan Tiap Subjek"
          text="Setiap disiplin ilmu memiliki spektrum warna kognitif dan modul interaktif yang disesuaikan dengan cara konsep tersebut dipahami."
          action={
            <Link
              href="/explore"
              className="inline-flex items-center gap-1.5 self-start text-xs font-black text-amber-900 hover:underline dark:text-amber-300 sm:self-auto"
            >
              <span>Buka Seluruh Kurikulum</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />

        {/* Asymmetric Bento Showcase Grid (Mapped dynamically over SUBJECT_SHOWCASE_ITEMS) */}
        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {SUBJECT_SHOWCASE_ITEMS.map((item: SubjectShowcaseItem, idx: number) => {
            const subject = subjects.find((s) => s.slug === item.subjectSlug);
            const lessonCount = subject?.lessonCount ?? 1;
            const Icon = item.icon;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                whileHover={{ y: -4 }}
                className={cn(
                  "group relative flex flex-col justify-between overflow-hidden rounded-3xl border-2 border-stone-900 p-6 sm:p-7 shadow-[4px_4px_0px_0px_rgba(24,24,27,0.9)] dark:border-white dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.7)]",
                  item.bgLight,
                  item.bgDark,
                  item.colSpan
                )}
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl border-2 shadow-2xs",
                          item.iconBorder,
                          item.iconBg,
                          item.iconColor
                        )}
                      >
                        <Icon className="h-6 w-6 sm:h-8 sm:w-8" />
                      </div>

                      <div>
                        <span
                          className={cn(
                            "rounded-full border px-2.5 py-0.5 text-[10px] sm:text-[11px] font-black uppercase tracking-wider",
                            item.badgeBg
                          )}
                        >
                          {item.category}
                        </span>
                        <h3 className="text-xl sm:text-2xl font-black tracking-tight text-stone-900 dark:text-white">
                          {item.heading}
                        </h3>
                      </div>
                    </div>

                    <span className="rounded-full border border-stone-300 bg-white/80 px-2.5 py-1 font-mono text-[11px] font-bold text-stone-900 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200">
                      {lessonCount} Materi
                    </span>
                  </div>

                  <p className="max-w-xl text-xs sm:text-sm font-medium leading-relaxed text-stone-700 dark:text-stone-300">
                    {item.text}
                  </p>

                  {/* Conditional Formula / Preview Ribbon */}
                  {(item.formula || item.previewTag || item.metaTags) && (
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      {item.formula && (
                        <span className="rounded-xl border border-stone-300 bg-white/90 px-3 py-1 font-mono text-xs font-bold text-stone-900 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-200">
                          <RenderFormula formula={item.formula} />
                        </span>
                      )}
                      {item.previewTag && (
                        <span className="inline-flex items-center gap-1 rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          <Activity className="h-3.5 w-3.5" />
                          {item.previewTag}
                        </span>
                      )}
                      {item.metaTags?.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-lg border border-emerald-300 bg-white/90 px-2.5 py-1 text-xs font-bold text-emerald-900 dark:border-emerald-700 dark:bg-stone-900 dark:text-emerald-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer / CTA Row */}
                <div className="mt-6 flex flex-col gap-3 border-t border-stone-900/10 pt-4 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
                  {item.focusText && (
                    <span className="text-xs font-bold text-stone-600 dark:text-stone-400">
                      {item.focusText}
                    </span>
                  )}
                  <Link
                    href={`/learn/umum/${item.subjectSlug}`}
                    className={cn(
                      "inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-stone-900 px-5 py-2.5 text-xs font-black text-white shadow-[2px_2px_0px_0px_rgba(24,24,27,0.9)] transition-all hover:-translate-y-0.5 active:translate-y-0.5 dark:border-white",
                      item.ctaBg,
                      !item.focusText && "w-full"
                    )}
                  >
                    <span>{item.ctaText}</span>
                    <ArrowRight className="h-4 w-4" />
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
