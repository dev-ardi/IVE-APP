"use client";

import React, { useEffect, useRef } from "react";
import { AlertTriangle, X } from "lucide-react";
import { CmsButton } from "./button";

export interface CmsConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function CmsConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel = "Konfirmasi",
  cancelLabel = "Batal",
  isDestructive = false,
  isLoading = false,
  onConfirm,
  onCancel,
}: CmsConfirmDialogProps) {
  const cancelBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Focus initial pada tombol Batal (design-cms.md §5)
      setTimeout(() => {
        cancelBtnRef.current?.focus();
      }, 50);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") onCancel();
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
    >
      <div className="relative w-full max-w-lg rounded-xl border-[3px] border-[#1E2024] bg-card p-6 shadow-[6px_6px_0px_0px_#1E2024] dark:border-[#F4F1EA] dark:shadow-[6px_6px_0px_0px_rgba(244,241,234,0.85)]">
        <button
          type="button"
          onClick={onCancel}
          aria-label="Tutup dialog"
          className="absolute right-4 top-4 rounded-md border-2 border-transparent p-1 text-muted-foreground hover:border-[#1E2024] hover:text-[#1E2024] dark:hover:border-[#F4F1EA] dark:hover:text-[#F4F1EA]"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-4">
          {isDestructive && (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-2 border-[#1E2024] bg-[#FF6B6B] text-[#1E2024] shadow-[2px_2px_0px_0px_#1E2024]">
              <AlertTriangle className="h-5 w-5" />
            </div>
          )}
          <div className="flex-1">
            <h3
              id="confirm-dialog-title"
              className="text-lg font-black tracking-tight text-[#1E2024] dark:text-[#F4F1EA]"
            >
              {title}
            </h3>
            <div className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {description}
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 border-t-2 border-[#1E2024]/10 pt-4 dark:border-[#F4F1EA]/10">
          <button
            ref={cancelBtnRef}
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="inline-flex min-h-[44px] items-center justify-center rounded-lg border-2 border-[#1E2024] bg-card px-4 text-sm font-bold text-[#1E2024] shadow-[2px_2px_0px_0px_#1E2024] hover:bg-muted active:translate-x-[1px] active:translate-y-[1px] active:shadow-none dark:border-[#F4F1EA] dark:text-[#F4F1EA] dark:shadow-[2px_2px_0px_0px_rgba(244,241,234,0.85)]"
          >
            {cancelLabel}
          </button>
          <CmsButton
            variant={isDestructive ? "destructive" : "primary"}
            isLoading={isLoading}
            onClick={onConfirm}
          >
            {confirmLabel}
          </CmsButton>
        </div>
      </div>
    </div>
  );
}
