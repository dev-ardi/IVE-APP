"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  RotateCcw,
  Target,
  Maximize2,
  Minimize2,
  Sparkles,
  Zap,
  Info,
  CircleDot,
  Send,
  Activity,
} from "lucide-react";
import { RenderFormula } from "@/modules/content/render-formula";
import { PredictChallengeModal } from "@/components/interactive/predict-challenge-modal";
import {
  OBJECT_SPECS,
  ObjectType,
  ProjectileEngine,
  ProjectileTelemetry,
  createProjectileEngine,
  releasePull,
  resetEngine,
  selectObject,
  setGravity,
  setObjectMass,
  startPull,
} from "./projectile-sim";
import { ProjectileController } from "./projectile-renderer";

interface Props {
  config?: Record<string, unknown>;
}

const PREDICT_OPTIONS = [
  {
    id: "A",
    text: "Batu yang lebih berat (2 kg) akan memiliki kecepatan awal lebih rendah daripada pesawat kertas pada regangan karet yang sama.",
    formula: "v_0 = \\sqrt{\\frac{2 \\eta E_{\\text{elastis}}}{m}}",
    isCorrect: true,
    explanation:
      "Tepat sekali! Karena energi potensial elastis karet ketapel ditransfer menjadi energi kinetik (1/2 m v₀²), massa (m) berada di penyebut. Semakin besar massa benda, semakin kecil kecepatan awal yang diperoleh.",
  },
  {
    id: "B",
    text: "Pesawat kertas dan batu akan melesat dengan kecepatan awal yang sama persis karena ditarik dengan gaya yang sama.",
    isCorrect: false,
    explanation:
      "Gaya dan energi elastis ketapel sama, tetapi inersia benda berbeda. Sesuai hukum Newton II (a = F/m) dan kekekalan energi, benda yang lebih ringan berakselerasi jauh lebih cepat.",
  },
  {
    id: "C",
    text: "Pesawat kertas pasti menghasilkan benturan yang lebih kuat merobohkan kardus karena bergerak lebih cepat.",
    isCorrect: false,
    explanation:
      "Meskipun kecepatannya tinggi, massa pesawat kertas sangat kecil (5 gram) sehingga momentumnya (p = m · v) sangat rendah. Akibatnya, ia tidak memiliki impuls yang cukup untuk merobohkan kardus.",
  },
];

