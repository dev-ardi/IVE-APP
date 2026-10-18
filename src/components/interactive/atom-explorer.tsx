"use client";

import { useMemo, useState } from "react";

interface Props {
  config?: Record<string, unknown>;
}

const ELEMENTS: Record<string, { protons: number; neutrons: number; electrons: number; symbol: string }> = {
  hydrogen: { protons: 1, neutrons: 0, electrons: 1, symbol: "H" },
  carbon: { protons: 6, neutrons: 6, electrons: 6, symbol: "C" },
  oxygen: { protons: 8, neutrons: 8, electrons: 8, symbol: "O" },
  sodium: { protons: 11, neutrons: 12, electrons: 11, symbol: "Na" },
};

/**
 * Atom Explorer (atom-explorer, §10).
 * Choose an element to see its nucleus (protons+neutrons) and orbiting electrons.
 */
export default function AtomExplorer({ config = {} }: Props) {
  const cfg = config as { element?: string };
  const defaultElem = ELEMENTS[cfg.element ?? "carbon"] ? (cfg.element as string) : "carbon";
  const [element, setElement] = useState(defaultElem);
  const el = ELEMENTS[element];

  const shells = useMemo(() => {
    // Simple electron shell distribution (max 2, 8, 8...).
    let remaining = el.electrons;
    const out: number[] = [];
    const caps = [2, 8, 8, 18, 32];
    let i = 0;
    while (remaining > 0 && i < caps.length) {
      const take = Math.min(caps[i], remaining);
      out.push(take);
      remaining -= take;
      i++;
    }
    return out;
  }, [el]);

  return (
    <div className="rounded-xl border border-border p-4">
      <div className="mb-3 flex flex-wrap gap-2">
        {Object.entries(ELEMENTS).map(([key, e]) => (
          <button
            key={key}
            type="button"
            onClick={() => setElement(key)}
            className={`rounded-full border px-3 py-1 text-xs capitalize transition ${
              element === key
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border hover:bg-muted"
            }`}
          >
            {key} (<span className="font-mono">{e.symbol}</span>)
          </button>
        ))}
      </div>

      <svg viewBox="0 0 260 260" className="mx-auto h-64 w-64" role="img" aria-label={`Model atom ${element}`}>
        <circle cx="130" cy="130" r="34" fill="oklch(0.7 0.15 30 / 0.35)" stroke="oklch(0.5 0.15 30)" />
        <text x="130" y="135" textAnchor="middle" fontSize="16" fontWeight="bold">
          {el.symbol}
        </text>

        {shells.map((count, si) => {
          const shellR = 44 + si * 42;
          return (
            <g key={si}>
              <circle cx="130" cy="130" r={shellR} fill="none" stroke="var(--border)" strokeDasharray="4 3" />
              {Array.from({ length: count }).map((_, ci) => {
                const a = (ci / Math.max(count, 1)) * Math.PI * 2;
                const ex = 130 + shellR * Math.cos(a);
                const ey = 130 + shellR * Math.sin(a);
                return <circle key={ci} cx={ex} cy={ey} r="5" fill="oklch(0.6 0.2 250)" />;
              })}
            </g>
          );
        })}
      </svg>

      <dl className="mt-3 grid grid-cols-3 gap-2 text-center text-sm">
        <Stat label="Proton" value={el.protons} />
        <Stat label="Neutron" value={el.neutrons} />
        <Stat label="Elektron" value={el.electrons} />
      </dl>
      <p className="mt-2 text-center text-xs text-muted-foreground">
        Proton &amp; neutron berada di inti atom; elektron bergerak pada kulit atom.
      </p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-muted/40 px-3 py-2">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-lg font-semibold">{value}</dd>
    </div>
  );
}