import {
  Atom,
  FlaskConical,
  Sigma,
  Globe2,
  type LucideIcon,
} from "lucide-react";

export interface HeroLabTabItem {
  id: string;
  title: string;
  subject: string;
  slug: string;
  icon: LucideIcon;
  badgeBg: string;
  buttonActive: string;
  url: string;
  desc: string;
}

export const HERO_LAB_TABS: HeroLabTabItem[] = [
  {
    id: "parabola",
    title: "Gerak Parabola",
    subject: "Fisika",
    slug: "fisika",
    icon: Atom,
    badgeBg:
      "bg-sky-100 text-sky-800 border-sky-300 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800",
    buttonActive:
      "bg-sky-600 text-white -translate-y-0.5 shadow-[2px_2px_0px_0px_rgba(15,23,42,0.9)]",
    url: "/learn/umum/fisika/kinematika-gerak/gerak-parabola",
    desc: "Ubah sudut elevasi dan kecepatan awal proyektil. Amati bagaimana gravitasi membentuk lintasan lengkung kuadratik secara instan.",
  },
  {
    id: "suhu",
    title: "Konversi Suhu",
    subject: "Kimia",
    slug: "kimia",
    icon: FlaskConical,
    badgeBg:
      "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800",
    buttonActive:
      "bg-purple-600 text-white -translate-y-0.5 shadow-[2px_2px_0px_0px_rgba(15,23,42,0.9)]",
    url: "/learn/umum/kimia/termodinamika/konversi-suhu",
    desc: "Geser suhu Celsius dan amati respon linear skala Fahrenheit, titik nol mutlak Kelvin, dan skala Reamur dalam tabung termometer visual.",
  },
  {
    id: "trigonometri",
    title: "Lingkaran Satuan",
    subject: "Matematika",
    slug: "matematika",
    icon: Sigma,
    badgeBg:
      "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800",
    buttonActive:
      "bg-blue-600 text-white -translate-y-0.5 shadow-[2px_2px_0px_0px_rgba(15,23,42,0.9)]",
    url: "/learn/umum/matematika/trigonometri-dasar/trigonometri",
    desc: "Putar jarum sudut derajat pada lingkaran satuan trigonometri untuk melihat proyeksi visual sinus (vertikal) dan kosinus (horizontal).",
  },
  {
    id: "nuklir",
    title: "Fisi Nuklir",
    subject: "General Knowledge",
    slug: "general-knowledge",
    icon: Globe2,
    badgeBg:
      "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800",
    buttonActive:
      "bg-amber-600 text-white -translate-y-0.5 shadow-[2px_2px_0px_0px_rgba(15,23,42,0.9)]",
    url: "/learn/umum/general-knowledge/energi-dan-sains/fisi-nuklir",
    desc: "Tembakkan neutron berkecepatan tinggi ke inti Uranium-235. Atur kedalaman batang kendali untuk mencegah reaksi berantai tak terkendali.",
  },
];
