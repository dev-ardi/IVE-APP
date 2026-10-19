"use client";

import { useState } from "react";
import Link from "next/link";
import { Atom, FlaskConical, Sigma, Globe2, ArrowRight } from "lucide-react";
import ProjectileSimulator from "@/components/interactive/projectile-simulator";
import TemperatureConverter from "@/components/interactive/temperature-converter";
import TrigonometryVisualizer from "@/components/interactive/trigonometry-visualizer";
import NuclearFission from "@/components/interactive/nuclear-fission";

const TABS = [
  {
    id: "parabola",
    title: "Gerak Parabola",
    subject: "Fisika",
    slug: "fisika",
    icon: Atom,
    badgeBg: "bg-sky-100 text-sky-800 border-sky-300 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800",
    buttonActive: "bg-sky-600 text-white shadow-[2px_2px_0px_0px_rgba(15,23,42,0.9)]",
    url: "/learn/umum/fisika/kinematika-gerak/gerak-parabola",
    desc: "Ubah sudut elevasi dan kecepatan awal proyektil. Amati bagaimana gravitasi membentuk lintasan lengkung kuadratik secara instan.",
  },
  {
    id: "suhu",
    title: "Konversi Suhu",
    subject: "Kimia",
    slug: "kimia",
    icon: FlaskConical,
    badgeBg: "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800",
    buttonActive: "bg-purple-600 text-white shadow-[2px_2px_0px_0px_rgba(15,23,42,0.9)]",
    url: "/learn/umum/kimia/termodinamika/konversi-suhu",
    desc: "Geser suhu Celsius dan amati respon linear skala Fahrenheit, titik nol mutlak Kelvin, dan skala Reamur dalam tabung termometer visual.",
  },
  {
    id: "trigonometri",
    title: "Lingkaran Satuan",
    subject: "Matematika",
    slug: "matematika",
    icon: Sigma,
    badgeBg: "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800",
    buttonActive: "bg-blue-600 text-white shadow-[2px_2px_0px_0px_rgba(15,23,42,0.9)]",
    url: "/learn/umum/matematika/trigonometri-dasar/trigonometri",
    desc: "Putar jarum sudut derajat pada lingkaran satuan trigonometri untuk melihat proyeksi visual sinus (vertikal) dan kosinus (horizontal).",
  },
  {
    id: "nuklir",
    title: "Fisi Nuklir",
    subject: "General Knowledge",
    slug: "general-knowledge",
    icon: Globe2,
    badgeBg: "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800",
    buttonActive: "bg-amber-600 text-white shadow-[2px_2px_0px_0px_rgba(15,23,42,0.9)]",
    url: "/learn/umum/general-knowledge/energi-dan-sains/fisi-nuklir",
    desc: "Tembakkan neutron berkecepatan tinggi ke inti Uranium-235. Atur kedalaman batang kendali untuk mencegah reaksi berantai tak terkendali.",
  },
];

export function HeroShowcase() {
  const [activeTab, setActiveTab] = useState("parabola");

  const currentTab = TABS.find((t) => t.id === activeTab) ?? TABS[0];
  const CurrentIcon = currentTab.icon;

  return (
    <div className="flex flex-col rounded-3xl border-2 border-slate-900 bg-white p-5 shadow-[4px_4px_0px_0px_rgba(15,23,42,0.9)] dark:border-slate-100 dark:bg-slate-900 dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.7)] sm:p-7">
      {/* Tab Switchers */}
      <div className="flex flex-col gap-4 border-b-2 border-slate-100 pb-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0" role="tablist" aria-label="Pilihan laboratorium interaktif">
          {TABS.map((tab) => {
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
      <div className="mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/50 p-2 dark:border-slate-800 dark:bg-slate-950/40 sm:p-4">
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
