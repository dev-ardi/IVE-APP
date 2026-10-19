"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  Sliders,
  CheckCircle2,
  Bot,
  ArrowRight,
  Sparkles,
  Send,
} from "lucide-react";

interface StepDetail {
  step: string;
  title: string;
  shortDesc: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  pillColor: string;
  borderColor: string;
}

const STEPS: StepDetail[] = [
  {
    step: "01",
    title: "Amati Visual & Konsep Intuitif",
    shortDesc: "Setiap materi dibuka dengan visualisasi terstruktur, diagram berlabel, dan analogi dunia nyata tanpa rumus kaku.",
    badge: "Eksplorasi Konseptual",
    icon: Eye,
    accentColor: "bg-purple-600 text-white",
    pillColor: "bg-purple-100 text-purple-900 border-purple-300 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800",
    borderColor: "border-purple-300 dark:border-purple-800",
  },
  {
    step: "02",
    title: "Ubah Parameter di Sandbox Interaktif",
    shortDesc: "Geser slider variabel fisika, putar sudut trigonometri, atau atur batang kendali nuklir secara langsung.",
    badge: "Laboratorium Langsung",
    icon: Sliders,
    accentColor: "bg-blue-600 text-white",
    pillColor: "bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800",
    borderColor: "border-blue-300 dark:border-blue-800",
  },
  {
    step: "03",
    title: "Uji Pemahaman dengan Kuis Terstruktur",
    shortDesc: "Pilihan salah tidak menghukum, melainkan membimbing dengan penjelasan logis di mana letak kekeliruan konsep.",
    badge: "Evaluasi Konstruktif",
    icon: CheckCircle2,
    accentColor: "bg-emerald-600 text-white",
    pillColor: "bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800",
    borderColor: "border-emerald-300 dark:border-emerald-800",
  },
  {
    step: "04",
    title: "Tanya AI Sesuai Konteks Materi",
    shortDesc: "AI Tutor membaca teks dan rumus di halaman Anda, siap menjawab keraguan spesifik dengan bahasa Indonesia yang santun.",
    badge: "Tutor Kontekstual",
    icon: Bot,
    accentColor: "bg-amber-600 text-white",
    pillColor: "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800",
    borderColor: "border-amber-300 dark:border-amber-800",
  },
];

