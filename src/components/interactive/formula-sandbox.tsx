"use client";

import React, { useState, useMemo } from "react";
import { RotateCcw, Maximize2, Minimize2, Info } from "lucide-react";
import { evaluateFormula } from "@/modules/content/formula/evaluator";

export interface FormulaVariable {
  name: string;
  label: string;
  unit?: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
}

export interface FormulaOutput {
  name: string;
  label: string;
  unit?: string;
  expression: string;
}

export interface FormulaSandboxConfig {
  title?: string;
  concept?: string;
  variables?: FormulaVariable[];
  outputs?: FormulaOutput[];
  visualization?: "readout" | "line" | "scatter";
  explanation?: string;
  textFallback?: string;
}

export const defaultFormulaConfig: FormulaSandboxConfig = {
  title: "Simulasi Rumus Interaktif",
  concept: "Eksplorasi Hubungan Variabel",
  variables: [
    {
      name: "x",
      label: "Variabel X",
      unit: "unit",
      min: 1,
      max: 50,
      step: 1,
      defaultValue: 10,
    },
    {
      name: "k",
      label: "Konstanta K",
      unit: "",
      min: 1,
      max: 10,
      step: 0.5,
      defaultValue: 2,
    },
  ],
  outputs: [
    {
      name: "y",
      label: "Hasil (y = k * x)",
      unit: "unit",
      expression: "k * x",
    },
  ],
  visualization: "line",
  explanation: "Ubah slider untuk melihat bagaimana perubahan variabel memengaruhi hasil kalkulasi.",
  textFallback: "Komponen ini menghitung y berdasarkan formula k * x dengan nilai awal x=10 dan k=2.",
};

