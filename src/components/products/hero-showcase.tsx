"use client";

import { useState } from "react";
import Link from "next/link";
import ProjectileSimulator from "@/components/interactive/projectile-simulator";
import TemperatureConverter from "@/components/interactive/temperature-converter";
import TrigonometryVisualizer from "@/components/interactive/trigonometry-visualizer";
import NuclearFission from "@/components/interactive/nuclear-fission";

const TABS = [
  {
    id: "parabola",
    title: "Gerak Parabola",
    subject: "Fisika",
    icon: "⚛️",
    badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200",
    url: "/learn/umum/fisika/kinematika-gerak/gerak-parabola",
    desc: "Ubah sudut & kecepatan proyektil, saksikan lintasan melengkung dihitung secara instan.",
  },
  {
    id: "suhu",
    title: "Konversi Suhu",
    subject: "Kimia",
    icon: "🧪",
    badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200",
    url: "/learn/umum/kimia/termodinamika/konversi-suhu",
    desc: "Geser suhu Celsius dan amati respon termometer di skala Fahrenheit, Kelvin, & Reamur.",
  },
  {
    id: "trigonometri",
    title: "Lingkaran Satuan",
    subject: "Matematika",
    icon: "📐",
    badgeColor: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200",
    url: "/learn/umum/matematika/trigonometri-dasar/trigonometri",
    desc: "Manipulasi sudut derajat pada lingkaran satuan, pahami nilai sinus, kosinus, dan tangen.",
  },
  {
    id: "nuklir",
    title: "Fisi Nuklir",
    subject: "General Knowledge",
    icon: "🌍",
    badgeColor: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-200",
    url: "/learn/umum/general-knowledge/energi-dan-sains/fisi-nuklir",
    desc: "Tembakkan neutron ke inti Uranium-235, kendalikan reaksi fisi berantai dan pelepasan energi.",
  },
];

export function HeroShowcase() {
  const [activeTab, setActiveTab] = useState("parabola");

  const currentTab = TABS.find((t) => t.id === activeTab) ?? TABS[0];

  return (
    <div className="flex flex-col rounded-3xl border border-border/80 bg-card p-4 sm:p-6 shadow-sm">
      {/* Tab Switchers */}
      <div className="flex flex-col gap-3 border-b border-border/80 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted/50 text-foreground/70 hover:bg-muted hover:text-foreground"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.title}</span>
            </button>
          ))}
        </div>

        <Link
          href={currentTab.url}
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
        >
          <span>Buka Pelajaran Penuh</span>
          <span>→</span>
        </Link>
      </div>

      {/* Description Header */}
      <div className="mt-4 mb-2 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{currentTab.desc}</p>
        <span className={`hidden sm:inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${currentTab.badgeColor}`}>
          {currentTab.subject}
        </span>
      </div>

      {/* Active Interactive Component */}
      <div className="mt-2 overflow-hidden">
        {activeTab === "parabola" && (
          <div className="scale-95 origin-top sm:scale-100 transition-all">
            <ProjectileSimulator config={{ initialSpeed: 24, angle: 45 }} />
          </div>
        )}
        {activeTab === "suhu" && (
          <div className="scale-95 origin-top sm:scale-100 transition-all">
            <TemperatureConverter config={{ initialCelsius: 37 }} />
          </div>
        )}
        {activeTab === "trigonometri" && (
          <div className="scale-95 origin-top sm:scale-100 transition-all">
            <TrigonometryVisualizer config={{ initialAngle: 45 }} />
          </div>
        )}
        {activeTab === "nuklir" && (
          <div className="scale-95 origin-top sm:scale-100 transition-all">
            <NuclearFission config={{ initialControlRods: 35 }} />
          </div>
        )}
      </div>
    </div>
  );
}
