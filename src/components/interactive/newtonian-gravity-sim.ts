/**
 * Newtonian Gravity Simulation Physics Engine.
 *
 * Implements:
 * - Free fall kinematics: v(t) = v0 + g*t, h(t) = h0 - v0*t - 0.5*g*t^2
 * - Newton's Law of Universal Gravitation: F = G * (M_earth * m) / R_earth^2
 * - Surface gravitational acceleration derivation: g = G * M_earth / R_earth^2 ≈ 9.81 m/s^2
 * - Vacuum vs Air Resistance comparison (Galileo / Newton thought experiment)
 *   In vacuum: all objects (feather, apple, iron ball) accelerate at the EXACT same rate g regardless of mass!
 *   In air: drag F_d = 0.5 * rho * Cd * A * v^2 limits feather to gentle terminal velocity.
 */

export const WORLD_W = 1000;
export const WORLD_H = 600;
export const GROUND_Y = 520; // screen pixel y for ground surface (h = 0m)
export const PIXELS_PER_METER = 80; // 80 pixels = 1.0 meter

// Physical constants
export const G_CONSTANT = 6.6743e-11; // N * m^2 / kg^2
export const EARTH_MASS = 5.9722e24; // kg
export const EARTH_RADIUS = 6.371e6; // meters
export const DEFAULT_G = 9.81; // m/s^2
export const AIR_DENSITY = 1.204; // kg/m^3 (sea level air at 20°C)

// Scene landmark positions
export const NEWTON_HEAD = { x: 270, y: 452, heightM: 0.85 }; // Newton seated on ground
export const TREE_TRUNK = { x: 190, y: GROUND_Y };
export const DEFAULT_INITIAL_HEIGHT = 5.0; // meters (branch height)

export type GravityObjectType = "apple" | "durian" | "feather" | "iron_ball";

export interface GravityObjectSpec {
  id: GravityObjectType;
  name: string;
  defaultMass: number; // kg
  minMass: number;
  maxMass: number;
  radiusM: number;
  dragCoefficient: number; // Cd
  crossSectionArea: number; // m^2
  color: string;
  label: string;
  description: string;
}

export const GRAVITY_OBJECTS: Record<GravityObjectType, GravityObjectSpec> = {
  apple: {
    id: "apple",
    name: "Apel",
    defaultMass: 0.15,
    minMass: 0.05,
    maxMass: 0.5,
    radiusM: 0.06,
    dragCoefficient: 0.47,
    crossSectionArea: 0.011,
    color: "#ef4444",
    label: "Apel (0.15 kg)",
    description: "Objek klasik inspirasi Newton; hambatan udara dapat diabaikan pada jatuh 5 meter.",
  },
  durian: {
    id: "durian",
    name: "Durian",
    defaultMass: 1.5,
    minMass: 0.8,
    maxMass: 3.5,
    radiusM: 0.12,
    dragCoefficient: 0.6,
    crossSectionArea: 0.045,
    color: "#ca8a04",
    label: "Durian (1.5 kg)",
    description: "Massa besar berduri; memiliki inersia tinggi dan percepatan jatuh bebas identik di ruang hampa.",
  },
  feather: {
    id: "feather",
    name: "Bulu Unggas",
    defaultMass: 0.001,
    minMass: 0.0005,
    maxMass: 0.01,
    radiusM: 0.08,
    dragCoefficient: 1.25,
    crossSectionArea: 0.0035,
    color: "#f8fafc",
    label: "Bulu (1 g)",
    description: "Massa sangat ringan; melayang perlahan jika ada hambatan udara, namun jatuh secepat besi di ruang hampa!",
  },
  iron_ball: {
    id: "iron_ball",
    name: "Bola Besi",
    defaultMass: 1.0,
    minMass: 0.2,
    maxMass: 5.0,
    radiusM: 0.07,
    dragCoefficient: 0.47,
    crossSectionArea: 0.015,
    color: "#475569",
    label: "Bola Besi (1.0 kg)",
    description: "Objek padat bermassa besar; meluncur jatuh bebas tanpa terpengaruh gaya gesek udara.",
  },
};

export interface GravityTelemetry {
  timeElapsed: number; // seconds
  currentHeight: number; // meters from ground
  currentSpeed: number; // m/s downwards
  currentAcceleration: number; // m/s^2
  gravitationalForceN: number; // N: F = G*M*m/R^2 = m*g
  dragForceN: number; // N
  netForceN: number; // N
  impactTime: number | null;
  impactSpeed: number | null;
  hasCollided: boolean;
  thoughtBubbleVisible: boolean;
}

export interface GravityEngine {
  objectType: GravityObjectType;
  mass: number; // kg
  initialHeightM: number; // meters
  useAirResistance: boolean;
  gravityG: number; // m/s^2
  phase: "ready" | "falling" | "paused" | "impacted" | "reset";
  t: number; // current elapsed simulation seconds
  yM: number; // current height above ground in meters
  vM: number; // current speed in m/s (positive downwards)
  wobblePhase: number; // for feather fluttering animation
  telemetry: GravityTelemetry;
}

