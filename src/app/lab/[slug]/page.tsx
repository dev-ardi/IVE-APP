import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { RenderInteractive } from "@/modules/content/render-interactive";

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
  "konversi-suhu": {
    title: "Konversi Skala Suhu & Termometer",
    subject: "Kimia",
    interactiveKey: "temperature-converter",
    desc: "Atur suhu Celsius dan lihat kolom raksa termometer bereaksi serta konversi ke Fahrenheit, Kelvin, dan Reamur.",
    lessonUrl: "/learn/umum/kimia/termodinamika/konversi-suhu",
  },
  "trigonometri": {
    title: "Visualisator Lingkaran Satuan",
    subject: "Matematika",
    interactiveKey: "trigonometry-visualizer",
    desc: "Eksplorasi sudut trigonometri pada lingkaran satuan dan identifikasi nilai sinus, kosinus, dan tangen di empat kuadran.",
    lessonUrl: "/learn/umum/matematika/trigonometri-dasar/trigonometri",
  },
  "fisi-nuklir": {
    title: "Reaksi Fisi Nuklir (U-235)",
    subject: "General Knowledge",
    interactiveKey: "nuclear-fission",
    desc: "Simulasikan penembakan neutron termal ke inti Uranium-235, pembelahan inti menjadi Barium & Kripton, dan pengaturan batang kendali.",
    lessonUrl: "/learn/umum/general-knowledge/energi-dan-sains/fisi-nuklir",
  },
  "siklus-krebs": {
    title: "Penjelajah Sel & Mitokondria",
    subject: "Biologi",
    interactiveKey: "cell-explorer",
    desc: "Pelajari kompartemen sel eukariotik dan organel mitokondria tempat berlangsungnya siklus respirasi aerobik.",
    lessonUrl: "/learn/umum/biologi/metabolisme-sel/siklus-krebs",
  },
  "atom-explorer": {
    title: "Penjelajah Struktur Atom",
    subject: "Kimia & Fisika",
    interactiveKey: "atom-explorer",
    desc: "Visualisasikan konfigurasi partikel subatomik proton, neutron, dan elektron valensi.",
    lessonUrl: "/learn/umum/kimia",
  },
  "history-timeline": {
    title: "Linimasa Sejarah Sains",
    subject: "Pengetahuan Umum",
    interactiveKey: "history-timeline",
    desc: "Eksplorasi peristiwa kunci perkembangan sains dan teknologi di linimasa interaktif.",
    lessonUrl: "/explore",
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = LAB_MAP[slug];
  if (!item) return { title: "Lab Simulasi" };
  return {
    title: `${item.title} — Lab Simulasi`,
    description: item.desc,
  };
}

export default async function LabDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = LAB_MAP[slug];
  if (!item) notFound();

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6 sm:py-12">
      {/* Breadcrumb & Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link href="/lab" className="hover:text-foreground transition">
          ← Kembali ke Semua Lab
        </Link>
        <span>/</span>
        <span className="font-semibold text-foreground">{item.subject}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <span className="text-xs font-semibold text-primary">{item.subject} • Sandbox Mode</span>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            {item.title}
          </h1>
          <p className="mt-1 text-xs text-muted-foreground max-w-2xl">{item.desc}</p>
        </div>

        {item.lessonUrl && (
          <Link
            href={item.lessonUrl}
            className="self-start sm:self-auto rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted transition"
          >
            Buka Pembahasan Materi 📖
          </Link>
        )}
      </div>

      {/* Interactive Simulation Frame */}
      <div className="rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-sm">
        <RenderInteractive componentKey={item.interactiveKey} />
      </div>
    </div>
  );
}
