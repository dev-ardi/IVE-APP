"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Maximize2, Minimize2, Sparkles, Target, RotateCcw } from "lucide-react";
import { RenderFormula } from "@/modules/content/render-formula";
import { PredictChallengeModal } from "@/components/interactive/predict-challenge-modal";

interface Props {
  config?: Record<string, unknown>;
}

const PREDICT_OPTIONS = [
  {
    id: "A",
    text: "Jarak tembak bertambah jauh karena peluru ditembakkan lebih tinggi.",
    isCorrect: false,
    explanation: "Meskipun peluru melambung lebih tinggi, sudut di atas 45° menghabiskan lebih banyak energi pada sumbu vertikal sehingga jangkauan horizontalnya justru memendek.",
  },
  {
    id: "B",
    text: "Jarak tembak memendek karena sudut di atas 45° mengurangi kecepatan horizontal (v_x).",
    formula: "R = \\frac{v_0^2 \\sin(2\\theta)}{g}",
    isCorrect: true,
    explanation: "Tepat sekali! Fungsi sin(2θ) mencapai titik puncak pada 45° (sin 90° = 1). Ketika sudut dinaikkan ke 65°, 2θ = 130° yang mana sin(130°) < 1, sehingga jarak jangkauan (R) memendek.",
  },
  {
    id: "C",
    text: "Jarak tembak tetap sama persis selama kecepatan awal (v_0) tidak diubah.",
    isCorrect: false,
    explanation: "Sudut elevasi menentukan pembagian vektor kecepatan horizontal (v_x = v_0 cos θ) dan vertikal (v_y = v_0 sin θ), sehingga sangat mempengaruhi jangkauan akhir.",
  },
];

