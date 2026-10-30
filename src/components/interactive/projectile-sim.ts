/**
 * Projectile Motion (Gerak Parabola) Simulation Physics Engine.
 *
 * Implements:
 * - Slingshot elastic potential energy: E_el = 0.5 * k * x^2, F = k * x
 * - Launch speed from energy conservation: 0.5 * m * v0^2 = eta * E_el => v0 = sqrt(2 * eta * E_el / m)
 * - Launch angle derived from pull displacement vector: theta = atan2(-dy, -dx)
 * - Trajectory integration: dx/dt = vx, dy/dt = vy, dvy/dt = -g
 * - Cardboard box targets on the right with momentum-based collision response
 * - Pure TypeScript, deterministic, fully unit-testable.
 */

export const WORLD_W = 1000;
export const WORLD_H = 500;
export const GROUND_Y = 440;
export const PIXELS_PER_METER = 20;

export const SLINGSHOT = {
  baseX: 130,
  baseY: GROUND_Y,
  forkY: 345,
  leftFork: { x: 112, y: 326 },
  rightFork: { x: 148, y: 326 },
  pouchRest: { x: 130, y: 345 },
} as const;

export const SPRING_K = 260; // N/m effective spring constant
export const SPRING_EFFICIENCY = 0.82; // eta
export const MAX_PULL_PX = 75; // max pixel displacement
export const MAX_PULL_METERS = 0.75; // corresponds to 75px
export const MIN_PULL_PX = 10; // minimum pull required to launch
export const MAX_V0_CAP = 45; // m/s clamp for ultra-light objects
export const DEFAULT_GRAVITY = 9.81;

export type ObjectType = "stone" | "plane" | "soccer";

export interface ObjectSpec {
  id: ObjectType;
  name: string;
  defaultMass: number; // kg
  minMass: number;
  maxMass: number;
  radius: number; // visual px
  color: string;
  label: string;
  description: string;
}

export const OBJECT_SPECS: Record<ObjectType, ObjectSpec> = {
  stone: {
    id: "stone",
    name: "Batu",
    defaultMass: 2.0,
    minMass: 0.5,
    maxMass: 5.0,
    radius: 14,
    color: "#78716c",
    label: "Batu (2 kg)",
    description: "Massa besar, inersia tinggi, hantaman momentum kuat.",
  },
  plane: {
    id: "plane",
    name: "Pesawat Kertas",
    defaultMass: 0.005,
    minMass: 0.001,
    maxMass: 0.05,
    radius: 13,
    color: "#f8fafc",
    label: "Pesawat Kertas (5 g)",
    description: "Massa sangat ringan, melesat cepat, benturan lembut.",
  },
  soccer: {
    id: "soccer",
    name: "Bola Sepak",
    defaultMass: 0.43,
    minMass: 0.1,
    maxMass: 1.0,
    radius: 15,
    color: "#ffffff",
    label: "Bola Sepak (0.43 kg)",
    description: "Massa sedang standar regulasi, trayektori seimbang.",
  },
};

export interface CardboardBox {
  id: number;
  baseX: number; // initial x
  baseY: number; // initial y
  x: number;
  y: number;
  w: number;
  h: number;
  vx: number;
  vy: number;
  angle: number; // radians
  angularVelocity: number;
  isFallen: boolean;
  hit: boolean;
}

export interface TrajectoryPoint {
  x: number;
  y: number;
  t: number;
  vx: number;
  vy: number;
}

export interface ProjectileState {
  active: boolean;
  x: number;
  y: number;
  vx: number; // px/s
  vy: number; // px/s (positive = downward in screen coords)
  t: number;
  mass: number;
  type: ObjectType | null;
  radius: number;
}

export interface ProjectileTelemetry {
  v0: number; // m/s
  angleDeg: number;
  elasticEnergyJ: number;
  elasticForceN: number;
  currentSpeed: number; // m/s
  currentHeight: number; // m from ground
  currentDistance: number; // m from launch point
  maxHeight: number; // m
  range: number; // m
  flightTime: number; // s
  boxesHit: number;
  boxesFallen: number;
}

