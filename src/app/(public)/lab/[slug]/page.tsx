import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { RenderInteractive } from "@/modules/content/render-interactive";
import { ArrowLeft, BookOpen } from "lucide-react";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

const LAB_MAP: Record<
  string,
  {
    title: string;
    subject: string;
    interactiveKey: string;
    desc: string;
    lessonUrl?: string;
  }
> = {
  "gerak-parabola": {
    title: "Simulator Gerak Parabola",
    subject: "Fisika",
    interactiveKey: "projectile-simulator",
    desc: "Manipulasi kecepatan awal dan sudut penembakan untuk melihat efek lintasan parabola dan kalkulasi jangkauan maksimum.",
    lessonUrl: "/learn/umum/fisika/kinematika-gerak/gerak-parabola",
  },
  "eksperimen-gerak-parabola": {
    title: "Eksperimen: Meluncurkan Proyektil",
    subject: "Fisika",
    interactiveKey: "projectile-simulator",
    desc: "Simulasikan lintasan peluru 2D dan periksa jangkauan terjauh di berbagai sudut.",
    lessonUrl: "/learn/umum/fisika/kinematika-gerak/gerak-parabola",
  },
  "gravitasi-newton": {
    title: "Simulasi Gravitasi Newton & Gerak Jatuh Bebas",
    subject: "Fisika",
    interactiveKey: "newtonian-gravity",
    desc: "Eksplorasi hukum gravitasi universal Newton, gerak jatuh bebas apel di bawah pohon, dan perbandingan ruang hampa vs atmosfer.",
    lessonUrl: "/learn/umum/fisika/kinematika-gerak/gravitasi-newton",
  },
  "eksperimen-gravitasi-newton": {
    title: "Eksperimen: Menjatuhkan Apel & Bulu",
    subject: "Fisika",
    interactiveKey: "newtonian-gravity",
    desc: "Uji hukum gravitasi Newton dan buktikan percepatan jatuh bebas identik di ruang hampa untuk berbagai benda.",
    lessonUrl: "/learn/umum/fisika/kinematika-gerak/gravitasi-newton",
  },
  "konversi-suhu": {
    title: "Konversi Skala Suhu & Termometer",
    subject: "Kimia",
    interactiveKey: "formula-sandbox",
    desc: "Atur suhu Celsius dan lihat kolom raksa termometer bereaksi serta konversi ke Fahrenheit, Kelvin, dan Reamur.",
    lessonUrl: "/learn/umum/kimia/suhu-dan-pengukuran/konversi-suhu",
  },
  "eksperimen-konversi-suhu": {
    title: "Eksperimen: Menandingkan Skala Suhu",
    subject: "Kimia",
    interactiveKey: "formula-sandbox",
    desc: "Bandingkan skala termometer Celsius, Fahrenheit, dan Kelvin secara visual.",
    lessonUrl: "/learn/umum/kimia/suhu-dan-pengukuran/eksperimen-konversi-suhu",
  },
  "trigonometri": {
    title: "Visualisator Lingkaran Satuan",
    subject: "Matematika",
    interactiveKey: "trigonometry-visualizer",
    desc: "Eksplorasi sudut trigonometri pada lingkaran satuan dan identifikasi nilai sinus, kosinus, dan tangen di empat kuadran.",
    lessonUrl: "/learn/umum/matematika/trigonometri/trigonometri",
  },
  "eksperimen-trigonometri": {
    title: "Eksperimen: Menjelajahi Lingkaran Satuan",
    subject: "Matematika",
    interactiveKey: "trigonometry-visualizer",
    desc: "Putar jarum sudut untuk mendapatkan rasio trigonometri dan proyeksi segitiga siku-siku.",
    lessonUrl: "/learn/umum/matematika/trigonometri/eksperimen-trigonometri",
  },
  "fisi-nuklir": {
    title: "Reaksi Fisi Nuklir (U-235)",
    subject: "Pengetahuan Umum",
    interactiveKey: "atom-explorer",
    desc: "Simulasikan penembakan neutron termal ke inti Uranium-235, pembelahan inti menjadi Barium & Kripton, dan pengaturan batang kendali.",
    lessonUrl: "/learn/umum/pengetahuan-umum/fisika-nuklir/fisi-nuklir",
  },
  "siklus-krebs": {
    title: "Penjelajah Sel & Mitokondria",
    subject: "Biologi",
    interactiveKey: "cell-explorer",
    desc: "Pelajari kompartemen sel eukariotik dan organel mitokondria tempat berlangsungnya siklus respirasi aerobik.",
    lessonUrl: "/learn/umum/biologi/metabolisme-sel/siklus-krebs",
  },
  "eksperimen-organel-sel": {
    title: "Eksperimen: Menjelajahi Organel Sel",
    subject: "Biologi",
    interactiveKey: "cell-explorer",
    desc: "Identifikasi struktur membran sel, inti sel, retikulum endoplasma, dan mitokondria.",
    lessonUrl: "/learn/umum/biologi/metabolisme-sel/eksperimen-organel-sel",
  },
  "atom-explorer": {
    title: "Penjelajah Struktur Atom",
    subject: "Kimia & Fisika",
    interactiveKey: "atom-explorer",
    desc: "Visualisasikan konfigurasi partikel subatomik proton, neutron, dan elektron valensi.",
    lessonUrl: "/learn/umum/kimia/suhu-dan-pengukuran/struktur-atom-dan-tabel-periodik",
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const dbLesson = await prisma.lesson.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: { subject: true },
  });

  if (dbLesson) {
    return {
      title: `${dbLesson.title} — Lab Simulasi | IVE-APP`,
      description: dbLesson.description ?? undefined,
    };
  }

  const item = LAB_MAP[slug];
  if (!item) return { title: "Lab Simulasi | IVE-APP" };
  return {
    title: `${item.title} — Lab Simulasi | IVE-APP`,
    description: item.desc,
  };
}

