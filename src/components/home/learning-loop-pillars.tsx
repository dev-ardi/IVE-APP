"use client";

import { motion } from "framer-motion";
import { Eye, Sliders, CheckCircle2, Bot, ArrowRight, Sparkles } from "lucide-react";

const PILLARS = [
  {
    step: "01",
    title: "Amati Konsep Visual",
    desc: "Mulai dengan ilustrasi konseptual, diagram interaktif, dan video penjelasan ringkas tanpa jargon berbelit-belit.",
    icon: Eye,
    color: "bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300",
    border: "border-purple-300 dark:border-purple-800",
  },
  {
    step: "02",
    title: "Eksperimen di Sandbox",
    desc: "Ubah variabel sudut, kecepatan, suhu, atau batang kendali fisi nuklir. Saksikan kalkulasi rumus bereaksi seketika.",
    icon: Sliders,
    color: "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300",
    border: "border-blue-300 dark:border-blue-800",
  },
  {
    step: "03",
    title: "Kuis dengan Umpan Balik",
    desc: "Uji pemahaman lewat soal latihan. Pilihan salah disertai penjelasan logis mengapa jawaban tersebut keliru.",
    icon: CheckCircle2,
    color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
    border: "border-emerald-300 dark:border-emerald-800",
  },
  {
    step: "04",
    title: "Konsultasi Tutor AI",
    desc: "Tanyakan hal yang membingungkan langsung kepada asisten AI yang membaca materi pelajaran yang sedang dibuka.",
    icon: Bot,
    color: "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300",
    border: "border-amber-300 dark:border-amber-800",
  },
];

export function LearningLoopPillars() {
  return (
    <section className="relative overflow-hidden border-b-2 border-stone-900/10 bg-[#F4EFFB] py-20 dark:border-stone-800 dark:bg-[#181324]">
      <div className="relative mx-auto w-full max-w-[1400px] px-3 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border-2 border-purple-600/30 bg-purple-100/80 px-3.5 py-1 text-xs font-black tracking-wide text-purple-900 dark:border-purple-500/40 dark:bg-purple-950/70 dark:text-purple-300">
            <Sparkles className="h-4 w-4 text-purple-700 dark:text-purple-400" />
            <span>ALUR BELAJAR IVE-APP</span>
          </div>

          <h2 className="text-3xl font-black tracking-tight text-stone-900 sm:text-4xl lg:text-5xl dark:text-white">
            Empat Langkah Menuju <span className="text-purple-700 dark:text-purple-400">Pemahaman Mandiri</span>
          </h2>

          <p className="max-w-2xl text-[16px] font-medium leading-relaxed text-stone-700 dark:text-stone-300">
            Kami merancang alur belajar terstruktur yang memandu Anda dari rasa penasaran hingga penguasaan konsep yang kokoh.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p, idx) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="group relative flex flex-col justify-between rounded-3xl border-2 border-stone-900 bg-white p-6 shadow-[3.5px_3.5px_0px_0px_rgba(24,24,27,0.9)] dark:border-stone-100 dark:bg-stone-900 dark:shadow-[3.5px_3.5px_0px_0px_rgba(255,255,255,0.7)]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-2xl font-black text-stone-400 dark:text-stone-500">
                      {p.step}
                    </span>
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${p.border} ${p.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>

                  <h3 className="mt-5 text-lg font-black tracking-tight text-stone-900 dark:text-white">
                    {p.title}
                  </h3>

                  <p className="mt-2 text-xs font-medium leading-relaxed text-stone-600 dark:text-stone-400">
                    {p.desc}
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-1 text-[11px] font-bold text-purple-700 dark:text-purple-400">
                  <span>Langkah {p.step}</span>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