export interface ProjectileEngine {
  gravity: number; // m/s^2
  selectedType: ObjectType | null;
  currentMass: number; // kg
  phase: "ready" | "pulling" | "flying" | "landed" | "reset";
  pouch: {
    x: number;
    y: number;
    isPulling: boolean;
    pullDistPx: number;
    stretchMeters: number;
    forceN: number;
    potentialEnergyJ: number;
    predictedV0: number;
    predictedAngleDeg: number;
  };
  projectile: ProjectileState;
  trajectory: TrajectoryPoint[];
  boxes: CardboardBox[];
  telemetry: ProjectileTelemetry;
  launchPoint: { x: number; y: number };
}

/** Initial 6-box pyramid target layout on the right */
export function createDefaultBoxes(): CardboardBox[] {
  const boxW = 44;
  const boxH = 44;
  const targetOriginX = 750;

  // Layer 0 (bottom, 3 boxes)
  // Layer 1 (middle, 2 boxes)
  // Layer 2 (top, 1 box)
  const boxes: CardboardBox[] = [
    { id: 1, baseX: targetOriginX - 48, baseY: GROUND_Y - boxH / 2, x: targetOriginX - 48, y: GROUND_Y - boxH / 2, w: boxW, h: boxH, vx: 0, vy: 0, angle: 0, angularVelocity: 0, isFallen: false, hit: false },
    { id: 2, baseX: targetOriginX, baseY: GROUND_Y - boxH / 2, x: targetOriginX, y: GROUND_Y - boxH / 2, w: boxW, h: boxH, vx: 0, vy: 0, angle: 0, angularVelocity: 0, isFallen: false, hit: false },
    { id: 3, baseX: targetOriginX + 48, baseY: GROUND_Y - boxH / 2, x: targetOriginX + 48, y: GROUND_Y - boxH / 2, w: boxW, h: boxH, vx: 0, vy: 0, angle: 0, angularVelocity: 0, isFallen: false, hit: false },
    { id: 4, baseX: targetOriginX - 24, baseY: GROUND_Y - boxH - boxH / 2, x: targetOriginX - 24, y: GROUND_Y - boxH - boxH / 2, w: boxW, h: boxH, vx: 0, vy: 0, angle: 0, angularVelocity: 0, isFallen: false, hit: false },
    { id: 5, baseX: targetOriginX + 24, baseY: GROUND_Y - boxH - boxH / 2, x: targetOriginX + 24, y: GROUND_Y - boxH - boxH / 2, w: boxW, h: boxH, vx: 0, vy: 0, angle: 0, angularVelocity: 0, isFallen: false, hit: false },
    { id: 6, baseX: targetOriginX, baseY: GROUND_Y - 2 * boxH - boxH / 2, x: targetOriginX, y: GROUND_Y - 2 * boxH - boxH / 2, w: boxW, h: boxH, vx: 0, vy: 0, angle: 0, angularVelocity: 0, isFallen: false, hit: false },
  ];
  return boxes;
}

