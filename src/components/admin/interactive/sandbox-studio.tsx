"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  FlaskConical,
  Layers,
  Search,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ExternalLink,
  Plus,
  Trash2,
  RefreshCw,
  Eye,
  Sliders,
  Calculator,
  ArrowRight,
  BookOpen,
  Info,
} from "lucide-react";
import { CmsButton } from "@/components/admin/ui/button";
import { CmsInput, CmsTextarea } from "@/components/admin/ui/input";
import { CmsPanel } from "@/components/admin/ui/panel";
import { CmsConfirmDialog } from "@/components/admin/ui/dialog";
import { ContentStatusBadge } from "@/components/admin/ui/badge";
import { CmsEmptyState, CmsErrorState, CmsLoadingSkeleton } from "@/components/admin/ui/feedback";
import { getSubjectTheme } from "@/components/ui/subject-theme";
import {
  INTERACTIVE_REGISTRY,
  INTERACTIVE_KEYS,
  type InteractiveKey,
} from "@/modules/content/interactive-registry";
import { RenderInteractive } from "@/modules/content/render-interactive";
import FormulaSandbox, {
  defaultFormulaConfig,
  type FormulaSandboxConfig,
  type FormulaVariable,
  type FormulaOutput,
} from "@/components/interactive/formula-sandbox";
import { evaluateFormula } from "@/modules/content/formula/evaluator";
import { RenderFormula } from "@/modules/content/render-formula";
import { getPublicUrl } from "@/lib/cms-public-url";

interface LessonSummary {
  id: string;
  slug: string;
  title: string;
  kind: "LESSON" | "EXPERIMENT";
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  subject: { id: string; name: string; slug: string };
  topic?: { id: string; name: string; slug: string } | null;
  interactiveBlockCount: number;
  hasFormulaBlock: boolean;
  createdAt: string;
  updatedAt: string;
}

interface LessonContext {
  lesson: {
    id: string;
    title: string;
    slug: string;
    kind: "LESSON" | "EXPERIMENT";
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    description?: string | null;
    keywords?: string[];
    difficulty: string;
    subject: { id: string; name: string; slug: string };
    topic?: { id: string; name: string; slug: string } | null;
    updatedAt: string;
  };
  formulaBlocks: Array<{ id: string; type: string; content?: string }>;
  interactiveBlocks: Array<{ id: string; type: string; component?: string; config?: Record<string, unknown> }>;
  sources: Array<{ id: string; title: string; citationNote?: string | null }>;
}

