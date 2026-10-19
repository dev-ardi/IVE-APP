"use client";

import React from "react";
import { Loader2 } from "lucide-react";

export type CmsButtonVariant =
  | "primary"
  | "secondary"
  | "highlight"
  | "destructive"
  | "ghost"
  | "outline";

export type CmsButtonSize = "sm" | "md" | "lg";

export interface CmsButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: CmsButtonVariant;
  size?: CmsButtonSize;
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export function CmsButton({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  icon,
  disabled,
  className = "",
  ...props
}: CmsButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 font-bold cursor-pointer select-none rounded-lg text-sm transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none focus-visible:outline-3 focus-visible:outline-blue-600 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50";

  const sizeStyles = {
    sm: "h-9 px-3 text-xs",
    md: "min-h-[44px] h-11 px-4 text-sm",
    lg: "min-h-[48px] h-12 px-6 text-base",
  };

  const variantStyles: Record<CmsButtonVariant, string> = {
    primary:
      "border-[3px] border-[#1E2024] bg-primary text-white shadow-[4px_4px_0px_0px_#1E2024] hover:bg-primary/90 dark:border-[#F4F1EA] dark:shadow-[4px_4px_0px_0px_rgba(244,241,234,0.85)]",
    secondary:
      "border-[3px] border-[#1E2024] bg-card text-[#1E2024] shadow-[4px_4px_0px_0px_#1E2024] hover:bg-stone-100 dark:border-[#F4F1EA] dark:text-[#F4F1EA] dark:shadow-[4px_4px_0px_0px_rgba(244,241,234,0.85)] dark:hover:bg-stone-800",
    highlight:
      "border-[3px] border-[#1E2024] bg-[#FFD84D] text-[#1E2024] shadow-[4px_4px_0px_0px_#1E2024] hover:bg-[#FACC15] dark:border-[#F4F1EA] dark:text-stone-950 dark:shadow-[4px_4px_0px_0px_rgba(244,241,234,0.85)]",
    destructive:
      "border-[3px] border-[#1E2024] bg-[#FF6B6B] text-[#1E2024] shadow-[4px_4px_0px_0px_#1E2024] hover:bg-red-400 dark:border-[#F4F1EA] dark:text-stone-950 dark:shadow-[4px_4px_0px_0px_rgba(244,241,234,0.85)]",
    outline:
      "border-[2px] border-[#1E2024] bg-transparent text-[#1E2024] hover:bg-stone-200/50 shadow-[2px_2px_0px_0px_#1E2024] dark:border-[#F4F1EA] dark:text-[#F4F1EA] dark:shadow-[2px_2px_0px_0px_rgba(244,241,234,0.85)]",
    ghost:
      "border-transparent bg-transparent text-[#1E2024] hover:border-[#1E2024] hover:border-2 hover:bg-stone-100 dark:text-[#F4F1EA] dark:hover:border-[#F4F1EA] dark:hover:bg-stone-800",
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin shrink-0" /> : icon}
      <span>{children}</span>
    </button>
  );
}
