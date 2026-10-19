/**
 * Interactive component registry (IVE_TAD_Phase_1.md §10, §18; design-cms.md §7.5).
 * The CMS stores a component *key*, never executable code.
 * This module is the single source of truth for known keys and metadata.
 */

export const INTERACTIVE_KEYS = [
  "formula-sandbox",
  "projectile-simulator",
  "trigonometry-visualizer",
  "cell-explorer",
  "atom-explorer",
  "history-timeline",
  "temperature-converter",
  "nuclear-fission",
] as const;

export type InteractiveKey = (typeof INTERACTIVE_KEYS)[number];

export function isInteractiveKey(key: string): key is InteractiveKey {
  return (INTERACTIVE_KEYS as readonly string[]).includes(key);
}

export interface InteractiveMeta {
  key: InteractiveKey;
  title: string;
  description: string;
  subjectHints: string[];
  defaultConfig: Record<string, unknown>;
}

export const INTERACTIVE_REGISTRY: Record<InteractiveKey, InteractiveMeta> = {
  "formula-sandbox": {
    key: "formula-sandbox",
    title: "Formula Sandbox",
    description:
      "Simulasi rumus fleksibel: atur variabel, slider, formula kalkulasi, dan grafik keluaran.",
    subjectHints: ["matematika", "fisika", "kimia"],
    defaultConfig: {
      title: "Simulasi Rumus",
      concept: "Kalkulasi Variabel Interaktif",
      variables: [
        { name: "x", label: "Nilai X", unit: "unit", min: 1, max: 100, step: 1, defaultValue: 10 },
        { name: "k", label: "Faktor Pengali", unit: "", min: 1, max: 10, step: 0.5, defaultValue: 2 },
      ],
      outputs: [{ name: "y", label: "Hasil (k * x)", unit: "unit", expression: "k * x" }],
      visualization: "line",
      explanation: "Sesuaikan slider variabel untuk melihat perubahan nilai kalkulasi secara langsung.",
      textFallback: "Simulasi ini menghitung y = k * x dengan nilai awal x=10 dan k=2.",
    },
  },
  "projectile-simulator": {
    key: "projectile-simulator",
    title: "Simulator Gerak Parabola",
    description: "Simulasi lintasan proyektil berdasarkan sudut elevasi, kecepatan awal, dan gravitasi.",
    subjectHints: ["fisika"],
    defaultConfig: {
      initialVelocity: 20,
      launchAngle: 45,
      gravity: 9.8,
      textFallback: "Simulasi gerak parabola dengan kecepatan 20 m/s dan sudut 45 derajat.",
    },
  },
  "trigonometry-visualizer": {
    key: "trigonometry-visualizer",
    title: "Visualizer Trigonometri",
    description: "Visualisasi interaktif sudut, lingkaran satuan, nilai sinus, cosinus, dan tangen.",
    subjectHints: ["matematika"],
    defaultConfig: {
      initialAngle: 45,
      showUnitCircle: true,
      textFallback: "Visualisasi lingkaran satuan dengan sudut awal 45 derajat.",
    },
  },
  "cell-explorer": {
    key: "cell-explorer",
    title: "Eksplorer Sel Biologi",
    description: "Pemeriksa interaktif organel sel dan fungsinya.",
    subjectHints: ["biologi"],
    defaultConfig: {
      cellType: "animal",
      textFallback: "Penjelajah struktur sel hewan dan organel-organel penyusunnya.",
    },
  },
  "atom-explorer": {
    key: "atom-explorer",
    title: "Eksplorer Struktur Atom",
    description: "Visualisasi model atom, proton, neutron, dan orbital elektron.",
    subjectHints: ["kimia", "fisika"],
    defaultConfig: {
      element: "C",
      textFallback: "Model atom Karbon dengan 6 proton, 6 neutron, dan 6 elektron.",
    },
  },
  "history-timeline": {
    key: "history-timeline",
    title: "Garis Waktu Sejarah",
    description: "Navigasi kronologis peristiwa bersejarah interaktif.",
    subjectHints: ["general-knowledge", "sejarah"],
    defaultConfig: {
      era: "modern",
      textFallback: "Garis waktu peristiwa penting sejarah sains dan teknologi modern.",
    },
  },
  "temperature-converter": {
    key: "temperature-converter",
    title: "Konverter Termodinamika & Suhu",
    description: "Visualisasi konversi suhu Celcius, Fahrenheit, Kelvin, dan Reamur.",
    subjectHints: ["fisika", "kimia"],
    defaultConfig: {
      initialCelsius: 25,
      textFallback: "Konverter skala termometer dengan nilai awal 25 derajat Celcius.",
    },
  },
  "nuclear-fission": {
    key: "nuclear-fission",
    title: "Simulasi Fisi Nuklir",
    description: "Reaksi berantai penembakan neutron pada inti uranium-235.",
    subjectHints: ["fisika", "general-knowledge"],
    defaultConfig: {
      uraniumCount: 15,
      textFallback: "Simulasi reaksi fisi berantai pada inti atom uranium.",
    },
  },
};