/**
 * Nuclear fission chain-reaction engine (educational model).
 *
 * Framework-free and deterministic for a given seed, so it can be unit-tested
 * and rendered by any view layer. All coordinates are in fixed "world units";
 * the renderer scales them to the actual canvas size.
 *
 * Simplifications (shown to learners in the UI):
 * - 2D geometry; neutrons travel in straight lines at constant speed
 *   (no moderation, scattering, or energy spectrum).
 * - A neutron touching an intact U-235 nucleus causes fission with probability
 *   FISSION_PROBABILITY_ON_HIT (≈ σf / (σf + σγ) for thermal neutrons); otherwise
 *   it is captured and the nucleus becomes U-236 (no fission).
 * - Each fission releases 2 or 3 neutrons (mean ≈ 2.43) in random, isotropic
 *   directions — never aimed at a specific nucleus.
 * - Energy released = completed fission events × ENERGY_PER_FISSION_MEV.
 * - Control rods absorb every neutron that touches them.
 */

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const WORLD_W = 1000;
export const WORLD_H = 600;

/** Reactor vessel (simulation area). The strip to the right holds the energy gauge. */
export const VESSEL = { left: 0, top: 0, right: 900, bottom: WORLD_H } as const;
/** Height of the control-rod drive housing drawn at the top of the vessel. */
export const ROD_HOUSING_H = 40;
export const ROD_WIDTH = 22;
export const ROD_MAX_LENGTH = WORLD_H - ROD_HOUSING_H - 20;
export const ROD_XS = [0.25, 0.5, 0.75].map((f) => f * VESSEL.right);

export const NUCLEUS_RADIUS = 20;
export const NEUTRON_RADIUS = 5;
export const MIN_NUCLEUS_SPACING = NUCLEUS_RADIUS * 2 + 22;

export const SOURCE = { x: 24, y: 360 } as const;
export const INITIAL_NUCLEUS = { x: 340, y: 360 } as const;
const SPAWN_AREA = { minX: 70, maxX: 850, minY: ROD_HOUSING_H + 40, maxY: WORLD_H - 50 };

/** Approximate recoverable energy per U-235 fission (MeV). */
export const ENERGY_PER_FISSION_MEV = 200;
export const MEV_TO_JOULE = 1.602176634e-13;
/** P(fission | neutron hits intact U-235) — thermal σf ≈ 585 b, σγ ≈ 99 b. */
export const FISSION_PROBABILITY_ON_HIT = 0.85;
/** P(3 neutrons) so that mean neutrons per fission = 2 + 0.43 ≈ 2.43. */
export const P_THREE_NEUTRONS = 0.43;

export const ADD_INCREMENT = 5;
export const MAX_NUCLEI = 60;
export const MAX_ACTIVE_NEUTRONS = 150;

const TRIGGER_SPEED = 320; // world units / second
const SECONDARY_SPEED_MIN = 260;
const SECONDARY_SPEED_RANGE = 80;
const FRAGMENT_SPEED = { heavy: 80, light: 98 }; // lighter fragment moves faster (momentum)
const FRAGMENT_DRAG = 1.2; // 1/s

export const SPAWN_ANIM_MS = 450;
export const FISSION_ANIM_MS = 380;
export const FRAGMENT_LIFE_MS = 1800;
export const EFFECT_LIFE_MS = 600;

const MAX_STEP_S = 0.05;
const SUBSTEP_S = 0.016;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type NucleusState = "intact" | "fissioning" | "fissioned" | "captured";
export type NeutronState = "active" | "absorbed" | "captured" | "caused-fission" | "escaped";
export type SimPhase = "ready" | "reset" | "fired" | "reacting" | "stopped";

export interface Nucleus {
  id: number;
  x: number;
  y: number;
  state: NucleusState;
  spawnT: number;
  changedT: number;
}

export interface Neutron {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  state: NeutronState;
  generation: number;
}

export interface Fragment {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  kind: "Ba-141" | "Kr-92";
  bornT: number;
}

export interface Effect {
  id: number;
  x: number;
  y: number;
  kind: "fission" | "absorb" | "capture";
  bornT: number;
}