export default function FormulaSandbox({
  config = defaultFormulaConfig,
}: {
  config?: Record<string, unknown> | FormulaSandboxConfig;
}) {
  const mergedConfig: FormulaSandboxConfig = {
    ...defaultFormulaConfig,
    ...(config as FormulaSandboxConfig),
  };

  const variablesList = mergedConfig.variables || defaultFormulaConfig.variables!;
  const outputsList = mergedConfig.outputs || defaultFormulaConfig.outputs!;

  // Initialize variable state from defaults
  const [values, setValues] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    for (const v of variablesList) {
      init[v.name] = v.defaultValue;
    }
    return init;
  });

  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleReset = () => {
    const resetVals: Record<string, number> = {};
    for (const v of variablesList) {
      resetVals[v.name] = v.defaultValue;
    }
    setValues(resetVals);
  };

  // Evaluate outputs
  const calculatedOutputs = useMemo(() => {
    return outputsList.map((out) => {
      let val = 0;
      let error = null;
      try {
        val = evaluateFormula(out.expression, values);
      } catch (err: unknown) {
        error = err instanceof Error ? err.message : "Error";
      }
      return {
        ...out,
        value: val,
        error,
      };
    });
  }, [outputsList, values]);

  // Generate chart curve if line or scatter
  const chartPoints = useMemo(() => {
    if (mergedConfig.visualization !== "line" && mergedConfig.visualization !== "scatter") {
      return [];
    }
    const primaryVar = variablesList[0];
    const primaryOut = outputsList[0];
    if (!primaryVar || !primaryOut) return [];

    const steps = 30;
    const range = primaryVar.max - primaryVar.min;
    const stepSize = range / steps;
    const pts: { x: number; y: number }[] = [];

    for (let i = 0; i <= steps; i++) {
      const curX = primaryVar.min + i * stepSize;
      const simVars = { ...values, [primaryVar.name]: curX };
      try {
        const curY = evaluateFormula(primaryOut.expression, simVars);
        if (!isNaN(curY) && isFinite(curY)) {
          pts.push({ x: curX, y: curY });
        }
      } catch {
        // Skip invalid points
      }
    }
    return pts;
  }, [mergedConfig.visualization, variablesList, outputsList, values]);

  // SVG dimensions & scales
  const svgWidth = 400;
  const svgHeight = 180;
  const padding = 28;

  const { pathD, currentCircle } = useMemo(() => {
    if (chartPoints.length < 2) return { pathD: "", currentCircle: null };
    const xs = chartPoints.map((p) => p.x);
    const ys = chartPoints.map((p) => p.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs) || 1;
    const minY = Math.min(...ys, 0);
    const maxY = Math.max(...ys, 10);

    const scaleX = (x: number) => padding + ((x - minX) / (maxX - minX || 1)) * (svgWidth - padding * 2);
    const scaleY = (y: number) => svgHeight - padding - ((y - minY) / (maxY - minY || 1)) * (svgHeight - padding * 2);

    const d = chartPoints
      .map((p, idx) => `${idx === 0 ? "M" : "L"} ${scaleX(p.x).toFixed(1)} ${scaleY(p.y).toFixed(1)}`)
      .join(" ");

    const curX = values[variablesList[0]?.name ?? ""] ?? 0;
    const curY = calculatedOutputs[0]?.value ?? 0;
    const circle = {
      cx: scaleX(curX),
      cy: scaleY(curY),
    };

    return { pathD: d, currentCircle: circle };
  }, [chartPoints, values, variablesList, calculatedOutputs]);

  return (
    <div
      className={`rounded-2xl border-[3px] border-[#1E2024] bg-card p-5 text-[#1E2024] shadow-[4px_4px_0px_0px_#1E2024] dark:border-[#F4F1EA] dark:text-[#F4F1EA] dark:shadow-[4px_4px_0px_0px_rgba(244,241,234,0.85)] ${
        isFullscreen ? "fixed inset-4 z-50 overflow-auto bg-background p-8" : ""
      }`}
    >
      {/* Topbar: Title & Controls */}
      <div className="flex items-center justify-between border-b-2 border-[#1E2024]/10 pb-3 dark:border-[#F4F1EA]/10">
        <div>
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
            {mergedConfig.concept || "Eksplorasi Formula"}
          </span>
          <h3 className="text-base font-black tracking-tight text-[#1E2024] dark:text-[#F4F1EA]">
            {mergedConfig.title || "Formula Sandbox"}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            title="Reset nilai ke awal"
            className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-[#1E2024] bg-card text-[#1E2024] shadow-[1.5px_1.5px_0px_0px_#1E2024] transition-all hover:bg-stone-100 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none dark:border-[#F4F1EA] dark:text-[#F4F1EA]"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? "Kecilkan" : "Layar penuh"}
            className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-[#1E2024] bg-card text-[#1E2024] shadow-[1.5px_1.5px_0px_0px_#1E2024] transition-all hover:bg-stone-100 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none dark:border-[#F4F1EA] dark:text-[#F4F1EA]"
          >
            {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* Grid: Inputs (Sliders) and Outputs */}
      <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Sliders Area */}
        <div className="flex flex-col gap-4">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
            Parameter Variabel
          </span>
          {variablesList.map((v) => {
            const currentVal = values[v.name] ?? v.defaultValue;
            return (
              <div
                key={v.name}
                className="rounded-xl border-2 border-[#1E2024] bg-muted/20 p-3 shadow-[2px_2px_0px_0px_#1E2024] dark:border-[#F4F1EA]"
              >
                <div className="flex items-center justify-between text-xs font-bold">
                  <label htmlFor={`slider-${v.name}`} className="font-mono">
                    {v.label} ({v.name})
                  </label>
                  <span className="rounded bg-primary/10 px-2 py-0.5 font-mono text-primary font-black">
                    {currentVal} {v.unit}
                  </span>
                </div>
                <input
                  id={`slider-${v.name}`}
                  type="range"
                  min={v.min}
                  max={v.max}
                  step={v.step}
                  value={currentVal}
                  onChange={(e) =>
                    setValues((prev) => ({
                      ...prev,
                      [v.name]: parseFloat(e.target.value),
                    }))
                  }
                  className="mt-2 w-full accent-primary cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-muted-foreground mt-0.5">
                  <span>{v.min}</span>
                  <span>{v.max}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Visual / Outputs Area */}
        <div className="flex flex-col gap-4">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
            Hasil & Visualisasi
          </span>

          {/* Cards for calculated outputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {calculatedOutputs.map((out) => (
              <div
                key={out.name}
                className="rounded-xl border-2 border-[#1E2024] bg-[#7BE0A4]/20 p-3 shadow-[2px_2px_0px_0px_#1E2024] dark:border-[#F4F1EA]"
              >
                <span className="block text-[11px] font-mono font-bold text-muted-foreground">
                  {out.label}
                </span>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-xl font-black font-mono text-[#1E2024] dark:text-[#F4F1EA]">
                    {out.error ? "Error" : typeof out.value === "number" ? out.value.toLocaleString("id-ID", { maximumFractionDigits: 2 }) : out.value}
                  </span>
                  {out.unit && <span className="text-xs font-bold text-muted-foreground">{out.unit}</span>}
                </div>
                {out.error && <span className="text-[10px] text-red-500">{out.error}</span>}
              </div>
            ))}
          </div>

          {/* Dynamic SVG Visualizer for line/scatter */}
          {(mergedConfig.visualization === "line" || mergedConfig.visualization === "scatter") && pathD && (
            <div className="relative overflow-hidden rounded-xl border-2 border-[#1E2024] bg-muted/30 p-2 shadow-[2px_2px_0px_0px_#1E2024] dark:border-[#F4F1EA]">
              <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="w-full h-auto"
                preserveAspectRatio="xMidYMid meet"
              >
                <line x1={padding} y1={svgHeight - padding} x2={svgWidth - padding} y2={svgHeight - padding} stroke="currentColor" strokeOpacity="0.2" strokeWidth="2" />
                <line x1={padding} y1={padding} x2={padding} y2={svgHeight - padding} stroke="currentColor" strokeOpacity="0.2" strokeWidth="2" />
                <path d={pathD} fill="none" stroke="currentColor" strokeWidth="3" className="text-primary" />
                {currentCircle && (
                  <circle
                    cx={currentCircle.cx}
                    cy={currentCircle.cy}
                    r="6"
                    className="fill-[#FFD84D] stroke-[#1E2024] stroke-2"
                  />
                )}
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Explanation Note */}
      {mergedConfig.explanation && (
        <div className="mt-4 flex items-start gap-2 rounded-lg border border-border bg-muted/40 p-3 text-xs leading-relaxed text-muted-foreground">
          <Info className="h-4 w-4 shrink-0 text-primary mt-0.5" />
          <span>{mergedConfig.explanation}</span>
        </div>
      )}

      {/* Accessible Text Fallback (TAD §10) */}
      {mergedConfig.textFallback && (
        <div className="mt-3 text-[11px] font-mono text-muted-foreground border-t border-border pt-2">
          <strong>Ringkasan tekstual:</strong> {mergedConfig.textFallback}
        </div>
      )}
    </div>
  );
}