export function createProjectileEngine(config?: {
  gravity?: number;
  initialType?: ObjectType | null;
  initialMass?: number;
}): ProjectileEngine {
  const selectedType: ObjectType = config?.initialType ?? "soccer";
  const spec = OBJECT_SPECS[selectedType];
  const mass = config?.initialMass ?? spec.defaultMass;

  return {
    gravity: config?.gravity ?? DEFAULT_GRAVITY,
    selectedType,
    currentMass: mass,
    phase: "ready",
    pouch: {
      x: SLINGSHOT.pouchRest.x,
      y: SLINGSHOT.pouchRest.y,
      isPulling: false,
      pullDistPx: 0,
      stretchMeters: 0,
      forceN: 0,
      potentialEnergyJ: 0,
      predictedV0: 0,
      predictedAngleDeg: 45,
    },
    projectile: {
      active: false,
      x: SLINGSHOT.pouchRest.x,
      y: SLINGSHOT.pouchRest.y,
      vx: 0,
      vy: 0,
      t: 0,
      mass,
      type: selectedType,
      radius: spec.radius,
    },
    trajectory: [],
    boxes: createDefaultBoxes(),
    telemetry: {
      v0: 0,
      angleDeg: 45,
      elasticEnergyJ: 0,
      elasticForceN: 0,
      currentSpeed: 0,
      currentHeight: (GROUND_Y - SLINGSHOT.pouchRest.y) / PIXELS_PER_METER,
      currentDistance: 0,
      maxHeight: (GROUND_Y - SLINGSHOT.pouchRest.y) / PIXELS_PER_METER,
      range: 0,
      flightTime: 0,
      boxesHit: 0,
      boxesFallen: 0,
    },
    launchPoint: { x: SLINGSHOT.pouchRest.x, y: SLINGSHOT.pouchRest.y },
  };
}

export function selectObject(engine: ProjectileEngine, type: ObjectType | null): void {
  engine.selectedType = type;
  if (type) {
    const spec = OBJECT_SPECS[type];
    engine.currentMass = spec.defaultMass;
    if (!engine.projectile.active) {
      engine.projectile.type = type;
      engine.projectile.mass = spec.defaultMass;
      engine.projectile.radius = spec.radius;
    }
  } else {
    if (!engine.projectile.active) {
      engine.projectile.type = null;
    }
  }
  recalculatePredictions(engine);
}

export function setObjectMass(engine: ProjectileEngine, mass: number): void {
  if (mass <= 0 || !Number.isFinite(mass)) return;
  engine.currentMass = mass;
  if (!engine.projectile.active) {
    engine.projectile.mass = mass;
  }
  recalculatePredictions(engine);
}

export function setGravity(engine: ProjectileEngine, g: number): void {
  if (g <= 0 || !Number.isFinite(g)) return;
  engine.gravity = g;
}

export function startPull(engine: ProjectileEngine, targetX: number, targetY: number): void {
  // If projectile is currently flying, do not pull until it lands
  if (engine.projectile.active) return;
  engine.pouch.isPulling = true;
  engine.phase = "pulling";
  updatePull(engine, targetX, targetY);
}

export function updatePull(engine: ProjectileEngine, targetX: number, targetY: number): void {
  if (!engine.pouch.isPulling) return;

  const rest = SLINGSHOT.pouchRest;
  let dx = targetX - rest.x;
  let dy = targetY - rest.y;

  // Only allow pulling left and down / around slingshot (cannot pull into shooting direction)
  if (dx > 5) dx = 5;

  const dist = Math.hypot(dx, dy);
  if (dist > MAX_PULL_PX) {
    dx = (dx / dist) * MAX_PULL_PX;
    dy = (dy / dist) * MAX_PULL_PX;
  }

  engine.pouch.x = rest.x + dx;
  engine.pouch.y = rest.y + dy;

  const currentDist = Math.hypot(dx, dy);
  engine.pouch.pullDistPx = currentDist;
  const stretchM = (currentDist / MAX_PULL_PX) * MAX_PULL_METERS;
  engine.pouch.stretchMeters = stretchM;

  // Hooke's Law: F = k * x
  const force = SPRING_K * stretchM;
  // Elastic Energy: E = 0.5 * k * x^2
  const energy = 0.5 * SPRING_K * stretchM * stretchM;

  engine.pouch.forceN = force;
  engine.pouch.potentialEnergyJ = energy;
  engine.telemetry.elasticForceN = force;
  engine.telemetry.elasticEnergyJ = energy;

  // Launch angle: opposite of pull vector (-dx, -dy)
  // In screen coordinates: y points down, so -dy is upwards
  const launchVx = -dx;
  const launchVy = -dy; // positive = upward in world physics
  const angleRad = Math.atan2(launchVy, Math.max(0.01, launchVx));
  let angleDeg = (angleRad * 180) / Math.PI;
  if (angleDeg < 5) angleDeg = 5;
  if (angleDeg > 85) angleDeg = 85;
  engine.pouch.predictedAngleDeg = angleDeg;

  // Predicted v0: 0.5 * m * v0^2 = eta * energy => v0 = sqrt(2 * eta * energy / m)
  if (engine.selectedType && energy > 0.05) {
    const rawV0 = Math.sqrt((2 * SPRING_EFFICIENCY * energy) / engine.currentMass);
    engine.pouch.predictedV0 = Math.min(rawV0, MAX_V0_CAP);
  } else {
    engine.pouch.predictedV0 = 0;
  }

  // Update idle projectile position to follow pouch
  if (!engine.projectile.active && engine.selectedType) {
    engine.projectile.x = engine.pouch.x;
    engine.projectile.y = engine.pouch.y;
  }
}

