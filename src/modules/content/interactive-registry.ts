/**
 * Interactive component registry (IVE_TAD_Phase_1.md §10, §18).
 * The CMS stores a component *key*, never executable code.
 * This module is the single source of truth for known keys, shared by the CMS
 * validation and the client renderer. Actual lazy-loading of the React
 * components lives in `render-interactive.tsx`.
 */

export const INTERACTIVE_KEYS = [
  "projectile-simulator",
  "trigonometry-visualizer",
  "cell-explorer",
  "atom-explorer",
  "history-timeline",
] as const;

export type InteractiveKey = (typeof INTERACTIVE_KEYS)[number];

export function isInteractiveKey(key: string): key is InteractiveKey {
  return (INTERACTIVE_KEYS as readonly string[]).includes(key);
}