"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Heading,
  AlignLeft,
  Image,
  Video,
  Calculator,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Layers,
  FlaskConical,
  Minus,
  ArrowUp,
  ArrowDown,
  Trash2,
  Eye,
  CheckCircle2,
  X,
  ExternalLink,
  Plus,
  BookOpen,
} from "lucide-react";
import { CmsInput, CmsTextarea, CmsSelect, CmsFormField } from "@/components/admin/ui/input";
import { CmsButton } from "@/components/admin/ui/button";
import { CmsPanel } from "@/components/admin/ui/panel";
import { CmsConfirmDialog } from "@/components/admin/ui/dialog";
import { ContentStatusBadge } from "@/components/admin/ui/badge";
import { LessonContentRenderer } from "@/modules/content/renderer";
import { INTERACTIVE_REGISTRY, type InteractiveKey } from "@/modules/content/interactive-registry";
import { getSubjectTheme } from "@/components/ui/subject-theme";
import type { ContentBlock } from "@/modules/content/blocks";
import { Difficulty, LessonKind, ContentStatus } from "@prisma/client";

interface LessonEditorProps {
  initialLesson?: {
    id: string;
    title: string;
    slug: string;
    description?: string | null;
    difficulty: Difficulty;
    kind: LessonKind;
    durationMinutes?: number | null;
    order?: number;
    status: ContentStatus;
    subjectId: string;
    topicId?: string | null;
    educationLevelId: string;
    contentBlocks?: unknown;
    sources?: Array<{ sourceId: string; source: { id: string; title: string } }>;
  };
  subjects: Array<{ id: string; name: string; slug: string; educationLevelId: string }>;
  topics: Array<{ id: string; name: string; subjectId: string }>;
  allSources: Array<{ id: string; title: string; author?: string | null }>;
  isEdit?: boolean;
}

