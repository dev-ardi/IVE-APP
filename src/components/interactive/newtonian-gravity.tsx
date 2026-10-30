"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Wind,
  Info,
  Maximize2,
  Minimize2,
  Activity,
  CircleDot,
  Apple,
  Weight,
} from "lucide-react";
import { RenderFormula } from "@/modules/content/render-formula";
import {
  DEFAULT_INITIAL_HEIGHT,
  DEFAULT_G,
  EARTH_MASS,
  EARTH_RADIUS,
  GRAVITY_OBJECTS,
  GravityEngine,
  GravityObjectType,
  GravityTelemetry,
  calculateUniversalGravity,
  createGravityEngine,
  pauseSimulation,
  resetGravityEngine,
  selectGravityObject,
  setAirResistance,
  setGravityObjectMass,
  setInitialHeight,
  startSimulation,
} from "./newtonian-gravity-sim";
import { GravityController } from "./newtonian-gravity-renderer";

interface Props {
  config?: Record<string, unknown>;
}

export default function NewtonianGravitySimulator({ config = {} }: Props) {
  const initialType = (config.defaultObject as GravityObjectType) ?? "apple";
  const initialH = Number(config.initialHeight ?? DEFAULT_INITIAL_HEIGHT);
  const initialAir = Boolean(config.airResistance ?? false);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controllerRef = useRef<GravityController | null>(null);

  const [engine] = useState<GravityEngine>(() =>
    createGravityEngine({
      objectType: initialType,
      initialHeight: initialH,
      airResistance: initialAir,
    })
  );

  const [selectedObj, setSelectedObj] = useState<GravityObjectType>(initialType);
  const [currentMass, setCurrentMass] = useState<number>(GRAVITY_OBJECTS[initialType].defaultMass);
  const [heightVal, setHeightVal] = useState<number>(initialH);
  const [airResistanceActive, setAirResistanceActive] = useState<boolean>(initialAir);
  const [phase, setPhase] = useState<GravityEngine["phase"]>("ready");
  const [isProjectorMode, setIsProjectorMode] = useState<boolean>(false);

  const [telemetry, setTelemetry] = useState<GravityTelemetry>({
    timeElapsed: 0,
    currentHeight: initialH,
    currentSpeed: 0,
    currentAcceleration: DEFAULT_G,
    gravitationalForceN: GRAVITY_OBJECTS[initialType].defaultMass * DEFAULT_G,
    dragForceN: 0,
    netForceN: GRAVITY_OBJECTS[initialType].defaultMass * DEFAULT_G,
    impactTime: null,
    impactSpeed: null,
    hasCollided: false,
    thoughtBubbleVisible: false,
  });

  const massSliderId = useId();
  const heightSliderId = useId();

  // Initialize Canvas & Controller Lifecycle
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const controller = new GravityController(canvas, {
      engine,
      onTelemetry: (newTelemetry, currentPhase) => {
        setTelemetry(newTelemetry);
        setPhase(currentPhase);
      },
    });
    controllerRef.current = controller;

    const ro = new ResizeObserver(() => {
      controller.resize();
    });

    if (containerRef.current) {
      ro.observe(containerRef.current);
    }

    return () => {
      ro.disconnect();
      controller.destroy();
      controllerRef.current = null;
    };
  }, [engine]);

  // Object Selection Handler
  const handleSelectObject = (type: GravityObjectType) => {
    setSelectedObj(type);
    const spec = GRAVITY_OBJECTS[type];
    setCurrentMass(spec.defaultMass);
    selectGravityObject(engine, type);
    // If selecting feather, enable air resistance by default for pedagogical intuition
    if (type === "feather") {
      setAirResistanceActive(true);
      setAirResistance(engine, true);
    }
    controllerRef.current?.render();
  };

  // Mass Slider Handler
  const handleMassChange = (newMass: number) => {
    setCurrentMass(newMass);
    setGravityObjectMass(engine, newMass);
    controllerRef.current?.render();
  };

  // Initial Height Slider Handler
  const handleHeightChange = (newHeight: number) => {
    setHeightVal(newHeight);
    setInitialHeight(engine, newHeight);
    controllerRef.current?.render();
  };

  // Air Resistance Toggle Handler
  const handleToggleAirResistance = (enabled: boolean) => {
    setAirResistanceActive(enabled);
    setAirResistance(engine, enabled);
    controllerRef.current?.render();
  };

  // Control Actions
  const handlePlay = () => {
    startSimulation(engine);
  };

  const handlePause = () => {
    pauseSimulation(engine);
  };

  const handleReset = () => {
    resetGravityEngine(engine);
    controllerRef.current?.render();
  };

  // Universal Gravitation calculation for Earth + Object
  const universalGravData = useMemo(() => {
    return calculateUniversalGravity(EARTH_MASS, currentMass, EARTH_RADIUS);
  }, [currentMass]);

  return (
    <div
      ref={containerRef}
      className={`relative mx-auto flex w-full flex-col gap-4 rounded-3xl border border-stone-200 bg-white p-4 shadow-sm transition-all sm:p-6 dark:border-stone-800 dark:bg-stone-900 ${
        isProjectorMode ? "fixed inset-0 z-50 overflow-y-auto rounded-none border-0 p-6" : ""
      }`}
    >
      {/* Top Header / Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-3 dark:border-stone-800">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500 text-white shadow-xs">
            <Apple className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-black tracking-tight text-stone-900 dark:text-white sm:text-lg">
              Simulasi Gravitasi Newton: Kisah Apel &amp; Ruang Hampa
            </h2>
            <p className="text-xs text-muted-foreground">
              Visualisasi hukum gravitasi universal, gerak jatuh bebas, dan eksperimen ruang hampa Galileo.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Status Badge */}
          <div className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-800 dark:border-sky-900 dark:bg-sky-950/60 dark:text-sky-300">
            <span
              className={`h-2 w-2 rounded-full ${
                phase === "falling"
                  ? "animate-pulse bg-emerald-500"
                  : phase === "impacted"
                  ? "bg-amber-500"
                  : "bg-sky-500"
              }`}
            />
            <span>
              {phase === "ready" && "Kondisi Awal (Siap)"}
              {phase === "falling" && "Benda Sedang Jatuh Bebas..."}
              {phase === "paused" && "Simulasi Dijeda"}
              {phase === "impacted" && "Tumbukan Terjadi! (Reaksi Newton)"}
            </span>
          </div>

          {/* Projector Mode Toggle */}
          <button
            type="button"
            onClick={() => setIsProjectorMode(!isProjectorMode)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-stone-100 px-3 py-1.5 text-xs font-bold text-stone-700 transition-colors hover:bg-stone-200 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
            title={isProjectorMode ? "Keluar Mode Proyektor" : "Mode Proyektor / Layar Penuh"}
          >
            {isProjectorMode ? (
              <>
                <Minimize2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Normal</span>
              </>
            ) : (
              <>
                <Maximize2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Proyektor</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Interactive Canvas */}
      <div className="relative w-full overflow-hidden rounded-2xl border-2 border-sky-100 bg-sky-50 shadow-inner dark:border-stone-700 dark:bg-stone-950">
        <canvas
          ref={canvasRef}
          className="block w-full touch-none select-none"
          style={{ aspectRatio: "1000/600" }}
          aria-label="Canvas simulasi interaktif Gravitasi Newton"
        />

        {/* Floating Play/Pause/Reset Quick Control at Bottom-Right of Canvas */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2 rounded-2xl bg-white/90 p-1.5 shadow-md backdrop-blur-md dark:bg-stone-900/90 border border-stone-200 dark:border-stone-700">
          {phase === "falling" ? (
            <button
              type="button"
              onClick={handlePause}
              className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-3.5 py-2 text-xs font-black text-white shadow-xs transition-transform hover:bg-amber-400 active:scale-95"
            >
              <Pause className="h-4 w-4" />
              <span>Pause</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePlay}
              disabled={phase === "impacted"}
              className="inline-flex items-center gap-1.5 rounded-xl bg-sky-600 px-4 py-2 text-xs font-black text-white shadow-xs transition-transform hover:bg-sky-500 active:scale-95 disabled:opacity-50"
            >
              <Play className="h-4 w-4 fill-white" />
              <span>{phase === "paused" ? "Lanjutkan" : "Play Simulasi"}</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-stone-100 px-3 py-2 text-xs font-bold text-stone-700 transition-colors hover:bg-stone-200 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
            title="Reset ke posisi awal di pohon"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Object Selector Cards (Consistent with Slingshot Simulator Style) */}
      <div className="flex flex-col gap-2 rounded-2xl border border-stone-200 bg-stone-50/80 p-3.5 dark:border-stone-800 dark:bg-stone-800/50">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Pilih Objek Uji Simulasi:
          </span>
          <span className="text-[11px] text-muted-foreground">
            Semua objek jatuh dengan percepatan sama di ruang hampa!
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {/* 1. Apel */}
          <button
            type="button"
            onClick={() => handleSelectObject("apple")}
            disabled={phase === "falling"}
            className={`flex items-center gap-2.5 rounded-xl border-2 p-2.5 text-left transition-all ${
              selectedObj === "apple"
                ? "border-red-500 bg-red-50 text-red-950 shadow-sm dark:bg-red-950/40 dark:text-red-200"
                : "border-stone-200 bg-white text-stone-700 hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300"
            }`}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500 text-white font-bold text-xs shadow-xs">
              🍎
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black">Apel</span>
              <span className="font-mono text-[10px] text-muted-foreground">0.15 kg</span>
            </div>
          </button>

          {/* 2. Durian */}
          <button
            type="button"
            onClick={() => handleSelectObject("durian")}
            disabled={phase === "falling"}
            className={`flex items-center gap-2.5 rounded-xl border-2 p-2.5 text-left transition-all ${
              selectedObj === "durian"
                ? "border-amber-500 bg-amber-50 text-amber-950 shadow-sm dark:bg-amber-950/40 dark:text-amber-200"
                : "border-stone-200 bg-white text-stone-700 hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300"
            }`}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-white font-bold text-xs shadow-xs">
              🍈
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black">Durian</span>
              <span className="font-mono text-[10px] text-muted-foreground">1.5 kg</span>
            </div>
          </button>

          {/* 3. Bulu Unggas */}
          <button
            type="button"
            onClick={() => handleSelectObject("feather")}
            disabled={phase === "falling"}
            className={`flex items-center gap-2.5 rounded-xl border-2 p-2.5 text-left transition-all ${
              selectedObj === "feather"
                ? "border-sky-500 bg-sky-50 text-sky-950 shadow-sm dark:bg-sky-950/40 dark:text-sky-200"
                : "border-stone-200 bg-white text-stone-700 hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300"
            }`}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500 text-white font-bold text-xs shadow-xs">
              🪶
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black">Bulu</span>
              <span className="font-mono text-[10px] text-muted-foreground">0.001 kg (1 g)</span>
            </div>
          </button>

          {/* 4. Bola Besi */}
          <button
            type="button"
            onClick={() => handleSelectObject("iron_ball")}
            disabled={phase === "falling"}
            className={`flex items-center gap-2.5 rounded-xl border-2 p-2.5 text-left transition-all ${
              selectedObj === "iron_ball"
                ? "border-slate-600 bg-slate-100 text-slate-950 shadow-sm dark:bg-slate-800 dark:text-slate-200"
                : "border-stone-200 bg-white text-stone-700 hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300"
            }`}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-700 text-white font-bold text-xs shadow-xs">
              💣
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black">Bola Besi</span>
              <span className="font-mono text-[10px] text-muted-foreground">1.0 kg</span>
            </div>
          </button>
        </div>
      </div>

      {/* Control Sliders & Environment Toggle */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Slider 1: Massa Objek */}
        <div className="flex flex-col gap-1.5 rounded-2xl border border-stone-200 bg-stone-50/70 p-3.5 dark:border-stone-800 dark:bg-stone-800/50">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-stone-700 dark:text-stone-300 flex items-center gap-1">
              <span>Massa Objek</span>
              <strong className="text-blue-600">(<RenderFormula formula="m" />)</strong>
            </span>
            <span className="rounded-md border border-stone-300 bg-white px-2 py-0.5 font-mono text-xs font-black text-stone-900 dark:border-stone-700 dark:bg-stone-900 dark:text-white">
              {currentMass} kg
            </span>
          </div>
          <input
            id={massSliderId}
            type="range"
            min={GRAVITY_OBJECTS[selectedObj].minMass}
            max={GRAVITY_OBJECTS[selectedObj].maxMass}
            step={selectedObj === "feather" ? 0.0005 : 0.05}
            value={currentMass}
            onChange={(e) => handleMassChange(Number(e.target.value))}
            disabled={phase === "falling"}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-stone-200 accent-blue-600 dark:bg-stone-700"
            aria-label="Pengaturan massa objek"
          />
          <span className="text-[10px] text-muted-foreground">
            {GRAVITY_OBJECTS[selectedObj].description}
          </span>
        </div>

        {/* Slider 2: Ketinggian Awal Cabang Pohon */}
        <div className="flex flex-col gap-1.5 rounded-2xl border border-stone-200 bg-stone-50/70 p-3.5 dark:border-stone-800 dark:bg-stone-800/50">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-stone-700 dark:text-stone-300 flex items-center gap-1">
              <span>Ketinggian Awal Cabang</span>
              <strong className="text-emerald-600">(<RenderFormula formula="h_0" />)</strong>
            </span>
            <span className="rounded-md border border-stone-300 bg-white px-2 py-0.5 font-mono text-xs font-black text-stone-900 dark:border-stone-700 dark:bg-stone-900 dark:text-white">
              {heightVal.toFixed(1)} m
            </span>
          </div>
          <input
            id={heightSliderId}
            type="range"
            min={2.0}
            max={5.5}
            step={0.1}
            value={heightVal}
            onChange={(e) => handleHeightChange(Number(e.target.value))}
            disabled={phase === "falling"}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-stone-200 accent-emerald-600 dark:bg-stone-700"
            aria-label="Ketinggian awal objek pada cabang pohon"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>Rendah (2.0m)</span>
            <span>Default (5.0m)</span>
            <span>Maks (5.5m)</span>
          </div>
        </div>

        {/* Toggle 3: Mode Hambatan Udara (Vakum vs Atmosfer) */}
        <div className="flex flex-col justify-between gap-1.5 rounded-2xl border border-stone-200 bg-stone-50/70 p-3.5 dark:border-stone-800 dark:bg-stone-800/50">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-stone-700 dark:text-stone-300 flex items-center gap-1">
              <Wind className="h-3.5 w-3.5 text-cyan-600" />
              <span>Hambatan Udara</span>
            </span>
            <span
              className={`rounded-md px-2 py-0.5 text-xs font-black ${
                airResistanceActive
                  ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                  : "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300"
              }`}
            >
              {airResistanceActive ? "Atmosfer (Gesekan)" : "Vakum (Hampa Udara)"}
            </span>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => handleToggleAirResistance(false)}
              disabled={phase === "falling"}
              className={`flex-1 rounded-xl py-1.5 text-xs font-bold transition-all ${
                !airResistanceActive
                  ? "bg-sky-600 text-white shadow-xs"
                  : "bg-white text-stone-700 hover:bg-stone-100 dark:bg-stone-800 dark:text-stone-300"
              }`}
            >
              Ruang Hampa (Galileo)
            </button>
            <button
              type="button"
              onClick={() => handleToggleAirResistance(true)}
              disabled={phase === "falling"}
              className={`flex-1 rounded-xl py-1.5 text-xs font-bold transition-all ${
                airResistanceActive
                  ? "bg-amber-600 text-white shadow-xs"
                  : "bg-white text-stone-700 hover:bg-stone-100 dark:bg-stone-800 dark:text-stone-300"
              }`}
            >
              Udara Nyata
            </button>
          </div>

          <span className="text-[10px] text-muted-foreground">
            {airResistanceActive
              ? "Bulu mengalami gaya gesek udara (drag) dan melayang santai."
              : "Semua benda jatuh dengan percepatan sama persis g = 9.81 m/s²."}
          </span>
        </div>
      </div>

      {/* 4 Educational Information Cards (As Specified in Prompt Section 7) */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Kondisi Objek */}
        <div className="flex flex-col justify-between rounded-2xl border border-stone-200 bg-stone-50/80 p-4 dark:border-stone-800 dark:bg-stone-800/60">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-stone-500 dark:text-stone-400">
              <span>Card 1: Kondisi Objek</span>
              <CircleDot className="h-4 w-4 text-sky-500" />
            </div>
            <h3 className="mt-1 text-sm font-black text-stone-900 dark:text-white">
              {GRAVITY_OBJECTS[selectedObj].name} ({currentMass} kg)
            </h3>
            <ul className="mt-3 flex flex-col gap-1.5 text-xs">
              <li className="flex justify-between">
                <span className="text-muted-foreground">Tinggi Awal (h₀):</span>
                <span className="font-mono font-bold">{heightVal.toFixed(2)} m</span>
              </li>
              <li className="flex justify-between">
                <span className="text-muted-foreground">Tinggi Sesaat (h):</span>
                <span className="font-mono font-bold text-emerald-600">
                  {telemetry.currentHeight.toFixed(2)} m
                </span>
              </li>
              <li className="flex justify-between">
                <span className="text-muted-foreground">Waktu Jatuh (t):</span>
                <span className="font-mono font-bold text-amber-600">
                  {telemetry.timeElapsed.toFixed(2)} s
                </span>
              </li>
              <li className="flex justify-between">
                <span className="text-muted-foreground">Kecepatan Sesaat (v):</span>
                <span className="font-mono font-bold text-sky-600">
                  {telemetry.currentSpeed.toFixed(2)} m/s
                </span>
              </li>
            </ul>
          </div>
          <div className="mt-3 border-t border-stone-200 pt-2 text-[10px] text-muted-foreground dark:border-stone-700">
            {phase === "impacted" ? (
              <span className="font-bold text-red-600">
                Tumbukan terjadi pada t = {telemetry.impactTime?.toFixed(2)} s dengan v ={" "}
                {telemetry.impactSpeed?.toFixed(2)} m/s!
              </span>
            ) : (
              <span>Objek bergerak dipercepat beraturan ke bawah.</span>
            )}
          </div>
        </div>

        {/* Card 2: Gaya Gravitasi Universal */}
        <div className="flex flex-col justify-between rounded-2xl border border-stone-200 bg-stone-50/80 p-4 dark:border-stone-800 dark:bg-stone-800/60">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-stone-500 dark:text-stone-400">
              <span>Card 2: Gaya Gravitasi</span>
              <Weight className="h-4 w-4 text-indigo-500" />
            </div>
            <div className="mt-1 font-bold text-indigo-700 dark:text-indigo-400 text-xs">
              <RenderFormula formula="F = G \frac{M_{\text{bumi}} \cdot m}{R_{\text{bumi}}^2}" />
            </div>
            <ul className="mt-3 flex flex-col gap-1.5 text-xs">
              <li className="flex justify-between">
                <span className="text-muted-foreground">Massa Bumi (M):</span>
                <span className="font-mono font-bold">5.97 × 10²⁴ kg</span>
              </li>
              <li className="flex justify-between">
                <span className="text-muted-foreground">Massa Objek (m):</span>
                <span className="font-mono font-bold">{currentMass} kg</span>
              </li>
              <li className="flex justify-between">
                <span className="text-muted-foreground">Jarak ke Pusat (r):</span>
                <span className="font-mono font-bold">6.371 × 10⁶ m</span>
              </li>
              <li className="flex justify-between">
                <span className="text-muted-foreground">Gaya Tarik (F):</span>
                <span className="font-mono font-bold text-indigo-600">
                  {telemetry.gravitationalForceN.toFixed(2)} N
                </span>
              </li>
            </ul>
          </div>
          <div className="mt-3 border-t border-stone-200 pt-2 text-[10px] text-muted-foreground dark:border-stone-700">
            Perhitungan Universal: G·M·m/r² = {universalGravData.formulaString} (sebanding m × g).
          </div>
        </div>

        {/* Card 3: Percepatan Gravitasi */}
        <div className="flex flex-col justify-between rounded-2xl border border-stone-200 bg-stone-50/80 p-4 dark:border-stone-800 dark:bg-stone-800/60">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-stone-500 dark:text-stone-400">
              <span>Card 3: Percepatan (g)</span>
              <Activity className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="mt-1 font-bold text-emerald-700 dark:text-emerald-400 text-xs">
              <RenderFormula formula="g = \frac{G M_{\text{bumi}}}{R_{\text{bumi}}^2} \approx 9.81\text{ m/s}^2" />
            </div>
            <p className="mt-2 text-xs leading-relaxed text-stone-600 dark:text-stone-300">
              Percepatan gravitasi <strong className="text-foreground">g</strong> di permukaan Bumi
              bernilai konstan sekitar <strong>9.81 m/s²</strong> dan <strong>TIDAK</strong> bergantung
              pada massa benda!
            </p>
          </div>
          <div className="mt-3 rounded-lg bg-emerald-50 p-2 text-[10px] text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
            <strong>Kunci Konsep:</strong> Gaya (F) memang lebih besar pada benda berat, tetapi
            inersia (keengganan bergerak) juga sama besarnya (a = F/m), sehingga percepatannya tetap
            sama!
          </div>
        </div>

        {/* Card 4: Pengaruh Hambatan Udara */}
        <div className="flex flex-col justify-between rounded-2xl border border-stone-200 bg-stone-50/80 p-4 dark:border-stone-800 dark:bg-stone-800/60">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-stone-500 dark:text-stone-400">
              <span>Card 4: Hambatan Udara</span>
              <Wind className="h-4 w-4 text-cyan-500" />
            </div>
            <div className="mt-1 font-bold text-cyan-700 dark:text-cyan-400 text-xs">
              <RenderFormula formula="F_{\text{net}} = m g - \frac{1}{2}\rho C_d A v^2" />
            </div>
            <p className="mt-2 text-xs leading-relaxed text-stone-600 dark:text-stone-300">
              {airResistanceActive ? (
                <>
                  Pada mode atmosfer, gaya gesek udara menahan benda. Bulu memiliki luas permukaan
                  relatif besar terhadap massanya sehingga cepat mencapai kecepatan terminal (± 2 m/s).
                </>
              ) : (
                <>
                  Pada ruang hampa (vakum), gesekan udara dihilangkan. Bulu dan bola besi meluncur
                  dengan percepatan identik dan menyentuh tanah pada detik yang sama persis!
                </>
              )}
            </p>
          </div>
          <div className="mt-3 rounded-lg bg-sky-50 p-2 text-[10px] text-sky-800 dark:bg-sky-950/60 dark:text-sky-300">
            <strong>Fakta Sejarah:</strong> Terbukti pada misi Apollo 15 (1971) di Bulan saat astronot
            David Scott menjatuhkan palu dan bulu falcon secara bersamaan!
          </div>
        </div>
      </div>

      {/* KaTeX Live Trajectory Kinematics Ribbon */}
      <div className="flex flex-col gap-2 rounded-2xl border border-stone-200 bg-[#FAF9F5] p-3.5 text-xs dark:border-stone-800 dark:bg-[#121316]">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-700 dark:text-stone-300">
              Persamaan Kinematika Jatuh Bebas:
            </span>
            <div className="font-bold text-blue-700 dark:text-blue-400">
              <RenderFormula formula="v(t) = v_0 + g t \quad (v_0 = 0 \implies v(t) = g t)" />
            </div>
          </div>
          <div className="font-bold text-amber-700 dark:text-amber-400">
            <RenderFormula formula="h(t) = h_0 - \frac{1}{2} g t^2" />
          </div>
        </div>
      </div>

      {/* Accessible Pedagogical Notes */}
      <div className="rounded-xl border border-border/80 bg-muted/30 p-3.5 text-xs text-muted-foreground flex flex-col gap-2">
        <div className="flex items-center gap-1.5 font-semibold text-foreground">
          <Info className="h-4 w-4 text-blue-500" />
          <span>Catatan Edukasi &amp; Sejarah Sains:</span>
        </div>
        <p className="leading-relaxed">
          <strong>Kisah Apel Newton:</strong> Penggambaran apel yang mengenai kepala Newton merupakan visualisasi naratif populer yang terinspirasi oleh catatan biografi William Stukeley (1752). Newton merenungkan mengapa buah apel selalu jatuh tegak lurus ke pusat Bumi, yang membimbingnya merumuskan bahwa gaya tarik yang sama mengikat Bulan tetap berada pada orbit mengelilingi Bumi.
        </p>
        <p className="leading-relaxed">
          <strong>Hukum Gravitasi Universal:</strong> Hukum Newton menyatukan fisika bumi dan langit. Besar gaya gravitasi berbanding lurus dengan hasil kali kedua massa dan berbanding terbalik dengan kuadrat jarak antar pusat massanya.
        </p>
      </div>
    </div>
  );
}
