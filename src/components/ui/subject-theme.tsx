import React from "react";
import {
  Sigma,
  Atom,
  FlaskConical,
  Dna,
  Globe2,
  BookOpen,
  type LucideIcon,
} from "lucide-react";

export interface SubjectTheme {
  name: string;
  slug: string;
  tagline: string;
  icon: LucideIcon;
  // Soothing section & card color properties inspired by oblo.aura.build
  bgTint: string;
  cardBg: string;
  cardBorder: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  iconBg: string;
  iconColor: string;
  cardBorderHover: string;
  shadowColor: string;
  accentBg: string;
}

export const SUBJECT_THEMES: Record<string, SubjectTheme> = {
  matematika: {
    name: "Matematika",
    slug: "matematika",
    tagline: "Logika Pola, Aljabar, Geometri, & Trigonometri",
    icon: Sigma,
    bgTint: "bg-[#EEF4FF] dark:bg-[#131A29]",
    cardBg: "bg-[#F3F7FF] dark:bg-[#162035]",
    cardBorder: "border-[#93B4F8] dark:border-[#2D4A88]",
    badgeBg: "bg-[#DDE9FF] dark:bg-[#1D2B4D]",
    badgeText: "text-[#1E3A8A] dark:text-[#93B4F8] font-bold",
    badgeBorder: "border-[#93B4F8] dark:border-[#2D4A88]",
    iconBg: "bg-[#CBE0FE] dark:bg-[#20335E]",
    iconColor: "text-[#1E40AF] dark:text-[#93B4F8]",
    cardBorderHover: "hover:border-[#2563EB]",
    shadowColor: "shadow-[3.5px_3.5px_0px_0px_rgba(30,58,138,0.85)]",
    accentBg: "bg-[#2563EB] text-white",
  },
  fisika: {
    name: "Fisika",
    slug: "fisika",
    tagline: "Hukum Gerak, Dinamika Energi, & Fenomena Alam",
    icon: Atom,
    bgTint: "bg-[#EBF8FB] dark:bg-[#112025]",
    cardBg: "bg-[#F1FCFD] dark:bg-[#15272E]",
    cardBorder: "border-[#87D7E8] dark:border-[#1E4954]",
    badgeBg: "bg-[#D6F2F7] dark:bg-[#183942]",
    badgeText: "text-[#0E5263] dark:text-[#87D7E8] font-bold",
    badgeBorder: "border-[#87D7E8] dark:border-[#1E4954]",
    iconBg: "bg-[#BFE9F2] dark:bg-[#1D4A56]",
    iconColor: "text-[#0891B2] dark:text-[#87D7E8]",
    cardBorderHover: "hover:border-[#0891B2]",
    shadowColor: "shadow-[3.5px_3.5px_0px_0px_rgba(8,145,178,0.85)]",
    accentBg: "bg-[#0891B2] text-white",
  },
  kimia: {
    name: "Kimia",
    slug: "kimia",
    tagline: "Struktur Materi, Termodinamika, & Reaksi Ikatan",
    icon: FlaskConical,
    bgTint: "bg-[#F7F0FC] dark:bg-[#1F1426]",
    cardBg: "bg-[#FAF5FD] dark:bg-[#25182F]",
    cardBorder: "border-[#D8B4FE] dark:border-[#522978]",
    badgeBg: "bg-[#EEDCFB] dark:bg-[#3B1B59]",
    badgeText: "text-[#581C87] dark:text-[#D8B4FE] font-bold",
    badgeBorder: "border-[#D8B4FE] dark:border-[#522978]",
    iconBg: "bg-[#E3C3FA] dark:bg-[#471E6E]",
    iconColor: "text-[#7C3AED] dark:text-[#D8B4FE]",
    cardBorderHover: "hover:border-[#9333EA]",
    shadowColor: "shadow-[3.5px_3.5px_0px_0px_rgba(124,58,237,0.85)]",
    accentBg: "bg-[#7C3AED] text-white",
  },
  biologi: {
    name: "Biologi",
    slug: "biologi",
    tagline: "Metabolisme Seluler, Organisme, & Ekosistem",
    icon: Dna,
    bgTint: "bg-[#EFF8F2] dark:bg-[#122216]",
    cardBg: "bg-[#F4FAF6] dark:bg-[#162A1C]",
    cardBorder: "border-[#93E2B1] dark:border-[#1E4E2C]",
    badgeBg: "bg-[#D8F3E2] dark:bg-[#1B3F25]",
    badgeText: "text-[#065F35] dark:text-[#93E2B1] font-bold",
    badgeBorder: "border-[#93E2B1] dark:border-[#1E4E2C]",
    iconBg: "bg-[#BFE9CD] dark:bg-[#205230]",
    iconColor: "text-[#059669] dark:text-[#93E2B1]",
    cardBorderHover: "hover:border-[#059669]",
    shadowColor: "shadow-[3.5px_3.5px_0px_0px_rgba(5,150,105,0.85)]",
    accentBg: "bg-[#059669] text-white",
  },
  "general-knowledge": {
    name: "General Knowledge",
    slug: "general-knowledge",
    tagline: "Fisi Nuklir, Astronomi, & Terobosan Sains Masa Depan",
    icon: Globe2,
    bgTint: "bg-[#FDF6EC] dark:bg-[#241A10]",
    cardBg: "bg-[#FEFAEF] dark:bg-[#2C2013]",
    cardBorder: "border-[#F9CE87] dark:border-[#6B4715]",
    badgeBg: "bg-[#FDE7C4] dark:bg-[#4C3310]",
    badgeText: "text-[#7B341E] dark:text-[#F9CE87] font-bold",
    badgeBorder: "border-[#F9CE87] dark:border-[#6B4715]",
    iconBg: "bg-[#FADBB0] dark:bg-[#5E3F14]",
    iconColor: "text-[#D97706] dark:text-[#F9CE87]",
    cardBorderHover: "hover:border-[#D97706]",
    shadowColor: "shadow-[3.5px_3.5px_0px_0px_rgba(217,119,6,0.85)]",
    accentBg: "bg-[#D97706] text-white",
  },
};

export function getSubjectTheme(slug: string): SubjectTheme {
  const normalized = slug.toLowerCase();
  return (
    SUBJECT_THEMES[normalized] || {
      name: slug,
      slug,
      tagline: "Eksplorasi Konsep & Teori Terstruktur",
      icon: BookOpen,
      bgTint: "bg-stone-50 dark:bg-stone-900",
      cardBg: "bg-stone-50 dark:bg-stone-900",
      cardBorder: "border-stone-300 dark:border-stone-700",
      badgeBg: "bg-stone-100 dark:bg-stone-800",
      badgeText: "text-stone-800 dark:text-stone-200 font-bold",
      badgeBorder: "border-stone-300 dark:border-stone-700",
      iconBg: "bg-stone-200 dark:bg-stone-700",
      iconColor: "text-stone-700 dark:text-stone-300",
      cardBorderHover: "hover:border-stone-500",
      shadowColor: "shadow-[3.5px_3.5px_0px_0px_rgba(24,24,27,0.85)]",
      accentBg: "bg-stone-800 text-white",
    }
  );
}

export function SubjectIcon({
  slug,
  size = 20,
  className = "",
}: {
  slug: string;
  size?: number;
  className?: string;
}) {
  const theme = getSubjectTheme(slug);
  const Icon = theme.icon;
  return <Icon size={size} className={`${theme.iconColor} ${className}`} aria-hidden="true" />;
}
