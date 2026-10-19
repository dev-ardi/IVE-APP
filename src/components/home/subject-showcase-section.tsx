"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Atom,
  Flame,
  Dna,
  Binary,
  Activity,
  Zap,
} from "lucide-react";

interface SubjectSummary {
  name: string;
  slug: string;
  lessonCount: number;
}

export function SubjectShowcaseSection({ subjects }: { subjects: SubjectSummary[] }) {
  const getSubject = (slug: string) => subjects.find((s) => s.slug === slug);

  const fisika = getSubject("fisika");
  const biologi = getSubject("biologi");
  const kimia = getSubject("kimia");
  const matematika = getSubject("matematika");
  const generalKnowledge = getSubject("general-knowledge");

  return (
    <section className="relative overflow-hidden border-b-2 border-stone-900/10 bg-[#FAF4E8] py-20 dark:border-stone-800 dark:bg-[#1E1711] sm:py-24">
      {/* Subtle ambient light */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 top-1/3 h-96 w-96 rounded-full bg-amber-300/20 blur-3xl dark:bg-amber-900/10"
      />

      <div className="relative mx-auto w-full max-w-[1400px] px-3 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-2">
            <div className="inline-flex items-center gap-1.5 self-start rounded-full border border-amber-600/30 bg-amber-100/90 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-amber-900 dark:bg-amber-950/70 dark:text-amber-300">
              <Sparkles className="h-3.5 w-3.5" />
              <span>BENTO SHOWCASE · KARAKTER ILMIAH</span>
            </div>
            <h2 className="text-3xl font-black tracking-tight text-stone-900 sm:text-4xl lg:text-5xl dark:text-white">
              Identitas Visual & Keilmuan Tiap Subjek
            </h2>
            <p className="max-w-xl text-sm font-medium leading-relaxed text-stone-700 sm:text-base dark:text-stone-300">
              Setiap disiplin ilmu memiliki spektrum warna kognitif dan modul interaktif yang disesuaikan dengan cara konsep tersebut dipahami.
            </p>
          </div>

          <Link
            href="/explore"
            className="inline-flex items-center gap-1.5 self-start text-xs font-black text-amber-900 hover:underline dark:text-amber-300 sm:self-auto"
          >
            <span>Buka Seluruh Kurikulum</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Asymmetric Bento Showcase Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* 1. Large Hero Bento Card (Fisika - 7 Cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            whileHover={{ y: -4 }}
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border-2 border-stone-900 bg-[#EBF2FE] p-7 shadow-[4.5px_4.5px_0px_0px_rgba(24,24,27,0.9)] dark:border-white dark:bg-[#121B2B] dark:shadow-[4.5px_4.5px_0px_0px_rgba(255,255,255,0.7)] lg:col-span-7"
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-blue-400 bg-blue-100 text-blue-700 shadow-2xs dark:bg-blue-950 dark:text-blue-300">
                    <Atom className="h-8 w-8" />
                  </div>
                  <div>
                    <span className="rounded-full border border-blue-400/40 bg-blue-200/60 px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider text-blue-900 dark:bg-blue-900/60 dark:text-blue-200">
                      Modul Unggulan • Fisika Klasik
                    </span>
                    <h3 className="text-2xl font-black tracking-tight text-stone-900 sm:text-3xl dark:text-white">
                      Fisika Mekanika & Dinamika
                    </h3>
                  </div>
                </div>

                <span className="rounded-full border border-blue-300 bg-white/80 px-3 py-1 font-mono text-xs font-bold text-blue-900 dark:border-blue-700 dark:bg-stone-900 dark:text-blue-200">
                  {fisika?.lessonCount ?? 1} Materi
                </span>
              </div>

              <p className="max-w-xl text-sm font-medium leading-relaxed text-stone-700 dark:text-stone-300">
                Eksplorasi gravitasi, sudut elevasi, dan vektor kecepatan pada gerak parabola tanpa batas lembar soal kertas. Putar simulasi secara real-time.
              </p>

              {/* Parallax Interactive Preview Ribbon */}
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="rounded-xl border border-blue-300 bg-white/90 px-3 py-1.5 font-mono text-xs font-bold text-blue-900 dark:border-blue-800 dark:bg-stone-900 dark:text-blue-200">
                  y = v₀ sin(θ)t - ½gt²
                </span>
                <span className="inline-flex items-center gap-1 rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  <Activity className="h-3.5 w-3.5" />
                  Simulasi Gerak Parabola 60 FPS
                </span>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-blue-900/10 pt-4 dark:border-blue-400/20">
              <span className="text-xs font-bold text-stone-600 dark:text-stone-400">
                Fokus: Gerak Peluru, Hukum Newton, Kecepatan Relatif
              </span>
              <Link
                href="/learn/umum/fisika"
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl border-2 border-stone-900 bg-blue-600 px-5 py-2.5 text-xs font-black text-white shadow-[2px_2px_0px_0px_rgba(24,24,27,0.9)] transition-all hover:-translate-y-0.5 hover:bg-blue-700 active:translate-y-0.5 dark:border-white"
              >
                <span>Masuk Lab Fisika</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>

          {/* 2. Biologi Bento Card (5 Cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            whileHover={{ y: -4 }}
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border-2 border-stone-900 bg-[#EBF7F0] p-7 shadow-[4.5px_4.5px_0px_0px_rgba(24,24,27,0.9)] dark:border-white dark:bg-[#0E2017] dark:shadow-[4.5px_4.5px_0px_0px_rgba(255,255,255,0.7)] lg:col-span-5"
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-emerald-400 bg-emerald-100 text-emerald-800 shadow-2xs dark:bg-emerald-950 dark:text-emerald-300">
                  <Dna className="h-8 w-8" />
                </div>
                <span className="rounded-full border border-emerald-400/40 bg-emerald-200/60 px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider text-emerald-900 dark:bg-emerald-900/60 dark:text-emerald-200">
                  Biologi Seluler • {biologi?.lessonCount ?? 1} Materi
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-black tracking-tight text-stone-900 dark:text-white">
                  Biologi & Metabolisme
                </h3>
                <p className="mt-1.5 text-sm font-medium leading-relaxed text-stone-700 dark:text-stone-300">
                  Pahami Siklus Krebs, fosforilasi oksidatif, dan produksi ATP seluler dengan animasi mikroskopis interaktif.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="rounded-lg border border-emerald-300 bg-white/90 px-2.5 py-1 text-xs font-bold text-emerald-900 dark:border-emerald-700 dark:bg-stone-900 dark:text-emerald-300">
                  Video Konten Lokal Tersedia
                </span>
                <span className="rounded-lg border border-emerald-300 bg-emerald-100/80 px-2.5 py-1 text-xs font-bold text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
                  +36 ATP Yield
                </span>
              </div>
            </div>

            <div className="mt-6 border-t border-emerald-900/10 pt-4 dark:border-emerald-400/20">
              <Link
                href="/learn/umum/biologi"
                className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-stone-900 bg-emerald-700 py-2.5 text-xs font-black text-white shadow-[2px_2px_0px_0px_rgba(24,24,27,0.9)] transition-all hover:bg-emerald-800 dark:border-white"
              >
                <span>Jelajahi Biologi</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>

          {/* 3. Kimia Bento Card (4 Cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            whileHover={{ y: -4 }}
            className="group relative flex flex-col justify-between rounded-3xl border-2 border-stone-900 bg-[#FFF2EA] p-6 shadow-[4px_4px_0px_0px_rgba(24,24,27,0.9)] dark:border-white dark:bg-[#25150E] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.7)] lg:col-span-4"
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-amber-400 bg-amber-100 text-amber-800 shadow-2xs dark:bg-amber-950 dark:text-amber-300">
                  <Flame className="h-6 w-6" />
                </div>
                <span className="rounded-full border border-amber-300 bg-white/80 px-2 py-0.5 text-[10px] font-bold text-amber-900 dark:border-amber-700 dark:bg-stone-900 dark:text-amber-200">
                  Termodinamika • {kimia?.lessonCount ?? 1} Materi
                </span>
              </div>

              <h3 className="text-xl font-black tracking-tight text-stone-900 dark:text-white">
                Kimia & Suhu
              </h3>
              <p className="text-xs font-medium leading-relaxed text-stone-700 dark:text-stone-300">
                Korelasi energi kinetik molekuler pada skala Celcius, Fahrenheit, dan Kelvin absolut.
              </p>

              <div className="rounded-xl border border-amber-300 bg-white/80 p-2 text-center font-mono text-xs font-bold text-amber-900 dark:border-amber-800 dark:bg-stone-900 dark:text-amber-200">
                0 K = -273.15 °C
              </div>
            </div>

            <div className="mt-6 border-t border-amber-900/10 pt-4 dark:border-amber-400/20">
              <Link
                href="/learn/umum/kimia"
                className="inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl border-2 border-stone-900 bg-amber-600 py-2.5 text-xs font-black text-white shadow-[2px_2px_0px_0px_rgba(24,24,27,0.9)] transition-all hover:bg-amber-700 dark:border-white"
              >
                <span>Buka Materi Kimia</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </motion.div>

          {/* 4. Matematika Bento Card (4 Cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.25 }}
            whileHover={{ y: -4 }}
            className="group relative flex flex-col justify-between rounded-3xl border-2 border-stone-900 bg-[#F0F5FF] p-6 shadow-[4px_4px_0px_0px_rgba(24,24,27,0.9)] dark:border-white dark:bg-[#111927] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.7)] lg:col-span-4"
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-blue-400 bg-blue-100 text-blue-800 shadow-2xs dark:bg-blue-950 dark:text-blue-300">
                  <Binary className="h-6 w-6" />
                </div>
                <span className="rounded-full border border-blue-300 bg-white/80 px-2 py-0.5 text-[10px] font-bold text-blue-900 dark:border-blue-700 dark:bg-stone-900 dark:text-blue-200">
                  Geometri • {matematika?.lessonCount ?? 1} Materi
                </span>
              </div>

              <h3 className="text-xl font-black tracking-tight text-stone-900 dark:text-white">
                Matematika Trigonometri
              </h3>
              <p className="text-xs font-medium leading-relaxed text-stone-700 dark:text-stone-300">
                Visualisasikan sinus, kosinus, dan tangen langsung di lingkaran satuan interaktif.
              </p>

              <div className="rounded-xl border border-blue-300 bg-white/80 p-2 text-center font-mono text-xs font-bold text-blue-900 dark:border-blue-800 dark:bg-stone-900 dark:text-blue-200">
                sin²(θ) + cos²(θ) = 1
              </div>
            </div>

            <div className="mt-6 border-t border-blue-900/10 pt-4 dark:border-blue-400/20">
              <Link
                href="/learn/umum/matematika"
                className="inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl border-2 border-stone-900 bg-blue-700 py-2.5 text-xs font-black text-white shadow-[2px_2px_0px_0px_rgba(24,24,27,0.9)] transition-all hover:bg-blue-800 dark:border-white"
              >
                <span>Buka Materi Matematika</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </motion.div>

          {/* 5. General Knowledge Bento Card (4 Cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
            whileHover={{ y: -4 }}
            className="group relative flex flex-col justify-between rounded-3xl border-2 border-stone-900 bg-[#F6EEFD] p-6 shadow-[4px_4px_0px_0px_rgba(24,24,27,0.9)] dark:border-white dark:bg-[#1E1128] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.7)] lg:col-span-4"
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-purple-400 bg-purple-100 text-purple-800 shadow-2xs dark:bg-purple-950 dark:text-purple-300">
                  <Zap className="h-6 w-6" />
                </div>
                <span className="rounded-full border border-purple-300 bg-white/80 px-2 py-0.5 text-[10px] font-bold text-purple-900 dark:border-purple-700 dark:bg-stone-900 dark:text-purple-200">
                  Sains Nuklir • {generalKnowledge?.lessonCount ?? 1} Materi
                </span>
              </div>

              <h3 className="text-xl font-black tracking-tight text-stone-900 dark:text-white">
                Sains Populer & Nuklir
              </h3>
              <p className="text-xs font-medium leading-relaxed text-stone-700 dark:text-stone-300">
                Pahami pembelahan inti Uranium-235 dan simulasi pengendalian reaksi fisi berantai.
              </p>

              <div className="rounded-xl border border-purple-300 bg-white/80 p-2 text-center font-mono text-xs font-bold text-purple-900 dark:border-purple-800 dark:bg-stone-900 dark:text-purple-200">
                ²³⁵U + n → ¹⁴¹Ba + ⁹²Kr + 3n
              </div>
            </div>

            <div className="mt-6 border-t border-purple-900/10 pt-4 dark:border-purple-400/20">
              <Link
                href="/learn/umum/general-knowledge"
                className="inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl border-2 border-stone-900 bg-purple-700 py-2.5 text-xs font-black text-white shadow-[2px_2px_0px_0px_rgba(24,24,27,0.9)] transition-all hover:bg-purple-800 dark:border-white"
              >
                <span>Buka Materi Populer</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
