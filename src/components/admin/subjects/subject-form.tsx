"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Sparkles } from "lucide-react";
import { CmsInput, CmsTextarea, CmsSelect, CmsFormField } from "@/components/admin/ui/input";
import { CmsButton } from "@/components/admin/ui/button";
import { CmsPanel } from "@/components/admin/ui/panel";
import { getSubjectTheme, SUBJECT_THEMES } from "@/components/ui/subject-theme";

interface SubjectFormProps {
  initialData?: {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    icon?: string | null;
    coverImage?: string | null;
    educationLevelId: string;
    order?: number;
    status?: string;
  };
  levels: { id: string; name: string; slug: string }[];
  isEdit?: boolean;
}

export function SubjectForm({ initialData, levels, isEdit = false }: SubjectFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialData?.name || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [educationLevelId, setEducationLevelId] = useState(
    initialData?.educationLevelId || levels[0]?.id || "",
  );
  const [description, setDescription] = useState(initialData?.description || "");
  const [icon, setIcon] = useState(initialData?.icon || "");
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || "");
  const [order, setOrder] = useState<number>(initialData?.order ?? 0);
  const [status, setStatus] = useState<string>(initialData?.status || "PUBLISHED");

  const [isAutoSlug, setIsAutoSlug] = useState(!isEdit);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  // Auto-slugify from name if not manually edited
  const handleNameChange = (val: string) => {
    setName(val);
    if (isAutoSlug) {
      const generated = val
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setSlug(generated);
    }
  };

  // Live subject theme evaluation (design-cms.md §8.3)
  const normalizedSlug = slug.toLowerCase().trim();
  const hasCustomTheme = normalizedSlug in SUBJECT_THEMES;
  const currentTheme = getSubjectTheme(normalizedSlug || "umum");
  const ThemeIcon = currentTheme.icon;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Nama mata pelajaran wajib diisi.");
      return;
    }
    if (!educationLevelId) {
      setError("Jenjang pendidikan wajib dipilih.");
      return;
    }

    setIsPending(true);
    try {
      const url = isEdit
        ? `/api/admin/subjects/${initialData?.id}`
        : "/api/admin/subjects";
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          slug: slug.trim() || undefined,
          educationLevelId,
          description: description.trim() || null,
          icon: icon.trim() || null,
          coverImage: coverImage.trim() || null,
          order: Number(order) || 0,
          status,
        }),
      });

      const body = await res.json().catch(() => null);
      if (!res.ok) {
        setError(body?.error?.message || "Gagal menyimpan mata pelajaran.");
        setIsPending(false);
        return;
      }

      router.push("/admin/subjects");
      router.refresh();
    } catch {
      setError("Ups, terjadi gangguan jaringan. Silakan coba lagi.");
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Left 2 Cols: Form Fields */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        <CmsPanel title={isEdit ? `Edit Mata Pelajaran: ${initialData?.name}` : "Informasi Mata Pelajaran"}>
          {error && (
            <div className="mb-4 rounded-lg border-2 border-[#FF6B6B] bg-red-50 p-3 text-xs font-bold text-red-700 dark:bg-red-950/40 dark:text-red-300">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-4">
            <CmsFormField label="Nama Mata Pelajaran" required id="subject-name">
              <CmsInput
                id="subject-name"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Contoh: Kimia"
              />
            </CmsFormField>

            <CmsFormField
              label="Slug URL"
              hint="Digunakan di URL publik (/learn/umum/:slug)"
              id="subject-slug"
            >
              <CmsInput
                id="subject-slug"
                value={slug}
                onChange={(e) => {
                  setIsAutoSlug(false);
                  setSlug(e.target.value);
                }}
                placeholder="kimia"
              />
            </CmsFormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CmsFormField label="Jenjang Pendidikan" required id="subject-level">
                <CmsSelect
                  id="subject-level"
                  value={educationLevelId}
                  onChange={(e) => setEducationLevelId(e.target.value)}
                >
                  {levels.map((lvl) => (
                    <option key={lvl.id} value={lvl.id}>
                      {lvl.name} ({lvl.slug})
                    </option>
                  ))}
                </CmsSelect>
              </CmsFormField>

              <CmsFormField label="Status Konten" id="subject-status">
                <CmsSelect
                  id="subject-status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="PUBLISHED">Dipublikasikan (PUBLISHED)</option>
                  <option value="DRAFT">Draf (DRAFT)</option>
                  <option value="ARCHIVED">Diarsipkan (ARCHIVED)</option>
                </CmsSelect>
              </CmsFormField>
            </div>

            <CmsFormField label="Deskripsi Ringkas" id="subject-desc">
              <CmsTextarea
                id="subject-desc"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Penjelasan ringkas tentang bidang keilmuan ini..."
              />
            </CmsFormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CmsFormField label="Ikon Lucide (opsional)" id="subject-icon">
                <CmsInput
                  id="subject-icon"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  placeholder="atom, flask-conical, sigma..."
                />
              </CmsFormField>

              <CmsFormField label="Urutan Tampilan" id="subject-order">
                <CmsInput
                  id="subject-order"
                  type="number"
                  min={0}
                  value={order}
                  onChange={(e) => setOrder(parseInt(e.target.value, 10) || 0)}
                />
              </CmsFormField>
            </div>
          </div>
        </CmsPanel>

        <div className="flex items-center justify-end gap-3">
          <CmsButton
            type="button"
            variant="secondary"
            onClick={() => router.push("/admin/subjects")}
          >
            Batal
          </CmsButton>
          <CmsButton type="submit" variant="primary" isLoading={isPending}>
            {isEdit ? "Simpan Perubahan" : "Buat Mata Pelajaran"}
          </CmsButton>
        </div>
      </div>

      {/* Right Col: Live Theme Preview (design-cms.md §8.3, RT-1) */}
      <div className="flex flex-col gap-4">
        <CmsPanel eyebrow="INTEGRASI IDENTITAS VISUAL" title="Pratinjau Tema Otomatis">
          <div className="text-xs text-muted-foreground leading-relaxed mb-4">
            Frontend memetakan warna subjek otomatis lewat{" "}
            <code className="font-mono text-primary font-bold">getSubjectTheme(slug)</code>.
          </div>

          {/* Theme Warning for unmapped slugs (design-cms.md §8.3 & RT-1) */}
          {!hasCustomTheme && slug.trim() && (
            <div className="mb-4 flex items-start gap-2.5 rounded-lg border-2 border-[#FFD84D] bg-[#FFD84D]/20 p-3 text-xs leading-relaxed text-[#1E2024] dark:text-[#F4F1EA]">
              <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
              <div>
                <strong>Slug ini belum punya tema warna khusus.</strong>
                <p className="mt-0.5">
                  Mata pelajaran ini akan otomatis menggunakan tema netral bawaan (Stone).
                </p>
              </div>
            </div>
          )}

          {/* Card Mockup showing how learners will see it */}
          <div
            className={`rounded-xl border-2 p-4 transition-colors ${currentTheme.cardBorder} ${currentTheme.cardBg}`}
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${currentTheme.iconBg}`}
              >
                <ThemeIcon className={`h-5 w-5 ${currentTheme.iconColor}`} />
              </div>
              <div>
                <span className={`block text-xs uppercase tracking-wider ${currentTheme.badgeText}`}>
                  {name || "Nama Subjek"}
                </span>
                <span className="text-[11px] font-mono text-muted-foreground">
                  /learn/umum/{slug || "slug"}
                </span>
              </div>
            </div>

            <div className="mt-3">
              <span
                className={`inline-block rounded-md border px-2 py-0.5 text-xs font-bold ${currentTheme.badgeBorder} ${currentTheme.badgeBg} ${currentTheme.badgeText}`}
              >
                {name || "Label Subjek"}
              </span>
            </div>

            <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
              {description || currentTheme.tagline}
            </p>
          </div>

          <div className="mt-4 border-t border-border pt-3 text-[11px] font-mono text-muted-foreground">
            <div className="flex justify-between py-0.5">
              <span>Tema Aktif:</span>
              <strong className="text-foreground">{currentTheme.name}</strong>
            </div>
            <div className="flex justify-between py-0.5">
              <span>Badge Style:</span>
              <span className="text-foreground">{currentTheme.badgeText}</span>
            </div>
          </div>
        </CmsPanel>
      </div>
    </form>
  );
}