export interface FissionEngine {
  /** Simulation clock in ms (advances only while stepping). */
  t: number;
  seed: number;
  rngState: number;
  nextId: number;
  rodInsertion: number; // 0..1
  nuclei: Nucleus[];
  /** Only neutrons in the "active" state are kept here. */
  neutrons: Neutron[];
  fragments: Fragment[];
  effects: Effect[];
  fissionEvents: number;
  absorbedByRods: number;
  capturedByU235: number;
  escapedNeutrons: number;
  neutronsFired: number;
  suppressedNeutrons: number;
  maxGeneration: number;
  phase: SimPhase;
}

export interface FissionStats {
  totalNuclei: number;
  intactNuclei: number;
  fissionedNuclei: number;
  capturedNuclei: number;
  activeNeutrons: number;
  fissionEvents: number;
  energyMeV: number;
  absorbedByRods: number;
  capturedByU235: number;
  escapedNeutrons: number;
  neutronsFired: number;
  suppressedNeutrons: number;
  maxGeneration: number;
  phase: SimPhase;
  seed: number;
}

// ---------------------------------------------------------------------------
// RNG (mulberry32, seeded → reproducible runs for debugging)
// ---------------------------------------------------------------------------

export function nextRandom(e: FissionEngine): number {
  e.rngState = (e.rngState + 0x6d2b79f5) | 0;
  let t = e.rngState;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

// ---------------------------------------------------------------------------
// Creation & commands
// ---------------------------------------------------------------------------

export function createEngine(seed: number, rodInsertion: number, phase: SimPhase = "ready"): FissionEngine {
  return {
    t: 0,
    seed,
    rngState: seed | 0,
    nextId: 2,
    rodInsertion: clamp01(rodInsertion),
    nuclei: [
      { id: 1, x: INITIAL_NUCLEUS.x, y: INITIAL_NUCLEUS.y, state: "intact", spawnT: -SPAWN_ANIM_MS, changedT: 0 },
    ],
    neutrons: [],
    fragments: [],
    effects: [],
    fissionEvents: 0,
    absorbedByRods: 0,
    capturedByU235: 0,
    escapedNeutrons: 0,
    neutronsFired: 0,
    suppressedNeutrons: 0,
    maxGeneration: 0,
    phase,
  };
}

export function setRodInsertion(e: FissionEngine, value: number): void {
  e.rodInsertion = clamp01(value);
}

export function isInRodColumn(x: number, margin: number): boolean {
  return ROD_XS.some((rx) => Math.abs(x - rx) < ROD_WIDTH / 2 + margin);
}

/** True when (x, y) lies inside the inserted part of any control rod. */
export function isInsideRod(e: FissionEngine, x: number, y: number): boolean {
  const length = e.rodInsertion * ROD_MAX_LENGTH;
  if (length <= 0) return false;
  if (y < ROD_HOUSING_H || y > ROD_HOUSING_H + length) return false;
  return isInRodColumn(x, NEUTRON_RADIUS);
}

/**
 * Place up to `count` new U-235 nuclei at random valid positions
 * (inside the vessel, away from rod columns, respecting minimum spacing).
 * Returns how many were actually added.
 */
export function addNuclei(e: FissionEngine, count: number = ADD_INCREMENT): number {
  let added = 0;
  for (let i = 0; i < count && e.nuclei.length < MAX_NUCLEI; i++) {
    for (let attempt = 0; attempt < 80; attempt++) {
      const x = SPAWN_AREA.minX + nextRandom(e) * (SPAWN_AREA.maxX - SPAWN_AREA.minX);
      const y = SPAWN_AREA.minY + nextRandom(e) * (SPAWN_AREA.maxY - SPAWN_AREA.minY);
      if (isInRodColumn(x, NUCLEUS_RADIUS + 8)) continue;
      if (Math.hypot(x - SOURCE.x, y - SOURCE.y) < 90) continue;
      if (e.nuclei.some((n) => Math.hypot(n.x - x, n.y - y) < MIN_NUCLEUS_SPACING)) continue;
      e.nuclei.push({ id: e.nextId++, x, y, state: "intact", spawnT: e.t, changedT: e.t });
      added++;
      break;
    }
  }
  if (added > 0 && (e.phase === "reset" || e.phase === "stopped")) e.phase = "ready";
  return added;
}

/**
 * Emit one trigger neutron from the source, aimed at the nearest intact nucleus
 * (or straight across if none remain). Returns false if the neutron cap is reached.
 */
export function fireNeutron(e: FissionEngine): boolean {
  if (e.neutrons.length >= MAX_ACTIVE_NEUTRONS) return false;
  let dx = 1;
  let dy = 0;
  let best = Infinity;
  for (const n of e.nuclei) {
    if (n.state !== "intact") continue;
    const d = Math.hypot(n.x - SOURCE.x, n.y - SOURCE.y);
    if (d < best) {
      best = d;
      dx = (n.x - SOURCE.x) / d;
      dy = (n.y - SOURCE.y) / d;
    }
  }
  e.neutrons.push({
    id: e.nextId++,
    x: SOURCE.x,
    y: SOURCE.y,
    vx: dx * TRIGGER_SPEED,
    vy: dy * TRIGGER_SPEED,
    state: "active",
    generation: 0,
  });
  e.neutronsFired++;
  if (e.phase !== "reacting") e.phase = "fired";
  return true;
}

// ---------------------------------------------------------------------------
// Stepping
// ---------------------------------------------------------------------------

/** Advance the simulation by `dtSeconds` (clamped and sub-stepped to avoid tunnelling). */
export function step(e: FissionEngine, dtSeconds: number): void {
  let remaining = Math.min(Math.max(dtSeconds, 0), MAX_STEP_S);
  while (remaining > 1e-6) {
    const h = Math.min(remaining, SUBSTEP_S);
    substep(e, h);
    remaining -= h;
  }
}

function substep(e: FissionEngine, h: number): void {
  e.t += h * 1000;

  for (const n of e.nuclei) {
    if (n.state === "fissioning" && e.t - n.changedT >= FISSION_ANIM_MS) {
      n.state = "fissioned";
      n.changedT = e.t;
    }
  }

  const spawned: Neutron[] = [];
  const budget = { active: e.neutrons.length };

  for (const nt of e.neutrons) {
    if (nt.state !== "active") continue;
    nt.x += nt.vx * h;
    nt.y += nt.vy * h;

    if (nt.x < VESSEL.left - 10 || nt.x > VESSEL.right + 10 || nt.y < VESSEL.top - 10 || nt.y > VESSEL.bottom + 10) {
      nt.state = "escaped";
      e.escapedNeutrons++;
      budget.active--;
      continue;
    }

    if (isInsideRod(e, nt.x, nt.y)) {
      nt.state = "absorbed";
      e.absorbedByRods++;
      budget.active--;
      e.effects.push({ id: e.nextId++, x: nt.x, y: nt.y, kind: "absorb", bornT: e.t });
      continue;
    }

    for (const n of e.nuclei) {
      if (n.state !== "intact") continue;
      if (Math.hypot(nt.x - n.x, nt.y - n.y) >= NUCLEUS_RADIUS + NEUTRON_RADIUS) continue;

      budget.active--;
      if (nextRandom(e) < FISSION_PROBABILITY_ON_HIT) {
        nt.state = "caused-fission";
        triggerFission(e, n, nt.generation + 1, spawned, budget);
      } else {
        nt.state = "captured";
        n.state = "captured";
        n.changedT = e.t;
        e.capturedByU235++;
        e.effects.push({ id: e.nextId++, x: n.x, y: n.y, kind: "capture", bornT: e.t });
      }
      break;
    }
  }

  e.neutrons = e.neutrons.filter((nt) => nt.state === "active").concat(spawned);

  const drag = Math.max(0, 1 - FRAGMENT_DRAG * h);
  for (const f of e.fragments) {
    f.x += f.vx * h;
    f.y += f.vy * h;
    f.vx *= drag;
    f.vy *= drag;
  }
  e.fragments = e.fragments.filter((f) => e.t - f.bornT < FRAGMENT_LIFE_MS);
  e.effects = e.effects.filter((fx) => e.t - fx.bornT < EFFECT_LIFE_MS);

  if (e.neutrons.length === 0 && (e.phase === "fired" || e.phase === "reacting")) {
    e.phase = "stopped";
  }
}

function triggerFission(
  e: FissionEngine,
  n: Nucleus,
  childGeneration: number,
  spawned: Neutron[],
  budget: { active: number }
): void {
  // The only place a fission event is recorded; guarded by the "intact" check upstream.
  n.state = "fissioning";
  n.changedT = e.t;
  e.fissionEvents++;
  e.phase = "reacting";
  e.effects.push({ id: e.nextId++, x: n.x, y: n.y, kind: "fission", bornT: e.t });

  const a = nextRandom(e) * Math.PI * 2;
  e.fragments.push(
    {
      id: e.nextId++,
      x: n.x + Math.cos(a) * 6,
      y: n.y + Math.sin(a) * 6,
      vx: Math.cos(a) * FRAGMENT_SPEED.heavy,
      vy: Math.sin(a) * FRAGMENT_SPEED.heavy,
      kind: "Ba-141",
      bornT: e.t,
    },
    {
      id: e.nextId++,
      x: n.x - Math.cos(a) * 6,
      y: n.y - Math.sin(a) * 6,
      vx: -Math.cos(a) * FRAGMENT_SPEED.light,
      vy: -Math.sin(a) * FRAGMENT_SPEED.light,
      kind: "Kr-92",
      bornT: e.t,
    }
  );

  const count = nextRandom(e) < P_THREE_NEUTRONS ? 3 : 2;
  for (let i = 0; i < count; i++) {
    if (budget.active >= MAX_ACTIVE_NEUTRONS) {
      e.suppressedNeutrons++;
      continue;
    }
    const ang = nextRandom(e) * Math.PI * 2;
    const speed = SECONDARY_SPEED_MIN + nextRandom(e) * SECONDARY_SPEED_RANGE;
    const offset = NUCLEUS_RADIUS + NEUTRON_RADIUS + 1;
    spawned.push({
      id: e.nextId++,
      x: n.x + Math.cos(ang) * offset,
      y: n.y + Math.sin(ang) * offset,
      vx: Math.cos(ang) * speed,
      vy: Math.sin(ang) * speed,
      state: "active",
      generation: childGeneration,
    });
    budget.active++;
  }
  e.maxGeneration = Math.max(e.maxGeneration, childGeneration);
}

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

/** True while anything still needs to move or animate. */
export function isBusy(e: FissionEngine): boolean {
  return (
    e.neutrons.length > 0 ||
    e.fragments.length > 0 ||
    e.effects.length > 0 ||
    e.nuclei.some((n) => n.state === "fissioning" || e.t - n.spawnT < SPAWN_ANIM_MS)
  );
}

export function getStats(e: FissionEngine): FissionStats {
  let intact = 0;
  let fissioned = 0;
  let captured = 0;
  for (const n of e.nuclei) {
    if (n.state === "intact") intact++;
    else if (n.state === "captured") captured++;
    else fissioned++;
  }
  return {
    totalNuclei: e.nuclei.length,
    intactNuclei: intact,
    fissionedNuclei: fissioned,
    capturedNuclei: captured,
    activeNeutrons: e.neutrons.length,
    fissionEvents: e.fissionEvents,
    energyMeV: e.fissionEvents * ENERGY_PER_FISSION_MEV,
    absorbedByRods: e.absorbedByRods,
    capturedByU235: e.capturedByU235,
    escapedNeutrons: e.escapedNeutrons,
    neutronsFired: e.neutronsFired,
    suppressedNeutrons: e.suppressedNeutrons,
    maxGeneration: e.maxGeneration,
    phase: e.phase,
    seed: e.seed,
  };
}

function clamp01(v: number): number {
  return Number.isFinite(v) ? Math.min(1, Math.max(0, v)) : 0;
}
