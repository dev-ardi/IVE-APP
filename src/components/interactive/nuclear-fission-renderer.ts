/**
 * Canvas 2D renderer + animation-loop controller for the nuclear fission
 * interactive. Keeps per-frame work outside React: the component only receives
 * a stats snapshot when something meaningful changes.
 */
import {
  ENERGY_PER_FISSION_MEV,
  EFFECT_LIFE_MS,
  FISSION_ANIM_MS,
  FRAGMENT_LIFE_MS,
  NEUTRON_RADIUS,
  NUCLEUS_RADIUS,
  ROD_HOUSING_H,
  ROD_MAX_LENGTH,
  ROD_WIDTH,
  ROD_XS,
  SOURCE,
  SPAWN_ANIM_MS,
  VESSEL,
  WORLD_H,
  WORLD_W,
  addNuclei,
  createEngine,
  fireNeutron,
  getStats,
  isBusy,
  setRodInsertion,
  step,
  type FissionEngine,
  type FissionStats,
} from "./nuclear-fission-sim";

const GAUGE = { x: 918, y: 56, w: 64, h: WORLD_H - 96 } as const;
const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";

export interface ControllerOptions {
  seed: number;
  rodInsertion: number;
  onStats: (stats: FissionStats) => void;
}

export class FissionController {
  private engine: FissionEngine;
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D | null;
  private readonly onStats: (stats: FissionStats) => void;
  private raf: number | null = null;
  private lastTs: number | null = null;
  private displayEnergy = 0;
  private scale = 1;
  private dpr = 1;
  private lastKey = "";

  constructor(canvas: HTMLCanvasElement, opts: ControllerOptions) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.onStats = opts.onStats;
    this.engine = createEngine(opts.seed, opts.rodInsertion);
    this.resize();
    this.emitStats(true);
  }

  // ---- commands ----------------------------------------------------------

  addNuclei(): number {
    const added = addNuclei(this.engine);
    this.emitStats();
    this.ensureLoop();
    return added;
  }

  fireNeutron(): boolean {
    const ok = fireNeutron(this.engine);
    this.emitStats();
    this.ensureLoop();
    return ok;
  }

  setRodInsertion(value: number): void {
    setRodInsertion(this.engine, value);
    if (this.raf === null) this.render();
  }

  /** Replace the whole engine: old neutrons/events can never touch the new run. */
  reset(seed: number, rodInsertion: number): void {
    if (this.raf !== null) {
      cancelAnimationFrame(this.raf);
      this.raf = null;
    }
    this.lastTs = null;
    this.engine = createEngine(seed, rodInsertion, "reset");
    this.displayEnergy = 0;
    this.emitStats(true);
    this.render();
  }

  resize(): void {
    const cssW = this.canvas.clientWidth;
    if (cssW <= 0) return;
    const cssH = (cssW * WORLD_H) / WORLD_W;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.scale = cssW / WORLD_W;
    this.canvas.width = Math.round(cssW * this.dpr);
    this.canvas.height = Math.round(cssH * this.dpr);
    this.render();
  }

  destroy(): void {
    if (this.raf !== null) cancelAnimationFrame(this.raf);
    this.raf = null;
  }

  // ---- loop --------------------------------------------------------------

  private ensureLoop(): void {
    if (this.raf !== null) return;
    this.lastTs = null;
    this.raf = requestAnimationFrame(this.frame);
  }

  private frame = (ts: number): void => {
    const dt = this.lastTs === null ? 1 / 60 : (ts - this.lastTs) / 1000;
    this.lastTs = ts;
    step(this.engine, dt);

    const target = this.engine.fissionEvents * ENERGY_PER_FISSION_MEV;
    const diff = target - this.displayEnergy;
    this.displayEnergy = Math.abs(diff) < 0.5 ? target : this.displayEnergy + diff * Math.min(1, dt * 6);

    this.render();
    this.emitStats();

    if (isBusy(this.engine) || this.displayEnergy !== target) {
      this.raf = requestAnimationFrame(this.frame);
    } else {
      this.raf = null;
      this.lastTs = null;
    }
  };

  private emitStats(force = false): void {
    const s = getStats(this.engine);
    const key = [
      s.totalNuclei, s.intactNuclei, s.fissionedNuclei, s.capturedNuclei, s.activeNeutrons,
      s.fissionEvents, s.absorbedByRods, s.escapedNeutrons, s.neutronsFired, s.maxGeneration,
      s.suppressedNeutrons, s.phase, s.seed,
    ].join("|");
    if (!force && key === this.lastKey) return;
    this.lastKey = key;
    this.onStats(s);
  }

  // ---- drawing -----------------------------------------------------------

  private render(): void {
    const ctx = this.ctx;
    if (!ctx || this.canvas.width === 0) return;
    const e = this.engine;
    const k = this.dpr * this.scale;
    const showLabels = this.scale * 10 >= 6.5;

    ctx.setTransform(k, 0, 0, k, 0, 0);
    ctx.clearRect(0, 0, WORLD_W, WORLD_H);

    drawBackground(ctx, showLabels);
    drawSource(ctx, showLabels);
    drawRods(ctx, e, showLabels);
    drawNuclei(ctx, e, showLabels);
    drawFragments(ctx, e, showLabels);
    drawEffects(ctx, e);
    drawNeutrons(ctx, e);
    drawGauge(ctx, this.displayEnergy, e.nuclei.length, showLabels);
  }
}

