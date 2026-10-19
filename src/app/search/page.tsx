import Link from "next/link";
import type { Metadata } from "next";
import { Suspense } from "react";
import { searchContent, type SearchResultItem } from "@/modules/search/service";
import { SearchInput } from "@/components/products/search-input";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pencarian Materi Sains & Matematika — IVE-APP",
  description: "Cari konsep sains, rumus matematika, simulasi, dan materi pelajaran interaktif di IVE-APP.",
};

const KIND_LABELS: Record<SearchResultItem["kind"], string> = {
  lesson: "Materi Interaktif",
  subject: "Mata Pelajaran",
  topic: "Topik Pembahasan",
};

const POPULAR_SEARCHES = [
  "Gerak Parabola",
  "Siklus Krebs",
  "Konversi Suhu",
  "Trigonometri",
  "Fisi Nuklir",
  "Mitokondria",
  "Lingkaran Satuan",
];

async function SearchResultsInner({ q }: { q: string }) {
  const results = await searchContent(q);

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card p-10 text-center">
        <span className="text-3xl">🔍</span>
        <h3 className="mt-3 text-sm font-bold text-foreground">
          Tidak Ditemukan Hasil untuk &ldquo;{q}&rdquo;
        </h3>
        <p className="mt-1 text-xs text-muted-foreground max-w-sm">
          Coba periksa ejaan kata kunci Anda atau coba salah satu pencarian populer di atas.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <span className="text-xs text-muted-foreground">
        Ditemukan <strong>{results.length}</strong> hasil pencarian:
      </span>
      <ul className="flex flex-col gap-3">
        {results.map((item) => (
          <li key={`${item.kind}-${item.id}`}>
            <Link
              href={item.url}
              className="group flex flex-col gap-1.5 rounded-2xl border border-border bg-card p-4 sm:p-5 transition hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-xs"
            >
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold text-primary">
                  {KIND_LABELS[item.kind]}
                </span>
                {item.subjectName && (
                  <span className="text-[11px] font-medium text-muted-foreground">
                    • {item.subjectName}
                  </span>
                )}
              </div>
              <span className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                {item.title}
              </span>
              {item.description && (
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-10 sm:px-6 sm:py-14">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-primary">
          Pusat Pencarian
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Telusuri Konsep & Simulasi
        </h1>
        <p className="text-sm text-muted-foreground">
          Ketik topik fisika, kimia, biologi, matematika, atau wawasan umum yang ingin Anda pelajari.
        </p>
      </div>

      {/* Input */}
      <div className="flex flex-col gap-3">
        <Suspense fallback={null}>
          <SearchInput />
        </Suspense>

        {/* Quick popular tags */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground pt-1">
          <span className="font-semibold text-foreground/80 mr-1">Pencarian Populer:</span>
          {POPULAR_SEARCHES.map((term) => (
            <Link
              key={term}
              href={`/search?q=${encodeURIComponent(term)}`}
              className="rounded-lg border border-border/80 bg-muted/40 px-2.5 py-1 text-[11px] hover:border-primary/50 hover:bg-muted hover:text-foreground transition"
            >
              {term}
            </Link>
          ))}
        </div>
      </div>

      {/* Search results */}
      {query ? (
        <Suspense
          fallback={
            <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
              <span className="h-2 w-2 rounded-full bg-primary animate-ping" />
              <span>Mencari materi...</span>
            </div>
          }
        >
          <SearchResultsInner q={query} />
        </Suspense>
      ) : (
        <div className="rounded-2xl border border-border/60 bg-muted/20 p-6 text-xs text-muted-foreground leading-relaxed">
          💡 <strong>Tips:</strong> Anda bisa mencari berdasarkan nama konsep (contoh: <em>parabola</em>), nama organel (contoh: <em>mitokondria</em>), atau rumus (contoh: <em>fisi nuklir</em>, <em>skala suhu</em>).
        </div>
      )}
    </div>
  );
}