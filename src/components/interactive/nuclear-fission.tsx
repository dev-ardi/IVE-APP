"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  Atom,
  Flame,
  Plus,
  RotateCcw,
  ShieldAlert,
  Zap,
  Activity,
  Layers,
  Info,
} from "lucide-react";
import {
  ADD_INCREMENT,
  MAX_NUCLEI,
  MEV_TO_JOULE,
  type FissionStats,
} from "./nuclear-fission-sim";
import { FissionController } from "./nuclear-fission-renderer";
import { RenderFormula } from "@/modules/content/render-formula";

interface Props {
  config?: Record<string, unknown>;
}

function getStatusMessage(s: FissionStats): string {
  if (s.phase === "ready") {
    return s.intactNuclei > 1
      ? `${s.intactNuclei} inti U-235 siap dalam kisi bahan bakar. Tembakkan neutron untuk memulai reaksi berantai.`
      : "1 inti U-235 siap di posisi target. Klik 'Tembakkan Neutron' untuk memulai reaksi.";
  }
  if (s.phase === "fired") {
    return "Neutron termal ditembakkan dari sumber menuju inti target...";
  }
  if (s.phase === "reacting") {
    return `Reaksi berantai aktif! (${s.fissionEvents} fisi terjadi, ${s.activeNeutrons} neutron bergerak, generasi ke-${s.maxGeneration}).`;
  }
  if (s.phase === "stopped") {
    if (s.fissionEvents === 0) {
      return "Neutron lolos atau diserap tanpa memicu pembelahan. Tambah atom atau tembakkan kembali.";
    }
    return `Reaksi mereda. Total ${s.fissionEvents} pembelahan menghasilkan ${s.energyMeV} MeV energi.`;
  }
  if (s.phase === "reset") {
    return "Simulasi di-reset ke kondisi awal (1 inti U-235, 0 MeV energi).";
  }
  return "Siap. Klik 'Tembakkan Neutron' untuk memicu reaksi fisi terinduksi.";
}