export function releasePull(engine: ProjectileEngine): boolean {
  if (!engine.pouch.isPulling) return false;
  engine.pouch.isPulling = false;

  const dist = engine.pouch.pullDistPx;

  // If pulled too little or canceled, snap back to rest
  if (dist < MIN_PULL_PX) {
    engine.pouch.x = SLINGSHOT.pouchRest.x;
    engine.pouch.y = SLINGSHOT.pouchRest.y;
    engine.pouch.pullDistPx = 0;
    engine.pouch.stretchMeters = 0;
    engine.pouch.forceN = 0;
    engine.pouch.potentialEnergyJ = 0;
    engine.phase = "ready";
    if (!engine.projectile.active && engine.selectedType) {
      engine.projectile.x = SLINGSHOT.pouchRest.x;
      engine.projectile.y = SLINGSHOT.pouchRest.y;
    }
    return false;
  }

  // Calculate actual release parameters
  const energy = engine.pouch.potentialEnergyJ;
  const angleDeg = engine.pouch.predictedAngleDeg;
  const angleRad = (angleDeg * Math.PI) / 180;

  // Snap rubber pouch back
  engine.pouch.x = SLINGSHOT.pouchRest.x;
  engine.pouch.y = SLINGSHOT.pouchRest.y;
  engine.pouch.pullDistPx = 0;
  engine.pouch.stretchMeters = 0;

  // If no object selected, the rubber band merely snaps back
  if (!engine.selectedType) {
    engine.phase = "ready";
    return false;
  }

  // Launch projectile
  const v0 = Math.min(
    Math.sqrt((2 * SPRING_EFFICIENCY * energy) / engine.currentMass),
    MAX_V0_CAP
  );

  const v0Px = v0 * PIXELS_PER_METER;
  const vxPx = v0Px * Math.cos(angleRad);
  const vyPx = -v0Px * Math.sin(angleRad); // negative = moving upwards in screen pixels

  engine.launchPoint = { x: SLINGSHOT.pouchRest.x, y: SLINGSHOT.pouchRest.y };
  engine.projectile = {
    active: true,
    x: SLINGSHOT.pouchRest.x,
    y: SLINGSHOT.pouchRest.y,
    vx: vxPx,
    vy: vyPx,
    t: 0,
    mass: engine.currentMass,
    type: engine.selectedType,
    radius: OBJECT_SPECS[engine.selectedType].radius,
  };

  engine.trajectory = [
    {
      x: SLINGSHOT.pouchRest.x,
      y: SLINGSHOT.pouchRest.y,
      t: 0,
      vx: v0 * Math.cos(angleRad),
      vy: v0 * Math.sin(angleRad),
    },
  ];

  engine.telemetry.v0 = v0;
  engine.telemetry.angleDeg = angleDeg;
  engine.telemetry.currentSpeed = v0;
  engine.telemetry.currentHeight = (GROUND_Y - SLINGSHOT.pouchRest.y) / PIXELS_PER_METER;
  engine.telemetry.currentDistance = 0;
  engine.telemetry.maxHeight = engine.telemetry.currentHeight;
  engine.telemetry.range = 0;
  engine.telemetry.flightTime = 0;
  engine.phase = "flying";

  return true;
}

