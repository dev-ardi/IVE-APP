/**
 * Canvas 2D Renderer and Animation Controller for Projectile Motion Slingshot Simulation.
 * Renders the slingshot, elastic bands, projectile, parabolic trajectory, ground scale,
 * and physics-responsive cardboard box targets.
 */

import {
  CardboardBox,
  GROUND_Y,
  PIXELS_PER_METER,
  ProjectileEngine,
  ProjectileTelemetry,
  SLINGSHOT,
  WORLD_H,
  WORLD_W,
  releasePull,
  startPull,
  step,
  updatePull,
} from "./projectile-sim";

export interface ProjectileControllerOptions {
  engine: ProjectileEngine;
  onTelemetry: (telemetry: ProjectileTelemetry, phase: ProjectileEngine["phase"]) => void;
}

export class ProjectileController {
  private engine: ProjectileEngine;
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D | null;
  private readonly onTelemetry: (telemetry: ProjectileTelemetry, phase: ProjectileEngine["phase"]) => void;
  private raf: number | null = null;
  private lastTs: number | null = null;
  private scale = 1;
  private dpr = 1;
  private isPointerDown = false;

  constructor(canvas: HTMLCanvasElement, opts: ProjectileControllerOptions) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.engine = opts.engine;
    this.onTelemetry = opts.onTelemetry;

    this.initEvents();
    this.resize();
    this.emitTelemetry();
    this.render();
  }

  setEngine(engine: ProjectileEngine): void {
    this.engine = engine;
    this.emitTelemetry();
    this.render();
    this.ensureLoop();
  }

  getEngine(): ProjectileEngine {
    return this.engine;
  }

  private initEvents(): void {
    const canvas = this.canvas;

    const getCanvasPos = (e: PointerEvent): { x: number; y: number } => {
      const rect = canvas.getBoundingClientRect();
      const cssX = e.clientX - rect.left;
      const cssY = e.clientY - rect.top;
      return {
        x: cssX / this.scale,
        y: cssY / this.scale,
      };
    };

    const onPointerDown = (e: PointerEvent) => {
      const pos = getCanvasPos(e);
      // Allow pulling if clicking near the slingshot pouch or rest area
      const distToPouch = Math.hypot(pos.x - this.engine.pouch.x, pos.y - this.engine.pouch.y);
      const distToRest = Math.hypot(pos.x - SLINGSHOT.pouchRest.x, pos.y - SLINGSHOT.pouchRest.y);

      if (distToPouch < 60 || distToRest < 70) {
        this.isPointerDown = true;
        canvas.setPointerCapture(e.pointerId);
        startPull(this.engine, pos.x, pos.y);
        this.emitTelemetry();
        this.render();
        this.ensureLoop();
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!this.isPointerDown) return;
      const pos = getCanvasPos(e);
      updatePull(this.engine, pos.x, pos.y);
      this.emitTelemetry();
      this.render();
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!this.isPointerDown) return;
      this.isPointerDown = false;
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch {
        // ignore if not captured
      }
      releasePull(this.engine);
      this.emitTelemetry();
      this.render();
      this.ensureLoop();
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);

    this.cleanupEvents = () => {
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
    };
  }

  private cleanupEvents: () => void = () => {};

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
    this.cleanupEvents();
  }

  ensureLoop(): void {
    if (this.raf !== null) return;
    this.lastTs = null;
    this.raf = requestAnimationFrame(this.frame);
  }

  private frame = (ts: number): void => {
    const dt = this.lastTs === null ? 1 / 60 : Math.min((ts - this.lastTs) / 1000, 0.05);
    this.lastTs = ts;

    const wasFlying = this.engine.projectile.active;
    const hasMovingBoxes = this.engine.boxes.some(
      (b) => Math.abs(b.vx) > 0.1 || Math.abs(b.vy) > 0.1
    );

    step(this.engine, dt);

    this.render();
    this.emitTelemetry();

    // Keep animating if projectile is active or boxes are still moving or pouch is being pulled
    if (this.engine.projectile.active || hasMovingBoxes || this.engine.pouch.isPulling) {
      this.raf = requestAnimationFrame(this.frame);
    } else if (wasFlying && !this.engine.projectile.active) {
      // Just landed
      this.render();
      this.emitTelemetry();
      this.raf = null;
      this.lastTs = null;
    } else {
      this.raf = null;
      this.lastTs = null;
    }
  };

  private emitTelemetry(): void {
    this.onTelemetry({ ...this.engine.telemetry }, this.engine.phase);
  }

  render(): void {
    const ctx = this.ctx;
    if (!ctx || this.canvas.width === 0) return;

    const k = this.dpr * this.scale;
    ctx.setTransform(k, 0, 0, k, 0, 0);
    ctx.clearRect(0, 0, WORLD_W, WORLD_H);

    drawSkyAndEnvironment(ctx);
    drawGroundAndScale(ctx);
    drawTrajectory(ctx, this.engine);
    drawCardboardBoxes(ctx, this.engine.boxes);
    drawSlingshot(ctx, this.engine);
    drawActiveProjectile(ctx, this.engine);
    drawPullAimHUD(ctx, this.engine);
  }
}

