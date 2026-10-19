import Link from "next/link";
import type { Metadata } from "next";
import {
  FlaskConical,
  Atom,
  Sigma,
  Globe2,
  Dna,
  Microscope,
  ArrowRight,
  BookOpen,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Lab Simulasi Sains & Interaktif",
  description:
    "Eksplorasi simulasi sains, fisika, kimia, matematika, dan biologi langsung di laboratorium visual IVE-APP.",
};

const EXPERIMENTS = [
  {
    slug: "gerak-parabola",
    title: "Simulator Gerak Parabola",
    subject: "Fisika",
    icon: Atom,
    theme: {
      badge: "bg-sky-50 text-sky-800 border-sky-300 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800",
      iconBg: "bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300",
      btn: "bg-sky-600 hover:bg-sky-700 text-white",
    },
    description:
      "Simulasi lintasan peluru 2D. Atur sudut elevasi, kecepatan awal, dan gravitasi bumi untuk melihat kalkulasi waktu terbang dan jangkauan terjauh secara instan.",
    lessonUrl: "/learn/umum/fisika/kinematika-gerak/gerak-parabola",
  },
  {
    slug: "konversi-suhu",
    title: "Konversi Skala Suhu & Termometer",
    subject: "Kimia",
    icon: FlaskConical,
    theme: {
      badge: "bg-purple-50 text-purple-800 border-purple-300 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800",
      iconBg: "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300",
      btn: "bg-purple-600 hover:bg-purple-700 text-white",
    },
    description:
      "Eksperimen kolom raksa termometer dinamis. Amati perubahan nilai dan rumus konversi antara Celsius, Fahrenheit, Kelvin, dan Reamur.",
    lessonUrl: "/learn/umum/kimia/termodinamika/konversi-suhu",
  },
  {
    slug: "trigonometri",
    title: "Visualisator Lingkaran Satuan",
    subject: "Matematika",
    icon: Sigma,
    theme: {
      badge: "bg-blue-50 text-blue-800 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800",
      iconBg: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
      btn: "bg-blue-600 hover:bg-blue-700 text-white",
    },
    description:
      "Manipulasi sudut trigonometri pada lingkaran berpusat (0,0) dengan r=1. Dapatkan nilai eksak sinus, kosinus, tangen, dan kuadran secara visual.",
    lessonUrl: "/learn/umum/matematika/trigonometri-dasar/trigonometri",
  },
  {
    slug: "fisi-nuklir",
    title: "Reaksi Fisi Nuklir U-235",
    subject: "General Knowledge",
    icon: Globe2,
    theme: {
      badge: "bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800",
      iconBg: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
      btn: "bg-amber-600 hover:bg-amber-700 text-white",
    },
    description:
      "Tembakkan neutron termal ke inti Uranium-235, saksikan pembelahan inti atom, pelepasan 3 neutron bebas baru, dan kendalikan reaksi dengan batang kendali.",
    lessonUrl: "/learn/umum/general-knowledge/energi-dan-sains/fisi-nuklir",
  },
  {
    slug: "siklus-krebs",
    title: "Penjelajah Sel & Mitokondria",
    subject: "Biologi",
    icon: Dna,
    theme: {
      badge: "bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800",
      iconBg: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
      btn: "bg-emerald-600 hover:bg-emerald-700 text-white",
    },
    description:
      "Telusuri anatomi membran mitokondria, matriks seluler tempat terjadinya Siklus Krebs, dan pelajari produksi pembawa energi NADH dan FADH2.",
    lessonUrl: "/learn/umum/biologi/metabolisme-sel/siklus-krebs",
  },
  {
    slug: "atom-explorer",
    title: "Penjelajah Struktur Atom",
    subject: "Kimia & Fisika",
    icon: Microscope,
    theme: {
      badge: "bg-sky-50 text-sky-800 border-sky-300 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800",
      iconBg: "bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300",
      btn: "bg-sky-600 hover:bg-sky-700 text-white",
    },
    description:
      "Visualisasi model atom, proton, neutron, dan elektron valensi pada berbagai unsur tabel periodik secara interaktif.",
    lessonUrl: "/learn/umum/kimia",
  },
];

export default function LabPage() {
  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-10 px-3 py-10 sm:px-6 sm:py-14">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-blue-700 dark:text-blue-400">
          <FlaskConical className="h-4 w-4" />
          <span>Laboratorium Interaktif</span>
          <span>•</span>
          <span>Sandbox Mode Bebas</span>
        </div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          Lab Simulasi & Eksperimen Bebas
        </h1>
        <p className="max-w-2xl text-base font-medium leading-relaxed text-slate-600 dark:text-slate-300">
          Ruang eksplorasi cepat untuk Anda yang ingin langsung mencoba simulasi visual dan menguji variabel tanpa harus membaca seluruh materi teori terlebih dahulu.
        </p>
      </div>

      {/* Grid of Experiments with Soft Neobrutalism Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {EXPERIMENTS.map((exp) => {
          const Icon = exp.icon;
          return (
            <div
              key={exp.slug}
              className="group flex flex-col justify-between rounded-2xl border-2 border-slate-900/10 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-slate-900 hover:shadow-[3px_3px_0px_0px_rgba(15,23,42,0.9)] dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-200 dark:hover:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.7)]"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl border border-slate-900/10 transition-transform group-hover:scale-105 ${exp.theme.iconBg}`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <span
                    className={`rounded-full border px-3 py-0.5 text-xs font-bold ${exp.theme.badge}`}
                  >
                    {exp.subject}
                  </span>
                </div>

                <h2 className="text-lg font-black tracking-tight text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                  {exp.title}
                </h2>

                <p className="text-[13.5px] font-medium leading-relaxed text-slate-600 dark:text-slate-300">
                  {exp.description}
                </p>
              </div>

              <div className="mt-6 flex flex-col gap-2.5 border-t border-slate-100 pt-4 dark:border-slate-800">
                <Link
                  href={`/lab/${exp.slug}`}
                  className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-slate-900 bg-blue-600 py-3 text-center text-xs font-black text-white shadow-[2px_2px_0px_0px_rgba(15,23,42,0.9)] transition-all hover:bg-blue-700 active:translate-y-0.5"
                >
                  <span>Buka Simulasi Penuh</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href={exp.lessonUrl}
                  className="inline-flex w-full items-center justify-center gap-1.5 py-1 text-center text-xs font-bold text-slate-600 hover:text-slate-950 hover:underline dark:text-slate-400 dark:hover:text-white"
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>Baca Materi Teori Lengkap</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
