"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  config?: Record<string, unknown>;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  label: string;
  type: "neutron" | "fragment" | "uranium";
}

export default function NuclearFission({ config = {} }: Props) {
  const [controlRodDepth, setControlRodDepth] = useState<number>(
    Number(config.initialControlRods ?? 30)
  );
  const [fissionCount, setFissionCount] = useState<number>(0);
  const [energyReleasedMev, setEnergyReleasedMev] = useState<number>(0);
  const [statusText, setStatusText] = useState<string>("Siap. Klik 'Tembakkan Neutron' untuk memulai reaksi.");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const stateRef = useRef<{
    particles: Particle[];
    animId: number | null;
    isSplitting: boolean;
  }>({
    particles: [],
    animId: null,
    isSplitting: false,
  });

  const resetSimulation = () => {
    if (stateRef.current.animId) {
      cancelAnimationFrame(stateRef.current.animId);
    }
    stateRef.current.isSplitting = false;
    stateRef.current.particles = [
      {
        x: 280,
        y: 130,
        vx: 0,
        vy: 0,
        radius: 36,
        color: "#10b981", // Uranium 235
        label: "U-235",
        type: "uranium",
      },
    ];
    setStatusText("Inti Uranium-235 stabil di posisi target. Siap menerima neutron termal.");
    draw();
  };

  const fireNeutron = () => {
    // Add incoming neutron moving right
    stateRef.current.particles = stateRef.current.particles.filter(p => p.type !== "neutron");
    stateRef.current.particles.push({
      x: 30,
      y: 130,
      vx: 3.5,
      vy: 0,
      radius: 6,
      color: "#38bdf8", // Sky blue neutron
      label: "n",
      type: "neutron",
    });
    setStatusText("Neutron termal ditembakkan menuju inti Uranium-235...");
    animate();
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = canvas.clientWidth;
    const h = 260;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, w, h);

    // Draw control rod guide zone
    const rodX = w * 0.72;
    const rodH = (controlRodDepth / 100) * 160;
    ctx.fillStyle = "rgba(100, 116, 139, 0.2)";
    ctx.fillRect(rodX - 14, 10, 28, 160);
    // Control rod itself (Cadmium / Boron)
    ctx.fillStyle = "rgba(71, 85, 105, 0.85)";
    ctx.fillRect(rodX - 10, 10, 20, rodH);
    ctx.fillStyle = "#94a3b8";
    ctx.font = "10px sans-serif";
    ctx.fillText("Batang Kendali", rodX - 32, 185);

    // Draw particles
    for (const p of stateRef.current.particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
      ctx.stroke();

      // Label
      ctx.fillStyle = "#ffffff";
      ctx.font = p.radius > 20 ? "bold 12px sans-serif" : "bold 9px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(p.label, p.x, p.y);
    }
  };

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.clientWidth;
    const h = 260;

    const particles = stateRef.current.particles;
    const u = particles.find((p) => p.type === "uranium");

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      // Check collision between neutron and Uranium
      if (p.type === "neutron" && u && !stateRef.current.isSplitting) {
        const dx = p.x - u.x;
        const dy = p.y - u.y;
        const dist = Math.hypot(dx, dy);

        if (dist < u.radius + p.radius) {
          // Trigger Fission!
          stateRef.current.isSplitting = true;
          setStatusText("Tumbukan terjadi! Inti U-235 menyerap neutron menjadi U-236*, lalu membelah (fisi)!");
          setFissionCount((prev) => prev + 1);
          setEnergyReleasedMev((prev) => prev + 202.5);

          // Remove original neutron & uranium
          stateRef.current.particles = [
            // Fragment 1: Barium-141
            {
              x: u.x,
              y: u.y - 10,
              vx: 1.6,
              vy: -1.8,
              radius: 22,
              color: "#f59e0b",
              label: "Ba-141",
              type: "fragment",
            },
            // Fragment 2: Kripton-92
            {
              x: u.x,
              y: u.y + 10,
              vx: 1.4,
              vy: 2.2,
              radius: 18,
              color: "#8b5cf6",
              label: "Kr-92",
              type: "fragment",
            },
            // 3 free fast neutrons released
            {
              x: u.x + 15,
              y: u.y - 15,
              vx: 3.2,
              vy: -0.8,
              radius: 5,
              color: "#38bdf8",
              label: "n",
              type: "neutron",
            },
            {
              x: u.x + 20,
              y: u.y,
              vx: 4.0,
              vy: 0.4,
              radius: 5,
              color: "#38bdf8",
              label: "n",
              type: "neutron",
            },
            {
              x: u.x + 15,
              y: u.y + 15,
              vx: 3.0,
              vy: 1.5,
              radius: 5,
              color: "#38bdf8",
              label: "n",
              type: "neutron",
            },
          ];
          break;
        }
      }

      // Check if fast neutrons are absorbed by control rods
      const rodX = w * 0.72;
      const rodH = (controlRodDepth / 100) * 160;
      if (
        p.type === "neutron" &&
        p.x >= rodX - 10 &&
        p.x <= rodX + 10 &&
        p.y >= 10 &&
        p.y <= 10 + rodH
      ) {
        p.vx = 0;
        p.vy = 0;
        p.color = "#64748b";
        p.label = "absorb";
      }
    }

    draw();

    // Check if particles still active within bounds
    const active = particles.some(
      (p) => p.x > 0 && p.x < w + 50 && p.y > 0 && p.y < h + 50 && (p.vx !== 0 || p.vy !== 0)
    );

    if (active) {
      stateRef.current.animId = requestAnimationFrame(animate);
    } else {
      setStatusText(
        "Reaksi pembelahan selesai. Fragmen fisi melepaskan energi kinetik dan radiasi, sedangkan neutron bebas diserap/bergerak keluar."
      );
    }
  };

  useEffect(() => {
    stateRef.current.particles = [
      {
        x: 280,
        y: 130,
        vx: 0,
        vy: 0,
        radius: 36,
        color: "#10b981",
        label: "U-235",
        type: "uranium",
      },
    ];
    draw();

    const currentRef = stateRef.current;
    return () => {
      if (currentRef.animId) cancelAnimationFrame(currentRef.animId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
      <div className="mb-5 flex flex-col gap-1 border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/10 text-base text-violet-600 dark:text-violet-400">
            ⚛️
          </span>
          <h3 className="text-lg font-semibold tracking-tight text-foreground">
            Simulasi Reaksi Fisi Nuklir (U-235)
          </h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Eksplorasi proses pemecahan inti atom Uranium ketika menangkap neutron, pelepasan energi kinetik, dan pengendalian reaksi melalui batang kendali.
        </p>
      </div>

      {/* Canvas view */}
      <div className="relative overflow-hidden rounded-xl border border-border bg-slate-950">
        <canvas ref={canvasRef} className="h-64 w-full" />
        <div className="absolute bottom-2 left-3 text-[11px] text-slate-400">
          {statusText}
        </div>
      </div>

      {/* Action buttons & controls */}
      <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-12">
        <div className="flex flex-col gap-3 md:col-span-6">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={fireNeutron}
              className="flex-1 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-violet-700 active:scale-95"
            >
              🚀 Tembakkan Neutron
            </button>
            <button
              type="button"
              onClick={resetSimulation}
              className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium transition hover:bg-muted"
            >
              Reset
            </button>
          </div>

          <div className="flex flex-col gap-1.5 pt-2">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-foreground">Kedalaman Batang Kendali:</span>
              <span className="font-mono text-primary">{controlRodDepth}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={controlRodDepth}
              onChange={(e) => {
                setControlRodDepth(Number(e.target.value));
                draw();
              }}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-muted accent-violet-600"
            />
            <span className="text-[11px] text-muted-foreground">
              Batang kendali (boron/kadmium) menyerap kelebihan neutron bebas untuk mencegah reaksi tak terkendali.
            </span>
          </div>
        </div>

        {/* Energy Telemetry Dashboard */}
        <div className="flex flex-col justify-between rounded-xl border border-border bg-muted/30 p-4 md:col-span-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Telemetri Reaksi Nuklir
          </span>
          <div className="mt-2 grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-background p-2.5 border border-border">
              <span className="text-[11px] text-muted-foreground">Peristiwa Fisi</span>
              <p className="text-xl font-bold text-foreground">{fissionCount} kali</p>
            </div>
            <div className="rounded-lg bg-background p-2.5 border border-border">
              <span className="text-[11px] text-muted-foreground">Total Energi Dilepas</span>
              <p className="text-xl font-bold text-violet-600 dark:text-violet-400">
                {energyReleasedMev.toFixed(1)} MeV
              </p>
            </div>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Setara dengan {(energyReleasedMev * 1.602e-13).toExponential(2)} Joule per inti.
          </p>
        </div>
      </div>

      {/* Accessible textual fallback */}
      <div className="mt-5 rounded-xl border border-border/60 bg-muted/20 px-4 py-3 text-xs text-muted-foreground">
        <strong>Konsep Fisika:</strong> Pada reaksi fisi terinduksi, sebuah neutron lambat ditangkap oleh inti U-235 menghasilkan U-236 yang tidak stabil. Inti tersebut segera terbelah menjadi dua inti lebih ringan (misalnya Ba-141 dan Kr-92) serta melepaskan 2 hingga 3 neutron bebas baru berenergi tinggi yang berpotensi memicu reaksi berantai.
      </div>
    </div>
  );
}