export default function NuclearFission({ config = {} }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controllerRef = useRef<FissionController | null>(null);

  const initialRodDepth = Math.max(
    0,
    Math.min(100, Number(config.initialControlRods ?? 30))
  );

  const [controlRodDepth, setControlRodDepth] = useState<number>(initialRodDepth);
  const [stats, setStats] = useState<FissionStats>({
    totalNuclei: 1,
    intactNuclei: 1,
    fissionedNuclei: 0,
    capturedNuclei: 0,
    activeNeutrons: 0,
    fissionEvents: 0,
    energyMeV: 0,
    absorbedByRods: 0,
    capturedByU235: 0,
    escapedNeutrons: 0,
    neutronsFired: 0,
    suppressedNeutrons: 0,
    maxGeneration: 0,
    phase: "ready",
    seed: 42,
  });

  const [statusMessage, setStatusMessage] = useState<string>(
    "Siap. Klik 'Tembakkan Neutron' untuk memicu reaksi fisi terinduksi."
  );

  const sliderId = useId();

  // Initialize canvas controller & lifecycle
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const controller = new FissionController(canvas, {
      seed: Math.floor(Math.random() * 100000) + 1,
      rodInsertion: initialRodDepth / 100,
      onStats: (newStats) => {
        setStats(newStats);
        setStatusMessage(getStatusMessage(newStats));
      },
    });
    controllerRef.current = controller;

    const handleResize = () => {
      controller.resize();
    };

    const ro = new ResizeObserver(() => {
      controller.resize();
    });

    if (containerRef.current) {
      ro.observe(containerRef.current);
    }
    window.addEventListener("resize", handleResize);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", handleResize);
      controller.destroy();
      controllerRef.current = null;
    };
  }, [initialRodDepth]);

  const handleFireNeutron = () => {
    controllerRef.current?.fireNeutron();
  };

  const handleAddNuclei = () => {
    controllerRef.current?.addNuclei();
  };

  const handleReset = () => {
    const nextSeed = Math.floor(Math.random() * 100000) + 1;
    controllerRef.current?.reset(nextSeed, controlRodDepth / 100);
  };

  const handleRodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setControlRodDepth(val);
    controllerRef.current?.setRodInsertion(val / 100);
  };

  const isAtMaxNuclei = stats.totalNuclei >= MAX_NUCLEI;
  const isReacting = stats.phase === "reacting" || stats.activeNeutrons > 0;

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-sm">
      {/* Simulation Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Atom className="h-5 w-5 text-amber-500 animate-pulse" />
            <h3 className="text-base sm:text-lg font-bold text-foreground">
              Simulasi Reaktor Fisi Nuklir & Reaksi Berantai
            </h3>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Eksperimen pembelahan inti U-235, pelepasan neutron sekunder, serta kontrol reaktivitas reaktor.
          </p>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2 self-start sm:self-auto rounded-full border border-border bg-muted/40 px-3 py-1 text-xs">
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              isReacting
                ? "bg-amber-500 animate-ping"
                : stats.phase === "stopped"
                ? "bg-sky-500"
                : "bg-emerald-500"
            }`}
          />
          <span className="font-medium text-foreground">
            {isReacting
              ? "Reaksi Berlangsung"
              : stats.phase === "stopped"
              ? "Reaksi Mereda"
              : "Siap Uji"}
          </span>
        </div>
      </div>

      {/* Main Canvas Container (Interior Reactor) */}
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-xl border-2 border-slate-800 bg-[#06121c] shadow-inner select-none"
      >
        <canvas
          ref={canvasRef}
          className="block w-full h-auto cursor-crosshair"
          style={{ aspectRatio: "1000 / 600" }}
          aria-label="Kanvas visualisasi interior reaktor fisi nuklir"
          role="img"
        />

        {/* Live HUD Floating Indicators */}
        <div className="pointer-events-none absolute left-3 top-3 flex flex-wrap gap-2 text-[11px] font-mono">
          <div className="rounded-md bg-slate-950/80 px-2 py-1 text-amber-300 border border-slate-700/60 backdrop-blur-sm">
            U-235: {stats.intactNuclei}/{stats.totalNuclei}
          </div>
          <div className="rounded-md bg-slate-950/80 px-2 py-1 text-cyan-300 border border-slate-700/60 backdrop-blur-sm">
            Neutron: {stats.activeNeutrons}
          </div>
          {stats.fissionEvents > 0 && (
            <div className="rounded-md bg-slate-950/80 px-2 py-1 text-rose-300 border border-slate-700/60 backdrop-blur-sm">
              Fisi: {stats.fissionEvents}
            </div>
          )}
        </div>
      </div>

      {/* Dynamic Status Notification */}
      <div className="flex items-center gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3.5 py-2.5 text-xs text-amber-900 dark:text-amber-200">
        <Activity className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
        <span className="font-medium">{statusMessage}</span>
      </div>

      {/* Simulation Controls */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-12 items-start">
        {/* Buttons Section */}
        <div className="flex flex-col gap-3 md:col-span-6">
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleFireNeutron}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-500 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              <Zap className="h-4 w-4" />
              Tembakkan Neutron
            </button>

            <button
              type="button"
              onClick={handleAddNuclei}
              disabled={isAtMaxNuclei}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-foreground shadow-sm transition hover:bg-muted active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
            >
              <Plus className="h-4 w-4 text-amber-500" />
              Tambah U-235 (+{ADD_INCREMENT})
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2.5 text-xs sm:text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground active:scale-[0.98] focus:outline-none"
              title="Reset simulasi ke kondisi awal"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
          </div>

          {/* Control Rod Slider */}
          <div className="flex flex-col gap-2 rounded-xl border border-border bg-muted/30 p-3.5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-foreground">
                <ShieldAlert className="h-4 w-4 text-rose-500" />
                Kedalaman Batang Kendali:
              </span>
              <span className="font-mono text-cyan-600 dark:text-cyan-400 font-bold">
                {controlRodDepth}%
              </span>
            </div>

            <input
              id={sliderId}
              type="range"
              min={0}
              max={100}
              value={controlRodDepth}
              onChange={handleRodChange}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-muted-foreground/20 accent-cyan-600 focus:outline-none"
              aria-label="Kedalaman batang kendali neutron"
            />

            <div className="flex justify-between text-[11px] text-muted-foreground">
              <span>0% (Reaksi Maksimal)</span>
              <span>100% (Pemadaman / SCRAM)</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Batang kendali (boron/kadmium) menyerap neutron bebas. Semakin dalam diturunkan, semakin cepat reaksi berantai dipadamkan.
            </p>
          </div>
        </div>

        {/* Telemetry Dashboard */}
        <div className="flex flex-col gap-2.5 rounded-xl border border-border bg-muted/20 p-4 md:col-span-6">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Activity className="h-3.5 w-3.5 text-amber-500" />
            Telemetri Reaksi Nuklir
          </span>

          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            <div className="rounded-lg border border-border bg-card p-2.5">
              <span className="text-[11px] text-muted-foreground block">Inti U-235</span>
              <p className="text-lg font-bold text-foreground">
                {stats.intactNuclei}
                <span className="text-xs font-normal text-muted-foreground">/{stats.totalNuclei}</span>
              </p>
              <span className="text-[10px] text-muted-foreground">
                {stats.fissionedNuclei} terbelah
              </span>
            </div>

            <div className="rounded-lg border border-border bg-card p-2.5">
              <span className="text-[11px] text-muted-foreground block">Peristiwa Fisi</span>
              <p className="text-lg font-bold text-amber-600 dark:text-amber-400">
                {stats.fissionEvents} <span className="text-xs font-normal">kali</span>
              </p>
              <span className="text-[10px] text-muted-foreground">
                Gen ke-{stats.maxGeneration}
              </span>
            </div>

            <div className="rounded-lg border border-border bg-card p-2.5 col-span-2 sm:col-span-1">
              <span className="text-[11px] text-muted-foreground block">Neutron Aktif</span>
              <p className="text-lg font-bold text-cyan-600 dark:text-cyan-400">
                {stats.activeNeutrons}
              </p>
              <span className="text-[10px] text-muted-foreground">
                {stats.absorbedByRods} diserap batang
              </span>
            </div>
          </div>

          {/* Energy Telemetry Card */}
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <Flame className="h-3.5 w-3.5 text-amber-500" />
                Total Energi Dilepas:
              </span>
              <span className="text-base sm:text-lg font-extrabold text-amber-600 dark:text-amber-400 font-mono">
                {stats.energyMeV.toLocaleString()} MeV
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Setara dengan {(stats.energyMeV * MEV_TO_JOULE).toExponential(3)} Joule (dihitung tepat 200 MeV per peristiwa fisi).
            </p>
          </div>
        </div>
      </div>

      {/* Visual Legend */}
      <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-border/60 text-xs text-muted-foreground">
        <span className="font-semibold text-foreground flex items-center gap-1">
          <Layers className="h-3.5 w-3.5" />
          Legenda Reaktor:
        </span>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-amber-400 border border-amber-600" />
          <span>Inti U-235</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]" />
          <span>Neutron Bebas (n)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
          <span>Barium-141</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-violet-400" />
          <span>Kripton-92</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-1.5 rounded-sm bg-slate-400 border border-slate-600" />
          <span>Batang Kendali (Kadmium/Boron)</span>
        </div>
      </div>

      {/* Accessible Physics Fallback & Pedagogical Notes */}
      <div className="rounded-xl border border-border/80 bg-muted/30 p-3.5 text-xs text-muted-foreground flex flex-col gap-2">
        <div className="flex items-center gap-1.5 font-semibold text-foreground">
          <Info className="h-4 w-4 text-cyan-500" />
          <span>Konsep Fisika & Persamaan Reaksi Fisi:</span>
        </div>
        <p className="leading-relaxed">
          Pada fisi nuklir terinduksi, neutron lambat (termal) ditangkap oleh inti Uranium-235 membentuk senyawa inti sementara{" "}
          <strong className="text-foreground">U-236*</strong> yang sangat tidak stabil. Inti tersebut segera terbelah menjadi dua fragmen fisi utama seperti{" "}
          <strong className="text-foreground">Barium-141</strong> dan <strong className="text-foreground">Kripton-92</strong>, melepaskan 2 hingga 3 neutron bebas sekunder berenergi tinggi serta energi kinetik sekitar{" "}
          <strong className="text-foreground">~200 MeV</strong> per peristiwa pembelahan:
        </p>
        <div className="text-center font-bold text-foreground bg-card py-2.5 px-3 rounded-lg border border-border text-xs sm:text-sm overflow-x-auto flex justify-center items-center">
          <RenderFormula formula="^{235}_{92}\text{U} + ^{1}_{0}\text{n} \longrightarrow \left[^{236}_{92}\text{U}\right]^* \longrightarrow ^{141}_{56}\text{Ba} + ^{92}_{36}\text{Kr} + 3\,^{1}_{0}\text{n} + \approx 200\text{ MeV}" />
        </div>
        <p className="text-[11px] text-muted-foreground/90 leading-relaxed">
          <strong>Penyederhanaan Model Edukasi:</strong> Simulasi ini menggunakan model 2D interaktif deterministik. Kecepatan neutron konstan, arah lontaran neutron sekunder isotropik acak, dan probabilitas fisi saat tumbukan adalah 85% (15% tangkapan radiatif). Batang kendali menyerap 100% neutron yang menyentuhnya. Energi dihitung tepat berdasarkan peristiwa fisi yang berhasil.
        </p>
      </div>
    </div>
  );
}
