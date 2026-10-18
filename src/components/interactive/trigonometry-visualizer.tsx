"use client";

import { useState } from "react";

interface Props {
  config?: Record<string, unknown>;
}

const degToRad = (d: number) => (d * Math.PI) / 180;

/**
 * Trigonometry Visualizer (trigonometry-visualizer, §10).
 * SVG unit-circle + right-triangle view; adjust the angle and see
 * sin/cos/tan values change live.
 */
export default function TrigonometryVisualizer({ config = {} }: Props) {
  const [angle, setAngle] = useState(Number(config.initialAngle ?? 45));
  const rad = degToRad(angle);
  const sin = Math.sin(rad);
  const cos = Math.cos(rad);

  const cx = 120;
  const cy = 120;
  const r = 100;
  const px = cx + cos * r;
  const py = cy - sin * r;

  return (
    <div className="rounded-xl border border-border p-4">
      <label className="mb-3 flex flex-col gap-1 text-sm">
        <span className="text-muted-foreground">
          Sudut: <strong>{angle}</strong>°
        </span>
        <input
          type="range"
          min={0}
          max={360}
          value={angle}
          onChange={(e) => setAngle(Number(e.target.value))}
          className="accent-primary"
          aria-label="Sudut trigonometri"
        />
      </label>

      <div className="flex flex-col items-center gap-4 md:flex-row">
        <svg viewBox="0 0 240 240" className="h-56 w-56" role="img" aria-label={`Sudut ${angle} derajat pada lingkaran satuan`}>
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--border)" />
          <line x1={cx} y1={cy} x2={cx + r} y2={cy} stroke="var(--border)" strokeDasharray="3 3" />
          <line x1={cx} y1={cy} x2={cx} y2={cy - r} stroke="var(--border)" strokeDasharray="3 3" />
          {/* radius line */}
          <line x1={cx} y1={cy} x2={px} y2={py} stroke="oklch(0.6 0.15 250)" strokeWidth="2" />
          {/* vertical (sin) */}
          <line x1={px} y1={cy} x2={px} y2={py} stroke="oklch(0.6 0.2 30)" strokeWidth="2" />
          {/* horizontal (cos) */}
          <line x1={cx} y1={cy} x2={px} y2={cy} stroke="oklch(0.6 0.2 120)" strokeWidth="2" />
          <circle cx={px} cy={py} r="5" fill="oklch(0.6 0.2 30)" />
          <text x={cx + 8} y={cy - 8} fontSize="10" fill="var(--muted-foreground)">
            θ={angle}°
          </text>
        </svg>

        <dl className="grid grid-cols-1 gap-2 text-sm">
          <Row label="sin θ" value={sin.toFixed(4)} />
          <Row label="cos θ" value={cos.toFixed(4)} />
          <Row label="tan θ" value={(Math.abs(cos) < 1e-6 ? "∞" : (sin / cos).toFixed(4))} />
        </dl>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg bg-muted/40 px-3 py-2">
      <dt className="font-mono text-muted-foreground">{label}</dt>
      <dd className="font-mono font-semibold">{value}</dd>
    </div>
  );
}