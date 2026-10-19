"use client";

import { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Atom, Sliders, Sparkles, CheckCircle2 } from "lucide-react";

export function HeroInteractivePreview() {
  const [speed, setSpeed] = useState(25);
  const [angle, setAngle] = useState(45);

  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 600], [0, 50]);

  // Physics calculation
  const g = 9.8;
  const rad = (angle * Math.PI) / 180;
  const maxRange = Number(((speed * speed * Math.sin(2 * rad)) / g).toFixed(1));
  const maxHeight = Number(((speed * speed * Math.sin(rad) * Math.sin(rad)) / (2 * g)).toFixed(1));

  // Generate SVG path for parabolic arc
  const width = 360;
  const height = 180;
  const scaleX = (width - 40) / 75;
  const scaleY = (height - 35) / 25;

  const points: string[] = [];
  const tTotal = (2 * speed * Math.sin(rad)) / g;
  const steps = 30;
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * tTotal;
    const x = speed * Math.cos(rad) * t;
    const y = speed * Math.sin(rad) * t - 0.5 * g * t * t;
    const px = 20 + Math.min(x, 75) * scaleX;
    const py = height - 20 - Math.min(Math.max(y, 0), 25) * scaleY;
    points.push(`${px.toFixed(1)},${py.toFixed(1)}`);
  }
  const pathD = points.length > 0 ? `M ${points.join(" L ")}` : "";

  return (
    <motion.div
      style={{ y: yParallax }}
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative mx-auto w-full max-w-lg"
    >
      {/* Decorative Neobrutalist background shadow layer */}
      <div className="absolute inset-0 translate-x-2.5 translate-y-2.5 rounded-3xl bg-stone-900 dark:bg-blue-600/30" />

      {/* Main EdTech Interactive Card */}
      <div className="relative rounded-3xl border-2 border-stone-900 bg-white p-5 shadow-sm dark:border-stone-100 dark:bg-stone-900 sm:p-6">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-3 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
              className="flex h-8.5 w-8.5 items-center justify-center rounded-lg bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300"
            >
              <Atom className="h-5 w-5" />
            </motion.div>
            <div>
              <div className="text-[11px] font-black uppercase tracking-wider text-sky-700 dark:text-sky-300">
                Simulasi Konsep Langsung
              </div>
              <div className="text-sm font-black text-stone-900 dark:text-white">
                Lintasan Gerak Parabola
              </div>
            </div>
          </div>

          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Canvas
          </span>
        </div>

        {/* Dynamic Canvas Simulation */}
        <div className="mt-3 overflow-hidden rounded-2xl border-2 border-stone-900/10 bg-[#0F172A] p-3 text-white dark:border-stone-800">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
            {/* Grid Lines */}
            <line x1="20" y1={height - 20} x2={width - 20} y2={height - 20} stroke="#334155" strokeWidth="1.5" />
            <line x1="20" y1="20" x2="20" y2={height - 20} stroke="#334155" strokeWidth="1.5" />

            {/* Target indicator */}
            <circle cx={Math.min(20 + maxRange * scaleX, width - 25)} cy={height - 20} r="5" fill="#F59E0B" />

            {/* Parabolic Trajectory Path */}
            {pathD && (
              <path
                d={pathD}
                fill="none"
                stroke="#38BDF8"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="4 2"
              />
            )}

            {/* Projectile Cannon */}
            <circle cx="20" cy={height - 20} r="6" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="1.5" />

            {/* Apex marker */}
            <circle
              cx={20 + (maxRange / 2) * scaleX}
              cy={Math.max(height - 20 - maxHeight * scaleY, 25)}
              r="4"
              fill="#10B981"
            />
          </svg>

          {/* Real-time Math Output */}
          <div className="mt-2 flex items-center justify-between border-t border-slate-800/80 pt-2 text-[11.5px] font-mono">
            <div className="flex items-center gap-3">
              <span className="text-sky-300">
                Jarak: <strong className="text-white">{maxRange}m</strong>
              </span>
              <span className="text-emerald-300">
                Tinggi Maks: <strong className="text-white">{maxHeight}m</strong>
              </span>
            </div>
            <span className="text-[10px] text-amber-400">g = 9.8 m/s²</span>
          </div>
        </div>

        {/* Live Variable Sliders with neobrutalist inputs */}
        <div className="mt-4 space-y-3 rounded-xl border border-stone-200/80 bg-stone-50 p-3.5 dark:border-stone-800 dark:bg-stone-800/60">
          <div className="flex items-center justify-between">
            <label htmlFor="hero-speed-slider" className="flex items-center gap-1.5 text-xs font-bold text-stone-800 dark:text-stone-200">
              <Sliders className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              Kecepatan Awal (v₀)
            </label>
            <span className="rounded-md border border-stone-300 bg-white px-2 py-0.5 font-mono text-xs font-black text-blue-700 dark:border-stone-700 dark:bg-stone-900 dark:text-blue-300">
              {speed} m/s
            </span>
          </div>
          <input
            id="hero-speed-slider"
            type="range"
            min={10}
            max={35}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-stone-200 accent-blue-600 dark:bg-stone-700"
            aria-label="Kecepatan awal peluru"
          />

          <div className="flex items-center justify-between pt-1">
            <label htmlFor="hero-angle-slider" className="flex items-center gap-1.5 text-xs font-bold text-stone-800 dark:text-stone-200">
              <Sparkles className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
              Sudut Elevasi (θ)
            </label>
            <span className="rounded-md border border-stone-300 bg-white px-2 py-0.5 font-mono text-xs font-black text-amber-700 dark:border-stone-700 dark:bg-stone-900 dark:text-amber-300">
              {angle}°
            </span>
          </div>
          <input
            id="hero-angle-slider"
            type="range"
            min={15}
            max={75}
            value={angle}
            onChange={(e) => setAngle(Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-stone-200 accent-amber-600 dark:bg-stone-700"
            aria-label="Sudut elevasi peluru"
          />
        </div>

        {/* Floating Badge Proof: Soft Neobrutalism badge */}
        <div className="mt-3 flex items-center justify-between text-xs text-stone-600 dark:text-stone-400">
          <div className="flex items-center gap-1 font-semibold text-stone-800 dark:text-stone-200">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            <span>Kalkulasi rumus instan tanpa refresh</span>
          </div>
          <span className="font-mono text-[11px] text-blue-600 dark:text-blue-400">
            y = v₀·sin(θ)·t - ½gt²
          </span>
        </div>
      </div>
    </motion.div>
  );
}
