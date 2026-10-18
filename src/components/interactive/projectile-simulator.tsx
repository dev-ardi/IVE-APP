"use client";

import { useEffect, useMemo, useRef, useState } from "react";

interface Props {
  config?: Record<string, unknown>;
}

/**
 * Projectile Simulator (IVE_TAD_Phase_1.md §10, §58 projectile-simulator).
 * Canvas-based; adjusts initial speed and angle to show the parabolic trajectory.
 */
export default function ProjectileSimulator({ config = {} }: Props) {
  const gravity = Number(config.gravity ?? 9.8);
  const [speed, setSpeed] = useState(Number(config.initialSpeed ?? 20));
  const [angle, setAngle] = useState(Number(config.angle ?? 45));
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

  // Draw on state change using a simple effect via requestAnimationFrame.
  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = 192;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    const pad = 24;
    const groundY = h - pad;
    const rad = (angle * Math.PI) / 180;
    const maxRange = (speed * speed) / gravity;
    const maxH = (speed * Math.sin(rad)) ** 2 / (2 * gravity);
    const pxScale = (w - pad * 2) / Math.max(maxRange, 1);
    const pyScale = (h - pad * 2) / Math.max(maxH, 1);

    // ground
    ctx.strokeStyle = "oklch(0.55 0 0)";
    ctx.beginPath();
    ctx.moveTo(pad, groundY);
    ctx.lineTo(w - pad, groundY);
    ctx.stroke();

    // trajectory
    ctx.strokeStyle = "oklch(0.6 0.15 250)";
    ctx.lineWidth = 2;
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

    // projectile (at peak)
    const tMid = results.timeOfFlight / 2;
    const px = pad + results.vx * tMid * pxScale;
    const py = groundY - results.maxHeight * pyScale;
    ctx.fillStyle = "oklch(0.6 0.2 30)";
    ctx.beginPath();
    ctx.arc(px, py, 7, 0, Math.PI * 2);
    ctx.fill();
  };

  useEffect(() => {
    requestAnimationFrame(() => draw());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results.vx, results.vy, results.maxHeight, results.timeOfFlight, angle, speed]);

  return (
    <div className="rounded-xl border border-border p-4">
      <div className="mb-3 flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-muted-foreground">Kecepatan awal: <strong>{speed}</strong> m/s</span>
          <input
            type="range"
            min={5}
            max={50}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="accent-primary"
            aria-label="Kecepatan awal"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-muted-foreground">Sudut elevasi: <strong>{angle}</strong>°</span>
          <input
            type="range"
            min={5}
            max={85}
            value={angle}
            onChange={(e) => setAngle(Number(e.target.value))}
            className="accent-primary"
            aria-label="Sudut elevasi"
          />
        </label>
      </div>

      <canvas
        ref={(el) => {
          canvasRef.current = el;
        }}
        className="h-48 w-full rounded-lg bg-muted/20"
        style={{ height: 192 }}
      />

      <dl className="mt-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
        <Stat label="Tinggi maks" value={`${results.maxHeight.toFixed(1)} m`} />
        <Stat label="Jarak terjauh" value={`${results.range.toFixed(1)} m`} />
        <Stat label="Waktu terbang" value={`${results.timeOfFlight.toFixed(2)} s`} />
        <Stat label="v_x" value={`${results.vx.toFixed(1)} m/s`} />
      </dl>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted/40 px-3 py-2">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="font-mono text-sm font-semibold">{value}</dd>
    </div>
  );
}