export default function ProjectileSimulator({ config = {} }: Props) {
  const gravity = Number(config.gravity ?? 9.8);
  const [speed, setSpeed] = useState(Number(config.initialSpeed ?? 20));
  const [angle, setAngle] = useState(Number(config.angle ?? 45));
  const [isProjectorMode, setIsProjectorMode] = useState<boolean>(false);
  const [showChallenge, setShowChallenge] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const results = useMemo(() => {
    const rad = (angle * Math.PI) / 180;
    const vx = speed * Math.cos(rad);
    const vy = speed * Math.sin(rad);
    const maxHeight = (vy * vy) / (2 * gravity);
    const timeOfFlight = (2 * vy) / gravity;
    const range = vx * timeOfFlight;
    return { vx, vy, maxHeight, timeOfFlight, range };
  }, [speed, angle, gravity]);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = isProjectorMode ? 320 : 200;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    const pad = 28;
    const groundY = h - pad;
    const rad = (angle * Math.PI) / 180;
    const maxRange = (speed * speed) / gravity;
    const maxH = (speed * Math.sin(rad)) ** 2 / (2 * gravity);
    const pxScale = (w - pad * 2) / Math.max(maxRange, 1);
    const pyScale = (h - pad * 2) / Math.max(maxH, 1);

    // Ground line
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(pad, groundY);
    ctx.lineTo(w - pad, groundY);
    ctx.stroke();

    // Distance tick markers
    ctx.fillStyle = "#64748b";
    ctx.font = "10px monospace";
    ctx.fillText("0 m", pad - 6, groundY + 16);
    ctx.fillText(`${results.range.toFixed(0)} m`, Math.min(w - pad - 20, pad + results.range * pxScale - 10), groundY + 16);

    // Trajectory arc
    ctx.strokeStyle = "#2563EB";
    ctx.lineWidth = 3;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    const tStep = results.timeOfFlight / 120;
    for (let t = 0; t <= results.timeOfFlight; t += tStep) {
      const x = results.vx * t;
      const y = results.vy * t - 0.5 * gravity * t * t;
      const cx = pad + x * pxScale;
      const cy = groundY - y * pyScale;
      if (t === 0) ctx.moveTo(cx, cy);
      else ctx.lineTo(cx, cy);
    }
    ctx.stroke();
    ctx.setLineDash([]); // Reset line dash

    // Peak marker
    const tMid = results.timeOfFlight / 2;
    const pxPeak = pad + results.vx * tMid * pxScale;
    const pyPeak = groundY - results.maxHeight * pyScale;

    // Peak dashed vertical line
    ctx.strokeStyle = "rgba(220, 38, 38, 0.4)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(pxPeak, groundY);
    ctx.lineTo(pxPeak, pyPeak);
    ctx.stroke();

    // Projectile ball at peak
    ctx.fillStyle = "#DC2626";
    ctx.beginPath();
    ctx.arc(pxPeak, pyPeak, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Cannon / Launch point
    ctx.fillStyle = "#1E293B";
    ctx.beginPath();
    ctx.arc(pad, groundY, 9, 0, Math.PI * 2);
    ctx.fill();
  };

  useEffect(() => {
    requestAnimationFrame(() => draw());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results, angle, speed, isProjectorMode]);

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border-2 border-stone-900 bg-white p-6 shadow-[4px_4px_0px_0px_rgba(24,24,27,0.9)] transition-all dark:border-white dark:bg-stone-900 dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.7)] ${
        isProjectorMode ? "fixed inset-4 z-50 overflow-y-auto bg-white p-8 dark:bg-stone-950" : ""
      }`}
    >
      {/* Header bar with Projector & Predict Challenge triggers */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-stone-900/10 pb-4 dark:border-stone-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-blue-400/40 bg-blue-100 px-2.5 py-0.5 text-[10px] font-black uppercase text-blue-900 dark:bg-blue-950 dark:text-blue-200">
              FISIKA MEKANIKA
            </span>
            <span className="text-xs font-bold text-stone-500">Live Projectile Simulator</span>
          </div>
          <h3 className="mt-1 text-xl font-black tracking-tight text-stone-900 dark:text-white">
            Simulasi Gerak Parabola Dinamis
          </h3>
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
            <span>{showChallenge ? "Tutup Tantangan" : "🎯 Tantangan Prediksi Dulu"}</span>
          </button>

          {/* Projector Mode Toggle */}
          <button
            type="button"
            onClick={() => setIsProjectorMode(!isProjectorMode)}
            title="Mode Presentasi Layar Penuh / Proyektor Kelas"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border-2 border-stone-900 bg-stone-100 text-stone-900 shadow-2xs hover:bg-stone-200 dark:border-white dark:bg-stone-800 dark:text-white"
          >
            {isProjectorMode ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Predict Challenge Component (Expandable) */}
      {showChallenge && (
        <div className="my-4">
          <PredictChallengeModal
            title="Tantangan Prediksi Dulu: Uji Hipotesis Anda"
            question="Jika Anda menaikkan sudut peluncuran dari 45° ke 65° dengan kecepatan tetap (20 m/s), apa yang akan terjadi pada jarak jatuh horizontal (R)?"
            formula="R = \frac{v_0^2 \sin(2\theta)}{g}"
            options={PREDICT_OPTIONS}
            onApplyHypothesis={() => {
              setAngle(65);
              setSpeed(20);
            }}
          />
        </div>
      )}

      {/* KaTeX Live Trajectory Formula Ribbon */}
      <div className="my-4 flex items-center justify-between rounded-2xl border border-stone-200 bg-[#FAF9F5] p-3 text-xs dark:border-stone-800 dark:bg-[#121316]">
        <div className="flex items-center gap-2">
          <span className="font-bold text-stone-600 dark:text-stone-400">Persamaan Lintasan:</span>
          <div className="font-bold text-blue-700 dark:text-blue-400">
            <RenderFormula formula="y = x \tan(\theta) - \frac{g x^2}{2 v_0^2 \cos^2(\theta)}" />
          </div>
        </div>
        <span className="hidden sm:inline-block font-mono text-[11px] text-stone-500">
          g = {gravity} m/s²
        </span>
      </div>

      {/* Variable Sliders */}
      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5 rounded-2xl border border-stone-200 bg-stone-50/70 p-3.5 dark:border-stone-800 dark:bg-stone-800/50">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-stone-700 dark:text-stone-300 flex items-center gap-1">
              <span>Kecepatan Awal</span>
              <strong className="text-blue-600">(<RenderFormula formula="v_0" />)</strong>
            </span>
            <span className="rounded-md border border-stone-300 bg-white px-2 py-0.5 font-mono text-xs font-black text-stone-900 dark:border-stone-700 dark:bg-stone-900 dark:text-white">
              {speed} m/s
            </span>
          </div>
          <input
            type="range"
            min={5}
            max={50}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-stone-200 accent-blue-600 dark:bg-stone-700"
            aria-label="Kecepatan awal"
          />
        </div>

        <div className="flex flex-col gap-1.5 rounded-2xl border border-stone-200 bg-stone-50/70 p-3.5 dark:border-stone-800 dark:bg-stone-800/50">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-stone-700 dark:text-stone-300 flex items-center gap-1">
              <span>Sudut Elevasi</span>
              <strong className="text-blue-600">(<RenderFormula formula="\theta" />)</strong>
            </span>
            <span className="rounded-md border border-stone-300 bg-white px-2 py-0.5 font-mono text-xs font-black text-stone-900 dark:border-stone-700 dark:bg-stone-900 dark:text-white">
              {angle}°
            </span>
          </div>
          <input
            type="range"
            min={5}
            max={85}
            value={angle}
            onChange={(e) => setAngle(Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-stone-200 accent-blue-600 dark:bg-stone-700"
            aria-label="Sudut elevasi"
          />
        </div>
      </div>

      {/* Canvas */}
      <div className="relative overflow-hidden rounded-2xl border-2 border-stone-900/10 bg-[#FAF9F5] dark:border-stone-800 dark:bg-[#121316]">
        <canvas
          ref={(el) => {
            canvasRef.current = el;
          }}
          className="w-full"
          style={{ height: isProjectorMode ? 320 : 200 }}
        />
      </div>

      {/* Real-time Results with KaTeX notation */}
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          label="Tinggi Maksimum"
          formula="h_{\max}"
          value={`${results.maxHeight.toFixed(1)} m`}
        />
        <StatCard
          label="Jarak Terjauh"
          formula="R"
          value={`${results.range.toFixed(1)} m`}
        />
        <StatCard
          label="Waktu Terbang"
          formula="t_{\text{terbang}}"
          value={`${results.timeOfFlight.toFixed(2)} s`}
        />
        <StatCard
          label="Kecepatan Horizontal"
          formula="v_x"
          value={`${results.vx.toFixed(1)} m/s`}
        />
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