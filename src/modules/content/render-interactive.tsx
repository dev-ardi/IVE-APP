"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import { isInteractiveKey } from "@/modules/content/interactive-registry";

const ProjectileSimulator = dynamic(() => import("@/components/interactive/projectile-simulator"), {
  ssr: false,
  loading: () => <InteractiveLoading />,
});
const TrigonometryVisualizer = dynamic(() => import("@/components/interactive/trigonometry-visualizer"), {
  ssr: false,
  loading: () => <InteractiveLoading />,
});
const CellExplorer = dynamic(() => import("@/components/interactive/cell-explorer"), {
  ssr: false,
  loading: () => <InteractiveLoading />,
});
const AtomExplorer = dynamic(() => import("@/components/interactive/atom-explorer"), {
  ssr: false,
  loading: () => <InteractiveLoading />,
});
const HistoryTimeline = dynamic(() => import("@/components/interactive/history-timeline"), {
  ssr: false,
  loading: () => <InteractiveLoading />,
});
const TemperatureConverter = dynamic(() => import("@/components/interactive/temperature-converter"), {
  ssr: false,
  loading: () => <InteractiveLoading />,
});
const NuclearFission = dynamic(() => import("@/components/interactive/nuclear-fission"), {
  ssr: false,
  loading: () => <InteractiveLoading />,
});

/**
 * Client boundary resolving an interactive component key to a lazily-loaded
 * component (IVE_TAD_Phase_1.md §10). Unknown keys render a friendly fallback.
 *
 * NOTE: this intentionally duplicates the module-level registry so the dynamic
 * components are stable references resolved outside render (next/react lint).
 */
const COMPONENTS: Record<string, ComponentType<{ config?: Record<string, unknown> }>> = {
  "projectile-simulator": ProjectileSimulator,
  "trigonometry-visualizer": TrigonometryVisualizer,
  "cell-explorer": CellExplorer,
  "atom-explorer": AtomExplorer,
  "history-timeline": HistoryTimeline,
  "temperature-converter": TemperatureConverter,
  "nuclear-fission": NuclearFission,
};

export function RenderInteractive({
  componentKey,
  config,
}: {
  componentKey: string;
  config?: Record<string, unknown>;
}) {
  if (!isInteractiveKey(componentKey)) {
    return (
      <div className="rounded-xl border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
        Interaksi berikut belum tersedia.
      </div>
    );
  }
  const Component = COMPONENTS[componentKey];
  return <Component config={config} />;
}

function InteractiveLoading() {
  return (
    <div className="flex h-40 items-center justify-center rounded-xl border border-border bg-muted/40 text-sm text-muted-foreground">
      Memuat interaksi…
    </div>
  );
}