export default function ProjectileSimulator({ config = {} }: Props) {
  const initialGravity = Number(config.gravity ?? 9.81);
  const initialSpeed = Number(config.initialSpeed ?? 20);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controllerRef = useRef<ProjectileController | null>(null);

  const [engine] = useState<ProjectileEngine>(() =>
    createProjectileEngine({ gravity: initialGravity })
  );

  const [selectedObj, setSelectedObj] = useState<ObjectType>("soccer");
  const [currentMass, setCurrentMass] = useState<number>(OBJECT_SPECS.soccer.defaultMass);
  const [gravityVal, setGravityVal] = useState<number>(initialGravity);
  const [pullSlider, setPullSlider] = useState<number>(0); // 0 to 100%
  const [angleSlider, setAngleSlider] = useState<number>(45);

  const [telemetry, setTelemetry] = useState<ProjectileTelemetry>({
    v0: initialSpeed,
    angleDeg: 45,
    elasticEnergyJ: 0,
    elasticForceN: 0,
    currentSpeed: 0,
    currentHeight: 4.75,
    currentDistance: 0,
    maxHeight: 4.75,
    range: 0,
    flightTime: 0,
    boxesHit: 0,
    boxesFallen: 0,
  });

  const [phase, setPhase] = useState<ProjectileEngine["phase"]>("ready");
  const [isProjectorMode, setIsProjectorMode] = useState<boolean>(false);
  const [showChallenge, setShowChallenge] = useState<boolean>(false);

  const massSliderId = useId();
  const pullSliderId = useId();
  const angleSliderId = useId();
  const gravitySliderId = useId();

  const handleAngleChange = (val: number) => {
    setAngleSlider(val);
    if (pullSlider > 0) {
      const pullDist = (pullSlider / 100) * 75;
      const rad = (val * Math.PI) / 180;
      const targetX = 130 - pullDist * Math.cos(rad);
      const targetY = 345 + pullDist * Math.sin(rad);
      startPull(engine, targetX, targetY);
      controllerRef.current?.render();
    }
  };

  // Initialize Canvas & Controller Lifecycle
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const controller = new ProjectileController(canvas, {
      engine,
      onTelemetry: (newTelemetry, currentPhase) => {
        setTelemetry(newTelemetry);
        setPhase(currentPhase);
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
  }, [engine]);

  // Object selection handler
  const handleSelectObject = (type: ObjectType) => {
    if (phase === "flying") return; // prevent teleportation during flight
    setSelectedObj(type);
    const defMass = OBJECT_SPECS[type].defaultMass;
    setCurrentMass(defMass);
    selectObject(engine, type);
    controllerRef.current?.render();
  };

  // Mass slider change
  const handleMassChange = (newMass: number) => {
    setCurrentMass(newMass);
    setObjectMass(engine, newMass);
    controllerRef.current?.render();
  };

  // Gravity change
  const handleGravityChange = (newG: number) => {
    setGravityVal(newG);
    setGravity(engine, newG);
  };

  // Accessible Pull Slider
  const handlePullSliderChange = (percent: number) => {
    setPullSlider(percent);
    if (percent === 0) {
      if (engine.pouch.isPulling) {
        releasePull(engine);
      }
      return;
    }
    const pullDist = (percent / 100) * 75;
    const rad = (angleSlider * Math.PI) / 180;
    // Aim opposite: pull back left & down
    const targetX = 130 - pullDist * Math.cos(rad);
    const targetY = 345 + pullDist * Math.sin(rad);

    startPull(engine, targetX, targetY);
    controllerRef.current?.render();
  };

  // Launch button
  const handleLaunchButton = () => {
    if (phase === "flying") return;

    // If not already pulled via touch/mouse, pull with current slider settings
    if (!engine.pouch.isPulling) {
      const stretchPercent = pullSlider > 10 ? pullSlider : 75;
      const pullDist = (stretchPercent / 100) * 75;
      const rad = (angleSlider * Math.PI) / 180;
      const targetX = 130 - pullDist * Math.cos(rad);
      const targetY = 345 + pullDist * Math.sin(rad);

      startPull(engine, targetX, targetY);
    }

    releasePull(engine);
    setPullSlider(0);
    controllerRef.current?.ensureLoop();
  };

  // Reset handler
  const handleReset = () => {
    resetEngine(engine);
    setPullSlider(0);
    setSelectedObj("soccer");
    setCurrentMass(OBJECT_SPECS.soccer.defaultMass);
    selectObject(engine, "soccer");
    controllerRef.current?.render();
  };

  const statusFeedback = useMemo(() => {
    if (phase === "pulling") {
      return `Karet diregangkan (${telemetry.elasticForceN.toFixed(0)} N). Energi tersimpan: ${telemetry.elasticEnergyJ.toFixed(1)} J. Lepaskan untuk meluncurkan!`;
    }
    if (phase === "flying") {
      return `Proyektil ${OBJECT_SPECS[selectedObj].name} sedang melesat (v = ${telemetry.currentSpeed.toFixed(1)} m/s, h = ${telemetry.currentHeight.toFixed(1)} m)...`;
    }
    if (phase === "landed") {
      if (telemetry.boxesHit > 0) {
        return `Tumbukan sukses! Mengenai kardus dengan ${telemetry.boxesFallen} kardus roboh! Jarak jatuh: ${telemetry.range.toFixed(1)} m.`;
      }
      return `Pendaratan selesai pada jarak ${telemetry.range.toFixed(1)} m (Tinggi puncak Hmax: ${telemetry.maxHeight.toFixed(1)} m).`;
    }
    return `Tarik karet ketapel pada layar (atau gunakan kontrol peluncur), lalu lepaskan untuk meluncurkan ${OBJECT_SPECS[selectedObj].name}.`;
  }, [phase, telemetry, selectedObj]);

  return (
    <div
      ref={containerRef}
      className={`flex flex-col gap-5 rounded-3xl border-2 border-stone-900 bg-white p-5 shadow-[4px_4px_0px_0px_rgba(24,24,27,0.9)] transition-all dark:border-white dark:bg-stone-900 dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.7)] sm:p-7 ${
        isProjectorMode ? "fixed inset-4 z-50 overflow-y-auto bg-white p-8 dark:bg-stone-950" : ""
      }`}
    >
      {/* Simulation Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-stone-200 pb-4 dark:border-stone-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-blue-400/40 bg-blue-100 px-2.5 py-0.5 text-[10px] font-black uppercase text-blue-900 dark:bg-blue-950 dark:text-blue-200">
              FISIKA MEKANIKA
            </span>
            <span className="text-xs font-bold text-stone-500">Slingshot & Parabola Simulator</span>
          </div>
          <h3 className="mt-1 text-lg sm:text-xl font-black tracking-tight text-stone-900 dark:text-white">
            Simulasi Ketapel Gerak Parabola & Tumbukan
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Tarik karet ketapel, atur massa & proyektil, amati kurva lintasan parabola serta tumbukan balok kardus.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Predict Challenge Trigger */}
          <button
            type="button"
            onClick={() => setShowChallenge(!showChallenge)}
            className={`inline-flex cursor-pointer items-center gap-1.5 rounded-xl border-2 px-3 py-1.5 text-xs font-black transition-all ${
              showChallenge
                ? "border-amber-600 bg-amber-500 text-stone-950 shadow-xs"
                : "border-stone-900 bg-amber-100 text-amber-950 hover:bg-amber-200 dark:border-white dark:bg-amber-950 dark:text-amber-200"
            }`}
          >
            <Target className="h-3.5 w-3.5" />
            <span>{showChallenge ? "Tutup Tantangan" : "🎯 Tantangan Prediksi"}</span>
          </button>

          {/* Projector Mode Toggle */}
          <button
            type="button"
            onClick={() => setIsProjectorMode(!isProjectorMode)}
            title="Mode Presentasi Layar Penuh"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border-2 border-stone-900 bg-stone-100 text-stone-900 shadow-2xs hover:bg-stone-200 dark:border-white dark:bg-stone-800 dark:text-white"
          >
            {isProjectorMode ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Predict Challenge Modal (Expandable) */}
      {showChallenge && (
        <div className="my-1">
          <PredictChallengeModal
            title="Tantangan Prediksi Fisika: Pengaruh Massa Terhadap Kecepatan Awal"
            question="Dengan tarikan karet ketapel dan energi elastis yang sama, mengapa batu (2 kg) bergerak lebih lambat daripada pesawat kertas (5 g) saat diluncurkan?"
            formula="v_0 = \sqrt{\frac{2 \eta E_{\text{elastis}}}{m}}"
            options={PREDICT_OPTIONS}
            onApplyHypothesis={() => {
              handleSelectObject("stone");
              setShowChallenge(false);
            }}
          />
        </div>
      )}

      {/* Main Interactive Canvas */}
      <div className="relative w-full overflow-hidden rounded-2xl border-2 border-stone-800 bg-[#08131e] shadow-inner select-none">
        <canvas
          ref={canvasRef}
          className="block w-full h-auto cursor-grab active:cursor-grabbing touch-none"
          style={{ aspectRatio: "1000 / 500" }}
          aria-label="Kanvas interaktif simulasi ketapel dan gerak parabola"
          role="img"
        />

        {/* Floating Hint Overlay */}
        <div className="pointer-events-none absolute left-3 top-3 flex flex-wrap gap-2 text-[11px] font-mono">
          <div className="rounded-md bg-slate-950/80 px-2.5 py-1 text-cyan-300 border border-slate-700/60 backdrop-blur-sm">
            Objek: {OBJECT_SPECS[selectedObj].name} ({currentMass} kg)
          </div>
          {phase === "flying" && (
            <div className="rounded-md bg-slate-950/80 px-2.5 py-1 text-amber-300 border border-slate-700/60 backdrop-blur-sm animate-pulse">
              Kecepatan: {telemetry.currentSpeed.toFixed(1)} m/s
            </div>
          )}
          {telemetry.boxesFallen > 0 && (
            <div className="rounded-md bg-slate-950/80 px-2.5 py-1 text-rose-300 border border-slate-700/60 backdrop-blur-sm">
              Kardus Roboh: {telemetry.boxesFallen}/6
            </div>
          )}
        </div>
      </div>

      {/* Status Feedback Banner */}
      <div className="flex items-center gap-2.5 rounded-xl border border-blue-500/30 bg-blue-500/10 px-3.5 py-2.5 text-xs text-blue-950 dark:text-blue-200">
        <Activity className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
        <span className="font-semibold">{statusFeedback}</span>
      </div>

      {/* Object Selector & Primary Controls */}
      <div className="flex flex-col gap-4 border-b border-stone-200 pb-5 dark:border-stone-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-700 dark:text-stone-300">Pilih Objek Peluncur:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Object 1: Batu */}
            <button
              type="button"
              onClick={() => handleSelectObject("stone")}
              disabled={phase === "flying"}
              className={`inline-flex items-center gap-2 rounded-xl border-2 px-3.5 py-2 text-xs font-bold transition-all ${
                selectedObj === "stone"
                  ? "border-amber-600 bg-amber-500 text-stone-950 shadow-[2px_2px_0px_0px_rgba(15,23,42,0.9)]"
                  : "border-stone-300 bg-stone-50 text-stone-700 hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
              }`}
            >
              <CircleDot className="h-4 w-4 text-stone-600 dark:text-stone-400" />
              <span>Batu (2 kg)</span>
            </button>

            {/* Object 2: Pesawat Kertas */}
            <button
              type="button"
              onClick={() => handleSelectObject("plane")}
              disabled={phase === "flying"}
              className={`inline-flex items-center gap-2 rounded-xl border-2 px-3.5 py-2 text-xs font-bold transition-all ${
                selectedObj === "plane"
                  ? "border-sky-600 bg-sky-500 text-white shadow-[2px_2px_0px_0px_rgba(15,23,42,0.9)]"
                  : "border-stone-300 bg-stone-50 text-stone-700 hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
              }`}
            >
              <Send className="h-4 w-4" />
              <span>Pesawat Kertas (5 g)</span>
            </button>

            {/* Object 3: Bola Sepak */}
            <button
              type="button"
              onClick={() => handleSelectObject("soccer")}
              disabled={phase === "flying"}
              className={`inline-flex items-center gap-2 rounded-xl border-2 px-3.5 py-2 text-xs font-bold transition-all ${
                selectedObj === "soccer"
                  ? "border-emerald-600 bg-emerald-500 text-white shadow-[2px_2px_0px_0px_rgba(15,23,42,0.9)]"
                  : "border-stone-300 bg-stone-50 text-stone-700 hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
              }`}
            >
              <Sparkles className="h-4 w-4" />
              <span>Bola Sepak (0.43 kg)</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleLaunchButton}
              disabled={phase === "flying"}
              className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2 text-xs sm:text-sm font-black text-white shadow-[2px_2px_0px_0px_rgba(15,23,42,0.9)] transition-all hover:bg-orange-500 active:scale-[0.98] disabled:opacity-50"
            >
              <Zap className="h-4 w-4" />
              <span>Lepaskan Ketapel</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 rounded-xl border-2 border-stone-300 bg-stone-50 px-3 py-2 text-xs font-bold text-stone-700 shadow-xs transition-all hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
              title="Reset simulasi ke kondisi awal"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Parameter Sliders Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
            min={OBJECT_SPECS[selectedObj].minMass}
            max={OBJECT_SPECS[selectedObj].maxMass}
            step={selectedObj === "plane" ? 0.001 : 0.05}
            value={currentMass}
            onChange={(e) => handleMassChange(Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-stone-200 accent-blue-600 dark:bg-stone-700"
            aria-label="Pengaturan massa objek proyektil"
          />
          <span className="text-[10px] text-muted-foreground">
            {OBJECT_SPECS[selectedObj].description}
          </span>
        </div>

        {/* Slider 2: Tarikan Karet (Regangan) */}
        <div className="flex flex-col gap-1.5 rounded-2xl border border-stone-200 bg-stone-50/70 p-3.5 dark:border-stone-800 dark:bg-stone-800/50">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-stone-700 dark:text-stone-300 flex items-center gap-1">
              <span>Tarikan Karet</span>
              <strong className="text-orange-600">(<RenderFormula formula="x" />)</strong>
            </span>
            <span className="rounded-md border border-stone-300 bg-white px-2 py-0.5 font-mono text-xs font-black text-stone-900 dark:border-stone-700 dark:bg-stone-900 dark:text-white">
              {pullSlider}% ({((pullSlider / 100) * 0.75).toFixed(2)} m)
            </span>
          </div>
          <input
            id={pullSliderId}
            type="range"
            min={0}
            max={100}
            value={pullSlider}
            onChange={(e) => handlePullSliderChange(Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-stone-200 accent-orange-600 dark:bg-stone-700"
            aria-label="Tarikan elastis karet ketapel"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>F = {telemetry.elasticForceN.toFixed(0)} N</span>
            <span>E = {telemetry.elasticEnergyJ.toFixed(1)} J</span>
          </div>
        </div>

        {/* Slider 3: Sudut Elevasi */}
        <div className="flex flex-col gap-1.5 rounded-2xl border border-stone-200 bg-stone-50/70 p-3.5 dark:border-stone-800 dark:bg-stone-800/50">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-stone-700 dark:text-stone-300 flex items-center gap-1">
              <span>Sudut Luncur</span>
              <strong className="text-purple-600">(<RenderFormula formula="\theta" />)</strong>
            </span>
            <span className="rounded-md border border-stone-300 bg-white px-2 py-0.5 font-mono text-xs font-black text-stone-900 dark:border-stone-700 dark:bg-stone-900 dark:text-white">
              {angleSlider}°
            </span>
          </div>
          <input
            id={angleSliderId}
            type="range"
            min={5}
            max={85}
            value={angleSlider}
            onChange={(e) => handleAngleChange(Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-stone-200 accent-purple-600 dark:bg-stone-700"
            aria-label="Sudut elevasi peluncuran"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>5° (Rendah)</span>
            <span>45° (Maksimal)</span>
            <span>85° (Tinggi)</span>
          </div>
        </div>

        {/* Slider 3: Percepatan Gravitasi */}
        <div className="flex flex-col gap-1.5 rounded-2xl border border-stone-200 bg-stone-50/70 p-3.5 dark:border-stone-800 dark:bg-stone-800/50">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-stone-700 dark:text-stone-300 flex items-center gap-1">
              <span>Gravitasi</span>
              <strong className="text-emerald-600">(<RenderFormula formula="g" />)</strong>
            </span>
            <span className="rounded-md border border-stone-300 bg-white px-2 py-0.5 font-mono text-xs font-black text-stone-900 dark:border-stone-700 dark:bg-stone-900 dark:text-white">
              {gravityVal.toFixed(2)} m/s²
            </span>
          </div>
          <input
            id={gravitySliderId}
            type="range"
            min={1.62}
            max={24.79}
            step={0.1}
            value={gravityVal}
            onChange={(e) => handleGravityChange(Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-stone-200 accent-emerald-600 dark:bg-stone-700"
            aria-label="Percepatan gravitasi"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>Bulan (1.62)</span>
            <span>Bumi (9.81)</span>
            <span>Jupiter (24.79)</span>
          </div>
        </div>
      </div>

      {/* Real-time Telemetry Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <StatCard
          label="Kecepatan Awal"
          formula="v_0"
          value={`${telemetry.v0.toFixed(1)} m/s`}
        />
        <StatCard
          label="Sudut Luncur"
          formula="\theta"
          value={`${telemetry.angleDeg.toFixed(0)}°`}
        />
        <StatCard
          label="Tinggi Maksimum"
          formula="h_{\max}"
          value={`${telemetry.maxHeight.toFixed(1)} m`}
        />
        <StatCard
          label="Jarak Jangkauan"
          formula="R"
          value={`${telemetry.range > 0 ? telemetry.range.toFixed(1) : telemetry.currentDistance.toFixed(1)} m`}
        />
        <StatCard
          label="Target Kardus"
          formula="\text{Hit}"
          value={`${telemetry.boxesFallen}/6 Roboh`}
        />
      </div>

      {/* KaTeX Live Trajectory Formula Ribbon */}
      <div className="flex flex-col gap-2 rounded-2xl border border-stone-200 bg-[#FAF9F5] p-3.5 text-xs dark:border-stone-800 dark:bg-[#121316]">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-700 dark:text-stone-300">Model Persamaan Lintasan Parabola:</span>
            <div className="font-bold text-blue-700 dark:text-blue-400">
              <RenderFormula formula="y(x) = x \tan(\theta) - \frac{g x^2}{2 v_0^2 \cos^2(\theta)}" />
            </div>
          </div>
          <div className="font-bold text-amber-700 dark:text-amber-400">
            <RenderFormula formula="E_{\text{el}} = \frac{1}{2} k x^2 \Longrightarrow v_0 = \sqrt{\frac{2 \eta E_{\text{el}}}{m}}" />
          </div>
        </div>
      </div>

      {/* Accessible Pedagogical Notes */}
      <div className="rounded-xl border border-border/80 bg-muted/30 p-3.5 text-xs text-muted-foreground flex flex-col gap-2">
        <div className="flex items-center gap-1.5 font-semibold text-foreground">
          <Info className="h-4 w-4 text-blue-500" />
          <span>Konsep Fisika & Asumsi Model Edukasi:</span>
        </div>
        <p className="leading-relaxed">
          <strong>Hukum Hooke & Kekekalan Energi:</strong> Regangan karet sejauh <strong className="text-foreground">x</strong> menyimpan energi potensial elastis <strong className="text-foreground">E = ½ k x²</strong>. Saat karet dilepaskan, efisiensi transfer energi mekanik <strong className="text-foreground">η ≈ 82%</strong> dikonversi menjadi energi kinetik benda. Oleh karena itu, benda berbobot ringan (pesawat kertas) memiliki kecepatan awal jauh lebih tinggi dibanding batu untuk tarikan yang sama.
        </p>
        <p className="leading-relaxed">
          <strong>Tumbukan Momentum:</strong> Efek benturan pada tumpukan kardus ditentukan oleh momentum linear <strong className="text-foreground">p = m · v</strong>. Meskipun pesawat kertas berkecepatan tinggi, massanya yang sangat kecil menghasilkan momentum rendah sehingga hanya menggoyang kardus, sedangkan batu menghasilkan impuls besar yang merobohkan susunan piramida kardus.
        </p>
      </div>
    </div>
  );
}

function StatCard({
  label,
  formula,
  value,
}: {
  label: string;
  formula: string;
  value: string;
}) {
  return (
    <div className="flex flex-col justify-between rounded-xl border border-stone-200 bg-stone-50/80 p-3 dark:border-stone-800 dark:bg-stone-800/60">
      <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
        <span className="truncate">{label}</span>
        <RenderFormula formula={formula} />
      </div>
      <dd className="mt-1 font-mono text-base font-black text-stone-900 dark:text-white">
        {value}
      </dd>
    </div>
  );
}