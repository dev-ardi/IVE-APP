"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProjectileSimulator from "@/components/interactive/projectile-simulator";
import TemperatureConverter from "@/components/interactive/temperature-converter";
import TrigonometryVisualizer from "@/components/interactive/trigonometry-visualizer";
import NuclearFission from "@/components/interactive/nuclear-fission";
import { HERO_LAB_TABS, type HeroLabTabItem } from "@/data/home/hero-lab-tabs.data";

export function HeroShowcase() {
  const [activeTab, setActiveTab] = useState("parabola");

  const currentTab = HERO_LAB_TABS.find((t) => t.id === activeTab) ?? HERO_LAB_TABS[0];
  const CurrentIcon = currentTab.icon;

  return (
    <div className="flex flex-col rounded-3xl border-2 border-slate-900 bg-white p-5 shadow-[4px_4px_0px_0px_rgba(15,23,42,0.9)] dark:border-slate-100 dark:bg-slate-900 dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.7)] sm:p-7">
      {/* Tab Switchers */}
      <div className="flex flex-col gap-4 border-b-2 border-slate-100 py-1 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 overflow-x-auto py-2 pr-1 sm:py-1 sm:pr-1" role="tablist" aria-label="Pilihan laboratorium interaktif">
          {HERO_LAB_TABS.map((tab: HeroLabTabItem) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.id)}
                className={`flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-xl border-2 px-3.5 py-2 text-xs font-bold transition-all ${
                  isActive
                    ? `${tab.buttonActive} border-slate-900 dark:border-white`
                    : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-400 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{tab.title}</span>
              </button>
            );
          })}
        </div>

        <Link
          href={currentTab.url}
          className="inline-flex cursor-pointer items-center gap-1.5 self-start text-xs font-black text-blue-600 hover:underline dark:text-blue-400 sm:self-auto"
        >
          <span>Eksplorasi Materi Lengkap</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Description Header */}
      <div className="my-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[13.5px] font-medium leading-relaxed text-slate-700 dark:text-slate-300">
          {currentTab.desc}
        </p>
        <span
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${currentTab.badgeBg}`}
        >
          <CurrentIcon className="h-3.5 w-3.5" />
          <span>{currentTab.subject}</span>
        </span>
      </div>

      {/* Active Interactive Component */}
      <div className="mt-2 overflow-hidden rounded-2xl bg-slate-50/50 p-2 dark:bg-slate-950/40 sm:p-4">
        {activeTab === "parabola" && (
          <div className="transition-all">
            <ProjectileSimulator config={{ initialSpeed: 24, angle: 45 }} />
          </div>
        )}
        {activeTab === "suhu" && (
          <div className="transition-all">
            <TemperatureConverter config={{ initialCelsius: 37 }} />
          </div>
        )}
        {activeTab === "trigonometri" && (
          <div className="transition-all">
            <TrigonometryVisualizer config={{ initialAngle: 45 }} />
          </div>
        )}
        {activeTab === "nuklir" && (
          <div className="transition-all">
            <NuclearFission config={{ initialControlRods: 35 }} />
          </div>
        )}
      </div>
    </div>
  );
}
