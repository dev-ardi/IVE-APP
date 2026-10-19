"use client";

import React from "react";
import { AlertCircle } from "lucide-react";

export interface CmsInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export function CmsInput({ className = "", error, id, ...props }: CmsInputProps) {
  return (
    <input
      id={id}
      aria-invalid={error ? "true" : undefined}
      aria-describedby={error && id ? `${id}-error` : undefined}
      className={`min-h-[44px] w-full rounded-lg border-[3px] border-[#1E2024] bg-card px-3.5 py-2 text-sm text-[#1E2024] shadow-[2px_2px_0px_0px_#1E2024] transition-all placeholder:text-muted-foreground focus-visible:outline-3 focus-visible:outline-blue-600 focus-visible:outline-offset-2 dark:border-[#F4F1EA] dark:text-[#F4F1EA] dark:shadow-[2px_2px_0px_0px_rgba(244,241,234,0.85)] ${
        error ? "border-[#FF6B6B] dark:border-[#FF6B6B]" : ""
      } ${className}`}
      {...props}
    />
  );
}

export interface CmsTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export function CmsTextarea({ className = "", error, id, ...props }: CmsTextareaProps) {
  return (
    <textarea
      id={id}
      aria-invalid={error ? "true" : undefined}
      aria-describedby={error && id ? `${id}-error` : undefined}
      className={`w-full rounded-lg border-[3px] border-[#1E2024] bg-card px-3.5 py-2.5 text-sm text-[#1E2024] shadow-[2px_2px_0px_0px_#1E2024] transition-all placeholder:text-muted-foreground focus-visible:outline-3 focus-visible:outline-blue-600 focus-visible:outline-offset-2 dark:border-[#F4F1EA] dark:text-[#F4F1EA] dark:shadow-[2px_2px_0px_0px_rgba(244,241,234,0.85)] ${
        error ? "border-[#FF6B6B] dark:border-[#FF6B6B]" : ""
      } ${className}`}
      {...props}
    />
  );
}

export interface CmsSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
}

export function CmsSelect({ className = "", error, id, children, ...props }: CmsSelectProps) {
  return (
    <select
      id={id}
      aria-invalid={error ? "true" : undefined}
      aria-describedby={error && id ? `${id}-error` : undefined}
      className={`min-h-[44px] w-full rounded-lg border-[3px] border-[#1E2024] bg-card px-3.5 py-2 text-sm font-medium text-[#1E2024] shadow-[2px_2px_0px_0px_#1E2024] transition-all focus-visible:outline-3 focus-visible:outline-blue-600 focus-visible:outline-offset-2 dark:border-[#F4F1EA] dark:text-[#F4F1EA] dark:shadow-[2px_2px_0px_0px_rgba(244,241,234,0.85)] ${
        error ? "border-[#FF6B6B] dark:border-[#FF6B6B]" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}

export function CmsFormField({
  label,
  id,
  error,
  hint,
  required,
  children,
  className = "",
}: {
  label: string;
  id?: string;
  error?: string | null;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className="text-xs font-mono font-bold uppercase tracking-wider text-[#1E2024] dark:text-[#F4F1EA]"
        >
          {label} {required && <span className="text-[#FF6B6B]">*</span>}
        </label>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
      {children}
      {error && (
        <p id={id ? `${id}-error` : undefined} className="flex items-center gap-1.5 text-xs font-bold text-[#FF6B6B]">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
