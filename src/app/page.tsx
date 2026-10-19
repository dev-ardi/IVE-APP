import Link from "next/link";
import { HeroShowcase } from "@/components/products/hero-showcase";
import { Card } from "@/components/products/card";
import { DifficultyBadge } from "@/components/products/difficulty-badge";
import { DUMMY_DATA } from "@/data/dummy-data";
import { listSubjectsByLevel } from "@/modules/subjects/service";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const subjects = await listSubjectsByLevel("umum");
  const featuredLessons = DUMMY_DATA.lessons;

  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background pt-12 pb-16 sm:pt-16 sm:pb-24">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-4 sm:px-6">
          <div className="flex flex-col items-center gap-5 text-center max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              IVE-APP — Interactive Visual Education
            </span>

            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Pahami konsep. <br className="hidden sm:inline" />
              <span className="text-primary">Coba sendiri.</span> Jadi makin bisa.
            </h1>

            <p className="text-base text-muted-foreground sm:text-lg leading-relaxed max-w-2xl">
              Platform pembelajaran sains dan matematika berbahasa Indonesia. Belajar bukan sekadar membaca teori, melainkan bereksperimen dengan variabel, melihat visualisasi nyata, dan menguji pemahaman secara langsung.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/explore"
                className="rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition hover:bg-primary/90 active:scale-95"
              >
                Mulai Belajar Sekarang →
              </Link>
              <Link
                href="/lab"
                className="rounded-xl border border-border bg-card px-6 py-3.5 text-sm font-semibold text-foreground transition hover:bg-muted active:scale-95"
              >
                🧪 Eksplorasi Lab Simulasi
              </Link>
            </div>
          </div>

          {/* Interactive Sandbox Showcase */}
          <div className="w-full max-w-4xl">
            <HeroShowcase />
          </div>
        </div>
      </section>

      {/* Subject Category Bar */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 w-full">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Mata Pelajaran (Jenjang Umum)
              </span>
              <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                Jelajahi Berdasarkan Bidang Ilmu
              </h2>
            </div>
            <Link
              href="/explore"
              className="text-xs font-semibold text-primary hover:underline self-start sm:self-auto"
            >
              Lihat Semua Katalog →
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {subjects.map((sub) => (
              <Link
                key={sub.slug}
                href={`/learn/umum/${sub.slug}`}
                className="group flex flex-col items-center justify-center rounded-2xl border border-border/80 bg-card p-5 text-center transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-sm"
              >
                <span className="text-3xl transition-transform group-hover:scale-110">
                  {sub.icon ?? "📚"}
                </span>
                <span className="mt-3 font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                  {sub.name}
                </span>
                <span className="mt-1 text-[11px] text-muted-foreground">
                  {sub.lessonCount} materi interaktif
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Lessons Grid */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 w-full">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Materi Interaktif Pilihan
              </span>
              <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                Pilih Konsep & Mulai Bereksperimen
              </h2>
            </div>
            <p className="text-xs text-muted-foreground max-w-sm">
              Materi disusun dengan simulasi langsung, rumus matematis terstruktur, dan latihan berpenjelasan.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {featuredLessons.map((lesson) => {
              const subj = subjects.find((s) => s.slug === lesson.subjectSlug);
              return (
                <Card
                  key={lesson.slug}
                  href={`/learn/${lesson.levelSlug}/${lesson.subjectSlug}/${lesson.topicSlug}/${lesson.slug}`}
                  icon={subj?.icon ?? "📖"}
                  badge={
                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Interaktif
                      </span>
                      <DifficultyBadge difficulty={lesson.difficulty} />
                    </div>
                  }
                  title={lesson.title}
                  description={lesson.description}
                  footer={
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="font-medium text-foreground/80">
                        {subj?.name ?? lesson.subjectSlug}
                      </span>
                      <span>⏱️ {lesson.durationMinutes} menit</span>
                    </div>
                  }
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* Active Learning Pillars (Belajar dengan Cara Mencoba) */}
      <section className="bg-muted/30 py-16 border-y border-border/80">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col items-center gap-3 text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Metode Pembelajaran Aktif
            </span>
            <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              Belajar dengan Cara Mencoba
            </h2>
            <p className="text-sm text-muted-foreground max-w-xl">
              Pendekatan kami menolak hafalan buta. Kami membangun intuisi melalui pemahaman visual dan eksperimen mandiri.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-border bg-card p-6 flex flex-col gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-2xl text-blue-600">
                👁️
              </span>
              <h3 className="text-base font-bold text-foreground">Visual Intuition</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Setiap rumus matematika dan fenomena sains divisualisasikan dengan diagram dan animasi agar mudah dibayangkan.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 flex flex-col gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-2xl text-amber-600">
                🎛️
              </span>
              <h3 className="text-base font-bold text-foreground">Hands-on Sandbox</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Ubah parameter, sudut, kecepatan, dan suhu. Lihat secara instan bagaimana sistem fisika dan kimia merespon.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 flex flex-col gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-2xl text-emerald-600">
                💡
              </span>
              <h3 className="text-base font-bold text-foreground">Feedback Mendidik</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Soal latihan bukan sekadar benar atau salah. Setiap jawaban disertai pembahasan konseptual yang jelas.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 flex flex-col gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-2xl text-purple-600">
                🤖
              </span>
              <h3 className="text-base font-bold text-foreground">Tanya AI Kontekstual</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Tutor AI siap menjawab pertanyaan khusus materi yang sedang dipelajari tanpa keluar dari halaman.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 w-full">
        <div className="rounded-3xl bg-gradient-to-tr from-primary to-indigo-700 p-8 sm:p-12 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-2 text-center sm:text-left">
            <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
              Siap Memulai Eksplorasi Sains & Matematika?
            </h2>
            <p className="text-sm text-white/80 max-w-lg">
              Akses semua materi dan simulasi secara gratis tanpa hambatan login. Mulai dari Gerak Parabola hingga Fisi Nuklir.
            </p>
          </div>

          <Link
            href="/explore"
            className="whitespace-nowrap rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-primary shadow-md transition hover:bg-slate-100 active:scale-95"
          >
            Buka Katalog Materi →
          </Link>
        </div>
      </section>
    </div>
  );
}