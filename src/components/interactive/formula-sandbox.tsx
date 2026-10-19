"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { Sliders, Maximize2, Minimize2, Sparkles, RefreshCw } from "lucide-react";
import { RenderFormula } from "@/modules/content/render-formula";

interface Props {
  config?: Record<string, unknown>;
}

type FormulaType = "quadratic" | "sine" | "exponential" | "gravity";

interface Preset {
  id: FormulaType;
  title: string;
  latexTemplate: (params: Record<string, number>) => string;
  defaultParams: Record<string, number>;
  paramBounds: Record<string, { min: number; max: number; step: number; label: string; symbol: string }>;
  evaluate: (x: number, params: Record<string, number>) => number;
  xRange: [number, number];
  yRange: [number, number];
  xLabel: string;
  yLabel: string;
  description: string;
}

const PRESETS: Record<FormulaType, Preset> = {
  quadratic: {
    id: "quadratic",
    title: "Fungsi Kuadrat (Parabola)",
    latexTemplate: (p) =>
      `y = ${p.a !== 1 ? p.a : ""}x^2 ${p.b >= 0 ? "+ " + p.b : "- " + Math.abs(p.b)}x ${p.c >= 0 ? "+ " + p.c : "- " + Math.abs(p.c)}`,
    defaultParams: { a: 1, b: 0, c: -4 },
    paramBounds: {
      a: { min: -5, max: 5, step: 0.5, label: "Kelengkungan (a)", symbol: "a" },
      b: { min: -10, max: 10, step: 1, label: "Pergeseran Linear (b)", symbol: "b" },
      c: { min: -15, max: 15, step: 1, label: "Titik Potong Sumbu-Y (c)", symbol: "c" },
    },
    evaluate: (x, p) => p.a * x * x + p.b * x + p.c,
    xRange: [-8, 8],
    yRange: [-15, 20],
    xLabel: "Sumbu X",
    yLabel: "Sumbu Y",
    description: "Perhatikan bagaimana nilai koefisien 'a' menentukan apakah kurva terbuka ke atas atau ke bawah.",
  },
  sine: {
    id: "sine",
    title: "Gelombang Harmonik Sinusoidal",
    latexTemplate: (p) =>
      `y = ${p.A} \\sin(${p.k}x)`,
    defaultParams: { A: 3, k: 1 },
    paramBounds: {
      A: { min: 1, max: 8, step: 0.5, label: "Amplitudo (A)", symbol: "A" },
      k: { min: 0.5, max: 4, step: 0.25, label: "Bilangan Gelombang (k)", symbol: "k" },
    },
    evaluate: (x, p) => p.A * Math.sin(p.k * x),
    xRange: [-10, 10],
    yRange: [-10, 10],
    xLabel: "Posisi (x)",
    yLabel: "Simpangan (y)",
    description: "Amplitudo menentukan tinggi puncak gelombang, sedangkan nilai 'k' menentukan kerapatan frekuensi ruang.",
  },
  exponential: {
    id: "exponential",
    title: "Peluruhan Eksponensial",
    latexTemplate: (p) =>
      `N(t) = ${p.N0} \\cdot e^{-${p.lambda}t}`,
    defaultParams: { N0: 10, lambda: 0.4 },
    paramBounds: {
      N0: { min: 2, max: 20, step: 1, label: "Jumlah Awal (N₀)", symbol: "N_0" },
      lambda: { min: 0.1, max: 1.5, step: 0.1, label: "Konstanta Peluruhan (λ)", symbol: "\\lambda" },
    },
    evaluate: (x, p) => (x < 0 ? 0 : p.N0 * Math.exp(-p.lambda * x)),
    xRange: [0, 15],
    yRange: [0, 22],
    xLabel: "Waktu (t)",
    yLabel: "Partikel Sisa N(t)",
    description: "Menggambarkan penurunan partikel radioaktif atau konsentrasi obat dalam darah terhadap waktu.",
  },
  gravity: {
    id: "gravity",
    title: "Gaya Gravitasi Universal",
    latexTemplate: (p) =>
      `F = \\frac{${p.G} \\cdot ${p.m1} \\cdot ${p.m2}}{r^2}`,
    defaultParams: { G: 1, m1: 5, m2: 8 },
    paramBounds: {
      G: { min: 1, max: 5, step: 1, label: "Konstanta Gravitasi (G)", symbol: "G" },
      m1: { min: 1, max: 15, step: 1, label: "Massa Benda 1 (m₁)", symbol: "m_1" },
      m2: { min: 1, max: 15, step: 1, label: "Massa Benda 2 (m₂)", symbol: "m_2" },
    },
    evaluate: (r, p) => (r <= 0.5 ? 0 : (p.G * p.m1 * p.m2) / (r * r)),
    xRange: [1, 12],
    yRange: [0, 60],
    xLabel: "Jarak Antar Pusat (r)",
    yLabel: "Gaya Tarik (F)",
    description: "Hukum kuadrat terbalik: saat jarak berlipat dua, gaya gravitasi berkurang menjadi seperempatnya.",
  },
};

