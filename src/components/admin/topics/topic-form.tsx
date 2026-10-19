"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { CmsInput, CmsTextarea, CmsSelect, CmsFormField } from "@/components/admin/ui/input";
import { CmsButton } from "@/components/admin/ui/button";
import { CmsPanel } from "@/components/admin/ui/panel";

interface TopicFormProps {
  initialData?: {
    id: string;
    name: string;
    slug: string;
    subjectId: string;
    description?: string | null;
    order?: number;
    status?: string;
  };
  subjects: { id: string; name: string; slug: string }[];
  isEdit?: boolean;
}

export function TopicForm({ initialData, subjects, isEdit = false }: TopicFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialData?.name || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [subjectId, setSubjectId] = useState(initialData?.subjectId || subjects[0]?.id || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [order, setOrder] = useState<number>(initialData?.order ?? 0);
  const [status, setStatus] = useState<string>(initialData?.status || "PUBLISHED");

  const [isAutoSlug, setIsAutoSlug] = useState(!isEdit);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Nama topik wajib diisi.");
      return;
    }
    if (!subjectId) {
      setError("Mata pelajaran wajib dipilih.");
      return;
    }

    setIsPending(true);
    try {
      const url = isEdit
        ? `/api/admin/topics/${initialData?.id}`
        : "/api/admin/topics";
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          slug: slug.trim() || undefined,
          subjectId,
          description: description.trim() || null,
          order: Number(order) || 0,
          status,
        }),
      });

      const body = await res.json().catch(() => null);
      if (!res.ok) {
        setError(body?.error?.message || "Gagal menyimpan topik.");
        setIsPending(false);
        return;
      }

      router.push("/admin/topics");
      router.refresh();
    } catch {
      setError("Terjadi gangguan jaringan.");
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl flex flex-col gap-6">
      <CmsPanel title={isEdit ? `Edit Topik: ${initialData?.name}` : "Informasi Topik Pembelajaran"}>
        {error && (
          <div className="mb-4 rounded-lg border-2 border-[#FF6B6B] bg-red-50 p-3 text-xs font-bold text-red-700 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <CmsFormField label="Mata Pelajaran Induk" required id="topic-subject">
            <CmsSelect
              id="topic-subject"
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
            >
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name} (/{sub.slug})
                </option>
              ))}
            </CmsSelect>
          </CmsFormField>

          <CmsFormField label="Nama Topik" required id="topic-name">
            <CmsInput
              id="topic-name"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Contoh: Kinematika atau Reaksi Redoks"
            />
          </CmsFormField>

          <CmsFormField label="Slug URL" id="topic-slug">
            <CmsInput
              id="topic-slug"
              value={slug}
              onChange={(e) => {
                setIsAutoSlug(false);
                setSlug(e.target.value);
              }}
              placeholder="reaksi-redoks"
            />
          </CmsFormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CmsFormField label="Urutan" id="topic-order">
              <CmsInput
                id="topic-order"
                type="number"
                min={0}
                value={order}
                onChange={(e) => setOrder(parseInt(e.target.value, 10) || 0)}
              />
            </CmsFormField>

            <CmsFormField label="Status" id="topic-status">
              <CmsSelect
                id="topic-status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="PUBLISHED">Dipublikasikan (PUBLISHED)</option>
                <option value="DRAFT">Draf (DRAFT)</option>
                <option value="ARCHIVED">Diarsipkan (ARCHIVED)</option>
              </CmsSelect>
            </CmsFormField>
          </div>

          <CmsFormField label="Deskripsi Topik (opsional)" id="topic-desc">
            <CmsTextarea
              id="topic-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Penjelasan ringkas tentang topik pembelajaran ini..."
            />
          </CmsFormField>
        </div>
      </CmsPanel>

      <div className="flex items-center justify-end gap-3">
        <CmsButton
          type="button"
          variant="secondary"
          onClick={() => router.push("/admin/topics")}
        >
          Batal
        </CmsButton>
        <CmsButton type="submit" variant="primary" isLoading={isPending}>
          {isEdit ? "Simpan Perubahan" : "Buat Topik"}
        </CmsButton>
      </div>
    </form>
  );
}