// ---------------------------------------------------------------------------
// Drawing helpers (world coordinates)
// ---------------------------------------------------------------------------

function drawBackground(ctx: CanvasRenderingContext2D, showLabels: boolean): void {
  const bg = ctx.createLinearGradient(0, 0, 0, WORLD_H);
  bg.addColorStop(0, "#06121c");
  bg.addColorStop(1, "#0a1b26");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, WORLD_W, WORLD_H);

  // Cherenkov-like glow of the moderator pool
  const glow = ctx.createRadialGradient(450, 330, 40, 450, 330, 520);
  glow.addColorStop(0, "rgba(14,165,233,0.16)");
  glow.addColorStop(1, "rgba(14,165,233,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(VESSEL.left, VESSEL.top, VESSEL.right, VESSEL.bottom);

  // Fuel lattice grid
  ctx.fillStyle = "rgba(148,163,184,0.13)";
  for (let x = 40; x < VESSEL.right; x += 40) {
    for (let y = ROD_HOUSING_H + 20; y < VESSEL.bottom; y += 40) {
      ctx.fillRect(x - 1, y - 1, 2, 2);
    }
  }

  // Vessel wall
  ctx.strokeStyle = "rgba(56,189,248,0.28)";
  ctx.lineWidth = 2;
  ctx.strokeRect(3, 3, VESSEL.right - 6, VESSEL.bottom - 6);

  // Rod drive housing
  ctx.fillStyle = "#0f1d2b";
  ctx.fillRect(3, 3, VESSEL.right - 6, ROD_HOUSING_H - 3);
  ctx.strokeStyle = "rgba(148,163,184,0.25)";
  ctx.beginPath();
  ctx.moveTo(3, ROD_HOUSING_H);
  ctx.lineTo(VESSEL.right - 3, ROD_HOUSING_H);
  ctx.stroke();

  if (showLabels) {
    ctx.font = `600 12px ${FONT}`;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(148,163,184,0.75)";
    ctx.fillText("PENGGERAK BATANG KENDALI", 16, ROD_HOUSING_H / 2 + 1);
    ctx.fillStyle = "rgba(148,163,184,0.55)";
    ctx.fillText("TERAS REAKTOR · MODERATOR AIR (ILUSTRASI 2D)", 16, VESSEL.bottom - 18);
  }
}

function drawSource(ctx: CanvasRenderingContext2D, showLabels: boolean): void {
  ctx.fillStyle = "#1e293b";
  ctx.strokeStyle = "rgba(103,232,249,0.6)";
  ctx.lineWidth = 1.5;
  ctx.fillRect(4, SOURCE.y - 22, 22, 44);
  ctx.strokeRect(4, SOURCE.y - 22, 22, 44);
  ctx.fillStyle = "#22d3ee";
  ctx.beginPath();
  ctx.arc(SOURCE.x - 9, SOURCE.y, 4, 0, Math.PI * 2);
  ctx.fill();
  if (showLabels) {
    ctx.font = `600 11px ${FONT}`;
    ctx.textAlign = "left";
    ctx.fillStyle = "rgba(103,232,249,0.8)";
    ctx.fillText("SUMBER n", 8, SOURCE.y + 36);
  }
}

