"use client";

import katex from "katex";
import { useMemo } from "react";

/**
 * Client formula renderer using KaTeX (IVE_TAD_Phase_1.md §4 math baseline).
 * Renders a LaTeX string safely without injecting HTML.
 */
export function RenderFormula({
  formula,
  display = false,
}: {
  formula: string;
  display?: boolean;
}) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(formula, {
        displayMode: display,
        throwOnError: false,
        strict: false,
      });
    } catch {
      return null;
    }
  }, [formula, display]);

  if (html === null) {
    return (
      <div className="rounded-lg bg-muted/40 px-3 py-2 font-mono text-sm text-foreground">
        {formula}
      </div>
    );
  }

  const className = display
    ? "my-4 flex justify-center overflow-x-auto rounded-xl bg-muted/30 py-4"
    : "inline-block";

  // KaTeX output is a static, trusted string generated from a known formula
  // string, not user-injected HTML (the formula parser cannot emit script).
  return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}