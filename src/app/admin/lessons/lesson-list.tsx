"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  FlaskConical,
  Edit,
  ExternalLink,
  Layers,
  AlertTriangle,
  CheckCircle2,
  Archive,
} from "lucide-react";
import { CmsInput, CmsSelect } from "@/components/admin/ui/input";
import { CmsButton } from "@/components/admin/ui/button";
import { CmsConfirmDialog } from "@/components/admin/ui/dialog";
import { ContentStatusBadge, KindBadge, DifficultyBadge } from "@/components/admin/ui/badge";
import { getSubjectTheme } from "@/components/ui/subject-theme";
import type { Difficulty, ContentStatus, LessonKind } from "@prisma/client";

export interface LessonRowItem {
  id: string;
  title: string;
  slug: string;
  kind: LessonKind | string;
  status: ContentStatus;
  difficulty: Difficulty;
  updatedAt: Date | string;
  subject: { name: string; slug: string };
  topic?: { name: string; slug: string } | null;
  educationLevel: { name: string; slug: string };
  _count: { questions: number; sources: number };
}

export function LessonList({
  lessons,
  subjects,
}: {
  lessons: LessonRowItem[];
  subjects: { id: string; name: string; slug: string }[];
}) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedKind, setSelectedKind] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  // Action Dialog State
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    lessonId: string;
    lessonTitle: string;
    action: "publish" | "unpublish" | "archive";
  }>({
    isOpen: false,
    lessonId: "",
    lessonTitle: "",
    action: "publish",
  });
  const [isActionPending, setIsActionPending] = useState(false);

  // Filtered Lessons
  const filteredLessons = useMemo(() => {
    return lessons.filter((l) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchTitle = l.title.toLowerCase().includes(q);
        const matchSlug = l.slug.toLowerCase().includes(q);
        if (!matchTitle && !matchSlug) return false;
      }
      if (selectedSubject && l.subject.slug !== selectedSubject) {
        return false;
      }
      if (selectedKind && l.kind !== selectedKind) {
        return false;
      }
      if (selectedStatus && l.status !== selectedStatus) {
        return false;
      }
      return true;
    });
  }, [lessons, search, selectedSubject, selectedKind, selectedStatus]);

  async function handleConfirmAction() {
    setIsActionPending(true);
    try {
      let endpoint = "";
      let method = "POST";

      if (dialogState.action === "publish") {
        endpoint = `/api/admin/lessons/${dialogState.lessonId}/publish`;
      } else if (dialogState.action === "unpublish") {
        endpoint = `/api/admin/lessons/${dialogState.lessonId}/publish`;
        method = "DELETE";
      } else if (dialogState.action === "archive") {
        endpoint = `/api/admin/lessons/${dialogState.lessonId}`;
        method = "DELETE";
      }

      const res = await fetch(endpoint, { method });
      const body = await res.json().catch(() => null);

      if (!res.ok) {
        alert(body?.error?.message || "Gagal mengubah status materi.");
        setIsActionPending(false);
        return;
      }

      setDialogState((prev) => ({ ...prev, isOpen: false }));
      router.refresh();
    } catch {
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setIsActionPending(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Filters Toolbar */}
      <div className="flex flex-col gap-3 rounded-xl border-[3px] border-[#1E2024] bg-card p-4 shadow-[3px_3px_0px_0px_#1E2024] dark:border-[#F4F1EA] dark:shadow-[3px_3px_0px_0px_rgba(244,241,234,0.85)]">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <CmsInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari materi..."
              className="pl-9"
            />
          </div>

          {/* Subject Filter */}
          <CmsSelect
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            <option value="">Semua Mata Pelajaran</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.slug}>
                {s.name}
              </option>
            ))}
          </CmsSelect>

          {/* Kind Filter */}
          <CmsSelect
            value={selectedKind}
            onChange={(e) => setSelectedKind(e.target.value)}
          >
            <option value="">Semua Jenis (Materi & Lab)</option>
            <option value="LESSON">Hanya Materi (LESSON)</option>
            <option value="EXPERIMENT">Hanya Eksperimen / Lab</option>
          </CmsSelect>

          {/* Status Filter */}
          <CmsSelect
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">Semua Status</option>
            <option value="PUBLISHED">Dipublikasikan (PUBLISHED)</option>
            <option value="DRAFT">Draf (DRAFT)</option>
            <option value="ARCHIVED">Diarsipkan (ARCHIVED)</option>
          </CmsSelect>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border-[3px] border-[#1E2024] bg-card shadow-[4px_4px_0px_0px_#1E2024] dark:border-[#F4F1EA] dark:shadow-[4px_4px_0px_0px_rgba(244,241,234,0.85)]">
        {filteredLessons.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground">
            Tidak ada materi yang sesuai dengan filter pencarian.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b-2 border-[#1E2024] bg-muted/50 font-mono text-muted-foreground dark:border-[#F4F1EA]">
                  <th className="py-2.5 px-3">JUDUL MATERI</th>
                  <th className="py-2.5 px-3">SUBJEK / TOPIK</th>
                  <th className="py-2.5 px-3">JENIS</th>
                  <th className="py-2.5 px-3">KESULITAN</th>
                  <th className="py-2.5 px-3">SUMBER</th>
                  <th className="py-2.5 px-3">STATUS</th>
                  <th className="py-2.5 px-3 text-right">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E2024]/10 dark:divide-[#F4F1EA]/10">
                {filteredLessons.map((lesson) => {
                  const theme = getSubjectTheme(lesson.subject.slug);

                  return (
                    <tr
                      key={lesson.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="py-3 px-3 max-w-xs">
                        <Link
                          href={`/admin/lessons/${lesson.id}`}
                          className="font-black text-[#1E2024] hover:underline line-clamp-1 dark:text-[#F4F1EA]"
                        >
                          {lesson.title}
                        </Link>
                        <span className="font-mono text-[11px] text-muted-foreground">
                          /{lesson.slug}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="h-2 w-2 rounded-full shrink-0"
                            style={{
                              backgroundColor:
                                lesson.subject.slug === "matematika"
                                  ? "#2563EB"
                                  : lesson.subject.slug === "fisika"
                                    ? "#0891B2"
                                    : lesson.subject.slug === "kimia"
                                      ? "#7C3AED"
                                      : lesson.subject.slug === "biologi"
                                        ? "#059669"
                                        : "#D97706",
                            }}
                          />
                          <span className="font-bold">{lesson.subject.name}</span>
                          {lesson.topic && (
                            <span className="text-muted-foreground">/ {lesson.topic.name}</span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <KindBadge kind={lesson.kind} />
                      </td>

                      <td className="py-3 px-3">
                        <DifficultyBadge difficulty={lesson.difficulty} />
                      </td>

                      <td className="py-3 px-3 font-mono font-bold">
                        {lesson._count.sources > 0 ? (
                          <span className="text-emerald-600 dark:text-emerald-400">
                            {lesson._count.sources} sumber
                          </span>
                        ) : (
                          <span className="rounded bg-[#FF6B6B] px-1.5 py-0.5 text-white">
                            0 sumber!
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3">
                        <ContentStatusBadge status={lesson.status} />
                      </td>

                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Deep Link to Sandbox Studio (design-cms.md §7.3) */}
                          <Link
                            href={`/admin/interactive?lesson=${lesson.id}`}
                            className="inline-flex items-center gap-1 rounded border border-[#1E2024] bg-[#FFD84D] px-2 py-1 text-[11px] font-bold text-[#1E2024] shadow-[1px_1px_0px_0px_#1E2024] hover:bg-[#FACC15]"
                            title="Buat atau edit sandbox interaktif untuk materi ini"
                          >
                            <FlaskConical className="h-3 w-3" />
                            <span>Sandbox</span>
                          </Link>

                          {/* Edit Lesson */}
                          <Link
                            href={`/admin/lessons/${lesson.id}`}
                            className="inline-flex items-center gap-1 rounded border border-[#1E2024] bg-card px-2 py-1 text-[11px] font-bold text-[#1E2024] shadow-[1px_1px_0px_0px_#1E2024] hover:bg-muted dark:border-[#F4F1EA] dark:text-[#F4F1EA]"
                          >
                            <Edit className="h-3 w-3" />
                            <span>Edit</span>
                          </Link>

                          {/* Status Actions */}
                          {lesson.status === "PUBLISHED" ? (
                            <button
                              type="button"
                              onClick={() =>
                                setDialogState({
                                  isOpen: true,
                                  lessonId: lesson.id,
                                  lessonTitle: lesson.title,
                                  action: "unpublish",
                                })
                              }
                              className="rounded border border-border bg-muted/40 px-2 py-1 text-[11px] font-bold hover:bg-muted text-muted-foreground"
                            >
                              Tarik
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() =>
                                setDialogState({
                                  isOpen: true,
                                  lessonId: lesson.id,
                                  lessonTitle: lesson.title,
                                  action: "publish",
                                })
                              }
                              className="rounded border border-[#1E2024] bg-[#7BE0A4] px-2 py-1 text-[11px] font-bold text-[#1E2024] hover:bg-[#68d193]"
                            >
                              Terbitkan
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Action Confirmation Dialog */}
      <CmsConfirmDialog
        isOpen={dialogState.isOpen}
        title={
          dialogState.action === "publish"
            ? `Terbitkan "${dialogState.lessonTitle}"?`
            : dialogState.action === "unpublish"
              ? `Tarik publikasi "${dialogState.lessonTitle}"?`
              : `Arsipkan "${dialogState.lessonTitle}"?`
        }
        description={
          dialogState.action === "publish" ? (
            <p>
              Materi ini akan langsung tayang dan dapat diakses publik oleh seluruh siswa di halaman website utama.
            </p>
          ) : (
            <p>
              Materi ini tidak lagi dapat diakses siswa di website publik dan dikembalikan ke status draf.
            </p>
          )
        }
        confirmLabel={
          dialogState.action === "publish" ? "Ya, Terbitkan" : "Ya, Tarik ke Draf"
        }
        isDestructive={dialogState.action !== "publish"}
        isLoading={isActionPending}
        onConfirm={handleConfirmAction}
        onCancel={() => setDialogState((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}