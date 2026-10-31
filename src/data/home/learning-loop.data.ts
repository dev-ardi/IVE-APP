import {
  Eye,
  Sliders,
  CheckCircle2,
  Bot,
  type LucideIcon,
} from "lucide-react";

export interface LearningStepItem {
  id: string;
  stepNumber: string;
  subheading: string;
  heading: string;
  text: string;
  icon: LucideIcon;
  accentColor: string;
  pillColor: string;
  borderColor: string;
}

export const LEARNING_STEPS: LearningStepItem[] = [
  {
    id: "step-01",
    stepNumber: "01",
    subheading: "Eksplorasi Konseptual",
    heading: "Amati Visual & Konsep Intuitif",
    text: "Setiap materi dibuka dengan visualisasi terstruktur, diagram berlabel, dan analogi dunia nyata tanpa rumus kaku.",
    icon: Eye,
    accentColor: "bg-purple-600 text-white",
    pillColor:
      "bg-purple-100 text-purple-900 border-purple-300 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800",
    borderColor: "border-purple-300 dark:border-purple-800",
  },
  {
    id: "step-02",
    stepNumber: "02",
    subheading: "Laboratorium Langsung",
    heading: "Ubah Parameter di Sandbox Interaktif",
    text: "Geser slider variabel fisika, putar sudut trigonometri, atau atur batang kendali nuklir secara langsung.",
    icon: Sliders,
    accentColor: "bg-blue-600 text-white",
    pillColor:
      "bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800",
    borderColor: "border-blue-300 dark:border-blue-800",
  },
  {
    id: "step-03",
    stepNumber: "03",
    subheading: "Evaluasi Konstruktif",
    heading: "Uji Pemahaman dengan Kuis Terstruktur",
    text: "Pilihan salah tidak menghukum, melainkan membimbing dengan penjelasan logis di mana letak kekeliruan konsep.",
    icon: CheckCircle2,
    accentColor: "bg-emerald-600 text-white",
    pillColor:
      "bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800",
    borderColor: "border-emerald-300 dark:border-emerald-800",
  },
  {
    id: "step-04",
    stepNumber: "04",
    subheading: "Tutor Kontekstual",
    heading: "Tanya AI Sesuai Konteks Materi",
    text: "AI Tutor membaca teks dan rumus di halaman Anda, siap menjawab keraguan spesifik dengan bahasa Indonesia yang santun.",
    icon: Bot,
    accentColor: "bg-amber-600 text-white",
    pillColor:
      "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800",
    borderColor: "border-amber-300 dark:border-amber-800",
  },
];