function drawRods(ctx: CanvasRenderingContext2D, e: FissionEngine, showLabels: boolean): void {
  const length = e.rodInsertion * ROD_MAX_LENGTH;
  for (const rx of ROD_XS) {
    const x0 = rx - ROD_WIDTH / 2;
    // Guide tube
    ctx.strokeStyle = "rgba(148,163,184,0.18)";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 6]);
    ctx.strokeRect(x0 - 3, ROD_HOUSING_H, ROD_WIDTH + 6, ROD_MAX_LENGTH);
    ctx.setLineDash([]);

    if (length > 0) {
      const g = ctx.createLinearGradient(x0, 0, x0 + ROD_WIDTH, 0);
      g.addColorStop(0, "#334155");
      g.addColorStop(0.45, "#94a3b8");
      g.addColorStop(1, "#1e293b");
      ctx.fillStyle = g;
      ctx.fillRect(x0, ROD_HOUSING_H, ROD_WIDTH, length);
      ctx.fillStyle = "#f43f5e";
      ctx.fillRect(x0, ROD_HOUSING_H + length - 5, ROD_WIDTH, 5);
    }

    // Drive head
    ctx.fillStyle = "#475569";
    ctx.fillRect(x0 - 4, 10, ROD_WIDTH + 8, ROD_HOUSING_H - 14);
  }
  if (showLabels) {
    ctx.font = `600 11px ${FONT}`;
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(226,232,240,0.85)";
    ctx.fillText(`BATANG KENDALI ${Math.round(e.rodInsertion * 100)}%`, VESSEL.right - 16, ROD_HOUSING_H / 2 + 1);
  }
}

function easeOutBack(p: number): number {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2);
}

function drawNuclei(ctx: CanvasRenderingContext2D, e: FissionEngine, showLabels: boolean): void {
  for (const n of e.nuclei) {
    if (n.state === "intact" || n.state === "captured") {
      const p = Math.min(1, Math.max(0, (e.t - n.spawnT) / SPAWN_ANIM_MS));
      const r = NUCLEUS_RADIUS * (n.state === "captured" ? 0.9 : 1) * Math.max(0.05, easeOutBack(p));
      const g = ctx.createRadialGradient(n.x - r * 0.35, n.y - r * 0.35, r * 0.1, n.x, n.y, r);
      if (n.state === "intact") {
        g.addColorStop(0, "#fef3c7");
        g.addColorStop(0.5, "#fbbf24");
        g.addColorStop(1, "#b45309");
      } else {
        g.addColorStop(0, "#cbd5e1");
        g.addColorStop(1, "#475569");
      }
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.55)";
      ctx.lineWidth = 1.2;
      ctx.stroke();
      if (showLabels && p > 0.6) {
        ctx.font = `800 10px ${FONT}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = n.state === "intact" ? "#451a03" : "#0f172a";
        ctx.fillText(n.state === "intact" ? "U-235" : "U-236", n.x, n.y + 0.5);
      }
    } else if (n.state === "fissioning") {
      const p = Math.min(1, (e.t - n.changedT) / FISSION_ANIM_MS);
      ctx.fillStyle = `rgba(251,146,60,${0.9 * (1 - p)})`;
      ctx.beginPath();
      ctx.ellipse(n.x, n.y, NUCLEUS_RADIUS * (1 + 0.6 * p), NUCLEUS_RADIUS * (1 - 0.5 * p), 0.6, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // fissioned: spent site marker
      ctx.strokeStyle = "rgba(148,163,184,0.3)";
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 4]);
      ctx.beginPath();
      ctx.arc(n.x, n.y, NUCLEUS_RADIUS * 0.6, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }
}

function drawFragments(ctx: CanvasRenderingContext2D, e: FissionEngine, showLabels: boolean): void {
  for (const f of e.fragments) {
    const age = (e.t - f.bornT) / FRAGMENT_LIFE_MS;
    const alpha = age < 0.6 ? 1 : Math.max(0, 1 - (age - 0.6) / 0.4);
    const heavy = f.kind === "Ba-141";
    const r = heavy ? 12 : 10;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = heavy ? "#fb7185" : "#a78bfa";
    ctx.beginPath();
    ctx.arc(f.x, f.y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.5)";
    ctx.lineWidth = 1;
    ctx.stroke();
    if (showLabels) {
      ctx.font = `700 10px ${FONT}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.fillStyle = heavy ? "#fecdd3" : "#ddd6fe";
      ctx.fillText(f.kind, f.x, f.y - r - 2);
    }
    ctx.globalAlpha = 1;
  }
}

