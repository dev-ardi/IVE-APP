import React from "react";
import Link from "next/link";
import { AlertCircle, FolderOpen, RefreshCcw, Database } from "lucide-react";
import { CmsButton } from "./button";

export function CmsEmptyState({
  icon: Icon = FolderOpen,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border-[3px] border-dashed border-[#1E2024]/40 bg-muted/20 p-12 text-center dark:border-[#F4F1EA]/40">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl border-2 border-[#1E2024] bg-[#FFD84D] text-[#1E2024] shadow-[3px_3px_0px_0px_#1E2024] dark:border-[#F4F1EA]">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="text-lg font-black tracking-tight text-[#1E2024] dark:text-[#F4F1EA]">
        {title}
      </h3>
      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
      {(actionLabel && actionHref) && (
        <div className="mt-6">
          <Link href={actionHref}>
            <CmsButton variant="primary">{actionLabel}</CmsButton>
          </Link>
        </div>
      )}
      {(actionLabel && onAction && !actionHref) && (
        <div className="mt-6">
          <CmsButton variant="primary" onClick={onAction}>
            {actionLabel}
          </CmsButton>
        </div>
      )}
    </div>
  );
}

export function CmsErrorState({
  title = "Ups, ada sedikit gangguan.",
  message = "Gagal memuat data dari database. Silakan coba lagi.",
  isDatabaseError = false,
  onRetry,
}: {
  title?: string;
  message?: string;
  isDatabaseError?: boolean;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border-[3px] border-[#FF6B6B] bg-red-50/50 p-8 text-center dark:bg-red-950/20">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg border-2 border-[#1E2024] bg-[#FF6B6B] text-[#1E2024] shadow-[3px_3px_0px_0px_#1E2024]">
        {isDatabaseError ? <Database className="h-6 w-6" /> : <AlertCircle className="h-6 w-6" />}
      </div>
      <h3 className="text-base font-black text-[#1E2024] dark:text-[#F4F1EA]">
        {title}
      </h3>
      <p className="mt-1 max-w-md text-sm text-stone-700 dark:text-stone-300">
        {message}
      </p>
      {isDatabaseError && (
        <p className="mt-2 text-xs font-mono text-stone-500">
          CMS beroperasi langsung dengan PostgreSQL dan tidak menggunakan data tiruan (dummy).
        </p>
      )}
      {onRetry && (
        <div className="mt-5">
          <CmsButton variant="secondary" size="sm" onClick={onRetry} icon={<RefreshCcw className="h-3.5 w-3.5" />}>
            Coba Lagi
          </CmsButton>
        </div>
      )}
    </div>
  );
}

export function CmsSkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="w-full rounded-xl border-[3px] border-[#1E2024] bg-card p-4 shadow-[4px_4px_0px_0px_#1E2024] dark:border-[#F4F1EA] dark:shadow-[4px_4px_0px_0px_rgba(244,241,234,0.85)]">
      <div className="flex h-10 items-center justify-between border-b-2 border-border pb-3">
        <div className="h-4 w-32 rounded bg-muted animate-pulse" />
        <div className="h-4 w-20 rounded bg-muted animate-pulse" />
      </div>
      <div className="mt-3 flex flex-col gap-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex h-12 items-center justify-between rounded-lg border border-border bg-muted/20 px-3">
            <div className="flex items-center gap-3">
              <div className="h-6 w-6 rounded bg-muted animate-pulse" />
              <div className="h-4 w-48 rounded bg-muted animate-pulse" />
            </div>
            <div className="h-6 w-20 rounded bg-muted animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function CmsLoadingSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex h-14 items-center justify-between rounded-lg border-2 border-border bg-muted/20 p-3"
        >
          <div className="flex items-center gap-2.5">
            <div className="h-6 w-6 rounded bg-muted animate-pulse" />
            <div className="flex flex-col gap-1.5">
              <div className="h-3 w-32 rounded bg-muted animate-pulse" />
              <div className="h-2 w-20 rounded bg-muted animate-pulse" />
            </div>
          </div>
          <div className="h-5 w-16 rounded bg-muted animate-pulse" />
        </div>
      ))}
    </div>
  );
}