export function step(engine: ProjectileEngine, dt: number): void {
  // Clamp dt to avoid tunneling
  const clampedDt = Math.min(Math.max(dt, 0), 0.05);

  // 1. Advance Projectile Physics
  if (engine.projectile.active) {
    const p = engine.projectile;
    p.t += clampedDt;

    // Gravity in pixel/s^2: g * PIXELS_PER_METER
    const gPx = engine.gravity * PIXELS_PER_METER;
    p.vy += gPx * clampedDt;

    p.x += p.vx * clampedDt;
    p.y += p.vy * clampedDt;

    // Real physics metric conversion
    const currentSpeedM = Math.hypot(p.vx, p.vy) / PIXELS_PER_METER;
    const currentHeightM = Math.max(0, (GROUND_Y - p.y) / PIXELS_PER_METER);
    const currentDistM = (p.x - engine.launchPoint.x) / PIXELS_PER_METER;

    engine.telemetry.currentSpeed = currentSpeedM;
    engine.telemetry.currentHeight = currentHeightM;
    engine.telemetry.currentDistance = currentDistM;
    engine.telemetry.flightTime = p.t;
    if (currentHeightM > engine.telemetry.maxHeight) {
      engine.telemetry.maxHeight = currentHeightM;
    }

    // Sample trajectory points every ~0.03s
    const lastPt = engine.trajectory[engine.trajectory.length - 1];
    if (!lastPt || p.t - lastPt.t >= 0.03) {
      engine.trajectory.push({
        x: p.x,
        y: p.y,
        t: p.t,
        vx: p.vx / PIXELS_PER_METER,
        vy: -p.vy / PIXELS_PER_METER,
      });
    }

    // Check collision with cardboard boxes
    for (const box of engine.boxes) {
      if (checkCollision(p, box)) {
        handleBoxImpact(engine, p, box);
        break; // one box direct hit per step
      }
    }

    // Check Ground Collision
    if (p.y >= GROUND_Y - p.radius) {
      p.y = GROUND_Y - p.radius;
      p.active = false;
      engine.phase = "landed";
      engine.telemetry.range = Math.max(0, (p.x - engine.launchPoint.x) / PIXELS_PER_METER);
      engine.telemetry.currentSpeed = 0;
      engine.telemetry.currentHeight = 0;
    }
  }

  // 2. Advance Box Physics (falls, topples, slides with friction)
  const gPx = engine.gravity * PIXELS_PER_METER;
  for (const box of engine.boxes) {
    if (box.isFallen || Math.abs(box.vx) > 0.1 || Math.abs(box.vy) > 0.1) {
      box.vy += gPx * clampedDt;
      box.x += box.vx * clampedDt;
      box.y += box.vy * clampedDt;
      box.angle += box.angularVelocity * clampedDt;

      // Ground collision for boxes
      const boxBottom = box.y + box.h / 2;
      if (boxBottom >= GROUND_Y) {
        box.y = GROUND_Y - box.h / 2;
        box.vy = 0;
        // Friction on ground
        box.vx *= 0.88;
        box.angularVelocity *= 0.82;
      }
    }
  }

  // Count fallen and hit boxes
  let hitCount = 0;
  let fallenCount = 0;
  for (const b of engine.boxes) {
    if (b.hit) hitCount++;
    if (b.isFallen) fallenCount++;
  }
  engine.telemetry.boxesHit = hitCount;
  engine.telemetry.boxesFallen = fallenCount;
}