export function LessonEditor({
  initialLesson,
  subjects,
  topics,
  allSources,
  isEdit = false,
}: LessonEditorProps) {
  const router = useRouter();

  // Basic Information State
  const [title, setTitle] = useState(initialLesson?.title || "");
  const [slug, setSlug] = useState(initialLesson?.slug || "");
  const [description, setDescription] = useState(initialLesson?.description || "");
  const [subjectId, setSubjectId] = useState(initialLesson?.subjectId || subjects[0]?.id || "");
  const [topicId, setTopicId] = useState(initialLesson?.topicId || "");
  const [kind, setKind] = useState<LessonKind>(initialLesson?.kind || LessonKind.LESSON);
  const [difficulty, setDifficulty] = useState<Difficulty>(
    initialLesson?.difficulty || Difficulty.BEGINNER,
  );
  const [durationMinutes, setDurationMinutes] = useState(
    initialLesson?.durationMinutes ?? 15,
  );
  const [status, setStatus] = useState<ContentStatus>(
    initialLesson?.status || ContentStatus.DRAFT,
  );

  // Content Blocks State
  const [blocks, setBlocks] = useState<ContentBlock[]>(() => {
    if (Array.isArray(initialLesson?.contentBlocks) && initialLesson.contentBlocks.length > 0) {
      return initialLesson.contentBlocks as ContentBlock[];
    }
    return [
      { id: "b_intro", type: "heading", level: 2, content: "Pengantar Konsep" },
      { id: "b_desc", type: "text", content: "Mulai pelajari konsep penting ini secara visual." },
    ];
  });

  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(
    blocks[0]?.id || null,
  );

  // Linked Sources State
  const [linkedSources, setLinkedSources] = useState<
    Array<{ sourceId: string; source: { id: string; title: string } }>
  >(initialLesson?.sources || []);

  // UI state
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isChecklistOpen, setIsChecklistOpen] = useState(false);
  const [checklistReport, setChecklistReport] = useState<Array<{ id: string; label: string; passed: boolean; message?: string }>>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Current Subject Theme
  const currentSubject = subjects.find((s) => s.id === subjectId);
  const subjectTheme = getSubjectTheme(currentSubject?.slug || "umum");

  // Selected Block
  const selectedBlock = blocks.find((b) => b.id === selectedBlockId) || null;

  // Auto slug from title if new
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isEdit && !slug) {
      setSlug(
        val
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, ""),
      );
    }
  };

  // Block Manipulation
  const addBlock = (type: string) => {
    const newId = `blk_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    let newBlock: ContentBlock;

    switch (type) {
      case "heading":
        newBlock = { id: newId, type: "heading", level: 2, content: "Judul Bagian Baru" };
        break;
      case "text":
        newBlock = { id: newId, type: "text", content: "Paragraf penjelasan materi baru..." };
        break;
      case "image":
        newBlock = {
          id: newId,
          type: "image",
          src: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=800",
          alt: "Ilustrasi konsep",
          caption: "Deskripsi gambar atau sumber visual",
        };
        break;
      case "video":
        newBlock = { id: newId, type: "video", src: "dQw4w9WgXcQ", title: "Video Penjelasan" };
        break;
      case "formula":
        newBlock = { id: newId, type: "formula", content: "E = m \\cdot c^2", display: true };
        break;
      case "callout":
        newBlock = {
          id: newId,
          type: "callout",
          content: "Kunci pemahaman penting dari konsep ini...",
          variant: "tip",
        };
        break;
      case "example":
        newBlock = { id: newId, type: "example", content: "Contoh soal dan solusi..." };
        break;
      case "realworld":
        newBlock = {
          id: newId,
          type: "realworld",
          title: "Penerapan Sehari-hari",
          content: "Bagaimana konsep ini bekerja di dunia nyata...",
        };
        break;
      case "interactive":
        newBlock = {
          id: newId,
          type: "interactive",
          component: "formula-sandbox",
          config: INTERACTIVE_REGISTRY["formula-sandbox"].defaultConfig,
        };
        break;
      case "divider":
      default:
        newBlock = { id: newId, type: "divider" };
        break;
    }

    setBlocks((prev) => [...prev, newBlock]);
    setSelectedBlockId(newId);
  };

  const updateBlock = (id: string, patch: Partial<ContentBlock>) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? ({ ...b, ...patch } as ContentBlock) : b)),
    );
  };

  const removeBlock = (id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
    if (selectedBlockId === id) {
      setSelectedBlockId(null);
    }
  };

  const moveBlock = (idx: number, direction: "up" | "down") => {
    if (direction === "up" && idx === 0) return;
    if (direction === "down" && idx === blocks.length - 1) return;

    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    const copy = [...blocks];
    const temp = copy[idx];
    copy[idx] = copy[targetIdx];
    copy[targetIdx] = temp;
    setBlocks(copy);
  };

  // Save Lesson (Draft or Update)
  async function saveLesson(targetStatus?: ContentStatus): Promise<string | null> {
    setErrorMessage(null);
    if (!title.trim()) {
      setErrorMessage("Judul materi wajib diisi.");
      return null;
    }

    setIsSaving(true);
    try {
      const endpoint = isEdit
        ? `/api/admin/lessons/${initialLesson?.id}`
        : "/api/admin/lessons";
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          slug: slug.trim() || undefined,
          description: description.trim() || null,
          subjectId,
          topicId: topicId || null,
          kind,
          difficulty,
          durationMinutes: Number(durationMinutes) || 15,
          educationLevelId: currentSubject?.educationLevelId,
          contentBlocks: blocks,
          status: targetStatus || status,
        }),
      });

      const body = await res.json().catch(() => null);
      if (!res.ok) {
        setErrorMessage(body?.error?.message || "Gagal menyimpan materi.");
        setIsSaving(false);
        return null;
      }

      setIsSaving(false);
      const lessonId = isEdit ? initialLesson?.id : body.data.id;
      if (!isEdit) {
        router.push(`/admin/lessons/${lessonId}`);
      }
      router.refresh();
      return lessonId;
    } catch {
      setErrorMessage("Gangguan jaringan saat menyimpan materi.");
      setIsSaving(false);
      return null;
    }
  }

  // Publish with Gates Checklist
  async function handlePublishClick() {
    setErrorMessage(null);
    const lessonId = isEdit ? initialLesson?.id : await saveLesson(ContentStatus.DRAFT);
    if (!lessonId) return;

    try {
      const res = await fetch(`/api/admin/lessons/${lessonId}/verify`);
      const body = await res.json().catch(() => null);
      if (body?.data?.checklist) {
        setChecklistReport(body.data.checklist);
        setIsChecklistOpen(true);
      }
    } catch {
      setErrorMessage("Gagal memverifikasi syarat publikasi materi.");
    }
  }

  async function executePublish() {
    if (!initialLesson?.id) return;
    setIsPublishing(true);
    try {
      const res = await fetch(`/api/admin/lessons/${initialLesson.id}/publish`, {
        method: "POST",
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) {
        alert(body?.error?.message || "Gagal mempublikasikan materi.");
        setIsPublishing(false);
        return;
      }
      setStatus(ContentStatus.PUBLISHED);
      setIsChecklistOpen(false);
      router.refresh();
    } catch {
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setIsPublishing(false);
    }
  }

  // Linking Sources directly in editor
  const linkSource = async (sourceId: string) => {
    if (!initialLesson?.id) {
      alert("Simpan draft materi terlebih dahulu untuk menautkan sumber.");
      return;
    }
    const res = await fetch(`/api/admin/lessons/${initialLesson.id}/sources`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sourceId }),
    });
    if (res.ok) {
      const added = allSources.find((s) => s.id === sourceId);
      if (added) {
        setLinkedSources((prev) => [...prev, { sourceId, source: added }]);
      }
      router.refresh();
    }
  };

  const unlinkSource = async (sourceId: string) => {
    if (!initialLesson?.id) return;
    const res = await fetch(
      `/api/admin/lessons/${initialLesson.id}/sources?sourceId=${sourceId}`,
      { method: "DELETE" },
    );
    if (res.ok) {
      setLinkedSources((prev) => prev.filter((s) => s.sourceId !== sourceId));
      router.refresh();
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Editor Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border-[3px] border-[#1E2024] bg-card p-4 shadow-[4px_4px_0px_0px_#1E2024] dark:border-[#F4F1EA] dark:shadow-[4px_4px_0px_0px_rgba(244,241,234,0.85)]">
        <div className="flex items-center gap-3">
          <ContentStatusBadge status={status} />
          <div>
            <h1 className="text-xl font-black text-[#1E2024] dark:text-[#F4F1EA]">
              {title || "Materi Baru"}
            </h1>
            <span className="font-mono text-xs text-muted-foreground">
              {currentSubject?.name || "Subjek"} / {slug || "slug"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Pratinjau Button */}
          <CmsButton
            variant="secondary"
            size="sm"
            icon={<Eye className="h-4 w-4" />}
            onClick={() => setIsPreviewOpen(true)}
          >
            Pratinjau
          </CmsButton>

          {/* Contextual Public Site Link */}
          {status === "PUBLISHED" && currentSubject && (
            <Link
              href={`/learn/umum/${currentSubject.slug}/${slug}`}
              target="_blank"
              className="inline-flex h-9 items-center gap-1 rounded-lg border-2 border-[#1E2024] bg-card px-2.5 text-xs font-bold text-[#1E2024] hover:bg-muted dark:border-[#F4F1EA] dark:text-[#F4F1EA]"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Public</span>
            </Link>
          )}

          {/* Simpan Draft */}
          <CmsButton
            variant="secondary"
            size="sm"
            isLoading={isSaving}
            onClick={() => saveLesson(ContentStatus.DRAFT)}
          >
            Simpan Draf
          </CmsButton>

          {/* Publish Button */}
          <CmsButton
            variant="primary"
            size="sm"
            icon={<CheckCircle2 className="h-4 w-4" />}
            onClick={handlePublishClick}
          >
            Publish
          </CmsButton>
        </div>
      </div>

      {errorMessage && (
        <div className="rounded-lg border-2 border-[#FF6B6B] bg-red-50 p-3 text-xs font-bold text-red-700 dark:bg-red-950/40 dark:text-red-300">
          {errorMessage}
        </div>
      )}

      {/* Main 3-Panel Grid (Library / Canvas / Inspector) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* PANEL 1: Block Library (Left, 3 Cols) */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <CmsPanel title="Library Blok" eyebrow="TAMBAHKAN KONTEN">
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => addBlock("heading")}
                className="flex items-center gap-2.5 rounded-lg border-2 border-[#1E2024] bg-card p-2.5 text-xs font-bold text-[#1E2024] shadow-[2px_2px_0px_0px_#1E2024] hover:bg-muted active:translate-x-[1px] active:translate-y-[1px] active:shadow-none dark:border-[#F4F1EA] dark:text-[#F4F1EA]"
              >
                <Heading className="h-4 w-4 text-primary" />
                <span>Heading (Judul Bagian)</span>
              </button>

              <button
                type="button"
                onClick={() => addBlock("text")}
                className="flex items-center gap-2.5 rounded-lg border-2 border-[#1E2024] bg-card p-2.5 text-xs font-bold text-[#1E2024] shadow-[2px_2px_0px_0px_#1E2024] hover:bg-muted active:translate-x-[1px] active:translate-y-[1px] active:shadow-none dark:border-[#F4F1EA] dark:text-[#F4F1EA]"
              >
                <AlignLeft className="h-4 w-4 text-stone-700 dark:text-stone-300" />
                <span>Teks Paragraf</span>
              </button>

              <button
                type="button"
                onClick={() => addBlock("formula")}
                className="flex items-center gap-2.5 rounded-lg border-2 border-[#1E2024] bg-card p-2.5 text-xs font-bold text-[#1E2024] shadow-[2px_2px_0px_0px_#1E2024] hover:bg-muted active:translate-x-[1px] active:translate-y-[1px] active:shadow-none dark:border-[#F4F1EA] dark:text-[#F4F1EA]"
              >
                <Calculator className="h-4 w-4 text-blue-600" />
                <span>Formula KaTeX</span>
              </button>

              <button
                type="button"
                onClick={() => addBlock("interactive")}
                className="flex items-center gap-2.5 rounded-lg border-2 border-[#1E2024] bg-[#FFD84D] p-2.5 text-xs font-black text-stone-900 shadow-[2px_2px_0px_0px_#1E2024] hover:bg-[#FACC15] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
              >
                <FlaskConical className="h-4 w-4 text-stone-950" />
                <span>Interaktif (Sandbox)</span>
              </button>

              <button
                type="button"
                onClick={() => addBlock("callout")}
                className="flex items-center gap-2.5 rounded-lg border-2 border-[#1E2024] bg-card p-2.5 text-xs font-bold text-[#1E2024] shadow-[2px_2px_0px_0px_#1E2024] hover:bg-muted active:translate-x-[1px] active:translate-y-[1px] active:shadow-none dark:border-[#F4F1EA] dark:text-[#F4F1EA]"
              >
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <span>Callout Catatan</span>
              </button>

              <button
                type="button"
                onClick={() => addBlock("example")}
                className="flex items-center gap-2.5 rounded-lg border-2 border-[#1E2024] bg-card p-2.5 text-xs font-bold text-[#1E2024] shadow-[2px_2px_0px_0px_#1E2024] hover:bg-muted active:translate-x-[1px] active:translate-y-[1px] active:shadow-none dark:border-[#F4F1EA] dark:text-[#F4F1EA]"
              >
                <HelpCircle className="h-4 w-4 text-sky-600" />
                <span>Contoh Penerapan</span>
              </button>

              <button
                type="button"
                onClick={() => addBlock("realworld")}
                className="flex items-center gap-2.5 rounded-lg border-2 border-[#1E2024] bg-card p-2.5 text-xs font-bold text-[#1E2024] shadow-[2px_2px_0px_0px_#1E2024] hover:bg-muted active:translate-x-[1px] active:translate-y-[1px] active:shadow-none dark:border-[#F4F1EA] dark:text-[#F4F1EA]"
              >
                <Sparkles className="h-4 w-4 text-emerald-600" />
                <span>Dunia Nyata</span>
              </button>

              <button
                type="button"
                onClick={() => addBlock("image")}
                className="flex items-center gap-2.5 rounded-lg border-2 border-[#1E2024] bg-card p-2.5 text-xs font-bold text-[#1E2024] shadow-[2px_2px_0px_0px_#1E2024] hover:bg-muted active:translate-x-[1px] active:translate-y-[1px] active:shadow-none dark:border-[#F4F1EA] dark:text-[#F4F1EA]"
              >
                <Image className="h-4 w-4 text-indigo-600" />
                <span>Gambar Ilustrasi</span>
              </button>

              <button
                type="button"
                onClick={() => addBlock("video")}
                className="flex items-center gap-2.5 rounded-lg border-2 border-[#1E2024] bg-card p-2.5 text-xs font-bold text-[#1E2024] shadow-[2px_2px_0px_0px_#1E2024] hover:bg-muted active:translate-x-[1px] active:translate-y-[1px] active:shadow-none dark:border-[#F4F1EA] dark:text-[#F4F1EA]"
              >
                <Video className="h-4 w-4 text-red-600" />
                <span>Video YouTube</span>
              </button>

              <button
                type="button"
                onClick={() => addBlock("divider")}
                className="flex items-center gap-2.5 rounded-lg border-2 border-[#1E2024] bg-card p-2.5 text-xs font-bold text-[#1E2024] shadow-[2px_2px_0px_0px_#1E2024] hover:bg-muted active:translate-x-[1px] active:translate-y-[1px] active:shadow-none dark:border-[#F4F1EA] dark:text-[#F4F1EA]"
              >
                <Minus className="h-4 w-4 text-stone-500" />
                <span>Garis Pembatas</span>
              </button>
            </div>
          </CmsPanel>

          {/* Sources Section in Left Column */}
          <CmsPanel title="Sumber Rujukan Tertaut" eyebrow="VALIDITAS MATERI">
            <div className="flex flex-col gap-2.5">
              {linkedSources.length === 0 ? (
                <div className="rounded-lg border-2 border-dashed border-[#FF6B6B] bg-red-50/50 p-3 text-xs text-red-800 dark:bg-red-950/20 dark:text-red-300">
                  <strong>Belum ada sumber tertaut!</strong> Materi wajib memiliki minimal 1 sumber untuk dipublikasikan.
                </div>
              ) : (
                linkedSources.map((ls) => (
                  <div
                    key={ls.sourceId}
                    className="flex items-center justify-between rounded-lg border border-border bg-card p-2 text-xs font-bold"
                  >
                    <span className="truncate max-w-[170px]">{ls.source.title}</span>
                    <button
                      type="button"
                      onClick={() => unlinkSource(ls.sourceId)}
                      className="text-red-500 hover:text-red-700"
                      title="Lepas sumber"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))
              )}

              {/* Add source dropdown */}
              <div className="mt-2 flex flex-col gap-1.5 border-t border-border pt-2">
                <span className="text-[11px] font-mono text-muted-foreground">Tautkan sumber dari daftar:</span>
                <CmsSelect
                  onChange={(e) => {
                    if (e.target.value) {
                      linkSource(e.target.value);
                      e.target.value = "";
                    }
                  }}
                  defaultValue=""
                >
                  <option value="" disabled>
                    + Pilih Sumber...
                  </option>
                  {allSources
                    .filter((s) => !linkedSources.some((ls) => ls.sourceId === s.id))
                    .map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title}
                      </option>
                    ))}
                </CmsSelect>
              </div>
            </div>
          </CmsPanel>
        </div>

        {/* PANEL 2: Content Canvas (Center, 5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <CmsPanel title={`Canvas Blok (${blocks.length})`} eyebrow="STRUKTUR ALUR MATERI">
            <div className="flex flex-col gap-3">
              {blocks.map((block, idx) => {
                const isSelected = block.id === selectedBlockId;
                return (
                  <div
                    key={block.id}
                    onClick={() => setSelectedBlockId(block.id)}
                    className={`cursor-pointer rounded-xl border-2 p-3.5 transition-all ${
                      isSelected
                        ? "border-[#1E2024] bg-muted/40 shadow-[3px_3px_0px_0px_#1E2024] dark:border-[#F4F1EA] dark:shadow-[3px_3px_0px_0px_rgba(244,241,234,0.85)]"
                        : "border-border bg-card hover:border-[#1E2024]/50"
                    }`}
                  >
                    {/* Block Card Header */}
                    <div className="flex items-center justify-between border-b border-border/60 pb-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-mono font-black uppercase text-foreground">
                          {block.type}
                        </span>
                        <span className="text-xs font-mono text-muted-foreground">
                          #{idx + 1}
                        </span>
                      </div>

                      {/* Order & Remove Controls */}
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => moveBlock(idx, "up")}
                          disabled={idx === 0}
                          className="rounded p-1 text-muted-foreground hover:bg-muted disabled:opacity-30"
                          title="Geser ke atas"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveBlock(idx, "down")}
                          disabled={idx === blocks.length - 1}
                          className="rounded p-1 text-muted-foreground hover:bg-muted disabled:opacity-30"
                          title="Geser ke bawah"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeBlock(block.id)}
                          className="rounded p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                          title="Hapus blok"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Block Preview Content */}
                    <div className="text-xs text-foreground/90 font-medium line-clamp-2">
                      {"content" in block && typeof block.content === "string" && block.content}
                      {block.type === "interactive" && (
                        <div className="flex items-center gap-1.5 text-primary font-mono font-bold">
                          <FlaskConical className="h-3.5 w-3.5" />
                          <span>Komponen: {block.component}</span>
                        </div>
                      )}
                      {block.type === "image" && (
                        <span>Gambar: {block.src} (Alt: {block.alt || "Belum ada!"})</span>
                      )}
                      {block.type === "video" && (
                        <span>Video ID: {block.src}</span>
                      )}
                      {block.type === "divider" && <hr className="my-2 border-border" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </CmsPanel>
        </div>

        {/* PANEL 3: Properties Inspector (Right, 4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <CmsPanel title="Inspector Blok & Metadata" eyebrow="PROPERTI AKTIF">
            {selectedBlock ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <span className="text-xs font-mono font-bold uppercase text-primary">
                    Tipe: {selectedBlock.type}
                  </span>
                  <span className="text-[11px] font-mono text-muted-foreground">
                    ID: {selectedBlock.id}
                  </span>
                </div>

                {/* Heading Inspector */}
                {selectedBlock.type === "heading" && (
                  <>
                    <CmsFormField label="Teks Judul" id="insp-heading-content">
                      <CmsInput
                        id="insp-heading-content"
                        value={selectedBlock.content}
                        onChange={(e) => updateBlock(selectedBlock.id, { content: e.target.value })}
                      />
                    </CmsFormField>
                    <CmsFormField label="Tingkat Heading" id="insp-heading-level">
                      <CmsSelect
                        id="insp-heading-level"
                        value={selectedBlock.level ?? 2}
                        onChange={(e) =>
                          updateBlock(selectedBlock.id, { level: parseInt(e.target.value, 10) })
                        }
                      >
                        <option value={2}>H2 — Bagian Utama</option>
                        <option value={3}>H3 — Sub-bagian</option>
                        <option value={4}>H4 — Poin Kecil</option>
                      </CmsSelect>
                    </CmsFormField>
                  </>
                )}

                {/* Text Inspector */}
                {selectedBlock.type === "text" && (
                  <CmsFormField label="Konten Paragraf" id="insp-text-content">
                    <CmsTextarea
                      id="insp-text-content"
                      rows={6}
                      value={selectedBlock.content}
                      onChange={(e) => updateBlock(selectedBlock.id, { content: e.target.value })}
                    />
                  </CmsFormField>
                )}

                {/* Formula Inspector */}
                {selectedBlock.type === "formula" && (
                  <>
                    <CmsFormField label="Kode LaTeX" id="insp-formula-content">
                      <CmsTextarea
                        id="insp-formula-content"
                        rows={3}
                        value={selectedBlock.content}
                        onChange={(e) => updateBlock(selectedBlock.id, { content: e.target.value })}
                        placeholder="x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}"
                      />
                    </CmsFormField>
                    <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedBlock.display ?? true}
                        onChange={(e) => updateBlock(selectedBlock.id, { display: e.target.checked })}
                        className="accent-primary h-4 w-4"
                      />
                      <span>Tampilkan sebagai Blok Tengah (Display Math)</span>
                    </label>
                  </>
                )}

                {/* Image Inspector */}
                {selectedBlock.type === "image" && (
                  <>
                    <CmsFormField label="URL Gambar" required id="insp-img-src">
                      <CmsInput
                        id="insp-img-src"
                        value={selectedBlock.src}
                        onChange={(e) => updateBlock(selectedBlock.id, { src: e.target.value })}
                      />
                    </CmsFormField>
                    <CmsFormField
                      label="Deskripsi Aksesibilitas (Alt Text)"
                      required
                      hint="Wajib untuk lolos publish gate"
                      id="insp-img-alt"
                    >
                      <CmsInput
                        id="insp-img-alt"
                        value={selectedBlock.alt || ""}
                        onChange={(e) => updateBlock(selectedBlock.id, { alt: e.target.value })}
                        placeholder="Deskripsikan gambar untuk pembaca layar..."
                      />
                    </CmsFormField>
                    <CmsFormField label="Keterangan Gambar (Caption)" id="insp-img-cap">
                      <CmsInput
                        id="insp-img-cap"
                        value={selectedBlock.caption || ""}
                        onChange={(e) => updateBlock(selectedBlock.id, { caption: e.target.value })}
                      />
                    </CmsFormField>
                  </>
                )}

                {/* Video Inspector */}
                {selectedBlock.type === "video" && (
                  <>
                    <CmsFormField label="YouTube Video ID" required id="insp-vid-src">
                      <CmsInput
                        id="insp-vid-src"
                        value={selectedBlock.src}
                        onChange={(e) => updateBlock(selectedBlock.id, { src: e.target.value })}
                        placeholder="Contoh: dQw4w9WgXcQ"
                      />
                    </CmsFormField>
                    <CmsFormField label="Judul Video" id="insp-vid-title">
                      <CmsInput
                        id="insp-vid-title"
                        value={selectedBlock.title || ""}
                        onChange={(e) => updateBlock(selectedBlock.id, { title: e.target.value })}
                      />
                    </CmsFormField>
                  </>
                )}

                {/* Callout Inspector */}
                {selectedBlock.type === "callout" && (
                  <>
                    <CmsFormField label="Tipe Callout" id="insp-callout-var">
                      <CmsSelect
                        id="insp-callout-var"
                        value={selectedBlock.variant || "info"}
                        onChange={(e) =>
                          updateBlock(selectedBlock.id, {
                            variant: e.target.value as "info" | "warning" | "tip",
                          })
                        }
                      >
                        <option value="info">Info</option>
                        <option value="warning">Peringatan</option>
                        <option value="tip">Tips Belajar</option>
                      </CmsSelect>
                    </CmsFormField>
                    <CmsFormField label="Isi Pesan" id="insp-callout-content">
                      <CmsTextarea
                        id="insp-callout-content"
                        rows={3}
                        value={selectedBlock.content}
                        onChange={(e) => updateBlock(selectedBlock.id, { content: e.target.value })}
                      />
                    </CmsFormField>
                  </>
                )}

                {/* Example / Realworld Inspector */}
                {(selectedBlock.type === "example" || selectedBlock.type === "realworld") && (
                  <CmsFormField label="Konten Penjelasan" id="insp-ex-content">
                    <CmsTextarea
                      id="insp-ex-content"
                      rows={4}
                      value={selectedBlock.content}
                      onChange={(e) => updateBlock(selectedBlock.id, { content: e.target.value })}
                    />
                  </CmsFormField>
                )}

                {/* Interactive Block Inspector (Registry generated) */}
                {selectedBlock.type === "interactive" && (
                  <div className="flex flex-col gap-3">
                    <CmsFormField label="Komponen Interaktif" id="insp-inter-comp">
                      <CmsSelect
                        id="insp-inter-comp"
                        value={selectedBlock.component}
                        onChange={(e) => {
                          const compKey = e.target.value as InteractiveKey;
                          updateBlock(selectedBlock.id, {
                            component: compKey,
                            config: INTERACTIVE_REGISTRY[compKey]?.defaultConfig || {},
                          });
                        }}
                      >
                        {Object.values(INTERACTIVE_REGISTRY).map((meta) => (
                          <option key={meta.key} value={meta.key}>
                            {meta.title} ({meta.key})
                          </option>
                        ))}
                      </CmsSelect>
                    </CmsFormField>

                    <CmsFormField
                      label="Fallback Tekstual (Aksesibilitas)"
                      required
                      hint="Wajib ada untuk publish"
                      id="insp-inter-fallback"
                    >
                      <CmsTextarea
                        id="insp-inter-fallback"
                        rows={3}
                        value={
                          typeof selectedBlock.config?.textFallback === "string"
                            ? selectedBlock.config.textFallback
                            : ""
                        }
                        onChange={(e) =>
                          updateBlock(selectedBlock.id, {
                            config: {
                              ...selectedBlock.config,
                              textFallback: e.target.value,
                            },
                          })
                        }
                        placeholder="Deskripsi cara kerja interaksi bagi pengguna pembaca layar..."
                      />
                    </CmsFormField>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground text-center py-6">
                Klik salah satu blok di kanvas tengah untuk mengedit propertinya.
              </p>
            )}

            {/* General Lesson Settings at Bottom of Inspector */}
            <div className="mt-6 border-t border-border pt-4 flex flex-col gap-3">
              <span className="text-[11px] font-mono font-bold uppercase text-muted-foreground">
                Metadata Umum Materi
              </span>

              <CmsFormField label="Judul Materi" required id="meta-title">
                <CmsInput
                  id="meta-title"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                />
              </CmsFormField>

              <CmsFormField label="Slug URL" required id="meta-slug">
                <CmsInput
                  id="meta-slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                />
              </CmsFormField>

              <div className="grid grid-cols-2 gap-2">
                <CmsFormField label="Mata Pelajaran" id="meta-subject">
                  <CmsSelect
                    id="meta-subject"
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value)}
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </CmsSelect>
                </CmsFormField>

                <CmsFormField label="Topik" id="meta-topic">
                  <CmsSelect
                    id="meta-topic"
                    value={topicId}
                    onChange={(e) => setTopicId(e.target.value)}
                  >
                    <option value="">-- Tanpa Topik --</option>
                    {topics
                      .filter((t) => t.subjectId === subjectId)
                      .map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                  </CmsSelect>
                </CmsFormField>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <CmsFormField label="Jenis" id="meta-kind">
                  <CmsSelect
                    id="meta-kind"
                    value={kind}
                    onChange={(e) => setKind(e.target.value as LessonKind)}
                  >
                    <option value="LESSON">Materi Biasa</option>
                    <option value="EXPERIMENT">Eksperimen / Lab</option>
                  </CmsSelect>
                </CmsFormField>

                <CmsFormField label="Tingkat Kesulitan" id="meta-diff">
                  <CmsSelect
                    id="meta-diff"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                  >
                    <option value="BEGINNER">Pemula</option>
                    <option value="INTERMEDIATE">Menengah</option>
                    <option value="ADVANCED">Lanjutan</option>
                  </CmsSelect>
                </CmsFormField>
              </div>
            </div>
          </CmsPanel>
        </div>
      </div>

      {/* Modal: Live Preview using exact same LessonContentRenderer + Subject Theme */}
      {isPreviewOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs"
        >
          <div className="flex h-[90vh] w-full max-w-4xl flex-col rounded-2xl border-[3px] border-[#1E2024] bg-background shadow-2xl dark:border-[#F4F1EA]">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b-[3px] border-[#1E2024] bg-card px-6 py-4 dark:border-[#F4F1EA]">
              <div>
                <span className="text-xs font-mono font-bold uppercase text-primary">
                  Pratinjau Pelajar (Sama dengan Frontend Publik)
                </span>
                <h2 className="text-lg font-black text-[#1E2024] dark:text-[#F4F1EA]">
                  {title || "Pratinjau Materi"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="rounded-lg border-2 border-[#1E2024] p-1.5 hover:bg-muted dark:border-[#F4F1EA]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body wrapped in Subject Theme bgTint */}
            <div className={`flex-1 overflow-y-auto p-6 sm:p-10 ${subjectTheme.bgTint}`}>
              <div className="mx-auto max-w-2xl bg-card rounded-2xl border-[2px] border-border p-8 shadow-sm">
                <div className="mb-6 flex items-center gap-2">
                  <span className={`rounded-md border px-2.5 py-0.5 text-xs font-bold ${subjectTheme.badgeBorder} ${subjectTheme.badgeBg} ${subjectTheme.badgeText}`}>
                    {currentSubject?.name || "Subjek"}
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">
                    {durationMinutes} Menit Belajar
                  </span>
                </div>

                <h1 className="text-3xl font-black tracking-tight text-[#1E2024] dark:text-[#F4F1EA] mb-6">
                  {title}
                </h1>

                {/* LessonContentRenderer */}
                <LessonContentRenderer blocks={blocks} />

                {/* Sources section preview */}
                {linkedSources.length > 0 && (
                  <div className="mt-12 border-t-2 border-border pt-6">
                    <h4 className="text-sm font-black font-mono uppercase text-muted-foreground mb-3">
                      Sumber Rujukan
                    </h4>
                    <ul className="flex flex-col gap-2 text-xs">
                      {linkedSources.map((ls) => (
                        <li key={ls.sourceId} className="flex items-center gap-2">
                          <BookOpen className="h-3.5 w-3.5 text-primary shrink-0" />
                          <span className="font-bold">{ls.source.title}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Publish Gates Checklist Dialog (design-cms.md §6.2) */}
      {isChecklistOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
        >
          <div className="w-full max-w-lg rounded-xl border-[3px] border-[#1E2024] bg-card p-6 shadow-[6px_6px_0px_0px_#1E2024] dark:border-[#F4F1EA] dark:shadow-[6px_6px_0px_0px_rgba(244,241,234,0.85)]">
            <h3 className="text-lg font-black tracking-tight text-[#1E2024] dark:text-[#F4F1EA]">
              Checklist Syarat Publikasi Materi
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              IVE-APP menjamin seluruh materi terbit memenuhi standar mutu, keterbacaan, dan validitas rujukan.
            </p>

            <div className="mt-4 flex flex-col gap-2.5">
              {checklistReport.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-start gap-3 rounded-lg border-2 p-3 ${
                    item.passed
                      ? "border-[#7BE0A4] bg-[#7BE0A4]/15"
                      : "border-[#FF6B6B] bg-[#FF6B6B]/15"
                  }`}
                >
                  <div className="mt-0.5">
                    {item.passed ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-700 dark:text-emerald-300" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-300" />
                    )}
                  </div>
                  <div className="flex-1">
                    <span className="text-xs font-black block">{item.label}</span>
                    {item.message && (
                      <span className="text-[11px] text-red-600 dark:text-red-300 block mt-0.5">
                        {item.message}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 border-t-2 border-border pt-4">
              <CmsButton
                variant="secondary"
                onClick={() => setIsChecklistOpen(false)}
              >
                Tutup
              </CmsButton>
              {checklistReport.every((c) => c.passed) && (
                <CmsButton
                  variant="primary"
                  isLoading={isPublishing}
                  onClick={executePublish}
                >
                  Konfirmasi & Terbitkan Sekarang
                </CmsButton>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