export default function FormulaSandbox({ config = {} }: Props) {
  const initialType = (config.initialType as FormulaType) || "quadratic";
  const [selectedType, setSelectedType] = useState<FormulaType>(initialType);
  const [params, setParams] = useState<Record<string, number>>(PRESETS[initialType].defaultParams);
  const [isProjectorMode, setIsProjectorMode] = useState<boolean>(false);
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const preset = PRESETS[selectedType];

  const handleTypeChange = (type: FormulaType) => {
    setSelectedType(type);
    setParams(PRESETS[type].defaultParams);
    setHoveredPoint(null);
  };

  const handleParamChange = (key: string, value: number) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  };

  const currentLatex = useMemo(() => {
    return preset.latexTemplate(params);
  }, [preset, params]);

  // Canvas plotting effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    const padLeft = 45;
    const padRight = 20;
    const padTop = 20;
    const padBottom = 35;

    const plotWidth = width - padLeft - padRight;
    const plotHeight = height - padTop - padBottom;

    const [xMin, xMax] = preset.xRange;
    const [yMin, yMax] = preset.yRange;

    const toScreenX = (x: number) => padLeft + ((x - xMin) / (xMax - xMin)) * plotWidth;
    const toScreenY = (y: number) => padTop + plotHeight - ((y - yMin) / (yMax - yMin)) * plotHeight;

    // Grid lines
    ctx.strokeStyle = "rgba(160, 160, 160, 0.2)";
    ctx.lineWidth = 1;

    // Vertical grid
    const xStep = (xMax - xMin) / 8;
    for (let x = xMin; x <= xMax; x += xStep) {
      const sx = toScreenX(x);
      ctx.beginPath();
      ctx.moveTo(sx, padTop);
      ctx.lineTo(sx, height - padBottom);
      ctx.stroke();

      ctx.fillStyle = "#6b7280";
      ctx.font = "10px monospace";
      ctx.fillText(x.toFixed(0), sx - 6, height - padBottom + 16);
    }

    // Horizontal grid
    const yStep = (yMax - yMin) / 6;
    for (let y = yMin; y <= yMax; y += yStep) {
      const sy = toScreenY(y);
      ctx.beginPath();
      ctx.moveTo(padLeft, sy);
      ctx.lineTo(width - padRight, sy);
      ctx.stroke();

      ctx.fillStyle = "#6b7280";
      ctx.font = "10px monospace";
      ctx.fillText(y.toFixed(0), 10, sy + 3);
    }

    // Zero axes if within range
    if (xMin <= 0 && xMax >= 0) {
      const zeroX = toScreenX(0);
      ctx.strokeStyle = "rgba(40, 40, 40, 0.6)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(zeroX, padTop);
      ctx.lineTo(zeroX, height - padBottom);
      ctx.stroke();
    }
    if (yMin <= 0 && yMax >= 0) {
      const zeroY = toScreenY(0);
      ctx.strokeStyle = "rgba(40, 40, 40, 0.6)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(padLeft, zeroY);
      ctx.lineTo(width - padRight, zeroY);
      ctx.stroke();
    }

    // Plot Curve
    ctx.strokeStyle = "#2563EB"; // Cobalt Blue
    ctx.lineWidth = 3;
    ctx.beginPath();

    const samples = 200;
    const dx = (xMax - xMin) / samples;
    let started = false;

    for (let i = 0; i <= samples; i++) {
      const x = xMin + i * dx;
      const y = preset.evaluate(x, params);

      if (isFinite(y) && y >= yMin - 10 && y <= yMax + 10) {
        const sx = toScreenX(x);
        const sy = toScreenY(y);
        if (!started) {
          ctx.moveTo(sx, sy);
          started = true;
        } else {
          ctx.lineTo(sx, sy);
        }
      }
    }
    ctx.stroke();

    // Plot hover marker if active
    if (hoveredPoint) {
      const sx = toScreenX(hoveredPoint.x);
      const sy = toScreenY(hoveredPoint.y);

      ctx.fillStyle = "#DC2626";
      ctx.beginPath();
      ctx.arc(sx, sy, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#1E2024";
      ctx.font = "bold 11px monospace";
      ctx.fillText(`(${hoveredPoint.x.toFixed(1)}, ${hoveredPoint.y.toFixed(1)})`, sx + 8, sy - 8);
    }
  }, [preset, params, hoveredPoint]);

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border-2 border-stone-900 bg-white p-6 shadow-[4px_4px_0px_0px_rgba(24,24,27,0.9)] transition-all dark:border-white dark:bg-stone-900 dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.7)] ${
        isProjectorMode ? "fixed inset-4 z-50 overflow-y-auto bg-white p-8 dark:bg-stone-950" : ""
      }`}
    >
      {/* Header bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-stone-900/10 pb-4 dark:border-stone-800">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-400 bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            <Sliders className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full border border-blue-400/40 bg-blue-100 px-2.5 py-0.5 text-[10px] font-black uppercase text-blue-900 dark:bg-blue-950 dark:text-blue-200">
                FORMULA SANDBOX
              </span>
              <span className="text-xs font-bold text-stone-500">Live Mathematical Graph</span>
            </div>
            <h3 className="text-lg font-black tracking-tight text-stone-900 dark:text-white">
              {preset.title}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Preset Selector */}
          <select
            value={selectedType}
            onChange={(e) => handleTypeChange(e.target.value as FormulaType)}
            className="cursor-pointer rounded-xl border border-stone-300 bg-stone-50 px-3 py-1.5 text-xs font-bold text-stone-900 dark:border-stone-700 dark:bg-stone-800 dark:text-white"
          >
            <option value="quadratic">Fungsi Kuadrat (Parabola)</option>
            <option value="sine">Gelombang Sinusoidal</option>
            <option value="exponential">Peluruhan Eksponensial</option>
            <option value="gravity">Gaya Gravitasi Newton</option>
          </select>

          {/* Projector Mode Toggle */}
          <button
            type="button"
            onClick={() => setIsProjectorMode(!isProjectorMode)}
            title="Mode Presentasi Guru / Proyektor"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-stone-300 bg-stone-100 text-stone-700 hover:bg-stone-200 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
          >
            {isProjectorMode ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* KaTeX Live Equation Banner */}
      <div className="my-4 flex flex-col items-center justify-center rounded-2xl border-2 border-stone-900/10 bg-[#FAF9F5] p-4 text-center dark:border-stone-800 dark:bg-[#121316]">
        <span className="mb-1 text-[11px] font-bold uppercase tracking-wider text-stone-500">
          Persamaan Matematis Aktif:
        </span>
        <div className="overflow-x-auto text-lg sm:text-2xl font-black text-blue-700 dark:text-blue-400">
          <RenderFormula formula={currentLatex} display={true} />
        </div>
        <p className="mt-1 text-xs font-medium text-stone-600 dark:text-stone-400">
          {preset.description}
        </p>
      </div>

      {/* Main 2-Column: Sliders & Canvas Graph */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-center">
        {/* Left Column: Variable Parameter Sliders (5 cols) */}
        <div className="flex flex-col gap-4 lg:col-span-5">
          <span className="text-xs font-black uppercase tracking-wider text-stone-600 dark:text-stone-400">
            Geser Variabel Rumus:
          </span>

          {Object.entries(preset.paramBounds).map(([key, bound]) => {
            const val = params[key] ?? bound.min;
            return (
              <div
                key={key}
                className="flex flex-col gap-1.5 rounded-2xl border border-stone-200 bg-stone-50/70 p-3.5 dark:border-stone-800 dark:bg-stone-800/50"
              >
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-stone-700 dark:text-stone-300 flex items-center gap-1">
                    <span>{bound.label}</span>
                    <strong className="text-blue-600">
                      (<RenderFormula formula={bound.symbol} />)
                    </strong>
                  </span>
                  <span className="rounded-md border border-stone-300 bg-white px-2 py-0.5 font-mono text-xs font-black text-stone-900 dark:border-stone-700 dark:bg-stone-900 dark:text-white">
                    {val}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono text-[11px] text-stone-400">{bound.min}</span>
                  <input
                    type="range"
                    min={bound.min}
                    max={bound.max}
                    step={bound.step}
                    value={val}
                    onChange={(e) => handleParamChange(key, Number(e.target.value))}
                    className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-stone-200 accent-blue-600 dark:bg-stone-700"
                  />
                  <span className="font-mono text-[11px] text-stone-400">{bound.max}</span>
                </div>
              </div>
            );
          })}

          <button
            type="button"
            onClick={() => setParams(preset.defaultParams)}
            className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-stone-300 bg-white py-2 text-xs font-bold text-stone-700 hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Kembalikan Nilai Awal</span>
          </button>
        </div>

        {/* Right Column: High-Performance Canvas Plot (7 cols) */}
        <div className="flex flex-col gap-2 lg:col-span-7">
          <div className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-stone-900/10 bg-[#FAF9F5] p-2 dark:border-stone-800 dark:bg-[#121316]">
            <canvas
              ref={canvasRef}
              className="h-64 w-full cursor-crosshair rounded-xl sm:h-80"
              onMouseMove={(e) => {
                const canvas = canvasRef.current;
                if (!canvas) return;
                const rect = canvas.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const padLeft = 45;
                const padRight = 20;
                const plotWidth = canvas.clientWidth - padLeft - padRight;
                const [xMin, xMax] = preset.xRange;
                const clampedX = Math.max(xMin, Math.min(xMax, xMin + ((mouseX - padLeft) / plotWidth) * (xMax - xMin)));
                const evalY = preset.evaluate(clampedX, params);
                setHoveredPoint({ x: clampedX, y: evalY });
              }}
              onMouseLeave={() => setHoveredPoint(null)}
            />
          </div>

          <div className="flex items-center justify-between text-xs font-semibold text-stone-500">
            <span>Grafik Fungsi Koordinat Kartesius</span>
            <span>Arahkan kursor untuk membaca nilai titik (x, y)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
