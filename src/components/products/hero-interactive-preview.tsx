"use client";

import { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Atom, Sliders, Sparkles, CheckCircle2 } from "lucide-react";

export function HeroInteractivePreview() {
  const [speed, setSpeed] = useState(25);
  const [angle, setAngle] = useState(45);

  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 600], [0, 40]);

  // Physics calculation
  const g = 9.8;
  const rad = (angle * Math.PI) / 180;
  const maxRange = Number(((speed * speed * Math.sin(2 * rad)) / g).toFixed(1));
  const maxHeight = Number(
    ((speed * speed * Math.sin(rad) * Math.sin(rad)) / (2 * g)).toFixed(1)
  );

  // Generate SVG path for parabolic arc
  const svgW = 360;
  const svgH = 180;
  const scaleX = (svgW - 40) / 75;
  const scaleY = (svgH - 35) / 25;

  const points: string[] = [];
  const tTotal = (2 * speed * Math.sin(rad)) / g;
  const steps = 40;
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * tTotal;
    const x = speed * Math.cos(rad) * t;
    const y = speed * Math.sin(rad) * t - 0.5 * g * t * t;
    const px = 20 + Math.min(x, 75) * scaleX;
    const py = svgH - 20 - Math.min(Math.max(y, 0), 25) * scaleY;
    points.push(`${px.toFixed(1)},${py.toFixed(1)}`);
  }
  const pathD = points.length > 0 ? `M ${points.join(" L ")}` : "";
  const apexCx = 20 + (maxRange / 2) * scaleX;
  const apexCy = Math.max(svgH - 20 - maxHeight * scaleY, 25);
  const landCx = Math.min(20 + maxRange * scaleX, svgW - 25);

  return (
    // This component is already wrapped by HeroSimulatorAnim which handles entrance.
    // We only add the subtle scroll-parallax here.
    <motion.div
      style={{ y: yParallax }}
      className="relative mx-auto w-full max-w-[460px]"
    >
      {/* Neobrutalist drop-shadow layer */}
      <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-3xl bg-stone-900 dark:bg-blue-700/40" />

      {/* Main Card */}
      <div className="relative rounded-3xl border-2 border-stone-900 bg-white p-5 shadow-sm dark:border-stone-100 dark:bg-stone-900 sm:p-6">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-3 dark:border-stone-800">
          <div className="flex items-center gap-2.5">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-sky-200 bg-sky-100 text-sky-700 dark:border-sky-800 dark:bg-sky-950 dark:text-sky-300"
            >
              <Atom className="h-5 w-5" />
            </motion.div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-sky-700 dark:text-sky-300">
                Simulasi Konsep Langsung
              </div>
              <div className="text-sm font-black leading-tight text-stone-900 dark:text-white">
                Lintasan Gerak Parabola
              </div>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            Live Canvas
          </span>
        </div>

        {/* Dynamic SVG Canvas */}
        <div className="mt-3 overflow-hidden rounded-2xl border-2 border-stone-900/10 bg-[#0F172A] px-3 pt-3 pb-2 dark:border-stone-800">
          <svg viewBox={`0 0 ${svgW} ${svgH}`} className="h-auto w-full">
            {/* Grid lines */}
            <line x1="20" y1={svgH - 20} x2={svgW - 10} y2={svgH - 20} stroke="#1E293B" strokeWidth="1.5" />
            <line x1="20" y1="15" x2="20" y2={svgH - 20} stroke="#1E293B" strokeWidth="1.5" />

            {/* Subtle grid tick marks */}
            {[0.25, 0.5, 0.75].map((t) => (
              <line
                key={t}
                x1={20 + t * (svgW - 30)}
                y1={svgH - 20}
                x2={20 + t * (svgW - 30)}
                y2={svgH - 15}
                stroke="#334155"
                strokeWidth="1"
              />
            ))}

            {/* Landing target ring */}
            <circle cx={landCx} cy={svgH - 20} r="7" fill="none" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="2 2" />
            <circle cx={landCx} cy={svgH - 20} r="3" fill="#F59E0B" />

            {/* Parabolic trajectory */}
            {pathD && (
              <path
                d={pathD}
                fill="none"
                stroke="url(#trajectoryGrad)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            )}

            {/* Gradient definition */}
            <defs>
              <linearGradient id="trajectoryGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="100%" stopColor="#818CF8" />
              </linearGradient>
            </defs>

            {/* Cannon (launch point) */}
            <circle cx="20" cy={svgH - 20} r="7" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="2" />

            {/* Apex dot */}
            <circle cx={apexCx} cy={apexCy} r="4.5" fill="#10B981" stroke="#FFFFFF" strokeWidth="1.5" />

            {/* Apex label */}
            <text x={apexCx + 6} y={apexCy - 2} fill="#10B981" fontSize="9" fontFamily="monospace" fontWeight="bold">
              {maxHeight}m
            </text>
          </svg>

          {/* Real-time math output */}
          <div className="mt-1 flex items-center justify-between border-t border-slate-800 pt-2 pb-1 text-[11.5px] font-mono">
            <div className="flex items-center gap-4">
              <span className="text-sky-300">
                Jarak: <strong className="text-white">{maxRange}m</strong>
              </span>
              <span className="text-emerald-300">
                Maks: <strong className="text-white">{maxHeight}m</strong>
              </span>
            </div>
            <span className="text-[10px] text-amber-400/80">g = 9.8 m/s²</span>
          </div>
        </div>

        {/* Sliders */}
        <div className="mt-4 space-y-3.5 rounded-2xl border border-stone-200/80 bg-stone-50/80 p-4 dark:border-stone-800 dark:bg-stone-800/50">
          {/* Speed */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label
                htmlFor="hero-speed"
                className="flex items-center gap-1.5 text-xs font-bold text-stone-800 dark:text-stone-200"
              >
                <Sliders className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                Kecepatan Awal (v₀)
              </label>
              <span className="rounded-md border border-blue-200 bg-white px-2 py-0.5 font-mono text-xs font-black text-blue-700 dark:border-blue-800 dark:bg-stone-900 dark:text-blue-300">
                {speed} m/s
              </span>
            </div>
            <input
              id="hero-speed"
              type="range"
              min={10}
              max={35}
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-stone-200 accent-blue-600 dark:bg-stone-700"
              aria-label="Kecepatan awal"
            />
          </div>

          {/* Angle */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label
                htmlFor="hero-angle"
                className="flex items-center gap-1.5 text-xs font-bold text-stone-800 dark:text-stone-200"
              >
                <Sparkles className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                Sudut Elevasi (θ)
              </label>
              <span className="rounded-md border border-amber-200 bg-white px-2 py-0.5 font-mono text-xs font-black text-amber-700 dark:border-amber-800 dark:bg-stone-900 dark:text-amber-300">
                {angle}°
              </span>
            </div>
            <input
              id="hero-angle"
              type="range"
              min={15}
              max={75}
              value={angle}
              onChange={(e) => setAngle(Number(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-stone-200 accent-amber-500 dark:bg-stone-700"
              aria-label="Sudut elevasi"
            />
          </div>
        </div>

        {/* Footer proof */}
        <div className="mt-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 font-semibold text-stone-700 dark:text-stone-300">
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
            <span>Kalkulasi instan, tanpa refresh</span>
          </div>
          <span className="font-mono text-[11px] text-blue-600 dark:text-blue-400">
            y = v₀·sin(θ)·t − ½gt²
          </span>
        </div>
      </div>
    </motion.div>
  );
}