export default async function LabDetailPage({ params }: Props) {
  const { slug } = await params;

  const dbLesson = await prisma.lesson.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: { subject: true, topic: true, educationLevel: true },
  });

  let title = "";
  let subjectName = "";
  let description = "";
  let interactiveKey = "projectile-simulator";
  let interactiveConfig: Record<string, unknown> | undefined;
  let lessonUrl: string | undefined;

  if (dbLesson) {
    title = dbLesson.title;
    subjectName = dbLesson.subject.name;
    description = dbLesson.description || "";
    const levelSlug = dbLesson.educationLevel.slug || "umum";
    const topicSlug = dbLesson.topic?.slug || "umum";
    lessonUrl = `/learn/${levelSlug}/${dbLesson.subject.slug}/${topicSlug}/${dbLesson.slug}`;

    const blocks = (Array.isArray(dbLesson.contentBlocks)
      ? dbLesson.contentBlocks
      : dbLesson.content) as Array<{ type: string; component?: string; config?: Record<string, unknown> }>;
    const interactiveBlock = Array.isArray(blocks) ? blocks.find((b) => b.type === "interactive") : null;
    if (interactiveBlock && interactiveBlock.component) {
      interactiveKey = interactiveBlock.component;
      interactiveConfig = interactiveBlock.config;
    } else if (LAB_MAP[slug]) {
      interactiveKey = LAB_MAP[slug].interactiveKey;
    }
  } else if (LAB_MAP[slug]) {
    const fallback = LAB_MAP[slug];
    title = fallback.title;
    subjectName = fallback.subject;
    description = fallback.desc;
    interactiveKey = fallback.interactiveKey;
    lessonUrl = fallback.lessonUrl;
  } else {
    notFound();
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6 sm:py-12">
      {/* Breadcrumb & Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
        <Link href="/lab" className="hover:text-foreground transition flex items-center gap-1 font-bold">
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Kembali ke Lab Simulasi</span>
        </Link>
        <span>/</span>
        <span className="font-semibold text-foreground">{subjectName}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b-2 border-stone-900/10 dark:border-stone-800 pb-5">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            {subjectName} • Sandbox Simulasi Mandiri
          </span>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-foreground sm:text-3xl">
            {title}
          </h1>
          {description && (
            <p className="mt-1.5 text-xs font-medium text-muted-foreground max-w-2xl leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {lessonUrl && (
          <Link
            href={lessonUrl}
            className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-xl border-2 border-stone-900 bg-white px-4 py-2 text-xs font-bold text-stone-900 shadow-[2px_2px_0px_0px_rgba(24,24,27,0.9)] transition-all hover:bg-stone-50 active:translate-y-0.5 dark:border-white dark:bg-stone-900 dark:text-white"
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>Materi Teori Lengkap</span>
          </Link>
        )}
      </div>

      {/* Interactive Simulation Frame */}
      <div className="rounded-2xl border-2 border-stone-900 bg-card p-4 sm:p-6 shadow-[3px_3px_0px_0px_rgba(24,24,27,0.9)] dark:border-stone-200 dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.7)]">
        <RenderInteractive componentKey={interactiveKey} config={interactiveConfig} />
      </div>
    </div>
  );
}
