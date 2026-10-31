import {
  TrendingUp,
  Sliders,
  Sparkles,
  Zap,
  HelpCircle,
  type LucideIcon,
} from "lucide-react";
import type { CardFeatureItem } from "@/components/ui/modular-card";

export interface MethodComparisonItem {
  id: "active" | "passive";
  tabLabel: string;
  subheading: string;
  heading: string;
  text: string;
  icon: LucideIcon;
  subheadingColor: string;
  features: CardFeatureItem[];
  checklistBg: string;
}

export interface ImpactPillarItem {
  id: string;
  metric: string;
  metricColor: string;
  heading: string;
  text: string;
  icon: LucideIcon;
}

export const COMPARISON_ITEMS: MethodComparisonItem[] = [
  {
    id: "active",
    tabLabel: "✨ Belajar IVE-APP",
    subheading: "Manipulasi Langsung & Intuisi Visual",
    heading: "Ubah Angkanya, Lihat Reaksinya Seketika",
    text: "Di IVE-APP, setiap formula fisika dan diagram reaksi dapat diutak-atik. Saat Anda mengubah sudut proyektil, kurva parabola langsung melengkung di layar Anda. Anda paham 'kenapa' rumusnya bekerja, bukan sekadar menghafalnya untuk ujian besok.",
    icon: Zap,
    subheadingColor: "text-emerald-700 dark:text-emerald-400",
    features: [
      { id: "feat-1", text: "Visualisasi kanvas 60 FPS", positive: true },
      { id: "feat-2", text: "Miskonsepsi diluruskan kuis", positive: true },
      { id: "feat-3", text: "Tutor AI siap tanya jawab", positive: true },
    ],
    checklistBg:
      "border-2 border-emerald-500/20 bg-emerald-50/70 dark:bg-emerald-950/40",
  },
  {
    id: "passive",
    tabLabel: "✕ Cara Tradisional",
    subheading: "Membaca Pasif & Hafalan Buta",
    heading: "Membaca Halaman Teori Tanpa Interaksi",
    text: "Siswa dipaksa mengingat simbol-simbol asing tanpa tahu apa yang terjadi dalam dunia nyata. Begitu soal diubah sedikit atau variabel diganti, kebingungan muncul kembali karena konsep dasarnya tidak pernah benar-benar menempel di benak.",
    icon: HelpCircle,
    subheadingColor: "text-rose-700 dark:text-rose-400",
    features: [
      { id: "feat-4", text: "Cepat lupa dalam 48 jam", positive: false },
      { id: "feat-5", text: "Rumus terasa abstrak & membosankan", positive: false },
      { id: "feat-6", text: "Tidak ada umpan balik instan", positive: false },
    ],
    checklistBg:
      "border border-rose-300 bg-rose-50/70 dark:bg-rose-950/30",
  },
];

export const IMPACT_PILLARS: ImpactPillarItem[] = [
  {
    id: "retention",
    metric: "3.2×",
    metricColor: "text-emerald-700 dark:text-emerald-400",
    heading: "Retensi Konsep Lebih Kuat",
    text: "Eksperimen langsung memicu kognisi aktif yang membuat memori bertahan jauh lebih lama dibanding sekadar membaca.",
    icon: TrendingUp,
  },
  {
    id: "exploration",
    metric: "100%",
    metricColor: "text-blue-700 dark:text-blue-400",
    heading: "Eksplorasi Tanpa Batas",
    text: "Semua simulasi berjalan langsung di browser tanpa perlu install aplikasi berat atau setup rumit.",
    icon: Sliders,
  },
  {
    id: "access",
    metric: "Zero-Cost",
    metricColor: "text-amber-700 dark:text-amber-400",
    heading: "Akses Penuh Jenjang Umum",
    text: "Terbuka untuk siapa pun: pelajar sekolah, mahasiswa, maupun pembelajar mandiri yang ingin mengasah sains.",
    icon: Sparkles,
  },
];
