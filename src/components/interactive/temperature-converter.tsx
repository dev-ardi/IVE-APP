"use client";

import { useState } from "react";

interface Props {
  config?: Record<string, unknown>;
}

export default function TemperatureConverter({ config = {} }: Props) {
  const initialC = Number(config.initialCelsius ?? 25);
  const [celsius, setCelsius] = useState<number>(initialC);

  const fahrenheit = (celsius * 9) / 5 + 32;
  const kelvin = celsius + 273.15;
  const reamur = (celsius * 4) / 5;

  // Temperature color based on Celsius
  const getTempColor = (c: number) => {
    if (c <= 0) return "#0284c7"; // ice blue
    if (c <= 20) return "#0d9488"; // cool teal
    if (c <= 37) return "#16a34a"; // green normal
    if (c <= 70) return "#ea580c"; // orange warm
    return "#dc2626"; // hot red
  };

  const benchmarks = [
    { label: "Titik Beku Air", val: 0 },
    { label: "Suhu Ruang Nyaman", val: 25 },
    { label: "Suhu Tubuh Manusia", val: 37 },
    { label: "Titik Didih Air", val: 100 },
  ];

  const mercuryHeight = Math.min(Math.max(((celsius + 50) / 200) * 100, 5), 100);

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
      <div className="mb-6 flex flex-col gap-1 border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-base text-amber-600 dark:text-amber-400">
            🌡️
          </span>
          <h3 className="text-lg font-semibold tracking-tight text-foreground">
            Simulasi & Konversi Skala Suhu
          </h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Geser slider atau pilih titik acuan untuk melihat transformasi nilai di keempat skala suhu secara langsung.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
        {/* Thermometer Visualizer */}
        <div className="flex flex-col items-center justify-center rounded-xl bg-muted/30 p-6 md:col-span-5">
          <div className="relative flex h-64 w-28 items-center justify-center">
            {/* Thermometer glass frame */}
            <div className="relative flex h-52 w-8 flex-col items-center justify-end overflow-hidden rounded-full border-2 border-border/80 bg-background/80 shadow-inner">
              {/* Scale tick marks */}
              <div className="absolute inset-y-4 right-1 flex flex-col justify-between text-[10px] text-muted-foreground select-none">
                <span>150°</span>
                <span>100°</span>
                <span>50°</span>
                <span>0°</span>
                <span>-50°</span>
              </div>

              {/* Liquid column */}
              <div
                className="w-4 rounded-full transition-all duration-300 ease-out"
                style={{
                  height: `${mercuryHeight}%`,
                  backgroundColor: getTempColor(celsius),
                }}
              />
            </div>

            {/* Thermometer bulb */}
            <div
              className="absolute -bottom-2 h-14 w-14 rounded-full border-2 border-border/80 shadow-md transition-colors duration-300 flex items-center justify-center"
              style={{ backgroundColor: getTempColor(celsius) }}
            >
              <div className="h-4 w-4 rounded-full bg-white/40" />
            </div>
          </div>

          <div className="mt-4 text-center">
            <span
              className="text-3xl font-extrabold tracking-tight"
              style={{ color: getTempColor(celsius) }}
            >
              {celsius.toFixed(1)}°C
            </span>
            <p className="text-xs text-muted-foreground mt-0.5">
              {celsius <= 0
                ? "Dingin Membeku"
                : celsius <= 25
                ? "Sejuk / Ruangan"
                : celsius <= 37
                ? "Hangat Alami Tubuh"
                : celsius < 100
                ? "Sangat Panas"
                : "Mendidih"}
            </p>
          </div>
        </div>

        {/* Controls & Converted Outputs */}
        <div className="flex flex-col justify-between gap-5 md:col-span-7">
          {/* Slider input */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-sm">
              <label htmlFor="temp-slider" className="font-medium text-foreground">
                Atur Suhu Input (Celsius):
              </label>
              <span className="font-mono font-bold text-primary">{celsius}°C</span>
            </div>
            <input
              id="temp-slider"
              type="range"
              min={-50}
              max={150}
              step={0.5}
              value={celsius}
              onChange={(e) => setCelsius(parseFloat(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-muted accent-primary"
            />
            <div className="flex justify-between text-[11px] text-muted-foreground">
              <span>-50°C</span>
              <span>0°C</span>
              <span>50°C</span>
              <span>100°C</span>
              <span>150°C</span>
            </div>
          </div>

          {/* Quick presets */}
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Titik Acuan Penting
            </span>
            <div className="mt-2 flex flex-wrap gap-2">
              {benchmarks.map((b) => (
                <button
                  key={b.label}
                  type="button"
                  onClick={() => setCelsius(b.val)}
                  className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition ${
                    celsius === b.val
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background text-foreground/80 hover:bg-muted"
                  }`}
                >
                  {b.label} ({b.val}°C)
                </button>
              ))}
            </div>
          </div>

          {/* Scale Results Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col rounded-xl border border-border bg-background p-3">
              <span className="text-xs font-medium text-muted-foreground">Fahrenheit</span>
              <span className="mt-1 text-xl font-bold tracking-tight text-foreground">
                {fahrenheit.toFixed(1)}°F
              </span>
              <span className="mt-1 text-[10px] text-muted-foreground font-mono">
                9/5×C + 32
              </span>
            </div>

            <div className="flex flex-col rounded-xl border border-border bg-background p-3">
              <span className="text-xs font-medium text-muted-foreground">Kelvin (Mutlak)</span>
              <span className="mt-1 text-xl font-bold tracking-tight text-foreground">
                {kelvin.toFixed(1)} K
              </span>
              <span className="mt-1 text-[10px] text-muted-foreground font-mono">
                C + 273.15
              </span>
            </div>

            <div className="flex flex-col rounded-xl border border-border bg-background p-3">
              <span className="text-xs font-medium text-muted-foreground">Reamur</span>
              <span className="mt-1 text-xl font-bold tracking-tight text-foreground">
                {reamur.toFixed(1)}°R
              </span>
              <span className="mt-1 text-[10px] text-muted-foreground font-mono">
                4/5×C
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Accessible Textual Fallback summary */}
      <div className="mt-6 rounded-xl border border-border/60 bg-muted/20 px-4 py-3 text-xs text-muted-foreground">
        <strong>Ringkasan Perhitungan:</strong> Pada suhu {celsius}°C, energi termal setara dengan {fahrenheit.toFixed(1)} derajat Fahrenheit, {kelvin.toFixed(1)} Kelvin, dan {reamur.toFixed(1)} derajat Reamur. Perbandingan rasio skala C : R : (F - 32) adalah 5 : 4 : 9.
      </div>
    </div>
  );
}
