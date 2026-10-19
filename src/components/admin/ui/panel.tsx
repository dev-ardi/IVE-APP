import React from "react";

export function CmsPanel({
  title,
  eyebrow,
  action,
  children,
  className = "",
  themeBorderColor,
  bodyClassName = "",
}: {
  title?: React.ReactNode;
  eyebrow?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  themeBorderColor?: string; // e.g. from getSubjectTheme(slug).cardBorder
  bodyClassName?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl border-[3px] border-[#1E2024] bg-card shadow-[4px_4px_0px_0px_#1E2024] dark:border-[#F4F1EA] dark:shadow-[4px_4px_0px_0px_rgba(244,241,234,0.85)] ${className}`}
      style={
        themeBorderColor
          ? {
              borderLeftWidth: "6px",
              borderLeftColor: themeBorderColor,
            }
          : undefined
      }
    >
      {(title || eyebrow || action) && (
        <div className="flex items-center justify-between border-b-2 border-[#1E2024]/10 bg-muted/40 px-5 py-3.5 dark:border-[#F4F1EA]/10">
          <div>
            {eyebrow && (
              <span className="block text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                {eyebrow}
              </span>
            )}
            {title && (
              <h2 className="text-base font-black tracking-tight text-[#1E2024] dark:text-[#F4F1EA]">
                {title}
              </h2>
            )}
          </div>
          {action && <div className="flex items-center gap-2">{action}</div>}
        </div>
      )}
      <div className={`p-5 ${bodyClassName}`}>{children}</div>
    </div>
  );
}
