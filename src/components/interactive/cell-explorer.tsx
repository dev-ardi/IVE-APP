"use client";

import { useState } from "react";

interface Props {
  config?: Record<string, unknown>;
}

interface Organelle {
  key: string;
  label: string;
  description: string;
  cx: number;
  cy: number;
}

const ORGANELLES: Organelle[] = [
  { key: "nucleus", label: "Nukleus", description: "Pusat kendali sel; menyimpan DNA dan mengatur aktivitas sel.", cx: 120, cy: 100 },
  { key: "mitochondria", label: "Mitokondria", description: "Penghasil energi (ATP) melalui respirasi sel.", cx: 185, cy: 165 },
  { key: "ribosome", label: "Ribosom", description: "Tempat sintesis protein dari informasi genetik.", cx: 60, cy: 150 },
  { key: "membrane", label: "Membran Sel", description: "Pelindung sel dan pengatur keluar-masuk zat.", cx: 120, cy: 115 },
];

/**
 * Cell Explorer (cell-explorer, §10).
 * Click an organelle on the diagram to read its function.
 */
export default function CellExplorer({ config = {} }: Props) {
  const initial = String(config.initialOrganelle ?? "nucleus");
  const initialOrg = ORGANELLES.find((o) => o.key === initial) ?? ORGANELLES[0];
  const [selected, setSelected] = useState(initialOrg);

  return (
    <div className="rounded-xl border border-border p-4">
      <div className="flex flex-col items-center gap-4 md:flex-row">
        <svg viewBox="0 0 240 240" className="h-56 w-56" role="img" aria-label="Diagram sel hewan dengan organel yang dapat diklik">
          <ellipse
            cx="120"
            cy="115"
            rx="95"
            ry="85"
            fill="oklch(0.96 0.02 230 / 0.4)"
            stroke={selected.key === "membrane" ? "oklch(0.5 0.15 250)" : "var(--border)"}
            strokeWidth="2"
            className="cursor-pointer"
            role="button"
            tabIndex={0}
            aria-label="Membran Sel"
            onClick={() => setSelected(ORGANELLES[3])}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") setSelected(ORGANELLES[3]);
            }}
          />
          {ORGANELLES.filter((o) => o.key !== "membrane").map((o) => (
            <g
              key={o.key}
              role="button"
              tabIndex={0}
              aria-label={o.label}
              className="cursor-pointer focus:outline-none"
              onClick={() => setSelected(o)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setSelected(o);
              }}
            >
              <circle
                cx={o.cx}
                cy={o.cy}
                r={o.key === "nucleus" ? 26 : 16}
                fill={selected.key === o.key ? "oklch(0.6 0.15 250 / 0.5)" : "oklch(0.6 0.15 250 / 0.25)"}
                stroke="oklch(0.5 0.15 250)"
                strokeWidth="1.5"
              />
              <text x={o.cx} y={o.cy + 4} textAnchor="middle" fontSize="9" fill="var(--foreground)">
                {o.label}
              </text>
            </g>
          ))}
        </svg>

        <div className="w-full max-w-sm" aria-live="polite">
          <h4 className="text-lg font-semibold">{selected.label}</h4>
          <p className="mt-1 text-sm text-foreground/80">{selected.description}</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {ORGANELLES.map((o) => (
              <li key={o.key}>
                <button
                  type="button"
                  onClick={() => setSelected(o)}
                  className={`rounded-full border px-3 py-1 text-xs transition ${
                    selected.key === o.key
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border hover:bg-muted"
                  }`}
                >
                  {o.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}