function drawEffects(ctx: CanvasRenderingContext2D, e: FissionEngine): void {
  for (const fx of e.effects) {
    const p = Math.min(1, (e.t - fx.bornT) / EFFECT_LIFE_MS);
    if (fx.kind === "fission") {
      ctx.fillStyle = `rgba(253,186,116,${0.35 * (1 - p)})`;
      ctx.beginPath();
      ctx.arc(fx.x, fx.y, NUCLEUS_RADIUS + 30 * p, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = `rgba(249,115,22,${1 - p})`;
      ctx.lineWidth = 3 * (1 - p) + 0.5;
      ctx.beginPath();
      ctx.arc(fx.x, fx.y, NUCLEUS_RADIUS + 60 * p, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      ctx.strokeStyle = fx.kind === "absorb" ? `rgba(203,213,225,${1 - p})` : `rgba(167,139,250,${1 - p})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(fx.x, fx.y, (fx.kind === "absorb" ? 6 : NUCLEUS_RADIUS) + 12 * p, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
}

function drawNeutrons(ctx: CanvasRenderingContext2D, e: FissionEngine): void {
  ctx.lineCap = "round";
  for (const nt of e.neutrons) {
    ctx.strokeStyle = "rgba(103,232,249,0.45)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(nt.x - nt.vx * 0.06, nt.y - nt.vy * 0.06);
    ctx.lineTo(nt.x, nt.y);
    ctx.stroke();
    ctx.fillStyle = "rgba(34,211,238,0.2)";
    ctx.beginPath();
    ctx.arc(nt.x, nt.y, NEUTRON_RADIUS * 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#67e8f9";
    ctx.beginPath();
    ctx.arc(nt.x, nt.y, NEUTRON_RADIUS, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.lineCap = "butt";
}

function drawGauge(ctx: CanvasRenderingContext2D, energyMeV: number, totalNuclei: number, showLabels: boolean): void {
  ctx.fillStyle = "#0b1622";
  ctx.fillRect(VESSEL.right, 0, WORLD_W - VESSEL.right, WORLD_H);

  const potential = Math.max(1, totalNuclei) * ENERGY_PER_FISSION_MEV;
  const frac = Math.min(1, Math.max(0, energyMeV / potential));
  ctx.fillStyle = "#111f2e";
  ctx.strokeStyle = "rgba(148,163,184,0.35)";
  ctx.lineWidth = 1.5;
  ctx.fillRect(GAUGE.x + 14, GAUGE.y, GAUGE.w - 28, GAUGE.h);
  ctx.strokeRect(GAUGE.x + 14, GAUGE.y, GAUGE.w - 28, GAUGE.h);

  const fillH = GAUGE.h * frac;
  if (fillH > 0) {
    const g = ctx.createLinearGradient(0, GAUGE.y + GAUGE.h, 0, GAUGE.y);
    g.addColorStop(0, "#f97316");
    g.addColorStop(1, "#fde047");
    ctx.fillStyle = g;
    ctx.fillRect(GAUGE.x + 16, GAUGE.y + GAUGE.h - fillH, GAUGE.w - 32, fillH);
  }

  ctx.strokeStyle = "rgba(148,163,184,0.35)";
  ctx.lineWidth = 1;
  for (let i = 1; i < 10; i++) {
    const y = GAUGE.y + (GAUGE.h * i) / 10;
    ctx.beginPath();
    ctx.moveTo(GAUGE.x + 8, y);
    ctx.lineTo(GAUGE.x + 14, y);
    ctx.stroke();
  }

  if (showLabels) {
    ctx.font = `700 11px ${FONT}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(253,186,116,0.9)";
    ctx.fillText("ENERGI", GAUGE.x + GAUGE.w / 2, 24);
    ctx.fillStyle = "rgba(226,232,240,0.9)";
    ctx.fillText(`${Math.round(frac * 100)}%`, GAUGE.x + GAUGE.w / 2, GAUGE.y + GAUGE.h + 18);
  }
}