export function createGravityEngine(config?: {
  objectType?: GravityObjectType;
  initialHeight?: number;
  airResistance?: boolean;
}): GravityEngine {
  const type: GravityObjectType = config?.objectType ?? "apple";
  const spec = GRAVITY_OBJECTS[type];
  const initialH = config?.initialHeight ?? DEFAULT_INITIAL_HEIGHT;
  const mass = spec.defaultMass;
  const g = DEFAULT_G;
  const fGrav = mass * g;

  return {
    objectType: type,
    mass,
    initialHeightM: initialH,
    useAirResistance: config?.airResistance ?? false,
    gravityG: g,
    phase: "ready",
    t: 0,
    yM: initialH,
    vM: 0,
    wobblePhase: 0,
    telemetry: {
      timeElapsed: 0,
      currentHeight: initialH,
      currentSpeed: 0,
      currentAcceleration: g,
      gravitationalForceN: fGrav,
      dragForceN: 0,
      netForceN: fGrav,
      impactTime: null,
      impactSpeed: null,
      hasCollided: false,
      thoughtBubbleVisible: false,
    },
  };
}

export function selectGravityObject(engine: GravityEngine, type: GravityObjectType): void {
  engine.objectType = type;
  const spec = GRAVITY_OBJECTS[type];
  engine.mass = spec.defaultMass;
  resetGravityEngine(engine);
}

export function setGravityObjectMass(engine: GravityEngine, mass: number): void {
  if (mass <= 0 || !Number.isFinite(mass)) return;
  engine.mass = mass;
  engine.telemetry.gravitationalForceN = mass * engine.gravityG;
}

export function setInitialHeight(engine: GravityEngine, heightM: number): void {
  if (heightM < 1.5 || heightM > 6.0 || !Number.isFinite(heightM)) return;
  engine.initialHeightM = heightM;
  if (engine.phase === "ready" || engine.phase === "reset") {
    engine.yM = heightM;
    engine.telemetry.currentHeight = heightM;
  }
}

export function setAirResistance(engine: GravityEngine, enabled: boolean): void {
  engine.useAirResistance = enabled;
}

export function startSimulation(engine: GravityEngine): void {
  if (engine.phase === "ready" || engine.phase === "reset" || engine.phase === "paused") {
    engine.phase = "falling";
  }
}

export function pauseSimulation(engine: GravityEngine): void {
  if (engine.phase === "falling") {
    engine.phase = "paused";
  }
}

export function resetGravityEngine(engine: GravityEngine): void {
  engine.phase = "ready";
  engine.t = 0;
  engine.yM = engine.initialHeightM;
  engine.vM = 0;
  engine.wobblePhase = 0;
  const fGrav = engine.mass * engine.gravityG;

  engine.telemetry = {
    timeElapsed: 0,
    currentHeight: engine.initialHeightM,
    currentSpeed: 0,
    currentAcceleration: engine.gravityG,
    gravitationalForceN: fGrav,
    dragForceN: 0,
    netForceN: fGrav,
    impactTime: null,
    impactSpeed: null,
    hasCollided: false,
    thoughtBubbleVisible: false,
  };
}

export function stepGravity(engine: GravityEngine, dt: number): void {
  if (engine.phase !== "falling") return;

  const clampedDt = Math.min(Math.max(dt, 0), 0.05);
  engine.t += clampedDt;

  const spec = GRAVITY_OBJECTS[engine.objectType];
  const g = engine.gravityG;
  const fGrav = engine.mass * g;

  let fDrag = 0;
  if (engine.useAirResistance) {
    // F_drag = 0.5 * rho * Cd * A * v^2
    fDrag = 0.5 * AIR_DENSITY * spec.dragCoefficient * spec.crossSectionArea * (engine.vM * engine.vM);
  }

  // Net force downwards: F_net = F_grav - F_drag
  const fNet = Math.max(0, fGrav - fDrag);
  const a = fNet / engine.mass; // m/s^2

  // Kinematic numerical integration
  engine.vM += a * clampedDt;
  engine.yM -= engine.vM * clampedDt;

  // Flutter wobble for light feather
  if (engine.objectType === "feather" && engine.useAirResistance) {
    engine.wobblePhase += clampedDt * 8;
  }

  // Check collision with Newton's head
  const targetImpactHeight = NEWTON_HEAD.heightM; // ~0.85m

  if (engine.yM <= targetImpactHeight) {
    engine.yM = targetImpactHeight;
    engine.phase = "impacted";
    engine.telemetry.hasCollided = true;
    engine.telemetry.impactTime = engine.t;
    engine.telemetry.impactSpeed = engine.vM;
    engine.telemetry.thoughtBubbleVisible = true;
    engine.telemetry.currentHeight = targetImpactHeight;
    engine.telemetry.currentSpeed = engine.vM;
    engine.telemetry.currentAcceleration = 0;
    return;
  }

  // Update real-time telemetry
  engine.telemetry.timeElapsed = engine.t;
  engine.telemetry.currentHeight = Math.max(0, engine.yM);
  engine.telemetry.currentSpeed = engine.vM;
  engine.telemetry.currentAcceleration = a;
  engine.telemetry.gravitationalForceN = fGrav;
  engine.telemetry.dragForceN = fDrag;
  engine.telemetry.netForceN = fNet;
}

/**
 * Universal Gravitation Law calculation for display card:
 * F = G * (m1 * m2) / r^2
 */
export function calculateUniversalGravity(
  m1: number,
  m2: number,
  r: number
): { force: number; formulaString: string } {
  if (r <= 0) return { force: 0, formulaString: "0 N" };
  const force = (G_CONSTANT * m1 * m2) / (r * r);
  return {
    force,
    formulaString: force.toExponential(3) + " N",
  };
}