export function LearningLoopPillars() {
  const [activeStep, setActiveStep] = useState(0);
  const [interactiveSliderVal, setInteractiveSliderVal] = useState(45);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);

  const current = STEPS[activeStep];

  return (
    <section className="relative overflow-hidden border-b-2 border-stone-900/10 bg-[#F4EFFB] py-20 dark:border-stone-800 dark:bg-[#181324] sm:py-24">
      {/* Decorative ambient background blur */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 top-20 h-72 w-72 rounded-full bg-purple-300/30 blur-3xl dark:bg-purple-900/20"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-blue-300/30 blur-3xl dark:bg-blue-900/20"
      />

      <div className="relative mx-auto w-full max-w-[1400px] px-3 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border-2 border-purple-600/30 bg-purple-100/90 px-3.5 py-1 text-xs font-black tracking-wide text-purple-900 shadow-2xs dark:border-purple-500/40 dark:bg-purple-950/70 dark:text-purple-300">
            <Sparkles className="h-4 w-4 text-purple-700 dark:text-purple-400" />
            <span>METODOLOGI & ALUR BELAJAR IVE-APP</span>
          </div>

          <h2 className="text-3xl font-black tracking-tight text-stone-900 sm:text-4xl lg:text-5xl dark:text-white">
            Empat Langkah Menuju <span className="text-purple-700 dark:text-purple-400">Pemahaman Mandiri</span>
          </h2>

          <p className="max-w-2xl text-[15.5px] font-medium leading-relaxed text-stone-700 sm:text-base dark:text-stone-300">
            Kami menolak metode hafalan pasif. Setiap modul dirancang untuk membawa pemikiran Anda bergerak aktif dari pengamatan visual hingga verifikasi matematis.
          </p>
        </div>

        {/* Asymmetric 2-Column Stepped Interactive Experience */}
        <div className="mt-14 grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
          {/* Left Column (5 Cols): Stepped Timeline Selector */}
          <div className="flex flex-col justify-between gap-3 lg:col-span-5">
            {STEPS.map((s, idx) => {
              const isActive = activeStep === idx;
              const Icon = s.icon;

              return (
                <button
                  key={s.step}
                  type="button"
                  onClick={() => setActiveStep(idx)}
                  className={`group relative flex cursor-pointer items-start gap-4 rounded-3xl border-2 p-5 text-left transition-all duration-300 ${
                    isActive
                      ? "border-stone-900 bg-white shadow-[4px_4px_0px_0px_rgba(24,24,27,0.9)] dark:border-white dark:bg-stone-900 dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.7)]"
                      : "border-stone-900/10 bg-white/60 hover:border-stone-900/40 hover:bg-white dark:border-stone-800 dark:bg-stone-900/40 dark:hover:bg-stone-900/80"
                  }`}
                >
                  {/* Step Number & Icon */}
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 transition-transform duration-300 group-hover:scale-105 ${
                      isActive
                        ? `${s.accentColor} border-stone-900 dark:border-white`
                        : "border-stone-300 bg-stone-100 text-stone-600 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black tracking-wider text-stone-600 dark:text-stone-400">
                        LANGKAH {s.step}
                      </span>
                      <span className={`rounded-full border px-2 py-0.2 text-[10px] font-bold ${s.pillColor}`}>
                        {s.badge}
                      </span>
                    </div>

                    <h3 className="text-base font-black tracking-tight text-stone-900 dark:text-white">
                      {s.title}
                    </h3>

                    <p className="text-xs font-medium leading-relaxed text-stone-600 dark:text-stone-400">
                      {s.shortDesc}
                    </p>
                  </div>

                  {isActive && (
                    <div className="absolute right-4 top-5 hidden sm:block">
                      <span className="flex h-2.5 w-2.5 rounded-full bg-purple-600 animate-pulse" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Column (7 Cols): Live Interactive Sandbox Demonstration Stage */}
          <div className="relative flex flex-col justify-between overflow-hidden rounded-3xl border-2 border-stone-900 bg-white p-6 shadow-[5px_5px_0px_0px_rgba(24,24,27,0.9)] dark:border-white dark:bg-stone-900 dark:shadow-[5px_5px_0px_0px_rgba(255,255,255,0.7)] sm:p-8 lg:col-span-7">
            {/* Stage Header */}
            <div className="flex items-center justify-between border-b border-stone-900/10 pb-4 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <span className="flex h-3 w-3 rounded-full bg-red-500" />
                <span className="flex h-3 w-3 rounded-full bg-amber-500" />
                <span className="flex h-3 w-3 rounded-full bg-emerald-500" />
                <span className="ml-2 font-mono text-xs font-bold text-stone-700 dark:text-stone-300">
                  IVE_STAGE // {current.step}_{current.badge.toUpperCase().replace(/\s+/g, "_")}
                </span>
              </div>

              <span className="rounded-full border border-stone-300 bg-stone-100 px-3 py-1 font-mono text-xs font-bold text-stone-700 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300">
                Langkah {activeStep + 1} dari 4
              </span>
            </div>

            {/* Dynamic Stage Content based on activeStep */}
            <div className="my-6 min-h-[300px]">
              <AnimatePresence mode="wait">
                {activeStep === 0 && (
                  <motion.div
                    key="stage-0"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase text-purple-700 dark:text-purple-400">
                        Diagram Konseptual Dinamis
                      </span>
                      <span className="rounded-md border border-purple-300 bg-purple-50 px-2 py-0.5 text-[11px] font-bold text-purple-800 dark:border-purple-800 dark:bg-purple-950/40 dark:text-purple-300">
                        Biologi Seluler
                      </span>
                    </div>

                    {/* Visual Graphic Simulator */}
                    <div className="relative flex h-52 items-center justify-center rounded-2xl border-2 border-stone-900/10 bg-[#FAF9F5] p-4 dark:border-stone-800 dark:bg-[#121316]">
                      <div className="flex flex-col items-center gap-3">
                        <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-4 border-dashed border-purple-500 bg-purple-100/60 animate-spin-slow dark:bg-purple-950/40">
                          <span className="font-mono text-xs font-black text-purple-900 dark:text-purple-200">
                            Krebs
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-stone-700 dark:text-stone-300">
                          <span className="rounded bg-emerald-100 px-2 py-0.5 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            +2 ATP
                          </span>
                          <span className="rounded bg-blue-100 px-2 py-0.5 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                            +6 NADH
                          </span>
                          <span className="rounded bg-amber-100 px-2 py-0.5 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                            +2 FADH₂
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs font-medium text-stone-600 dark:text-stone-300">
                      Visualisasi interaktif mendemonstrasikan bagaimana Asetil-KoA memasuki matriks mitokondria dan menghasilkan energi secara siklis.
                    </p>
                  </motion.div>
                )}

                {activeStep === 1 && (
                  <motion.div
                    key="stage-1"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase text-blue-700 dark:text-blue-400">
                        Simulasi Fisika Gerak Parabola
                      </span>
                      <span className="rounded-md border border-blue-300 bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-blue-800 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300">
                        Live Canvas
                      </span>
                    </div>

                    {/* Trajectory Canvas Mini Preview */}
                    <div className="relative flex h-48 flex-col justify-end overflow-hidden rounded-2xl border-2 border-stone-900/10 bg-[#FAF9F5] p-4 dark:border-stone-800 dark:bg-[#121316]">
                      {/* Trajectory Arc */}
                      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
                        <path
                          d={`M 20 160 Q ${20 + interactiveSliderVal * 2.8} ${160 - interactiveSliderVal * 2.4} ${
                            20 + interactiveSliderVal * 5.6
                          } 160`}
                          fill="none"
                          stroke="#2563EB"
                          strokeWidth="3.5"
                          strokeDasharray="6 4"
                        />
                      </svg>

                      {/* Projectile dot */}
                      <motion.div
                        animate={{
                          x: [20, 20 + interactiveSliderVal * 5.6],
                          y: [0, 0],
                        }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="relative z-10 h-4 w-4 rounded-full border-2 border-white bg-blue-600 shadow-md"
                      />

                      <div className="relative z-10 flex items-center justify-between rounded-xl bg-white/90 p-2.5 backdrop-blur-sm dark:bg-stone-900/90">
                        <span className="font-mono text-xs font-bold text-stone-700 dark:text-stone-300">
                          Sudut Elevasi (θ): <strong className="text-blue-600">{interactiveSliderVal}°</strong>
                        </span>
                        <span className="font-mono text-xs font-bold text-stone-700 dark:text-stone-300">
                          Jangkauan ($R$):{" "}
                          <strong className="text-emerald-600">
                            {(Math.sin((2 * interactiveSliderVal * Math.PI) / 180) * 40.8).toFixed(1)} m
                          </strong>
                        </span>
                      </div>
                    </div>

                    {/* Interactive Slider Input */}
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-stone-600 dark:text-stone-400">15°</span>
                      <input
                        type="range"
                        min="15"
                        max="75"
                        value={interactiveSliderVal}
                        onChange={(e) => setInteractiveSliderVal(Number(e.target.value))}
                        className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-stone-200 accent-blue-600 dark:bg-stone-700"
                      />
                      <span className="text-xs font-bold text-stone-600 dark:text-stone-400">75°</span>
                    </div>
                  </motion.div>
                )}

                {activeStep === 2 && (
                  <motion.div
                    key="stage-2"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase text-emerald-700 dark:text-emerald-400">
                        Evaluasi Formatif Instan
                      </span>
                      <span className="rounded-md border border-emerald-300 bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                        Umpan Balik Positif
                      </span>
                    </div>

                    <div className="rounded-2xl border-2 border-stone-900/10 bg-[#FAF9F5] p-4 dark:border-stone-800 dark:bg-[#121316]">
                      <p className="text-xs font-bold text-stone-900 dark:text-white sm:text-sm">
                        Berapakah nilai suhu 0 Kelvin dalam skala Celsius?
                      </p>

                      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {[
                          { id: 0, text: "-273.15 °C", correct: true },
                          { id: 1, text: "0 °C", correct: false },
                          { id: 2, text: "100 °C", correct: false },
                          { id: 3, text: "-100 °C", correct: false },
                        ].map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setSelectedQuizOption(opt.id)}
                            className={`flex cursor-pointer items-center justify-between rounded-xl border p-2.5 text-xs font-bold transition-all ${
                              selectedQuizOption === opt.id
                                ? opt.correct
                                  ? "border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200"
                                  : "border-red-500 bg-red-50 text-red-900 dark:bg-red-950/60 dark:text-red-200"
                                : "border-stone-300 bg-white hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-800 text-stone-800 dark:text-stone-200"
                            }`}
                          >
                            <span>{opt.text}</span>
                            {selectedQuizOption === opt.id && (
                              <span>{opt.correct ? "✓ Tepat" : "✗ Coba lagi"}</span>
                            )}
                          </button>
                        ))}
                      </div>

                      {selectedQuizOption !== null && (
                        <div className="mt-3 rounded-xl border border-stone-200 bg-white p-2.5 text-[11px] font-medium text-stone-700 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300">
                          💡 <strong>Penjelasan:</strong> Nol Mutlak (0 K) adalah kondisi teoretis di mana seluruh gerakan termal partikel berhenti, setara dengan -273.15°C.
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {activeStep === 3 && (
                  <motion.div
                    key="stage-3"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase text-amber-700 dark:text-amber-400">
                        Tanya AI Tutor Kontekstual
                      </span>
                      <span className="rounded-md border border-amber-300 bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
                        Membaca Materi Ini
                      </span>
                    </div>

                    <div className="flex flex-col gap-2 rounded-2xl border-2 border-stone-900/10 bg-[#FAF9F5] p-4 dark:border-stone-800 dark:bg-[#121316]">
                      {/* User message */}
                      <div className="self-end rounded-2xl rounded-tr-none bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-2xs">
                        Kenapa sudut 45 derajat menghasilkan jarak terjauh?
                      </div>

                      {/* AI response */}
                      <div className="self-start rounded-2xl rounded-tl-none border border-stone-200 bg-white p-3 text-xs font-medium text-stone-800 shadow-2xs dark:border-stone-800 dark:bg-stone-900 dark:text-stone-200">
                        <span className="font-bold text-amber-600 dark:text-amber-400">🤖 AI Tutor: </span>
                        Jangkauan horizontal dirumuskan oleh R = (v₀² · sin(2θ)) / g. Fungsi sinus mencapai nilai maksimumnya yaitu 1 saat sudutnya 90°. Karena sin(2θ) = 1, maka 2θ = 90° sehingga θ = 45°!
                      </div>

                      {/* Quick input field mock */}
                      <div className="mt-2 flex items-center gap-2 rounded-xl border border-stone-300 bg-white px-3 py-1.5 dark:border-stone-700 dark:bg-stone-800">
                        <span className="text-xs text-stone-400">Tanyakan apapun seputar konsep ini...</span>
                        <Send className="ml-auto h-3.5 w-3.5 text-blue-600" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Stage Bottom Navigation */}
            <div className="flex items-center justify-between border-t border-stone-900/10 pt-4 dark:border-stone-800">
              <button
                type="button"
                onClick={() => setActiveStep((prev) => (prev > 0 ? prev - 1 : 3))}
                className="cursor-pointer text-xs font-bold text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white"
              >
                ← Langkah Sebelumnya
              </button>

              <button
                type="button"
                onClick={() => setActiveStep((prev) => (prev < 3 ? prev + 1 : 0))}
                className="inline-flex cursor-pointer items-center gap-1 rounded-xl border-2 border-stone-900 bg-purple-600 px-4 py-2 text-xs font-black text-white shadow-[2px_2px_0px_0px_rgba(24,24,27,0.9)] transition-all hover:-translate-y-0.5 hover:bg-purple-700 active:translate-y-0.5 dark:border-white"
              >
                <span>Langkah Selanjutnya</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
