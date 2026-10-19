import React from "react";
import {
  PencilLine,
  CheckCircle2,
  Archive,
  Sparkles,
  Shield,
  Layers,
  FlaskConical,
} from "lucide-react";
import type { ContentStatus, Difficulty, Role } from "@prisma/client";

export function ContentStatusBadge({
  status,
  className = "",
}: {
  status: ContentStatus | string;
  className?: string;
}) {
  switch (status) {
    case "PUBLISHED":
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-md border-2 border-[#1E2024] bg-[#7BE0A4] px-2 py-0.5 text-xs font-mono font-bold text-[#1E2024] shadow-[1.5px_1.5px_0px_0px_#1E2024] dark:border-[#F4F1EA] dark:text-stone-950 dark:shadow-[1.5px_1.5px_0px_0px_rgba(244,241,234,0.85)] ${className}`}
        >
          <CheckCircle2 className="h-3 w-3 shrink-0" />
          <span>PUBLISHED</span>
        </span>
      );
    case "ARCHIVED":
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-md border-2 border-[#1E2024] bg-[#D9D4C7] px-2 py-0.5 text-xs font-mono font-bold text-[#1E2024] shadow-[1.5px_1.5px_0px_0px_#1E2024] dark:border-[#F4F1EA] dark:text-stone-950 dark:shadow-[1.5px_1.5px_0px_0px_rgba(244,241,234,0.85)] ${className}`}
        >
          <Archive className="h-3 w-3 shrink-0" />
          <span>ARCHIVED</span>
        </span>
      );
    case "DRAFT":
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-md border-2 border-[#1E2024] bg-[#FFD84D] px-2 py-0.5 text-xs font-mono font-bold text-[#1E2024] shadow-[1.5px_1.5px_0px_0px_#1E2024] dark:border-[#F4F1EA] dark:text-stone-950 dark:shadow-[1.5px_1.5px_0px_0px_rgba(244,241,234,0.85)] ${className}`}
        >
          <PencilLine className="h-3 w-3 shrink-0" />
          <span>DRAFT</span>
        </span>
      );
  }
}

export function RoleBadge({
  role,
  className = "",
}: {
  role: Role | string;
  className?: string;
}) {
  if (role === "SUPER_ADMIN") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-md border-2 border-[#1E2024] bg-[#FFB3D1] px-2.5 py-0.5 text-xs font-mono font-black text-[#1E2024] shadow-[2px_2px_0px_0px_#1E2024] dark:border-[#F4F1EA] dark:text-stone-950 ${className}`}
      >
        <Shield className="h-3 w-3 text-[#1E2024]" />
        <span>SUPER ADMIN</span>
      </span>
    );
  }

  if (role === "ADMIN") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-md border-2 border-[#1E2024] bg-[#FFD84D] px-2.5 py-0.5 text-xs font-mono font-bold text-[#1E2024] shadow-[2px_2px_0px_0px_#1E2024] dark:border-[#F4F1EA] dark:text-stone-950 ${className}`}
      >
        <Shield className="h-3 w-3 text-[#1E2024]" />
        <span>ADMIN</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border border-border bg-muted px-2 py-0.5 text-xs font-mono font-medium text-foreground ${className}`}
    >
      <span>USER</span>
    </span>
  );
}

export function NewBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border-2 border-[#1E2024] bg-[#FFD84D] px-2 py-0.5 text-[11px] font-mono font-black text-[#1E2024] shadow-[1.5px_1.5px_0px_0px_#1E2024] dark:border-[#F4F1EA] dark:text-stone-950 ${className}`}
    >
      <Sparkles className="h-3 w-3" />
      <span>BARU</span>
    </span>
  );
}

export function SandboxBadge({
  count,
  className = "",
}: {
  count: number;
  className?: string;
}) {
  if (count > 0) {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-md border-2 border-[#1E2024] bg-[#E5EFFE] px-2 py-0.5 text-[11px] font-mono font-bold text-[#1E3A8A] shadow-[1.5px_1.5px_0px_0px_#1E2024] dark:border-[#F4F1EA] dark:bg-[#1E2B4D] dark:text-[#93B4F8] ${className}`}
      >
        <FlaskConical className="h-3 w-3" />
        <span>SANDBOX {count}</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border border-stone-400 bg-stone-100 px-2 py-0.5 text-[11px] font-mono font-semibold text-stone-600 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-400 ${className}`}
    >
      <span>BELUM ADA SANDBOX</span>
    </span>
  );
}

export function KindBadge({
  kind,
  className = "",
}: {
  kind: "LESSON" | "EXPERIMENT" | string;
  className?: string;
}) {
  if (kind === "EXPERIMENT") {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-md border border-emerald-600 bg-emerald-50 px-2 py-0.5 text-[11px] font-mono font-bold text-emerald-800 dark:border-emerald-500 dark:bg-emerald-950/60 dark:text-emerald-300 ${className}`}
      >
        <FlaskConical className="h-3 w-3" />
        <span>EKSPERIMEN</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border border-blue-600 bg-blue-50 px-2 py-0.5 text-[11px] font-mono font-bold text-blue-800 dark:border-blue-500 dark:bg-blue-950/60 dark:text-blue-300 ${className}`}
    >
      <Layers className="h-3 w-3" />
      <span>MATERI</span>
    </span>
  );
}

export function DifficultyBadge({
  difficulty,
  className = "",
}: {
  difficulty: Difficulty | string;
  className?: string;
}) {
  const labels: Record<string, string> = {
    BEGINNER: "Pemula",
    INTERMEDIATE: "Menengah",
    ADVANCED: "Lanjutan",
  };
  return (
    <span
      className={`inline-flex items-center rounded-md border border-border bg-card px-2 py-0.5 text-xs font-mono font-medium text-foreground ${className}`}
    >
      {labels[difficulty] ?? difficulty}
    </span>
  );
}
