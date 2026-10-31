"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Brain } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { ModularCard } from "@/components/ui/modular-card";
import {
  COMPARISON_ITEMS,
  IMPACT_PILLARS,
  type MethodComparisonItem,
} from "@/data/home/active-learning.data";

export function ActiveLearningWhy() {
  const [activeTab, setActiveTab] = useState<"active" | "passive">("active");

  const activeItem =
    COMPARISON_ITEMS.find((item) => item.id === activeTab) ??
    COMPARISON_ITEMS[0];

  return (
    <section className="relative overflow-hidden border-y-2 border-stone-900/10 bg-[#EEF7F2] py-20 dark:border-stone-800 dark:bg-[#122018]">
      <div className="relative mx-auto w-full max-w-[1400px] px-3 sm:px-6 lg:px-8">
        {/* 1. Modular Section Header */}
        <SectionHeader
          align="center"
          badge="MENGAPA METODE KAMI BERBEDA"
          badgeIcon={Brain}
          badgeVariant="emerald"
          heading={
            <>
              Otak Manusia Mengingat{" "}
              <span className="text-emerald-700 dark:text-emerald-400">
                Apa yang Dilihat & Dicoba
              </span>
              , Bukan yang Dihafal.
            </>
          }
          text="Sains dan matematika sering terasa sulit bukan karena Anda tidak mampu, melainkan karena rumus-rumus tersebut diajarkan sebagai teks hitam-putih tanpa representasi visual yang hidup."
        />

        {/* 2. Interactive Comparison Tab Switcher */}
        <div className="mt-12 flex justify-center">
          <div
            role="tablist"
            aria-label="Pilihan metode belajar"
            className="relative inline-flex max-w-full overflow-hidden rounded-2xl border-2 border-stone-900/90 bg-white p-1.5 shadow-sm dark:border-stone-700 dark:bg-stone-900"
          >
            {/* Sliding background pill animation */}
            <motion.div
              initial={false}
              animate={{
                x: activeTab === "active" ? "0%" : "100%",
                backgroundColor: activeTab === "active" ? "#16a34a" : "#dc2626",
              }}
              transition={{
                type: "spring",
                stiffness: 380,
                damping: 26,
                mass: 0.75,
              }}
              className="absolute left-1.5 top-1.5 bottom-1.5 w-[calc(50%-6px)] rounded-xl border-2 border-stone-900 shadow-[2px_2px_0px_0px_rgba(24,24,27,0.9)] dark:border-white"
            />

            {/* Dynamic Buttons from COMPARISON_ITEMS */}
            {COMPARISON_ITEMS.map((item: MethodComparisonItem) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative z-10 cursor-pointer whitespace-nowrap rounded-xl px-4 py-2.5 text-xs font-black transition-colors duration-150 sm:px-5 ${
                    isActive
                      ? "text-white"
                      : "text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white"
                  }`}
                >
                  {item.tabLabel}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Dynamic Comparison Panel using ModularCard */}
        <div className="mx-auto mt-8 max-w-4xl">
          <motion.div
            key={activeItem.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <ModularCard
              id={activeItem.id}
              variant="default"
              layout="horizontal"
              subheading={
                <span className={`inline-flex items-center gap-1.5 font-mono text-xs font-black uppercase ${activeItem.subheadingColor}`}>
                  <activeItem.icon className="h-4 w-4 shrink-0" />
                  {activeItem.subheading}
                </span>
              }
              heading={activeItem.heading}
              text={activeItem.text}
              features={activeItem.features}
              checklistClassName={activeItem.checklistBg}
              className="p-6 sm:p-8"
              contentClassName="flex flex-col gap-3 max-w-xl"
              headingClassName="text-2xl font-black text-stone-900 dark:text-white"
              textClassName="text-sm font-medium leading-relaxed text-stone-600 dark:text-stone-300"
            />
          </motion.div>
        </div>

        {/* 4. Value Proof Badges (3 Pillars of Impact mapped over typed array) */}
        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {IMPACT_PILLARS.map((pillar) => (
            <ModularCard
              key={pillar.id}
              id={pillar.id}
              variant="default"
              icon={pillar.icon}
              iconBg={pillar.metricColor}
              metric={pillar.metric}
              metricColor={pillar.metricColor}
              heading={pillar.heading}
              text={pillar.text}
              className="p-6 sm:p-8"
              headingClassName="text-sm font-black"
              textClassName="text-xs font-medium"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