// ---------------------------------------------------------------------------
// Drawing Routines
// ---------------------------------------------------------------------------

function drawSkyAndEnvironment(ctx: CanvasRenderingContext2D): void {
  // Atmospheric sky gradient
  const sky = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
  sky.addColorStop(0, "#08131e");
  sky.addColorStop(0.7, "#0f2334");
  sky.addColorStop(1, "#16334a");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, WORLD_W, GROUND_Y);

  // Subtle clouds / background hills
  ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
  ctx.beginPath();
  ctx.ellipse(320, 390, 240, 70, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(780, 380, 280, 85, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawGroundAndScale(ctx: CanvasRenderingContext2D): void {
  // Ground soil
  const ground = ctx.createLinearGradient(0, GROUND_Y, 0, WORLD_H);
  ground.addColorStop(0, "#1e293b");
  ground.addColorStop(1, "#0f172a");
  ctx.fillStyle = ground;
  ctx.fillRect(0, GROUND_Y, WORLD_W, WORLD_H - GROUND_Y);

  // Grass top strip
  ctx.fillStyle = "#10b981";
  ctx.fillRect(0, GROUND_Y - 3, WORLD_W, 4);

  // Ground distance tick markers (every 5 meters = 100px)
  ctx.fillStyle = "rgba(148, 163, 184, 0.7)";
  ctx.strokeStyle = "rgba(148, 163, 184, 0.35)";
  ctx.lineWidth = 1;
  ctx.font = "600 10px monospace";
  ctx.textAlign = "center";

  for (let m = 0; m <= 45; m += 5) {
    const x = SLINGSHOT.baseX + m * PIXELS_PER_METER;
    if (x > WORLD_W - 20) break;

    ctx.beginPath();
    ctx.moveTo(x, GROUND_Y);
    ctx.lineTo(x, GROUND_Y + 7);
    ctx.stroke();

    ctx.fillText(`${m}m`, x, GROUND_Y + 18);
  }
}

function drawSlingshot(ctx: CanvasRenderingContext2D, engine: ProjectileEngine): void {
  const { baseX, baseY, leftFork, rightFork } = SLINGSHOT;
  const pouch = engine.pouch;

  // 1. Back rubber band (connected to left branch)
  ctx.strokeStyle = "#c2410c";
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(leftFork.x, leftFork.y);
  ctx.lineTo(pouch.x, pouch.y);
  ctx.stroke();

  // 2. Slingshot Wooden Fork Structure
  // Main trunk
  const trunkGrad = ctx.createLinearGradient(baseX - 10, baseY, baseX + 10, baseY);
  trunkGrad.addColorStop(0, "#78350f");
  trunkGrad.addColorStop(0.5, "#b45309");
  trunkGrad.addColorStop(1, "#451a03");
  ctx.fillStyle = trunkGrad;

  // Base anchored in soil
  ctx.beginPath();
  ctx.moveTo(baseX - 12, baseY + 10);
  ctx.lineTo(baseX + 12, baseY + 10);
  ctx.lineTo(baseX + 9, baseY - 65);
  ctx.lineTo(baseX - 9, baseY - 65);
  ctx.closePath();
  ctx.fill();

  // Left & right wooden fork branches
  ctx.beginPath();
  ctx.moveTo(baseX - 9, baseY - 65);
  ctx.quadraticCurveTo(baseX - 14, baseY - 90, leftFork.x, leftFork.y);
  ctx.lineTo(leftFork.x + 8, leftFork.y);
  ctx.quadraticCurveTo(baseX, baseY - 80, rightFork.x - 8, rightFork.y);
  ctx.lineTo(rightFork.x, rightFork.y);
  ctx.quadraticCurveTo(baseX + 14, baseY - 90, baseX + 9, baseY - 65);
  ctx.closePath();
  ctx.fill();

  // Branch tip caps
  ctx.fillStyle = "#9a3412";
  ctx.beginPath();
  ctx.arc(leftFork.x + 4, leftFork.y, 5, 0, Math.PI * 2);
  ctx.arc(rightFork.x - 4, rightFork.y, 5, 0, Math.PI * 2);
  ctx.fill();

  // 3. Resting / Loaded Object inside Pouch (when idle or pulling)
  if (!engine.projectile.active && engine.selectedType) {
    drawObjectShape(ctx, engine.selectedType, pouch.x, pouch.y, -pouch.predictedAngleDeg);
  }

  // 4. Front rubber band (connected to right branch)
  ctx.strokeStyle = "#ea580c";
  ctx.lineWidth = 4.5;
  ctx.beginPath();
  ctx.moveTo(rightFork.x, rightFork.y);
  ctx.lineTo(pouch.x, pouch.y);
  ctx.stroke();

  // 5. Leather Pouch
  ctx.fillStyle = "#451a03";
  ctx.strokeStyle = "#78350f";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.ellipse(pouch.x, pouch.y, 9, 13, (pouch.predictedAngleDeg * Math.PI) / 180, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
}

function drawActiveProjectile(ctx: CanvasRenderingContext2D, engine: ProjectileEngine): void {
  const p = engine.projectile;
  if (!p.active || !p.type) return;

  // Calculate flight rotation angle from current velocity
  const angle = Math.atan2(p.vy, p.vx);
  drawObjectShape(ctx, p.type, p.x, p.y, (angle * 180) / Math.PI);
}

function drawObjectShape(
  ctx: CanvasRenderingContext2D,
  type: string,
  x: number,
  y: number,
  angleDeg: number
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((angleDeg * Math.PI) / 180);

  if (type === "stone") {
    // Stone: textured irregular pebble
    ctx.fillStyle = "#78716c";
    ctx.strokeStyle = "#44403c";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-11, -8);
    ctx.lineTo(8, -12);
    ctx.lineTo(13, 2);
    ctx.lineTo(7, 11);
    ctx.lineTo(-9, 10);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Highlights
    ctx.fillStyle = "rgba(255,255,255,0.2)";
    ctx.beginPath();
    ctx.arc(-2, -3, 4, 0, Math.PI * 2);
    ctx.fill();
  } else if (type === "plane") {
    // Paper Plane: origami folded delta
    ctx.fillStyle = "#f8fafc";
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 1.2;

    // Wing body
    ctx.beginPath();
    ctx.moveTo(16, 0); // nose
    ctx.lineTo(-14, -11); // left wingtip
    ctx.lineTo(-7, 0); // center notch
    ctx.lineTo(-14, 11); // right wingtip
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Center fold spine
    ctx.fillStyle = "#e2e8f0";
    ctx.beginPath();
    ctx.moveTo(16, 0);
    ctx.lineTo(-7, 0);
    ctx.lineTo(-14, 0);
    ctx.stroke();
  } else {
    // Soccer ball
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(0, 0, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#0f172a";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Center pentagon
    ctx.fillStyle = "#0f172a";
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const a = (i * Math.PI * 2) / 5 - Math.PI / 2;
      const px = Math.cos(a) * 5;
      const py = Math.sin(a) * 5;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
  }

  ctx.restore();
}

function drawTrajectory(ctx: CanvasRenderingContext2D, engine: ProjectileEngine): void {
  const traj = engine.trajectory;
  if (traj.length === 0) return;

  // Dotted parabolic flight path
  ctx.strokeStyle = "#38bdf8";
  ctx.lineWidth = 2.5;
  ctx.setLineDash([5, 4]);
  ctx.beginPath();
  for (let i = 0; i < traj.length; i++) {
    if (i === 0) ctx.moveTo(traj[i].x, traj[i].y);
    else ctx.lineTo(traj[i].x, traj[i].y);
  }
  ctx.stroke();
  ctx.setLineDash([]); // reset dash

  // Periodic waypoint dots
  ctx.fillStyle = "rgba(56, 189, 248, 0.7)";
  for (let i = 0; i < traj.length; i += 6) {
    ctx.beginPath();
    ctx.arc(traj[i].x, traj[i].y, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Peak Height Indicator
  const peakY = Math.min(...traj.map((p) => p.y));
  const peakPoint = traj.find((p) => p.y === peakY);
  if (peakPoint && engine.telemetry.maxHeight > 5) {
    // Dashed vertical projection to ground
    ctx.strokeStyle = "rgba(244, 63, 94, 0.5)";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(peakPoint.x, GROUND_Y);
    ctx.lineTo(peakPoint.x, peakPoint.y);
    ctx.stroke();
    ctx.setLineDash([]);

    // Peak marker
    ctx.fillStyle = "#f43f5e";
    ctx.beginPath();
    ctx.arc(peakPoint.x, peakPoint.y, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = "700 10px monospace";
    ctx.textAlign = "center";
    ctx.fillStyle = "#f43f5e";
    ctx.fillText(`Hmax: ${engine.telemetry.maxHeight.toFixed(1)}m`, peakPoint.x, peakPoint.y - 8);
  }

  // Current In-Flight Projections
  if (engine.projectile.active) {
    const p = engine.projectile;
    // Vertical drop line to ground
    ctx.strokeStyle = "rgba(103, 232, 249, 0.4)";
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);
    ctx.beginPath();
    ctx.moveTo(p.x, GROUND_Y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    ctx.setLineDash([]);

    // Real-time floating telemetry tag following projectile
    ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
    ctx.strokeStyle = "rgba(56, 189, 248, 0.5)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(p.x + 12, p.y - 28, 92, 34, 6);
    ctx.fill();
    ctx.stroke();

    ctx.font = "600 9.5px monospace";
    ctx.textAlign = "left";
    ctx.fillStyle = "#38bdf8";
    ctx.fillText(`v: ${engine.telemetry.currentSpeed.toFixed(1)} m/s`, p.x + 16, p.y - 17);
    ctx.fillStyle = "#f8fafc";
    ctx.fillText(`h: ${engine.telemetry.currentHeight.toFixed(1)} m`, p.x + 16, p.y - 6);
  }

  // Landing marker when finished
  if (engine.phase === "landed") {
    const last = traj[traj.length - 1];
    ctx.fillStyle = "#10b981";
    ctx.beginPath();
    ctx.arc(last.x, GROUND_Y, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = "700 11px monospace";
    ctx.textAlign = "center";
    ctx.fillStyle = "#10b981";
    ctx.fillText(`Jarak (R): ${engine.telemetry.range.toFixed(1)} m`, last.x, GROUND_Y + 34);
  }
}

function drawCardboardBoxes(ctx: CanvasRenderingContext2D, boxes: CardboardBox[]): void {
  for (const box of boxes) {
    ctx.save();
    ctx.translate(box.x, box.y);
    ctx.rotate(box.angle);

    // Box body (kraft cardboard)
    ctx.fillStyle = box.hit ? "#b45309" : "#d97706";
    ctx.strokeStyle = "#78350f";
    ctx.lineWidth = 2;
    ctx.fillRect(-box.w / 2, -box.h / 2, box.w, box.h);
    ctx.strokeRect(-box.w / 2, -box.h / 2, box.w, box.h);

    // Cardboard sealing tape across center
    ctx.fillStyle = "rgba(254, 240, 138, 0.55)";
    ctx.fillRect(-box.w / 2, -5, box.w, 10);

    // Fold line
    ctx.strokeStyle = "rgba(69, 26, 3, 0.35)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, -box.h / 2);
    ctx.lineTo(0, box.h / 2);
    ctx.stroke();

    // Box label / stamp
    ctx.font = "800 8.5px monospace";
    ctx.textAlign = "center";
    ctx.fillStyle = "#451a03";
    ctx.fillText("IVE", 0, 14);

    ctx.restore();
  }
}

function drawPullAimHUD(ctx: CanvasRenderingContext2D, engine: ProjectileEngine): void {
  const pouch = engine.pouch;
  if (!pouch.isPulling) return;

  const pullDist = pouch.pullDistPx;
  if (pullDist < 8) return;

  const rest = SLINGSHOT.pouchRest;
  const dx = pouch.x - rest.x;
  const dy = pouch.y - rest.y;

  // Aiming trajectory direction line (opposite of pull vector)
  const aimDx = -dx;
  const aimDy = -dy;
  const aimLen = Math.hypot(aimDx, aimDy);

  if (aimLen > 1) {
    const dirX = aimDx / aimLen;
    const dirY = aimDy / aimLen;

    ctx.strokeStyle = "rgba(250, 204, 21, 0.65)";
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(rest.x, rest.y);
    ctx.lineTo(rest.x + dirX * 90, rest.y + dirY * 90);
    ctx.stroke();
    ctx.setLineDash([]);

    // Arrow tip
    ctx.fillStyle = "#facc15";
    ctx.beginPath();
    ctx.arc(rest.x + dirX * 90, rest.y + dirY * 90, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  // Floating HUD Badge near pouch
  const hudX = pouch.x - 120;
  const hudY = pouch.y - 65;

  ctx.fillStyle = "rgba(15, 23, 42, 0.9)";
  ctx.strokeStyle = "rgba(234, 88, 12, 0.7)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(hudX, hudY, 114, 52, 8);
  ctx.fill();
  ctx.stroke();

  ctx.font = "700 9.5px monospace";
  ctx.textAlign = "left";
  ctx.fillStyle = "#fdba74";
  ctx.fillText(`F: ${pouch.forceN.toFixed(0)} N`, hudX + 10, hudY + 16);
  ctx.fillText(`E_el: ${pouch.potentialEnergyJ.toFixed(1)} J`, hudX + 10, hudY + 30);
  ctx.fillStyle = "#fde047";
  ctx.fillText(
    `v0: ${pouch.predictedV0.toFixed(1)} m/s (θ=${pouch.predictedAngleDeg.toFixed(0)}°)`,
    hudX + 10,
    hudY + 44
  );
}
