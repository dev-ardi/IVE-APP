import {
  Atom,
  Flame,
  Dna,
  Binary,
  Zap,
  type LucideIcon,
} from "lucide-react";

export interface SubjectShowcaseItem {
  id: string;
  subjectSlug: string;
  category: string;
  heading: string;
  text: string;
  icon: LucideIcon;
  colSpan: string;
  bgLight: string;
  bgDark: string;
  iconBorder: string;
  iconBg: string;
  iconColor: string;
  badgeBg: string;
  ctaText: string;
  ctaBg: string;
  formula?: string;
  previewTag?: string;
  focusText?: string;
  metaTags?: string[];
}

export const SUBJECT_SHOWCASE_ITEMS: SubjectShowcaseItem[] = [
  {
    id: "fisika",
    subjectSlug: "fisika",
    category: "Modul Unggulan • Fisika Klasik",
    heading: "Fisika Mekanika & Dinamika",
    text: "Eksplorasi gravitasi, sudut elevasi, dan vektor kecepatan pada gerak parabola tanpa batas lembar soal kertas. Putar simulasi secara real-time.",
    icon: Atom,
    colSpan: "lg:col-span-7",
    bgLight: "bg-[#EBF2FE]",
    bgDark: "dark:bg-[#121B2B]",
    iconBorder: "border-blue-400",
    iconBg: "bg-blue-100 dark:bg-blue-950",
    iconColor: "text-blue-700 dark:text-blue-300",
    badgeBg: "border-blue-400/40 bg-blue-200/60 text-blue-900 dark:bg-blue-900/60 dark:text-blue-200",
    ctaText: "Masuk Lab Fisika",
    ctaBg: "bg-blue-600 hover:bg-blue-700",
    formula: "y = v_0 \\sin(\\theta)t - \\frac{1}{2}gt^2",
    previewTag: "Simulasi Gerak Parabola 60 FPS",
    focusText: "Fokus: Gerak Peluru, Hukum Newton, Kecepatan Relatif",
  },
  {
    id: "biologi",
    subjectSlug: "biologi",
    category: "Biologi Seluler",
    heading: "Biologi & Metabolisme",
    text: "Pahami Siklus Krebs, fosforilasi oksidatif, dan produksi ATP seluler dengan animasi mikroskopis interaktif.",
    icon: Dna,
    colSpan: "lg:col-span-5",
    bgLight: "bg-[#EBF7F0]",
    bgDark: "dark:bg-[#0E2017]",
    iconBorder: "border-emerald-400",
    iconBg: "bg-emerald-100 dark:bg-emerald-950",
    iconColor: "text-emerald-800 dark:text-emerald-300",
    badgeBg: "border-emerald-400/40 bg-emerald-200/60 text-emerald-900 dark:bg-emerald-900/60 dark:text-emerald-200",
    ctaText: "Jelajahi Biologi",
    ctaBg: "bg-emerald-700 hover:bg-emerald-800",
    metaTags: ["Video Konten Lokal Tersedia", "+36 ATP Yield"],
  },
  {
    id: "kimia",
    subjectSlug: "kimia",
    category: "Termodinamika",
    heading: "Kimia & Suhu",
    text: "Korelasi energi kinetik molekuler pada skala Celcius, Fahrenheit, dan Kelvin absolut.",
    icon: Flame,
    colSpan: "lg:col-span-4",
    bgLight: "bg-[#FFF2EA]",
    bgDark: "dark:bg-[#25150E]",
    iconBorder: "border-amber-400",
    iconBg: "bg-amber-100 dark:bg-amber-950",
    iconColor: "text-amber-800 dark:text-amber-300",
    badgeBg: "border-amber-300 bg-white/80 text-amber-900 dark:border-amber-700 dark:bg-stone-900 dark:text-amber-200",
    ctaText: "Buka Materi Kimia",
    ctaBg: "bg-amber-600 hover:bg-amber-700",
    formula: "0\\text{ K} = -273.15^\\circ\\text{C}",
  },
  {
    id: "matematika",
    subjectSlug: "matematika",
    category: "Geometri",
    heading: "Matematika Trigonometri",
    text: "Visualisasikan sinus, kosinus, dan tangen langsung di lingkaran satuan interaktif.",
    icon: Binary,
    colSpan: "lg:col-span-4",
    bgLight: "bg-[#F0F5FF]",
    bgDark: "dark:bg-[#111927]",
    iconBorder: "border-blue-400",
    iconBg: "bg-blue-100 dark:bg-blue-950",
    iconColor: "text-blue-800 dark:text-blue-300",
    badgeBg: "border-blue-300 bg-white/80 text-blue-900 dark:border-blue-700 dark:bg-stone-900 dark:text-blue-200",
    ctaText: "Buka Materi Matematika",
    ctaBg: "bg-blue-700 hover:bg-blue-800",
    formula: "\\sin^2(\\theta) + \\cos^2(\\theta) = 1",
  },
  {
    id: "general-knowledge",
    subjectSlug: "general-knowledge",
    category: "Sains Nuklir",
    heading: "Sains Populer & Nuklir",
    text: "Pahami pembelahan inti Uranium-235 dan simulasi pengendalian reaksi fisi berantai.",
    icon: Zap,
    colSpan: "lg:col-span-4",
    bgLight: "bg-[#F6EEFD]",
    bgDark: "dark:bg-[#1E1128]",
    iconBorder: "border-purple-400",
    iconBg: "bg-purple-100 dark:bg-purple-950",
    iconColor: "text-purple-800 dark:text-purple-300",
    badgeBg: "border-purple-300 bg-white/80 text-purple-900 dark:border-purple-700 dark:bg-stone-900 dark:text-purple-200",
    ctaText: "Simulasi Fisi Nuklir",
    ctaBg: "bg-purple-700 hover:bg-purple-800",
    formula: "^{235}_{92}\\text{U} + ^1_0n \\rightarrow \\text{Fisi} + 3^1_0n",
  },
];
