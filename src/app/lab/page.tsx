import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lab Simulasi Sains & Interaktif",
  description: "Eksplorasi simulasi sains, fisika, kimia, matematika, dan biologi langsung di laboratorium visual IVE-APP.",
};

const EXPERIMENTS = [
  {
    slug: "gerak-parabola",
    title: "Simulator Gerak Parabola",
    subject: "Fisika",
    icon: "⚛️",
    color: "border-blue-500/30 bg-blue-500/5",
    description: "Simulasi lintasan peluru 2D. Atur sudut elevasi, kecepatan awal, dan gravitasi bumi untuk melihat kalkulasi waktu terbang dan jangkauan terjauh.",
    lessonUrl: "/learn/umum/fisika/kinematika-gerak/gerak-parabola",
  },
  {
    slug: "konversi-suhu",
    title: "Konversi Skala Suhu & Termometer",
    subject: "Kimia",
    icon: "🧪",
    color: "border-amber-500/30 bg-amber-500/5",
    description: "Eksperimen kolom raksa termometer dinamis. Amati perubahan nilai dan rumus konversi antara Celsius, Fahrenheit, Kelvin, dan Reamur.",
    lessonUrl: "/learn/umum/kimia/termodinamika/konversi-suhu",
  },
  {
    slug: "trigonometri",
    title: "Visualisator Lingkaran Satuan",
    subject: "Matematika",
    icon: "📐",
    color: "border-indigo-500/30 bg-indigo-500/5",
    description: "Manipulasi sudut trigonometri pada lingkaran berpusat (0,0) dengan r=1. Dapatkan nilai eksak sinus, kosinus, tangen, dan kuadran secara visual.",
    lessonUrl: "/learn/umum/matematika/trigonometri-dasar/trigonometri",
  },
  {
    slug: "fisi-nuklir",
    title: "Reaksi Fisi Nuklir U-235",
    subject: "General Knowledge",
    icon: "🌍",
    color: "border-violet-500/30 bg-violet-500/5",
    description: "Tembakkan neutron termal ke inti Uranium-235, saksikan pembelahan inti atom, pelepasan 3 neutron bebas baru, dan kendalikan reaksi dengan batang kendali.",
    lessonUrl: "/learn/umum/general-knowledge/energi-dan-sains/fisi-nuklir",
  },
  {
    slug: "siklus-krebs",
    title: "Penjelajah Sel & Mitokondria",
    subject: "Biologi",
    icon: "🧬",
    color: "border-emerald-500/30 bg-emerald-500/5",
    description: "Telusuri anatomi membran mitokondria, matriks seluler tempat terjadinya Siklus Krebs, dan pelajari produksi pembawa energi NADH dan FADH2.",
    lessonUrl: "/learn/umum/biologi/metabolisme-sel/siklus-krebs",
  },
  {
    slug: "atom-explorer",
    title: "Penjelajah Struktur Atom",
    subject: "Kimia & Fisika",
    icon: "🔬",
    color: "border-cyan-500/30 bg-cyan-500/5",
    description: "Visualisasi model atom, proton, neutron, dan elektron valensi pada berbagai unsur tabel periodik.",
    lessonUrl: "/learn/umum/kimia",
  },
];

export default function LabPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-10 sm:px-6 sm:py-14">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
          <span>Laboratorium Interaktif</span>
          <span>•</span>
          <span>Sandbox Mode</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Lab Simulasi & Eksperimen Bebas
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground leading-relaxed">
          Ruang eksperimen cepat untuk Anda yang ingin langsung mencoba simulasi visual tanpa harus membaca seluruh materi teori terlebih dahulu.
        </p>
      </div>

      {/* Grid of Experiments */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {EXPERIMENTS.map((exp) => (
          <div
            key={exp.slug}
            className={`flex flex-col justify-between rounded-2xl border p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${exp.color}`}
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-background text-2xl shadow-xs">
                  {exp.icon}
                </span>
                <span className="rounded-full bg-background/80 px-2.5 py-0.5 text-[11px] font-semibold text-foreground/80 border border-border/60">
                  {exp.subject}
                </span>
              </div>

              <h2 className="text-lg font-bold text-foreground tracking-tight">
                {exp.title}
              </h2>

              <p className="text-xs text-muted-foreground leading-relaxed">
                {exp.description}
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-2 pt-4 border-t border-border/50">
              <Link
                href={`/lab/${exp.slug}`}
                className="w-full rounded-xl bg-primary py-2.5 text-center text-xs font-semibold text-primary-foreground shadow-xs transition hover:bg-primary/90"
              >
                Buka Simulasi Penuh →
              </Link>
              <Link
                href={exp.lessonUrl}
                className="w-full text-center text-[11px] font-medium text-muted-foreground hover:text-foreground hover:underline"
              >
                Baca Materi & Pembahasan Teori
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