function checkCollision(p: ProjectileState, box: CardboardBox): boolean {
  // AABB with circle check
  const halfW = box.w / 2;
  const halfH = box.h / 2;

  const nearestX = Math.max(box.x - halfW, Math.min(p.x, box.x + halfW));
  const nearestY = Math.max(box.y - halfH, Math.min(p.y, box.y + halfH));

  const dx = p.x - nearestX;
  const dy = p.y - nearestY;

  return dx * dx + dy * dy < p.radius * p.radius;
}

function handleBoxImpact(engine: ProjectileEngine, p: ProjectileState, box: CardboardBox): void {
  box.hit = true;

  // Impact momentum in kg * m/s
  const speedM = Math.hypot(p.vx, p.vy) / PIXELS_PER_METER;
  const momentum = p.mass * speedM; // kg*m/s

  // Thresholds based on object mass & speed
  // Paper plane (0.005 kg * 30 m/s = 0.15 kg*m/s) -> minor nudge, doesn't topple
  // Soccer ball (0.43 kg * 15 m/s = 6.45 kg*m/s) -> topples 1-2 boxes
  // Stone (2.0 kg * 10 m/s = 20 kg*m/s) -> massive topple!
  if (momentum < 0.8) {
    // Light impact: tilt slightly and wobble
    box.angle = (p.vx > 0 ? 1 : -1) * 0.12;
    box.vx += (p.vx / PIXELS_PER_METER) * 0.4;
  } else {
    // Toppling impact
    box.isFallen = true;
    const impulseFactor = Math.min(momentum / 4, 3.5);
    box.vx = (p.vx / PIXELS_PER_METER) * (1.2 * impulseFactor);
    box.vy = -Math.abs(p.vy / PIXELS_PER_METER) * 0.8;
    box.angularVelocity = (p.vx > 0 ? 1 : -1) * (1.5 * impulseFactor);

    // Propagate small shock to neighbouring boxes in pyramid
    for (const other of engine.boxes) {
      if (other.id !== box.id) {
        const dist = Math.hypot(other.x - box.x, other.y - box.y);
        if (dist < 70 && momentum >= 3.0) {
          other.isFallen = true;
          other.vx += box.vx * 0.35;
          other.vy -= 20;
          other.angularVelocity += (box.vx > 0 ? 1 : -1) * 0.8;
        }
      }
    }
  }

  // Deflect projectile downwards after collision
  p.vx = p.vx * 0.25;
  p.vy = Math.max(100, Math.abs(p.vy) * 0.5);
}

export function resetEngine(engine: ProjectileEngine): void {
  engine.phase = "ready";
  engine.pouch.x = SLINGSHOT.pouchRest.x;
  engine.pouch.y = SLINGSHOT.pouchRest.y;
  engine.pouch.isPulling = false;
  engine.pouch.pullDistPx = 0;
  engine.pouch.stretchMeters = 0;
  engine.pouch.forceN = 0;
  engine.pouch.potentialEnergyJ = 0;

  engine.projectile.active = false;
  engine.projectile.x = SLINGSHOT.pouchRest.x;
  engine.projectile.y = SLINGSHOT.pouchRest.y;
  engine.projectile.vx = 0;
  engine.projectile.vy = 0;
  engine.projectile.t = 0;

  engine.trajectory = [];
  engine.boxes = createDefaultBoxes();

  engine.telemetry.v0 = 0;
  engine.telemetry.currentSpeed = 0;
  engine.telemetry.currentHeight = (GROUND_Y - SLINGSHOT.pouchRest.y) / PIXELS_PER_METER;
  engine.telemetry.currentDistance = 0;
  engine.telemetry.maxHeight = engine.telemetry.currentHeight;
  engine.telemetry.range = 0;
  engine.telemetry.flightTime = 0;
  engine.telemetry.boxesHit = 0;
  engine.telemetry.boxesFallen = 0;

  recalculatePredictions(engine);
}

function recalculatePredictions(engine: ProjectileEngine): void {
  if (engine.selectedType) {
    const spec = OBJECT_SPECS[engine.selectedType];
    engine.projectile.radius = spec.radius;
    engine.projectile.type = engine.selectedType;
  }
}