export function SandboxStudio({ initialLessonId }: { initialLessonId?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlLessonId = searchParams.get("lesson") || initialLessonId || null;

  // Tabs
  const [activeTab, setActiveTab] = useState<"studio" | "library">("studio");

  // Zone A Data & Filters
  const [lessons, setLessons] = useState<LessonSummary[]>([]);
  const [isLoadingLessons, setIsLoadingLessons] = useState(true);
  const [lessonsError, setLessonsError] = useState<string | null>(null);

  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(urlLessonId);
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [onlyWithoutSandbox, setOnlyWithoutSandbox] = useState(false);
  const [showArchived, setShowArchived] = useState(false);

  // Zone C Context Data
  const [lessonContext, setLessonContext] = useState<LessonContext | null>(null);
  const [isLoadingContext, setIsLoadingContext] = useState(false);

  // Zone B Studio State
  const [selectedComponentKey, setSelectedComponentKey] = useState<InteractiveKey>("formula-sandbox");
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);

  // Formula Sandbox Config Builder State
  const [formulaConfig, setFormulaConfig] = useState<FormulaSandboxConfig>({
    ...defaultFormulaConfig,
  });

  // Generic Config for other components
  const [genericConfig, setGenericConfig] = useState<Record<string, unknown>>({});

  // UI / Dialogs
  const [isPublishConfirmOpen, setIsPublishConfirmOpen] = useState(false);
  const [isInserting, setIsInserting] = useState(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);
  const [actionErrorMessage, setActionErrorMessage] = useState<string | null>(null);

  // Load Lessons on Mount
  const fetchLessons = async () => {
    try {
      const res = await fetch("/api/admin/interactive/lessons");
      const body = await res.json().catch(() => null);
      if (!res.ok) {
        setLessonsError(body?.error?.message || "Gagal memuat daftar materi.");
        setIsLoadingLessons(false);
        return;
      }
      const data = (body?.data || []) as LessonSummary[];
      setLessons(data);
      setIsLoadingLessons(false);

      if (!selectedLessonId && data.length > 0) {
        const preselected = urlLessonId ? data.find((l) => l.id === urlLessonId) : data[0];
        setSelectedLessonId(preselected?.id || data[0].id);
      }
    } catch {
      setLessonsError("Gangguan jaringan saat memuat materi.");
      setIsLoadingLessons(false);
    }
  };

  useEffect(() => {
    let active = true;
    fetch("/api/admin/interactive/lessons")
      .then((res) => res.json())
      .then((body) => {
        if (!active) return;
        const data = (body?.data || []) as LessonSummary[];
        setLessons(data);
        setIsLoadingLessons(false);

        if (!selectedLessonId && data.length > 0) {
          const preselected = urlLessonId ? data.find((l) => l.id === urlLessonId) : data[0];
          setSelectedLessonId(preselected?.id || data[0].id);
        }
      })
      .catch(() => {
        if (!active) return;
        setLessonsError("Gangguan jaringan saat memuat materi.");
        setIsLoadingLessons(false);
      });

    return () => {
      active = false;
    };
  }, [selectedLessonId, urlLessonId]);

  // Update URL query when lesson selected
  const handleSelectLesson = (id: string) => {
    setSelectedLessonId(id);
    setLessonContext(null);
    setIsLoadingContext(true);
    setActionSuccessMessage(null);
    setActionErrorMessage(null);
    setEditingBlockId(null);
    const params = new URLSearchParams(window.location.search);
    params.set("lesson", id);
    router.replace(`/admin/interactive?${params.toString()}`);
  };

  // Load Lesson Context when selectedLessonId changes
  useEffect(() => {
    if (!selectedLessonId) return;

    let active = true;
    fetch(`/api/admin/interactive/lessons/${selectedLessonId}`)
      .then((res) => res.json())
      .then((body) => {
        if (!active || !body?.data) return;
        const ctx = body.data as LessonContext;
        setLessonContext(ctx);
        setIsLoadingContext(false);

        if (ctx.interactiveBlocks && ctx.interactiveBlocks.length > 0) {
          const firstInteractive = ctx.interactiveBlocks[0];
          const compKey = (firstInteractive.component || "formula-sandbox") as InteractiveKey;
          setSelectedComponentKey(compKey);
          setEditingBlockId(firstInteractive.id);

          if (compKey === "formula-sandbox" && firstInteractive.config) {
            setFormulaConfig({
              ...defaultFormulaConfig,
              ...(firstInteractive.config as unknown as FormulaSandboxConfig),
            });
          } else if (firstInteractive.config) {
            setGenericConfig(firstInteractive.config);
          }
        } else {
          setEditingBlockId(null);
          setSelectedComponentKey("formula-sandbox");
          setFormulaConfig({
            ...defaultFormulaConfig,
            title: `Simulasi: ${ctx.lesson.title}`,
            concept: ctx.lesson.title,
            textFallback: `Simulasi interaktif untuk konsep materi ${ctx.lesson.title}.`,
          });
        }
      })
      .catch(() => {
        if (!active) return;
        setIsLoadingContext(false);
      });

    return () => {
      active = false;
    };
  }, [selectedLessonId]);

  // Selected Lesson Summary from Zone A
  const activeLessonSummary = useMemo(() => {
    return lessons.find((l) => l.id === selectedLessonId) || null;
  }, [lessons, selectedLessonId]);

  // Subject theme for active lesson
  const currentSubjectTheme = useMemo(() => {
    const slug = activeLessonSummary?.subject?.slug || "umum";
    return getSubjectTheme(slug);
  }, [activeLessonSummary]);

  // Filtered Lessons for Zone A
  const filteredLessons = useMemo(() => {
    return lessons.filter((l) => {
      if (!showArchived && l.status === "ARCHIVED") return false;
      if (subjectFilter !== "ALL" && l.subject.id !== subjectFilter) return false;
      if (statusFilter !== "ALL" && l.status !== statusFilter) return false;
      if (onlyWithoutSandbox && l.interactiveBlockCount > 0) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = l.title.toLowerCase().includes(q);
        const matchesTopic = l.topic?.name.toLowerCase().includes(q);
        const matchesSubject = l.subject.name.toLowerCase().includes(q);
        if (!matchesTitle && !matchesTopic && !matchesSubject) return false;
      }
      return true;
    });
  }, [lessons, showArchived, subjectFilter, statusFilter, onlyWithoutSandbox, searchQuery]);

  // Group lessons by subject
  const groupedLessons = useMemo(() => {
    const map = new Map<string, { subject: { id: string; name: string; slug: string }; list: LessonSummary[] }>();
    for (const l of filteredLessons) {
      if (!map.has(l.subject.id)) {
        map.set(l.subject.id, { subject: l.subject, list: [] });
      }
      map.get(l.subject.id)!.list.push(l);
    }
    return Array.from(map.values());
  }, [filteredLessons]);

  // Unique Subjects for filter dropdown
  const uniqueSubjects = useMemo(() => {
    const map = new Map<string, { id: string; name: string }>();
    for (const l of lessons) {
      if (!map.has(l.subject.id)) {
        map.set(l.subject.id, { id: l.subject.id, name: l.subject.name });
      }
    }
    return Array.from(map.values());
  }, [lessons]);

  // Safe formula expression validator
  const expressionValidationErrors = useMemo(() => {
    if (selectedComponentKey !== "formula-sandbox") return [];
    const errors: Array<{ outputName: string; message: string }> = [];
    const varMap: Record<string, number> = {};
    (formulaConfig.variables || []).forEach((v) => {
      varMap[v.name] = v.defaultValue ?? 1;
    });

    (formulaConfig.outputs || []).forEach((out) => {
      if (!out.expression || !out.expression.trim()) {
        errors.push({ outputName: out.name, message: `Ekspresi untuk ${out.name} tidak boleh kosong.` });
        return;
      }
      try {
        evaluateFormula(out.expression, varMap);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Ekspresi tidak valid";
        errors.push({ outputName: out.name, message: `${out.name}: ${msg}` });
      }
    });

    return errors;
  }, [selectedComponentKey, formulaConfig]);

  // Check if current config has mandatory text fallback
  const isFallbackMissing = useMemo(() => {
    if (selectedComponentKey === "formula-sandbox") {
      return !formulaConfig.textFallback || !formulaConfig.textFallback.trim();
    }
    const genericFallback = genericConfig.textFallback as string | undefined;
    return !genericFallback || !genericFallback.trim();
  }, [selectedComponentKey, formulaConfig, genericConfig]);

  // Formula Variable Handlers
  const addVariable = () => {
    const vars = formulaConfig.variables || [];
    const candidateNames = ["a", "b", "c", "d", "n", "r", "v", "t", "w", "z"];
    const existingNames = new Set(vars.map((v) => v.name));
    const nextName = candidateNames.find((n) => !existingNames.has(n)) || `var_${vars.length + 1}`;

    const newVar: FormulaVariable = {
      name: nextName,
      label: `Variabel ${nextName.toUpperCase()}`,
      unit: "",
      min: 1,
      max: 100,
      step: 1,
      defaultValue: 10,
    };
    setFormulaConfig((prev) => ({
      ...prev,
      variables: [...(prev.variables || []), newVar],
    }));
  };

  const updateVariable = (idx: number, patch: Partial<FormulaVariable>) => {
    setFormulaConfig((prev) => {
      const copy = [...(prev.variables || [])];
      copy[idx] = { ...copy[idx], ...patch };
      return { ...prev, variables: copy };
    });
  };

  const removeVariable = (idx: number) => {
    setFormulaConfig((prev) => {
      const copy = [...(prev.variables || [])];
      copy.splice(idx, 1);
      return { ...prev, variables: copy };
    });
  };

  // Formula Output Handlers
  const addOutput = () => {
    const outs = formulaConfig.outputs || [];
    const candidateNames = ["y", "z", "res", "total", "val"];
    const existingNames = new Set(outs.map((o) => o.name));
    const nextName = candidateNames.find((n) => !existingNames.has(n)) || `out_${outs.length + 1}`;

    const firstVar = formulaConfig.variables?.[0]?.name || "x";
    const newOut: FormulaOutput = {
      name: nextName,
      label: `Hasil ${nextName.toUpperCase()}`,
      unit: "",
      expression: `${firstVar} * 2`,
    };
    setFormulaConfig((prev) => ({
      ...prev,
      outputs: [...(prev.outputs || []), newOut],
    }));
  };

  const updateOutput = (idx: number, patch: Partial<FormulaOutput>) => {
    setFormulaConfig((prev) => {
      const copy = [...(prev.outputs || [])];
      copy[idx] = { ...copy[idx], ...patch };
      return { ...prev, outputs: copy };
    });
  };

  const removeOutput = (idx: number) => {
    setFormulaConfig((prev) => {
      const copy = [...(prev.outputs || [])];
      copy.splice(idx, 1);
      return { ...prev, outputs: copy };
    });
  };

  // Use formula from Zone C as suggestion
  const applyFormulaSuggestion = (latex: string) => {
    // Attempt basic parsing: e.g. "E = m \cdot c^2" or "v = s / t"
    let clean = latex.replace(/\\cdot/g, "*").replace(/\\times/g, "*").replace(/\\frac{([^}]+)}{([^}]+)}/g, "($1)/($2)");
    clean = clean.replace(/[{}]/g, "").replace(/\s+/g, " ");

    const parts = clean.split("=");
    if (parts.length === 2) {
      const outName = parts[0].trim().replace(/[^a-zA-Z0-9]/g, "");
      const expr = parts[1].trim();

      // Extract single-letter identifiers
      const idents = Array.from(new Set(expr.match(/[a-zA-Z]/g) || []));
      const newVars: FormulaVariable[] = idents.map((id) => ({
        name: id,
        label: `Variabel ${id}`,
        unit: "",
        min: 1,
        max: 50,
        step: 1,
        defaultValue: 5,
      }));

      setFormulaConfig((prev) => ({
        ...prev,
        concept: `Kalkulasi Rumus: ${latex}`,
        variables: newVars.length > 0 ? newVars : prev.variables,
        outputs: [
          {
            name: outName || "hasil",
            label: `Nilai ${outName || "Hasil"}`,
            unit: "",
            expression: expr,
          },
        ],
        textFallback: `Kalkulasi rumus ${latex} dengan input variabel interaktif.`,
      }));
    } else {
      // Just set as output expression
      setFormulaConfig((prev) => ({
        ...prev,
        concept: `Kalkulasi Rumus: ${latex}`,
        outputs: [
          {
            name: "hasil",
            label: "Kalkulasi",
            unit: "",
            expression: clean,
          },
        ],
      }));
    }

    setSelectedComponentKey("formula-sandbox");
    setActionSuccessMessage("Rumus dari materi berhasil dimuat ke pembangun!");
    setTimeout(() => setActionSuccessMessage(null), 4000);
  };

  // Save Studio Draft to LocalStorage
  const handleSaveDraft = () => {
    if (!selectedLessonId) return;
    const configToSave =
      selectedComponentKey === "formula-sandbox" ? formulaConfig : genericConfig;
    const draftData = {
      lessonId: selectedLessonId,
      componentKey: selectedComponentKey,
      config: configToSave,
      savedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem(`ive_studio_draft_${selectedLessonId}`, JSON.stringify(draftData));
      setActionSuccessMessage("Draf Sandbox tersimpan di ruang kerja browser.");
      setTimeout(() => setActionSuccessMessage(null), 3000);
    } catch {
      setActionErrorMessage("Gagal menyimpan draf ke local storage.");
    }
  };

  // Insert into Lesson Action
  const executeInsertToLesson = async () => {
    if (!selectedLessonId) return;
    setActionErrorMessage(null);
    setActionSuccessMessage(null);
    setIsInserting(true);

    const configToInsert =
      selectedComponentKey === "formula-sandbox" ? formulaConfig : genericConfig;

    try {
      const res = await fetch(`/api/admin/interactive/lessons/${selectedLessonId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          componentKey: selectedComponentKey,
          config: configToInsert,
          existingBlockId: editingBlockId || undefined,
        }),
      });

      const body = await res.json().catch(() => null);
      if (!res.ok) {
        setActionErrorMessage(body?.error?.message || "Gagal menyisipkan sandbox ke materi.");
        setIsInserting(false);
        setIsPublishConfirmOpen(false);
        return;
      }

      setActionSuccessMessage("Komponen interaktif berhasil disisipkan dan terhubung ke materi!");
      setIsPublishConfirmOpen(false);
      setIsInserting(false);

      // Refresh list & context
      fetchLessons();
      if (selectedLessonId) {
        const ctxRes = await fetch(`/api/admin/interactive/lessons/${selectedLessonId}`);
        const ctxBody = await ctxRes.json().catch(() => null);
        if (ctxBody?.data) setLessonContext(ctxBody.data);
      }
    } catch {
      setActionErrorMessage("Gangguan jaringan saat menyisipkan komponen.");
      setIsInserting(false);
      setIsPublishConfirmOpen(false);
    }
  };

  const handleInsertClick = () => {
    if (!selectedLessonId) return;
    if (isFallbackMissing) {
      setActionErrorMessage("Penjelasan fallback teks wajib diisi sebelum disisipkan ke materi.");
      return;
    }
    if (expressionValidationErrors.length > 0) {
      setActionErrorMessage("Harap perbaiki formula/ekspresi yang bermasalah terlebih dahulu.");
      return;
    }

    // Check if lesson is published: require confirmation dialog
    if (activeLessonSummary?.status === "PUBLISHED") {
      setIsPublishConfirmOpen(true);
    } else {
      executeInsertToLesson();
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Banner / Tab Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border-[3px] border-[#1E2024] bg-card p-4 shadow-[4px_4px_0px_0px_#1E2024] dark:border-[#F4F1EA] dark:shadow-[4px_4px_0px_0px_rgba(244,241,234,0.85)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
              STUDIO INTERAKTIF
            </span>
          </div>
          <h1 className="text-xl font-black text-[#1E2024] dark:text-[#F4F1EA]">
            Sandbox Studio & Pustaka Komponen
          </h1>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("studio")}
            className={`flex items-center gap-2 rounded-lg border-2 px-4 py-2 text-xs font-black uppercase tracking-wider transition-all ${
              activeTab === "studio"
                ? "border-[#1E2024] bg-primary text-white shadow-[2px_2px_0px_0px_#1E2024] dark:border-[#F4F1EA]"
                : "border-border bg-background text-[#1E2024] hover:bg-muted dark:text-[#F4F1EA]"
            }`}
          >
            <FlaskConical className="h-4 w-4" />
            Sandbox Studio
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("library")}
            className={`flex items-center gap-2 rounded-lg border-2 px-4 py-2 text-xs font-black uppercase tracking-wider transition-all ${
              activeTab === "library"
                ? "border-[#1E2024] bg-primary text-white shadow-[2px_2px_0px_0px_#1E2024] dark:border-[#F4F1EA]"
                : "border-border bg-background text-[#1E2024] hover:bg-muted dark:text-[#F4F1EA]"
            }`}
          >
            <Layers className="h-4 w-4" />
            Pustaka Komponen ({INTERACTIVE_KEYS.length})
          </button>
        </div>
      </div>

      {/* Global Alerts */}
      {actionSuccessMessage && (
        <div className="flex items-center gap-3 rounded-lg border-[3px] border-[#1E2024] bg-[#2E7D32]/10 p-3 text-sm font-bold text-[#2E7D32] shadow-[2px_2px_0px_0px_#1E2024] dark:border-[#F4F1EA] dark:bg-[#2E7D32]/25">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>{actionSuccessMessage}</span>
        </div>
      )}

      {actionErrorMessage && (
        <div className="flex items-center gap-3 rounded-lg border-[3px] border-[#1E2024] bg-[#C62828]/10 p-3 text-sm font-bold text-[#C62828] shadow-[2px_2px_0px_0px_#1E2024] dark:border-[#F4F1EA] dark:bg-[#C62828]/25">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <span>{actionErrorMessage}</span>
        </div>
      )}

      {/* TAB 1: STUDIO (3 ZONES) */}
      {activeTab === "studio" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* ========================================================= */}
          {/* ZONA A: PEMILIH MATERI (3 Cols on desktop)                */}
          {/* ========================================================= */}
          <div className="flex flex-col gap-4 lg:col-span-3">
            <CmsPanel
              eyebrow="ZONA A — SUMBER DATA DB"
              title="Pemilih Materi"
              className="flex flex-col gap-3 p-4"
            >
              <div className="text-xs text-muted-foreground">
                Pilih materi dari database untuk membangun sandbox interaktif.
              </div>

              {/* Filters */}
              <div className="flex flex-col gap-2.5">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari materi..."
                    className="w-full rounded-lg border-2 border-[#1E2024] bg-background py-1.5 pl-9 pr-3 text-xs font-medium outline-none focus:border-primary dark:border-[#F4F1EA]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={subjectFilter}
                    onChange={(e) => setSubjectFilter(e.target.value)}
                    className="rounded-lg border-2 border-[#1E2024] bg-background px-2 py-1.5 text-xs font-bold outline-none dark:border-[#F4F1EA]"
                  >
                    <option value="ALL">Semua Mapel</option>
                    {uniqueSubjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="rounded-lg border-2 border-[#1E2024] bg-background px-2 py-1.5 text-xs font-bold outline-none dark:border-[#F4F1EA]"
                  >
                    <option value="ALL">Semua Status</option>
                    <option value="PUBLISHED">PUBLISHED</option>
                    <option value="DRAFT">DRAFT</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5 pt-1 text-xs">
                  <label className="flex cursor-pointer items-center gap-2 font-medium">
                    <input
                      type="checkbox"
                      checked={onlyWithoutSandbox}
                      onChange={(e) => setOnlyWithoutSandbox(e.target.checked)}
                      className="rounded border-[#1E2024] text-primary"
                    />
                    <span>Belum punya sandbox</span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-2 font-medium text-muted-foreground">
                    <input
                      type="checkbox"
                      checked={showArchived}
                      onChange={(e) => setShowArchived(e.target.checked)}
                      className="rounded border-[#1E2024] text-primary"
                    />
                    <span>Tampilkan arsip</span>
                  </label>
                </div>
              </div>

              {/* Lesson List Grouped by Subject */}
              <div className="mt-2 flex max-h-[600px] flex-col gap-4 overflow-y-auto pr-1">
                {isLoadingLessons ? (
                  <CmsLoadingSkeleton count={4} />
                ) : lessonsError ? (
                  <CmsErrorState message={lessonsError} onRetry={fetchLessons} />
                ) : groupedLessons.length === 0 ? (
                  <CmsEmptyState
                    title="Materi tidak ditemukan"
                    description="Belum ada materi yang sesuai dengan filter pencarian."
                    actionLabel="Tambah Materi Baru"
                    actionHref="/admin/lessons/new"
                  />
                ) : (
                  groupedLessons.map((grp) => {
                    const theme = getSubjectTheme(grp.subject.slug);
                    return (
                      <div key={grp.subject.id} className="flex flex-col gap-1.5">
                        {/* Subject Group Header */}
                        <div className="flex items-center gap-2 border-b-2 border-border/60 pb-1 pt-1">
                          <span
                            className="h-2.5 w-2.5 rounded-full border border-[#1E2024]"
                            style={{ backgroundColor: theme.cardBorder }}
                          />
                          <span className="font-mono text-xs font-black uppercase text-[#1E2024] dark:text-[#F4F1EA]">
                            {grp.subject.name}
                          </span>
                        </div>

                        {/* Lessons in this subject */}
                        <div className="flex flex-col gap-1.5">
                          {grp.list.map((l) => {
                            const isSelected = l.id === selectedLessonId;
                            const isNew =
                              Date.now() - new Date(l.createdAt).getTime() <
                              7 * 24 * 60 * 60 * 1000;

                            return (
                              <button
                                key={l.id}
                                type="button"
                                onClick={() => handleSelectLesson(l.id)}
                                className={`flex flex-col gap-1.5 rounded-lg border-2 p-2.5 text-left transition-all ${
                                  isSelected
                                    ? "border-[#1E2024] bg-accent/20 shadow-[2px_2px_0px_0px_#1E2024] dark:border-[#F4F1EA] dark:shadow-[2px_2px_0px_0px_rgba(244,241,234,0.85)]"
                                    : "border-border bg-background hover:border-[#1E2024]/50"
                                }`}
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <span className="text-xs font-black text-[#1E2024] dark:text-[#F4F1EA]">
                                    {l.title}
                                  </span>
                                  {isNew && (
                                    <span className="shrink-0 rounded border border-[#1E2024] bg-primary px-1 py-0.5 text-[9px] font-black uppercase text-white">
                                      BARU
                                    </span>
                                  )}
                                </div>

                                {l.topic && (
                                  <span className="text-[10px] text-muted-foreground">
                                    Topik: {l.topic.name}
                                  </span>
                                )}

                                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                                  <ContentStatusBadge status={l.status} />
                                  {l.interactiveBlockCount > 0 ? (
                                    <span className="rounded border border-[#1E2024] bg-[#2E7D32]/15 px-1.5 py-0.5 text-[10px] font-black text-[#2E7D32] dark:border-[#F4F1EA]">
                                      SANDBOX {l.interactiveBlockCount}
                                    </span>
                                  ) : (
                                    <span className="rounded border border-dashed border-[#1E2024]/60 bg-muted/30 px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground dark:border-[#F4F1EA]/60">
                                      BELUM ADA
                                    </span>
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CmsPanel>
          </div>

          {/* ========================================================= */}
          {/* ZONA B: WORKSPACE STUDIO (6 Cols on desktop)              */}
          {/* ========================================================= */}
          <div className="flex flex-col gap-4 lg:col-span-6">
            {!activeLessonSummary ? (
              <CmsPanel title="Workspace Studio" className="p-8 text-center">
                <CmsEmptyState
                  title="Pilih Materi Terlebih Dahulu"
                  description="Silakan pilih salah satu materi di panel kiri untuk membuka workspace studio dan mulai membuat komponen interaktif."
                />
              </CmsPanel>
            ) : (
              <div className="flex flex-col gap-4">
                {/* Header Context Stripe */}
                <div
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border-[3px] border-[#1E2024] bg-card p-3 shadow-[3px_3px_0px_0px_#1E2024] dark:border-[#F4F1EA] dark:shadow-[3px_3px_0px_0px_rgba(244,241,234,0.85)]"
                  style={{ borderLeftWidth: "8px", borderLeftColor: currentSubjectTheme.cardBorder }}
                >
                  <div className="flex flex-col">
                    <span className="font-mono text-[10px] font-bold uppercase text-muted-foreground">
                      {activeLessonSummary.subject.name} / {activeLessonSummary.topic?.name || "Umum"}
                    </span>
                    <h2 className="text-base font-black text-[#1E2024] dark:text-[#F4F1EA]">
                      {activeLessonSummary.title}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2">
                    <ContentStatusBadge status={activeLessonSummary.status} />
                    <Link
                      href={`/admin/lessons/${activeLessonSummary.id}`}
                      className="flex items-center gap-1 rounded border-2 border-[#1E2024] bg-background px-2.5 py-1 text-xs font-bold text-[#1E2024] hover:bg-muted dark:border-[#F4F1EA] dark:text-[#F4F1EA]"
                    >
                      <BookOpen className="h-3.5 w-3.5" />
                      Editor Materi
                    </Link>
                  </div>
                </div>

                {/* Component Selector Bar */}
                <CmsPanel
                  eyebrow="PILIHAN KOMPONEN INTERAKTIF"
                  title="Template / Komponen"
                  className="flex flex-col gap-3 p-4"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    {INTERACTIVE_KEYS.map((key) => {
                      const meta = INTERACTIVE_REGISTRY[key];
                      const isMatchSubject = meta.subjectHints.includes(
                        activeLessonSummary.subject.slug,
                      );
                      const isSelected = selectedComponentKey === key;

                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => {
                            setSelectedComponentKey(key);
                            if (key !== "formula-sandbox") {
                              setGenericConfig(meta.defaultConfig);
                            }
                          }}
                          className={`flex items-center gap-1.5 rounded-lg border-2 px-3 py-1.5 text-xs font-black transition-all ${
                            isSelected
                              ? "border-[#1E2024] bg-primary text-white shadow-[2px_2px_0px_0px_#1E2024] dark:border-[#F4F1EA]"
                              : isMatchSubject
                                ? "border-primary bg-primary/10 text-primary hover:bg-primary/20"
                                : "border-border bg-background text-[#1E2024] hover:bg-muted dark:text-[#F4F1EA]"
                          }`}
                        >
                          <span>{meta.title}</span>
                          {isMatchSubject && (
                            <span className="rounded bg-primary/20 px-1 text-[9px] font-bold">
                              Rekomendasi
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div className="text-xs text-muted-foreground">
                    {INTERACTIVE_REGISTRY[selectedComponentKey]?.description}
                  </div>
                </CmsPanel>

                {/* Builder v0 — Form Schema */}
                {selectedComponentKey === "formula-sandbox" ? (
                  <CmsPanel
                    eyebrow="BUILDER v0 — FORM RUMUS & VARIABEL"
                    title="Konfigurasi Formula Sandbox"
                    className="flex flex-col gap-5 p-4"
                  >
                    {/* Basic Meta */}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-black uppercase text-[#1E2024] dark:text-[#F4F1EA]">
                          Judul Sandbox
                        </label>
                        <CmsInput
                          value={formulaConfig.title || ""}
                          onChange={(e) => setFormulaConfig((p) => ({ ...p, title: e.target.value }))}
                          placeholder="Contoh: Eksplorasi Reaksi Redoks"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-black uppercase text-[#1E2024] dark:text-[#F4F1EA]">
                          Konsep Materi
                        </label>
                        <CmsInput
                          value={formulaConfig.concept || ""}
                          onChange={(e) =>
                            setFormulaConfig((p) => ({ ...p, concept: e.target.value }))
                          }
                          placeholder="Contoh: Hubungan Massa dan Energi"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-black uppercase text-[#1E2024] dark:text-[#F4F1EA]">
                        Tipe Visualisasi
                      </label>
                      <div className="flex gap-2">
                        {(["line", "readout", "scatter"] as const).map((vis) => (
                          <button
                            key={vis}
                            type="button"
                            onClick={() => setFormulaConfig((p) => ({ ...p, visualization: vis }))}
                            className={`rounded-lg border-2 px-3 py-1.5 text-xs font-black uppercase tracking-wider ${
                              formulaConfig.visualization === vis
                                ? "border-[#1E2024] bg-primary text-white shadow-[2px_2px_0px_0px_#1E2024] dark:border-[#F4F1EA]"
                                : "border-border bg-background hover:bg-muted"
                            }`}
                          >
                            {vis === "line" ? "Grafik Garis" : vis === "readout" ? "Pembaca Nilai" : "Grafik Sebar"}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Variables Manager */}
                    <div className="flex flex-col gap-3 rounded-lg border-2 border-border bg-muted/20 p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Sliders className="h-4 w-4 text-primary" />
                          <span className="text-xs font-black uppercase text-[#1E2024] dark:text-[#F4F1EA]">
                            Variabel Masukan (Slider Pengguna)
                          </span>
                        </div>
                        <CmsButton
                          variant="secondary"
                          size="sm"
                          onClick={addVariable}
                          className="h-7 text-xs"
                        >
                          <Plus className="mr-1 h-3.5 w-3.5" />
                          Tambah Variabel
                        </CmsButton>
                      </div>

                      <div className="flex flex-col gap-2.5">
                        {(formulaConfig.variables || []).map((v, idx) => (
                          <div
                            key={idx}
                            className="grid grid-cols-2 gap-2 rounded-lg border-2 border-[#1E2024]/60 bg-background p-2.5 sm:grid-cols-6 dark:border-[#F4F1EA]/60"
                          >
                            <div>
                              <span className="text-[10px] font-bold text-muted-foreground">ID Var</span>
                              <input
                                type="text"
                                value={v.name}
                                onChange={(e) => updateVariable(idx, { name: e.target.value })}
                                className="w-full rounded border border-[#1E2024] px-1.5 py-1 text-xs font-mono font-bold dark:border-[#F4F1EA]"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <span className="text-[10px] font-bold text-muted-foreground">Label Slider</span>
                              <input
                                type="text"
                                value={v.label}
                                onChange={(e) => updateVariable(idx, { label: e.target.value })}
                                className="w-full rounded border border-[#1E2024] px-1.5 py-1 text-xs font-bold dark:border-[#F4F1EA]"
                              />
                            </div>
                            <div>
                              <span className="text-[10px] font-bold text-muted-foreground">Satuan</span>
                              <input
                                type="text"
                                value={v.unit || ""}
                                onChange={(e) => updateVariable(idx, { unit: e.target.value })}
                                placeholder="kg, m/s"
                                className="w-full rounded border border-[#1E2024] px-1.5 py-1 text-xs font-bold dark:border-[#F4F1EA]"
                              />
                            </div>
                            <div>
                              <span className="text-[10px] font-bold text-muted-foreground">Rentang (Min-Max)</span>
                              <div className="flex gap-1">
                                <input
                                  type="number"
                                  value={v.min}
                                  onChange={(e) => updateVariable(idx, { min: Number(e.target.value) })}
                                  className="w-1/2 rounded border border-[#1E2024] px-1 py-1 text-xs font-bold dark:border-[#F4F1EA]"
                                />
                                <input
                                  type="number"
                                  value={v.max}
                                  onChange={(e) => updateVariable(idx, { max: Number(e.target.value) })}
                                  className="w-1/2 rounded border border-[#1E2024] px-1 py-1 text-xs font-bold dark:border-[#F4F1EA]"
                                />
                              </div>
                            </div>
                            <div className="flex items-end justify-between gap-1">
                              <div>
                                <span className="text-[10px] font-bold text-muted-foreground">Default</span>
                                <input
                                  type="number"
                                  value={v.defaultValue}
                                  onChange={(e) =>
                                    updateVariable(idx, { defaultValue: Number(e.target.value) })
                                  }
                                  className="w-full rounded border border-[#1E2024] px-1 py-1 text-xs font-bold dark:border-[#F4F1EA]"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => removeVariable(idx)}
                                title="Hapus Variabel"
                                className="rounded p-1 text-[#C62828] hover:bg-[#C62828]/10"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Outputs & Formulas Manager */}
                    <div className="flex flex-col gap-3 rounded-lg border-2 border-border bg-muted/20 p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Calculator className="h-4 w-4 text-primary" />
                          <span className="text-xs font-black uppercase text-[#1E2024] dark:text-[#F4F1EA]">
                            Keluaran Rumus (Kalkulasi Evaluator Aman)
                          </span>
                        </div>
                        <CmsButton
                          variant="secondary"
                          size="sm"
                          onClick={addOutput}
                          className="h-7 text-xs"
                        >
                          <Plus className="mr-1 h-3.5 w-3.5" />
                          Tambah Hasil
                        </CmsButton>
                      </div>

                      <div className="flex flex-col gap-2.5">
                        {(formulaConfig.outputs || []).map((out, idx) => (
                          <div
                            key={idx}
                            className="flex flex-col gap-2 rounded-lg border-2 border-[#1E2024]/60 bg-background p-2.5 dark:border-[#F4F1EA]/60"
                          >
                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                              <div>
                                <span className="text-[10px] font-bold text-muted-foreground">ID Keluaran</span>
                                <input
                                  type="text"
                                  value={out.name}
                                  onChange={(e) => updateOutput(idx, { name: e.target.value })}
                                  className="w-full rounded border border-[#1E2024] px-1.5 py-1 text-xs font-mono font-bold dark:border-[#F4F1EA]"
                                />
                              </div>
                              <div className="sm:col-span-2">
                                <span className="text-[10px] font-bold text-muted-foreground">Label Tampilan</span>
                                <input
                                  type="text"
                                  value={out.label}
                                  onChange={(e) => updateOutput(idx, { label: e.target.value })}
                                  className="w-full rounded border border-[#1E2024] px-1.5 py-1 text-xs font-bold dark:border-[#F4F1EA]"
                                />
                              </div>
                              <div className="flex items-end justify-between gap-1">
                                <div className="w-full">
                                  <span className="text-[10px] font-bold text-muted-foreground">Satuan</span>
                                  <input
                                    type="text"
                                    value={out.unit || ""}
                                    onChange={(e) => updateOutput(idx, { unit: e.target.value })}
                                    className="w-full rounded border border-[#1E2024] px-1.5 py-1 text-xs font-bold dark:border-[#F4F1EA]"
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeOutput(idx)}
                                  className="rounded p-1 text-[#C62828] hover:bg-[#C62828]/10"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>

                            <div>
                              <span className="text-[10px] font-bold text-muted-foreground">
                                Ekspresi Matematika (Operator: +, -, *, /, ^, sin, cos, sqrt)
                              </span>
                              <input
                                type="text"
                                value={out.expression}
                                onChange={(e) => updateOutput(idx, { expression: e.target.value })}
                                placeholder="Contoh: 0.5 * m * v^2"
                                className="w-full rounded border-2 border-[#1E2024] px-2 py-1 font-mono text-xs font-black dark:border-[#F4F1EA]"
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Expression Errors Alert */}
                      {expressionValidationErrors.length > 0 && (
                        <div className="rounded-lg border-2 border-[#C62828] bg-[#C62828]/10 p-2.5 text-xs font-bold text-[#C62828]">
                          {expressionValidationErrors.map((err, i) => (
                            <div key={i}>• {err.message}</div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Text Fallback (MANDATORY) */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-black uppercase text-[#1E2024] dark:text-[#F4F1EA]">
                          Penjelasan Tekstual / Fallback Aksesibilitas{" "}
                          <span className="text-destructive">*</span>
                        </label>
                        <span className="text-[10px] font-bold text-destructive">Wajib diisi</span>
                      </div>
                      <CmsTextarea
                        rows={2}
                        value={formulaConfig.textFallback || ""}
                        onChange={(e) =>
                          setFormulaConfig((p) => ({ ...p, textFallback: e.target.value }))
                        }
                        placeholder="Jelaskan cara kerja dan interpretasi hasil kalkulasi untuk pembaca layar atau saat grafis tidak dimuat..."
                      />
                    </div>
                  </CmsPanel>
                ) : (
                  /* Generic JSON/Schema Builder for other components */
                  <CmsPanel
                    eyebrow="BUILDER v0 — KONFIGURASI KOMPONEN"
                    title={`Konfigurasi: ${INTERACTIVE_REGISTRY[selectedComponentKey]?.title}`}
                    className="flex flex-col gap-4 p-4"
                  >
                    <div className="flex flex-col gap-1.5">
                      <span className="text-xs font-black uppercase text-[#1E2024] dark:text-[#F4F1EA]">
                        Parameter Konfigurasi (JSON)
                      </span>
                      <textarea
                        rows={6}
                        value={JSON.stringify(genericConfig, null, 2)}
                        onChange={(e) => {
                          try {
                            const parsed = JSON.parse(e.target.value);
                            setGenericConfig(parsed);
                          } catch {
                            // keep typing
                          }
                        }}
                        className="w-full rounded-lg border-2 border-[#1E2024] bg-background p-2 font-mono text-xs font-bold outline-none dark:border-[#F4F1EA]"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-black uppercase text-[#1E2024] dark:text-[#F4F1EA]">
                          Fallback Teks <span className="text-destructive">*</span>
                        </label>
                        <span className="text-[10px] font-bold text-destructive">Wajib diisi</span>
                      </div>
                      <CmsTextarea
                        rows={2}
                        value={(genericConfig.textFallback as string) || ""}
                        onChange={(e) =>
                          setGenericConfig((p) => ({ ...p, textFallback: e.target.value }))
                        }
                        placeholder="Penjelasan fallback tekstual..."
                      />
                    </div>
                  </CmsPanel>
                )}

                {/* PRATINJAU LANGSUNG (LIVE PREVIEW) */}
                <CmsPanel
                  eyebrow="PRATINJAU LANGSUNG (SAMA DENGAN PELAJAR)"
                  title="Live Sandbox Preview"
                  className="flex flex-col gap-3 p-4"
                >
                  <div
                    className="overflow-hidden rounded-xl border-[3px] border-[#1E2024] p-4 shadow-[4px_4px_0px_0px_#1E2024] dark:border-[#F4F1EA] dark:shadow-[4px_4px_0px_0px_rgba(244,241,234,0.85)]"
                    style={{ backgroundColor: `${currentSubjectTheme.cardBorder}15` }}
                  >
                    {selectedComponentKey === "formula-sandbox" ? (
                      <FormulaSandbox config={formulaConfig} />
                    ) : (
                      <RenderInteractive
                        componentKey={selectedComponentKey}
                        config={genericConfig}
                      />
                    )}
                  </div>
                </CmsPanel>

                {/* Action Buttons Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border-[3px] border-[#1E2024] bg-card p-4 shadow-[4px_4px_0px_0px_#1E2024] dark:border-[#F4F1EA] dark:shadow-[4px_4px_0px_0px_rgba(244,241,234,0.85)]">
                  <div className="flex items-center gap-2">
                    <CmsButton
                      variant="secondary"
                      onClick={handleSaveDraft}
                      className="text-xs"
                    >
                      Simpan Draf Studio
                    </CmsButton>

                    <CmsButton
                      variant="primary"
                      onClick={handleInsertClick}
                      isLoading={isInserting}
                      disabled={isFallbackMissing || expressionValidationErrors.length > 0}
                      className="text-xs"
                    >
                      <Sparkles className="mr-1.5 h-4 w-4" />
                      Sisipkan ke Materi
                    </CmsButton>
                  </div>

                  {activeLessonSummary.status === "PUBLISHED" && (
                    <a
                      href={
                        getPublicUrl({
                          pageType: "lesson",
                          lessonSlug: activeLessonSummary.slug,
                          subjectSlug: activeLessonSummary.subject.slug,
                          topicSlug: activeLessonSummary.topic?.slug,
                          status: "PUBLISHED",
                        }).url
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-lg border-2 border-[#1E2024] bg-background px-3 py-1.5 text-xs font-black text-[#1E2024] hover:bg-muted dark:border-[#F4F1EA] dark:text-[#F4F1EA]"
                    >
                      <span>Lihat Public Site</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ========================================================= */}
          {/* ZONA C: KONTEKS MATERI (3 Cols on desktop)                */}
          {/* ========================================================= */}
          <div className="flex flex-col gap-4 lg:col-span-3">
            <CmsPanel
              eyebrow="ZONA C — KONTEKS MATERI"
              title="Informasi & Rumus"
              className="flex flex-col gap-4 p-4"
            >
              {!activeLessonSummary ? (
                <div className="text-xs text-muted-foreground">
                  Pilih materi di Zone A untuk melihat konteks rumus dan sumber.
                </div>
              ) : isLoadingContext ? (
                <CmsLoadingSkeleton count={3} />
              ) : (
                <div className="flex flex-col gap-4">
                  {/* Basic Metadata */}
                  <div className="flex flex-col gap-1 rounded-lg border-2 border-border p-2.5 text-xs">
                    <span className="font-mono text-[10px] uppercase text-muted-foreground">
                      Deskripsi Materi
                    </span>
                    <p className="font-medium text-[#1E2024] dark:text-[#F4F1EA]">
                      {lessonContext?.lesson.description || "Tidak ada deskripsi."}
                    </p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-bold">
                        {lessonContext?.lesson.difficulty}
                      </span>
                      <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-bold">
                        {lessonContext?.lesson.kind}
                      </span>
                    </div>
                  </div>

                  {/* Formula Blocks Found */}
                  <div className="flex flex-col gap-2 rounded-lg border-2 border-[#1E2024]/60 bg-muted/20 p-2.5 dark:border-[#F4F1EA]/60">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase text-[#1E2024] dark:text-[#F4F1EA]">
                        Rumus Ditemukan ({lessonContext?.formulaBlocks.length || 0})
                      </span>
                    </div>

                    {lessonContext?.formulaBlocks && lessonContext.formulaBlocks.length > 0 ? (
                      <div className="flex flex-col gap-2">
                        {lessonContext.formulaBlocks.map((f, i) => (
                          <div
                            key={f.id || i}
                            className="flex flex-col gap-1.5 rounded border border-[#1E2024] bg-background p-2 dark:border-[#F4F1EA]"
                          >
                            <div className="overflow-x-auto text-xs">
                              <RenderFormula formula={f.content || ""} display />
                            </div>
                            <CmsButton
                              variant="secondary"
                              size="sm"
                              onClick={() => applyFormulaSuggestion(f.content || "")}
                              className="h-6 w-full text-[10px] font-black"
                            >
                              <Sparkles className="mr-1 h-3 w-3" />
                              Gunakan sebagai dasar
                            </CmsButton>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-[11px] text-muted-foreground">
                        Tidak ada blok formula dalam materi ini.
                      </span>
                    )}
                  </div>

                  {/* Linked Sources Warning */}
                  <div className="flex flex-col gap-2 rounded-lg border-2 border-border p-2.5 text-xs">
                    <span className="font-mono text-[10px] uppercase text-muted-foreground">
                      Sumber Tertaut ({lessonContext?.sources.length || 0})
                    </span>

                    {lessonContext?.sources && lessonContext.sources.length > 0 ? (
                      <div className="flex flex-col gap-1">
                        {lessonContext.sources.map((s) => (
                          <div key={s.id} className="font-bold text-[#1E2024] dark:text-[#F4F1EA]">
                            • {s.title}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1.5 rounded border-2 border-[#C62828] bg-[#C62828]/10 p-2 font-bold text-[#C62828]">
                        <span>Materi belum memiliki sumber — tidak dapat dipublikasikan.</span>
                        <Link
                          href={`/admin/lessons/${activeLessonSummary.id}`}
                          className="text-[10px] underline hover:opacity-80"
                        >
                          Tautkan sumber di editor &rarr;
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Existing Interactive Blocks */}
                  {lessonContext?.interactiveBlocks && lessonContext.interactiveBlocks.length > 0 && (
                    <div className="flex flex-col gap-2 rounded-lg border-2 border-border p-2.5 text-xs">
                      <span className="font-mono text-[10px] uppercase text-muted-foreground">
                        Sandbox Yang Sudah Ada ({lessonContext.interactiveBlocks.length})
                      </span>
                      <div className="flex flex-col gap-1.5">
                        {lessonContext.interactiveBlocks.map((ib) => (
                          <div
                            key={ib.id}
                            className="flex items-center justify-between rounded border border-border bg-background p-1.5"
                          >
                            <span className="font-mono text-[10px] font-bold">
                              {ib.component}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingBlockId(ib.id);
                                if (ib.component === "formula-sandbox" && ib.config) {
                                  setSelectedComponentKey("formula-sandbox");
                                  setFormulaConfig(ib.config as unknown as FormulaSandboxConfig);
                                } else if (ib.config) {
                                  setSelectedComponentKey(ib.component as InteractiveKey);
                                  setGenericConfig(ib.config);
                                }
                              }}
                              className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-bold hover:bg-primary hover:text-white"
                            >
                              Edit Ini
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CmsPanel>
          </div>
        </div>
      )}

      {/* TAB 2: PUSTAKA KOMPONEN (INTERACTIVE LIBRARY) */}
      {activeTab === "library" && (
        <div className="flex flex-col gap-6">
          <div className="rounded-xl border-[3px] border-[#1E2024] bg-card p-4 shadow-[4px_4px_0px_0px_#1E2024] dark:border-[#F4F1EA] dark:shadow-[4px_4px_0px_0px_rgba(244,241,234,0.85)]">
            <h2 className="text-lg font-black text-[#1E2024] dark:text-[#F4F1EA]">
              Pustaka Komponen Terdaftar (Registry)
            </h2>
            <p className="text-xs text-muted-foreground">
              Komponen interaktif yang siap dipasang pada materi. CMS menyimpan key & konfigurasi
              tervalidasi, tanpa injeksi kode bebas.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {INTERACTIVE_KEYS.map((key) => {
              const meta = INTERACTIVE_REGISTRY[key];
              return (
                <div
                  key={key}
                  className="flex flex-col justify-between gap-4 rounded-xl border-[3px] border-[#1E2024] bg-card p-4 shadow-[4px_4px_0px_0px_#1E2024] dark:border-[#F4F1EA] dark:shadow-[4px_4px_0px_0px_rgba(244,241,234,0.85)]"
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-mono text-[10px] font-black uppercase tracking-widest text-primary">
                          {key}
                        </span>
                        <h3 className="text-base font-black text-[#1E2024] dark:text-[#F4F1EA]">
                          {meta.title}
                        </h3>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {meta.subjectHints.map((hint) => (
                          <span
                            key={hint}
                            className="rounded border border-[#1E2024] bg-muted px-1.5 py-0.5 text-[9px] font-bold uppercase dark:border-[#F4F1EA]"
                          >
                            {hint}
                          </span>
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground">{meta.description}</p>

                    {/* Interactive Preview of Default Config */}
                    <div className="max-h-[350px] overflow-hidden rounded-lg border-2 border-[#1E2024] bg-background p-2 dark:border-[#F4F1EA]">
                      <RenderInteractive componentKey={key} config={meta.defaultConfig} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t-2 border-border pt-3">
                    <span className="text-[11px] font-bold text-muted-foreground">
                      Schema Validated & Fallback Included
                    </span>
                    <CmsButton
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        setSelectedComponentKey(key);
                        if (key === "formula-sandbox") {
                          setFormulaConfig(meta.defaultConfig as unknown as FormulaSandboxConfig);
                        } else {
                          setGenericConfig(meta.defaultConfig);
                        }
                        setActiveTab("studio");
                      }}
                      className="text-xs"
                    >
                      <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                      Gunakan di Studio
                    </CmsButton>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Confirmation Dialog for Published Lessons */}
      <CmsConfirmDialog
        isOpen={isPublishConfirmOpen}
        title="Terapkan ke Materi Terbit?"
        description={`Materi "${activeLessonSummary?.title}" saat ini berstatus TERBIT (PUBLISHED). Perubahan komponen interaktif ini akan langsung tampil dan berfungsi di Public Site untuk pelajar.`}
        confirmLabel="Terapkan Langsung ke Public Site"
        cancelLabel="Batal"
        onConfirm={executeInsertToLesson}
        onCancel={() => setIsPublishConfirmOpen(false)}
      />
    </div>
  );
}
