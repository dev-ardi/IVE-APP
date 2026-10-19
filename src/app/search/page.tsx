import Link from "next/link";
import type { Metadata } from "next";
import { Suspense } from "react";
import { Search, Lightbulb } from "lucide-react";
import { searchContent, type SearchResultItem } from "@/modules/search/service";
import { SearchInput } from "@/components/products/search-input";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pencarian Materi Sains & Matematika — IVE-APP",
  description:
    "Cari konsep sains, rumus matematika, simulasi, dan materi pelajaran interaktif di IVE-APP.",
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
      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/50 p-10 text-center dark:border-slate-700 dark:bg-slate-900/50">
        <Search className="h-10 w-10 text-slate-400" />
        <h3 className="mt-3 text-base font-extrabold text-slate-900 dark:text-white">
          Tidak Ditemukan Hasil untuk &ldquo;{q}&rdquo;
        </h3>
        <p className="mt-1 max-w-sm text-xs font-medium text-slate-600 dark:text-slate-400">
          Coba periksa ejaan kata kunci Anda atau coba salah satu pencarian populer di atas.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
        Ditemukan <strong className="text-slate-900 dark:text-white">{results.length}</strong> hasil pencarian:
      </span>
      <ul className="flex flex-col gap-3">
        {results.map((item) => (
          <li key={`${item.kind}-${item.id}`}>
            <Link
              href={item.url}
              className="group flex flex-col gap-2 rounded-2xl border-2 border-slate-900/10 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-900 hover:shadow-[3px_3px_0px_0px_rgba(15,23,42,0.9)] dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-200 dark:hover:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.7)]"
            >
              <div className="flex items-center gap-2">
                <span className="rounded-md border border-blue-600/30 bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-800 dark:border-blue-400/30 dark:bg-blue-950/60 dark:text-blue-300">
                  {KIND_LABELS[item.kind]}
                </span>
                {item.subjectName && (
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    • {item.subjectName}
                  </span>
                )}
              </div>
              <span className="text-base font-extrabold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                {item.title}
              </span>
              {item.description && (
                <p className="line-clamp-2 text-xs font-medium leading-relaxed text-slate-600 dark:text-slate-300">
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
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-3 py-10 sm:px-6 sm:py-14">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-blue-700 dark:text-blue-400">
          <Search className="h-4 w-4" />
          <span>Pusat Pencarian Sains & Matematika</span>
        </div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          Telusuri Konsep & Simulasi
        </h1>
        <p className="text-base font-medium text-slate-600 dark:text-slate-300">
          Ketik topik fisika, kimia, biologi, matematika, atau wawasan umum yang ingin Anda pelajari.
        </p>
      </div>

      {/* Input */}
      <div className="flex flex-col gap-3">
        <Suspense fallback={null}>
          <SearchInput />
        </Suspense>

        {/* Quick popular tags */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
          <span className="mr-1 font-bold text-slate-700 dark:text-slate-300">Pencarian Populer:</span>
          {POPULAR_SEARCHES.map((term) => (
            <Link
              key={term}
              href={`/search?q=${encodeURIComponent(term)}`}
              className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-2xs transition hover:border-slate-900 hover:bg-slate-50 hover:text-slate-950 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-400 dark:hover:text-white"
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
            <div className="flex items-center gap-2 py-4 text-sm font-semibold text-slate-600 dark:text-slate-400">
              <span className="h-2 w-2 rounded-full bg-blue-600 animate-ping" />
              <span>Mencari konsep & materi...</span>
            </div>
          }
        >
          <SearchResultsInner q={query} />
        </Suspense>
      ) : (
        <div className="flex items-start gap-3 rounded-2xl border-2 border-slate-900/10 bg-blue-50/50 p-5 text-xs font-medium leading-relaxed text-slate-700 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-300">
          <Lightbulb className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
          <div>
            <strong className="text-slate-900 dark:text-white">Tips Pencarian:</strong> Anda bisa mencari berdasarkan nama konsep (contoh: <em>parabola</em>), nama organel (contoh: <em>mitokondria</em>), atau nama rumus (contoh: <em>fisi nuklir</em>, <em>skala suhu</em>).
          </div>
        </div>
      )}
    </div>
  );
}