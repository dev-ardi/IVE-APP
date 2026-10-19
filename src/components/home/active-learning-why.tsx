"use client";

import { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Brain,
  Zap,
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sliders,
  TrendingUp,
} from "lucide-react";

export function ActiveLearningWhy() {
  const [activeTab, setActiveTab] = useState<"active" | "passive">("active");
  const { scrollYProgress } = useScroll();

  // Gentle parallax translation for floating mathematical tags
  const yFloating1 = useTransform(scrollYProgress, [0, 1], [-20, 40]);
  const yFloating2 = useTransform(scrollYProgress, [0, 1], [30, -50]);

  return (
    <section className="relative overflow-hidden border-y-2 border-stone-900/10 bg-[#EEF7F2] py-20 dark:border-stone-800 dark:bg-[#122018]">
      {/* Parallax Floating Formula Badges (Lightweight, pure CSS/Motion transforms) */}
      <motion.div
        style={{ y: yFloating1 }}
        aria-hidden="true"
        className="pointer-events-none absolute top-12 left-6 hidden rounded-xl border border-emerald-400/30 bg-white/80 px-3 py-1.5 font-mono text-xs font-bold text-emerald-800 shadow-sm backdrop-blur-sm lg:block dark:bg-stone-900/80 dark:text-emerald-300"
      >
        {"v² = v₀² + 2g·h"}
      </motion.div>

      <motion.div
        style={{ y: yFloating2 }}
        aria-hidden="true"
        className="pointer-events-none absolute bottom-12 right-10 hidden rounded-xl border border-emerald-400/30 bg-white/80 px-3 py-1.5 font-mono text-xs font-bold text-emerald-800 shadow-sm backdrop-blur-sm lg:block dark:bg-stone-900/80 dark:text-emerald-300"
      >
        {"E = mc² · F = m·a"}
      </motion.div>

      <div className="relative mx-auto w-full max-w-[1400px] px-3 sm:px-6 lg:px-8">
        {/* Section Header: Educational Marketing Why */}
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border-2 border-emerald-600/30 bg-emerald-100/80 px-3.5 py-1 text-xs font-black tracking-wide text-emerald-900 dark:border-emerald-500/40 dark:bg-emerald-950/70 dark:text-emerald-300"
          >
            <Brain className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
            <span>MENGAPA METODE KAMI BERBEDA</span>
          </motion.div>

          <h2 className="text-3xl font-black tracking-tight text-stone-900 sm:text-4xl lg:text-5xl dark:text-white">
            Otak Manusia Mengingat{" "}
            <span className="text-emerald-700 dark:text-emerald-400">Apa yang Dilihat & Dicoba</span>, Bukan yang Dihafal.
          </h2>

          <p className="max-w-2xl text-[16px] font-medium leading-relaxed text-stone-700 dark:text-stone-300">
            Sains dan matematika sering terasa sulit bukan karena Anda tidak mampu, melainkan karena rumus-rumus tersebut diajarkan sebagai teks hitam-putih tanpa representasi visual yang hidup.
          </p>
        </div>

        {/* Interactive Comparison Card Switcher */}
        <div className="mt-12 flex justify-center">
          <div className="inline-flex rounded-2xl border-2 border-stone-900/15 bg-white p-1.5 shadow-sm dark:border-stone-700 dark:bg-stone-900">
            <button
              type="button"
              onClick={() => setActiveTab("active")}
              className={`cursor-pointer rounded-xl px-5 py-2.5 text-xs font-black transition-all ${
                activeTab === "active"
                  ? "border-2 border-stone-900 bg-emerald-600 text-white shadow-[2px_2px_0px_0px_rgba(24,24,27,0.9)] dark:border-white"
                  : "text-stone-600 hover:text-stone-900 dark:text-stone-300"
              }`}
            >
              ✨ Pengalaman Belajar IVE-APP
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("passive")}
              className={`cursor-pointer rounded-xl px-5 py-2.5 text-xs font-black transition-all ${
                activeTab === "passive"
                  ? "border-2 border-stone-900 bg-rose-600 text-white shadow-[2px_2px_0px_0px_rgba(24,24,27,0.9)] dark:border-white"
                  : "text-stone-600 hover:text-stone-900 dark:text-stone-300"
              }`}
            >
              ✕ Cara Tradisional / Buku Teks
            </button>
          </div>
        </div>

        {/* Dynamic Comparison Panel */}
        <div className="mx-auto mt-8 max-w-4xl">
          {activeTab === "active" ? (
            <motion.div
              key="active-card"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="rounded-3xl border-2 border-stone-900 bg-white p-6 shadow-[4px_4px_0px_0px_rgba(24,24,27,0.9)] dark:border-stone-100 dark:bg-stone-900 sm:p-8"
            >
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-col gap-3">
                  <span className="inline-flex items-center gap-1.5 font-mono text-xs font-black uppercase text-emerald-700 dark:text-emerald-400">
                    <Zap className="h-4 w-4" />
                    Manipulasi Langsung & Intuisi Visual
                  </span>
                  <h3 className="text-2xl font-black text-stone-900 dark:text-white">
                    Ubah Angkanya, Lihat Reaksinya Seketika
                  </h3>
                  <p className="text-sm font-medium leading-relaxed text-stone-600 dark:text-stone-300">
                    Di IVE-APP, setiap formula fisika dan diagram reaksi dapat diutak-atik. Saat Anda mengubah sudut proyektil, kurva parabola langsung melengkung di layar Anda. Anda paham &ldquo;kenapa&rdquo; rumusnya bekerja, bukan sekadar menghafalnya untuk ujian besok.
                  </p>
                </div>

                <div className="shrink-0 space-y-2.5 rounded-2xl border-2 border-emerald-500/20 bg-emerald-50/70 p-4 dark:bg-emerald-950/40">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 dark:text-emerald-200">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Visualisasi kanvas 60 FPS</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 dark:text-emerald-200">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Miskonsepsi diluruskan kuis</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 dark:text-emerald-200">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Tutor AI siap tanya jawab</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="passive-card"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="rounded-3xl border-2 border-stone-900/20 bg-stone-100 p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900/60 sm:p-8"
            >
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-col gap-3">
                  <span className="inline-flex items-center gap-1.5 font-mono text-xs font-black uppercase text-rose-700 dark:text-rose-400">
                    <HelpCircle className="h-4 w-4" />
                    Membaca Pasif & Hafalan Buta
                  </span>
                  <h3 className="text-2xl font-black text-stone-800 dark:text-stone-200">
                    Membaca Halaman Teori Tanpa Interaksi
                  </h3>
                  <p className="text-sm font-medium leading-relaxed text-stone-600 dark:text-stone-400">
                    Siswa dipaksa mengingat simbol-simbol asing tanpa tahu apa yang terjadi dalam dunia nyata. Begitu soal diubah sedikit atau variabel diganti, kebingungan muncul kembali karena konsep dasarnya tidak pernah benar-benar menempel di benak.
                  </p>
                </div>

                <div className="shrink-0 space-y-2.5 rounded-2xl border border-rose-300 bg-rose-50/70 p-4 dark:bg-rose-950/30">
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-800 dark:text-rose-300">
                    <XCircle className="h-4 w-4 text-rose-500" />
                    <span>Cepat lupa dalam 48 jam</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-800 dark:text-rose-300">
                    <XCircle className="h-4 w-4 text-rose-500" />
                    <span>Rumus terasa abstrak & membosankan</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-800 dark:text-rose-300">
                    <XCircle className="h-4 w-4 text-rose-500" />
                    <span>Tidak ada umpan balik instan</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Value Proof Badges (3 Pillars of Impact) */}
        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="flex flex-col gap-2 rounded-2xl border-2 border-stone-900/10 bg-white p-5.5 shadow-sm dark:border-stone-800 dark:bg-stone-900">
            <div className="flex items-center gap-2 font-black text-emerald-700 dark:text-emerald-400">
              <TrendingUp className="h-5 w-5" />
              <span className="text-2xl">3.2×</span>
            </div>
            <h4 className="text-sm font-black text-stone-900 dark:text-white">Retensi Konsep Lebih Kuat</h4>
            <p className="text-xs font-medium text-stone-600 dark:text-stone-400">
              Eksperimen langsung memicu kognisi aktif yang membuat memori bertahan jauh lebih lama dibanding sekadar membaca.
            </p>
          </div>

          <div className="flex flex-col gap-2 rounded-2xl border-2 border-stone-900/10 bg-white p-5.5 shadow-sm dark:border-stone-800 dark:bg-stone-900">
            <div className="flex items-center gap-2 font-black text-blue-700 dark:text-blue-400">
              <Sliders className="h-5 w-5" />
              <span className="text-2xl">100%</span>
            </div>
            <h4 className="text-sm font-black text-stone-900 dark:text-white">Eksplorasi Tanpa Batas</h4>
            <p className="text-xs font-medium text-stone-600 dark:text-stone-400">
              Semua simulasi berjalan langsung di browser tanpa perlu install aplikasi berat atau setup rumit.
            </p>
          </div>

          <div className="flex flex-col gap-2 rounded-2xl border-2 border-stone-900/10 bg-white p-5.5 shadow-sm dark:border-stone-800 dark:bg-stone-900">
            <div className="flex items-center gap-2 font-black text-amber-700 dark:text-amber-400">
              <Sparkles className="h-5 w-5" />
              <span className="text-2xl">Zero-Cost</span>
            </div>
            <h4 className="text-sm font-black text-stone-900 dark:text-white">Akses Penuh Jenjang Umum</h4>
            <p className="text-xs font-medium text-stone-600 dark:text-stone-400">
              Terbuka untuk siapa pun: pelajar sekolah, mahasiswa, maupun pembelajar mandiri yang ingin mengasah sains.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
