/**
 * Canvas 2D Renderer and Animation Controller for Newtonian Gravity Simulation.
 * Renders the educational landscape, 5-meter apple tree, seated Isaac Newton,
 * falling objects (Apple, Durian, Feather, Iron Ball), live in-canvas telemetry HUD,
 * and the post-impact thought bubble displaying Newton's Universal Law of Gravitation.
 */

import {
  GROUND_Y,
  GravityEngine,
  GravityTelemetry,
  NEWTON_HEAD,
  PIXELS_PER_METER,
  TREE_TRUNK,
  WORLD_H,
  WORLD_W,
  stepGravity,
} from "./newtonian-gravity-sim";

export interface GravityControllerOptions {
  engine: GravityEngine;
  onTelemetry: (telemetry: GravityTelemetry, phase: GravityEngine["phase"]) => void;
}

export class GravityController {
  private engine: GravityEngine;
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D | null;
  private readonly onTelemetry: (telemetry: GravityTelemetry, phase: GravityEngine["phase"]) => void;
  private raf: number | null = null;
  private lastTs: number | null = null;
  private scale = 1;
  private dpr = 1;
  private isDestroyed = false;

  constructor(canvas: HTMLCanvasElement, opts: GravityControllerOptions) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.engine = opts.engine;
    this.onTelemetry = opts.onTelemetry;

    this.resize();
    this.emitTelemetry();
    this.render();
    this.ensureLoop();
  }

  setEngine(engine: GravityEngine): void {
    this.engine = engine;
    this.emitTelemetry();
    this.render();
    this.ensureLoop();
  }

  getEngine(): GravityEngine {
    return this.engine;
  }

  resize(): void {
    if (this.isDestroyed || !this.canvas) return;
    const parent = this.canvas.parentElement;
    if (!parent) return;

    const rect = parent.getBoundingClientRect();
    const width = Math.max(rect.width, 320);
    this.scale = width / WORLD_W;
    const height = WORLD_H * this.scale;

    this.dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;

    this.canvas.width = Math.round(width * this.dpr);
    this.canvas.height = Math.round(height * this.dpr);
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;

    this.render();
  }

  destroy(): void {
    this.isDestroyed = true;
    if (this.raf !== null) {
      cancelAnimationFrame(this.raf);
      this.raf = null;
    }
  }

  private ensureLoop(): void {
    if (this.raf === null && !this.isDestroyed) {
      this.lastTs = null;
      this.raf = requestAnimationFrame(this.loop);
    }
  }

  private loop = (ts: number): void => {
    if (this.isDestroyed) return;

    if (this.lastTs === null) {
      this.lastTs = ts;
    }

    const dt = Math.min((ts - this.lastTs) / 1000, 0.05);
    this.lastTs = ts;

    if (this.engine.phase === "falling") {
      stepGravity(this.engine, dt);
      this.emitTelemetry();
    }

    this.render();

    // Keep loop active while falling or during ready/impacted state for animations
    this.raf = requestAnimationFrame(this.loop);
  };

  private emitTelemetry(): void {
    this.onTelemetry({ ...this.engine.telemetry }, this.engine.phase);
  }

  render(): void {
    const ctx = this.ctx;
    if (!ctx) return;

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.scale(this.scale * this.dpr, this.scale * this.dpr);

    // 1. Sky & Landscape Background
    this.drawSky(ctx);
    this.drawMountains(ctx);
    this.drawGround(ctx);
    this.drawHeightRuler(ctx);

    // 2. Large Apple Tree (Left Side)
    this.drawAppleTree(ctx);

    // 3. Seated Isaac Newton (Under the Tree)
    this.drawNewton(ctx);

    // 4. Trajectory Fall Line & Simulation Object
    this.drawFallPathAndObject(ctx);

    // 5. In-Canvas Live Telemetry HUD (Follows Object)
    this.drawLiveTelemetryHud(ctx);

    // 6. Post-Impact Thought Bubble (Newton's Insight)
    if (this.engine.telemetry.thoughtBubbleVisible) {
      this.drawThoughtBubble(ctx);
    }

    ctx.restore();
  }

  private drawSky(ctx: CanvasRenderingContext2D): void {
    // Sky gradient: morning educational blue to soft horizon
    const skyGrad = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
    skyGrad.addColorStop(0, "#bae6fd"); // sky-200
    skyGrad.addColorStop(0.5, "#e0f2fe"); // sky-100
    skyGrad.addColorStop(1, "#f0f9ff"); // sky-50
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);

    // Sun with warm glow
    const sunGrad = ctx.createRadialGradient(850, 90, 10, 850, 90, 80);
    sunGrad.addColorStop(0, "rgba(254, 240, 138, 0.95)");
    sunGrad.addColorStop(0.5, "rgba(253, 224, 71, 0.4)");
    sunGrad.addColorStop(1, "rgba(253, 224, 71, 0)");
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(850, 90, 80, 0, Math.PI * 2);
    ctx.fill();

    // Drifting decorative clouds
    this.drawCloud(ctx, 420, 90, 0.85);
    this.drawCloud(ctx, 680, 140, 0.65);
    this.drawCloud(ctx, 80, 70, 0.7);
  }

  private drawCloud(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number): void {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.fillStyle = "rgba(255, 255, 255, 0.85)";

    ctx.beginPath();
    ctx.arc(0, 0, 24, 0, Math.PI * 2);
    ctx.arc(22, -10, 20, 0, Math.PI * 2);
    ctx.arc(44, 0, 22, 0, Math.PI * 2);
    ctx.arc(22, 12, 16, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  private drawMountains(ctx: CanvasRenderingContext2D): void {
    // Far rolling hills / mountains
    ctx.fillStyle = "#cbd5e1"; // slate-300
    ctx.beginPath();
    ctx.moveTo(350, GROUND_Y);
    ctx.quadraticCurveTo(460, 360, 560, GROUND_Y);
    ctx.quadraticCurveTo(680, 380, 790, GROUND_Y);
    ctx.quadraticCurveTo(890, 350, WORLD_W, 460);
    ctx.lineTo(WORLD_W, GROUND_Y);
    ctx.closePath();
    ctx.fill();

    // Midground green hills
    ctx.fillStyle = "#86efac"; // green-300
    ctx.beginPath();
    ctx.moveTo(400, GROUND_Y);
    ctx.quadraticCurveTo(550, 430, 700, GROUND_Y);
    ctx.quadraticCurveTo(840, 440, WORLD_W, GROUND_Y);
    ctx.lineTo(WORLD_W, GROUND_Y);
    ctx.closePath();
    ctx.fill();
  }

  private drawGround(ctx: CanvasRenderingContext2D): void {
    // Grass layer
    const grassGrad = ctx.createLinearGradient(0, GROUND_Y - 5, 0, GROUND_Y + 15);
    grassGrad.addColorStop(0, "#22c55e"); // green-500
    grassGrad.addColorStop(1, "#16a34a"); // green-600
    ctx.fillStyle = grassGrad;
    ctx.fillRect(0, GROUND_Y, WORLD_W, 20);

    // Underground soil layer
    const soilGrad = ctx.createLinearGradient(0, GROUND_Y + 20, 0, WORLD_H);
    soilGrad.addColorStop(0, "#78350f"); // amber-900
    soilGrad.addColorStop(1, "#451a03"); // amber-950
    ctx.fillStyle = soilGrad;
    ctx.fillRect(0, GROUND_Y + 20, WORLD_W, WORLD_H - (GROUND_Y + 20));

    // Decorative grass blades
    ctx.strokeStyle = "#15803d";
    ctx.lineWidth = 2;
    for (let gx = 30; gx < WORLD_W; gx += 45) {
      ctx.beginPath();
      ctx.moveTo(gx, GROUND_Y);
      ctx.quadraticCurveTo(gx - 3, GROUND_Y - 8, gx - 5, GROUND_Y - 10);
      ctx.moveTo(gx, GROUND_Y);
      ctx.quadraticCurveTo(gx + 3, GROUND_Y - 7, gx + 6, GROUND_Y - 9);
      ctx.stroke();
    }
  }

  private drawHeightRuler(ctx: CanvasRenderingContext2D): void {
    // Subtle height reference scale (0m to 5.5m)
    const rulerX = 40;
    const topY = GROUND_Y - 5.5 * PIXELS_PER_METER;

    ctx.save();
    ctx.strokeStyle = "rgba(100, 116, 139, 0.4)";
    ctx.lineWidth = 1.5;

    // Vertical line
    ctx.beginPath();
    ctx.moveTo(rulerX, GROUND_Y);
    ctx.lineTo(rulerX, topY);
    ctx.stroke();

    ctx.font = "bold 10px monospace";
    ctx.fillStyle = "#64748b";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";

    // 1-meter major tick marks
    for (let m = 0; m <= 5.5; m += 1) {
      const y = GROUND_Y - m * PIXELS_PER_METER;
      ctx.beginPath();
      ctx.moveTo(rulerX - 6, y);
      ctx.lineTo(rulerX + 6, y);
      ctx.stroke();

      ctx.fillText(`${m}m`, rulerX - 8, y);
    }

    // Label on top
    ctx.textAlign = "center";
    ctx.fillText("Skala Tinggi (m)", rulerX + 30, topY - 12);

    ctx.restore();
  }

  private drawAppleTree(ctx: CanvasRenderingContext2D): void {
    const tx = TREE_TRUNK.x; // 190
    const ty = GROUND_Y; // 520

    ctx.save();

    // 1. Tree Trunk with warm bark texture
    const trunkGrad = ctx.createLinearGradient(tx - 35, ty, tx + 45, ty);
    trunkGrad.addColorStop(0, "#451a03");
    trunkGrad.addColorStop(0.4, "#78350f");
    trunkGrad.addColorStop(1, "#3c1802");
    ctx.fillStyle = trunkGrad;

    ctx.beginPath();
    ctx.moveTo(tx - 40, ty);
    ctx.quadraticCurveTo(tx - 30, ty - 120, tx - 25, ty - 240);
    ctx.quadraticCurveTo(tx - 20, ty - 320, tx - 15, ty - 400); // branch split
    // Main branch to right (holds apple at x=270, y=120)
    ctx.quadraticCurveTo(tx + 40, ty - 410, 275, ty - 400); // branch extends right
    ctx.lineTo(275, ty - 390);
    ctx.quadraticCurveTo(tx + 30, ty - 370, tx + 20, ty - 310);
    ctx.quadraticCurveTo(tx + 25, ty - 180, tx + 45, ty);
    ctx.closePath();
    ctx.fill();

    // Bark texture lines
    ctx.strokeStyle = "rgba(69, 26, 3, 0.4)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(tx - 10, ty - 40);
    ctx.lineTo(tx - 8, ty - 140);
    ctx.moveTo(tx + 12, ty - 60);
    ctx.lineTo(tx + 10, ty - 200);
    ctx.stroke();

    // 2. Tree Foliage (Canopy) - Rich layered green clouds
    const leafClouds = [
      { x: tx - 60, y: ty - 410, r: 85, color: "#15803d" },
      { x: tx + 40, y: ty - 430, r: 95, color: "#16a34a" },
      { x: tx - 20, y: ty - 470, r: 80, color: "#22c55e" },
      { x: tx + 80, y: ty - 390, r: 75, color: "#15803d" },
      { x: 260, y: ty - 415, r: 65, color: "#16a34a" },
      { x: tx - 70, y: ty - 340, r: 70, color: "#15803d" },
    ];

    for (const cloud of leafClouds) {
      ctx.fillStyle = cloud.color;
      ctx.beginPath();
      ctx.arc(cloud.x, cloud.y, cloud.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Small Decorative Apples hanging on the tree
    const decorativeApples = [
      { x: tx - 50, y: ty - 370 },
      { x: tx + 20, y: ty - 450 },
      { x: tx - 10, y: ty - 410 },
      { x: tx + 60, y: ty - 370 },
      { x: 230, y: ty - 390 },
      { x: tx - 80, y: ty - 330 },
    ];

    for (const apple of decorativeApples) {
      ctx.fillStyle = "#ef4444"; // red-500
      ctx.beginPath();
      ctx.arc(apple.x, apple.y, 7, 0, Math.PI * 2);
      ctx.fill();

      // Stem
      ctx.strokeStyle = "#78350f";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(apple.x, apple.y - 7);
      ctx.lineTo(apple.x + 2, apple.y - 12);
      ctx.stroke();
    }

    ctx.restore();
  }

  private drawNewton(ctx: CanvasRenderingContext2D): void {
    const nx = NEWTON_HEAD.x; // 270
    const ny = NEWTON_HEAD.y; // 452 (head center)
    const gy = GROUND_Y; // 520
    const isImpacted = this.engine.telemetry.hasCollided;

    ctx.save();

    // 1. Newton's Seated Body & Coat (17th Century Attire)
    // Seated torso leaning back against tree trunk (left)
    const coatGrad = ctx.createLinearGradient(nx - 30, ny + 20, nx + 25, gy);
    coatGrad.addColorStop(0, "#1e1b4b"); // indigo-950
    coatGrad.addColorStop(1, "#312e81"); // indigo-900
    ctx.fillStyle = coatGrad;

    ctx.beginPath();
    ctx.moveTo(nx - 22, ny + 15); // shoulder left (resting against trunk)
    ctx.lineTo(nx + 12, ny + 15); // shoulder right
    ctx.lineTo(nx + 25, gy - 10); // seated lap/thigh
    ctx.lineTo(nx + 40, gy); // foot on grass
    ctx.lineTo(nx - 35, gy); // back base against tree
    ctx.closePath();
    ctx.fill();

    // White cravat / collar ruffle
    ctx.fillStyle = "#f8fafc";
    ctx.beginPath();
    ctx.moveTo(nx - 6, ny + 14);
    ctx.lineTo(nx + 4, ny + 14);
    ctx.lineTo(nx - 1, ny + 28);
    ctx.closePath();
    ctx.fill();

    // 2. Arms, Book & Quill
    if (!isImpacted) {
      // Writing pose: left hand holds book on lap, right hand holds quill
      ctx.fillStyle = "#fef08a"; // parchment book
      ctx.fillRect(nx + 6, ny + 32, 22, 16);
      ctx.strokeStyle = "#ca8a04";
      ctx.lineWidth = 1;
      ctx.strokeRect(nx + 6, ny + 32, 22, 16);

      // Quill pen
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(nx + 24, ny + 30);
      ctx.lineTo(nx + 34, ny + 18);
      ctx.stroke();
    } else {
      // Surprised pose: hands raised in astonishment/curiosity!
      ctx.strokeStyle = "#fbcfe8"; // flesh tone arms
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(nx + 12, ny + 20);
      ctx.lineTo(nx + 32, ny + 10); // hand up
      ctx.stroke();

      // Quill flies slightly or points up
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(nx + 32, ny + 10);
      ctx.lineTo(nx + 44, ny - 4);
      ctx.stroke();
    }

    // 3. Newton's Head & Face
    const headTilt = isImpacted ? -0.15 : 0.08; // tilts up upon impact
    ctx.save();
    ctx.translate(nx, ny);
    ctx.rotate(headTilt);

    // Iconic wavy 17th-century wig / hair (silver-grey)
    ctx.fillStyle = "#e2e8f0"; // slate-200
    ctx.beginPath();
    ctx.arc(-2, -6, 17, 0, Math.PI * 2);
    ctx.arc(-14, 4, 11, 0, Math.PI * 2);
    ctx.arc(10, 4, 10, 0, Math.PI * 2);
    ctx.arc(-8, 12, 9, 0, Math.PI * 2);
    ctx.fill();

    // Face
    ctx.fillStyle = "#fecdd3"; // warm peach/rose
    ctx.beginPath();
    ctx.ellipse(0, 0, 11, 13, 0, 0, Math.PI * 2);
    ctx.fill();

    // Facial Features
    if (!isImpacted) {
      // Writing / contemplating expression
      // Eyes looking down towards notebook
      ctx.fillStyle = "#1e293b";
      ctx.beginPath();
      ctx.arc(3, -1, 1.6, 0, Math.PI * 2);
      ctx.fill();
      // Concentrated slight smile / neutral mouth
      ctx.strokeStyle = "#9f1239";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(3, 5, 3, 0, Math.PI);
      ctx.stroke();
    } else {
      // Surprised / "Aha!" epiphany expression
      // Wide open eyes looking up towards falling object!
      ctx.fillStyle = "#1e293b";
      ctx.beginPath();
      ctx.arc(2, -3, 2.4, 0, Math.PI * 2);
      ctx.fill();
      // Raised inquisitive eyebrow
      ctx.strokeStyle = "#475569";
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(-1, -7);
      ctx.lineTo(6, -8);
      ctx.stroke();
      // Open mouth (Aha!)
      ctx.fillStyle = "#881337";
      ctx.beginPath();
      ctx.ellipse(3, 4, 3, 4, 0, 0, Math.PI * 2);
      ctx.fill();

      // Fun starburst impact sparkle
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 2;
      const sparks = [
        { dx: -18, dy: -20 },
        { dx: 18, dy: -22 },
        { dx: 0, dy: -28 },
      ];
      for (const sp of sparks) {
        ctx.beginPath();
        ctx.moveTo(sp.dx, sp.dy);
        ctx.lineTo(sp.dx * 1.3, sp.dy * 1.3);
        ctx.stroke();
      }
    }

    ctx.restore();
    ctx.restore();
  }

  private drawFallPathAndObject(ctx: CanvasRenderingContext2D): void {
    const ox = NEWTON_HEAD.x; // 270
    const startY = GROUND_Y - this.engine.initialHeightM * PIXELS_PER_METER;
    const currentY = GROUND_Y - this.engine.yM * PIXELS_PER_METER;

    ctx.save();

    // 1. Subtle vertical fall guide line (dashed)
    ctx.strokeStyle = "rgba(148, 163, 184, 0.4)";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(ox, startY);
    ctx.lineTo(ox, NEWTON_HEAD.y);
    ctx.stroke();
    ctx.setLineDash([]);

    // 2. Render Falling Object
    this.drawObjectGraphic(ctx, ox, currentY);

    ctx.restore();
  }

  private drawObjectGraphic(ctx: CanvasRenderingContext2D, x: number, y: number): void {
    const type = this.engine.objectType;

    ctx.save();
    ctx.translate(x, y);

    switch (type) {
      case "apple": {
        // Red juicy apple with stem and green leaf
        ctx.fillStyle = "#ef4444";
        ctx.beginPath();
        ctx.arc(-4, 0, 11, 0, Math.PI * 2);
        ctx.arc(4, 0, 11, 0, Math.PI * 2);
        ctx.fill();

        // Highlight
        ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
        ctx.beginPath();
        ctx.arc(-4, -4, 3.5, 0, Math.PI * 2);
        ctx.fill();

        // Brown stem
        ctx.strokeStyle = "#78350f";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, -9);
        ctx.quadraticCurveTo(2, -16, 5, -17);
        ctx.stroke();

        // Green leaf
        ctx.fillStyle = "#22c55e";
        ctx.beginPath();
        ctx.ellipse(5, -14, 5, 2.5, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();
        break;
      }

      case "durian": {
        // Large oval spiky durian
        ctx.fillStyle = "#ca8a04"; // yellow-600
        ctx.beginPath();
        ctx.ellipse(0, 0, 15, 18, 0, 0, Math.PI * 2);
        ctx.fill();

        // Spikes on perimeter
        ctx.fillStyle = "#a16207";
        for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 6) {
          const sx = Math.cos(angle) * 15;
          const sy = Math.sin(angle) * 18;
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(sx * 1.3, sy * 1.3);
          ctx.lineTo(sx + 3, sy);
          ctx.fill();
        }

        // Stem
        ctx.strokeStyle = "#451a03";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, -18);
        ctx.lineTo(0, -26);
        ctx.stroke();
        break;
      }

      case "feather": {
        // Light feather with flutter wobble
        const flutterAngle =
          this.engine.useAirResistance && this.engine.phase === "falling"
            ? Math.sin(this.engine.wobblePhase) * 0.4
            : 0;

        ctx.rotate(flutterAngle);

        // Feather vane (pure white / light cyan soft gradient)
        ctx.fillStyle = "#f8fafc";
        ctx.beginPath();
        ctx.ellipse(0, 0, 7, 20, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#cbd5e1";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Quill spine
        ctx.strokeStyle = "#94a3b8";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, -20);
        ctx.lineTo(0, 24);
        ctx.stroke();
        break;
      }

      case "iron_ball": {
        // Dense dark metallic cannonball
        const ballGrad = ctx.createRadialGradient(-4, -4, 2, 0, 0, 16);
        ballGrad.addColorStop(0, "#94a3b8"); // slate-400
        ballGrad.addColorStop(0.5, "#475569"); // slate-600
        ballGrad.addColorStop(1, "#0f172a"); // slate-900
        ctx.fillStyle = ballGrad;
        ctx.beginPath();
        ctx.arc(0, 0, 15, 0, Math.PI * 2);
        ctx.fill();

        // Specular sheen
        ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
        ctx.beginPath();
        ctx.arc(-5, -5, 4, 0, Math.PI * 2);
        ctx.fill();
        break;
      }
    }

    ctx.restore();
  }

  private drawLiveTelemetryHud(ctx: CanvasRenderingContext2D): void {
    const ox = NEWTON_HEAD.x;
    const currentY = GROUND_Y - this.engine.yM * PIXELS_PER_METER;

    // HUD position: floated to the right of the falling object
    const hudX = ox + 45;
    const hudY = Math.min(Math.max(currentY - 20, 40), GROUND_Y - 90);

    ctx.save();

    // 1. Downward Acceleration Vector Arrow
    const arrowLen = 32;
    ctx.strokeStyle = "#ef4444"; // red-500
    ctx.fillStyle = "#ef4444";
    ctx.lineWidth = 2.5;

    ctx.beginPath();
    ctx.moveTo(ox + 22, currentY);
    ctx.lineTo(ox + 22, currentY + arrowLen);
    ctx.stroke();

    // Arrowhead pointing down
    ctx.beginPath();
    ctx.moveTo(ox + 17, currentY + arrowLen - 2);
    ctx.lineTo(ox + 22, currentY + arrowLen + 6);
    ctx.lineTo(ox + 27, currentY + arrowLen - 2);
    ctx.closePath();
    ctx.fill();

    // Vector label
    ctx.font = "bold 11px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("g", ox + 22, currentY - 5);

    // 2. Glassmorphic Telemetry Badge
    const padW = 145;
    const padH = 68;

    ctx.fillStyle = "rgba(15, 23, 42, 0.85)"; // slate-900 with high contrast
    ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.roundRect(hudX, hudY, padW, padH, 10);
    ctx.fill();
    ctx.stroke();

    // Telemetry text rows
    ctx.font = "bold 10px monospace";
    ctx.textAlign = "left";

    // Row 1: Acceleration
    const aVal = this.engine.telemetry.currentAcceleration.toFixed(2);
    ctx.fillStyle = "#f87171"; // red-400
    ctx.fillText(`g : ${aVal} m/s²`, hudX + 10, hudY + 16);

    // Row 2: Speed v
    const vVal = this.engine.telemetry.currentSpeed.toFixed(2);
    ctx.fillStyle = "#38bdf8"; // sky-400
    ctx.fillText(`v : ${vVal} m/s`, hudX + 10, hudY + 32);

    // Row 3: Height h
    const hVal = this.engine.telemetry.currentHeight.toFixed(2);
    ctx.fillStyle = "#4ade80"; // green-400
    ctx.fillText(`h : ${hVal} m`, hudX + 10, hudY + 48);

    // Row 4: Time t
    const tVal = this.engine.telemetry.timeElapsed.toFixed(2);
    ctx.fillStyle = "#fbbf24"; // amber-400
    ctx.fillText(`t : ${tVal} s`, hudX + 10, hudY + 62);

    ctx.restore();
  }

  private drawThoughtBubble(ctx: CanvasRenderingContext2D): void {
    // Large cartoon cloud thought bubble above Newton
    const bx = 410;
    const by = 260;
    const bw = 290;
    const bh = 140;

    ctx.save();

    // Small connector circles leading from Newton's head (270, 452) to thought bubble
    const connectors = [
      { x: 300, y: 410, r: 5 },
      { x: 325, y: 375, r: 8 },
      { x: 355, y: 340, r: 12 },
    ];

    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 2;

    for (const c of connectors) {
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    // Main cloud thought bubble
    ctx.shadowColor = "rgba(0, 0, 0, 0.15)";
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 4;

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.roundRect(bx - bw / 2, by - bh / 2, bw, bh, 20);
    ctx.fill();

    ctx.shadowColor = "transparent";
    ctx.strokeStyle = "#0284c7"; // sky-600
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Inside Thought Bubble: Formula & Pedagogical Epiphany
    ctx.textAlign = "center";

    // Title
    ctx.font = "bold 13px system-ui, sans-serif";
    ctx.fillStyle = "#0369a1"; // sky-700
    ctx.fillText("💡 HUKUM GRAVITASI UNIVERSAL", bx, by - 36);

    // Mathematical Formula
    ctx.font = "bold 18px 'Cambria Math', 'Times New Roman', serif";
    ctx.fillStyle = "#0f172a"; // slate-900
    ctx.fillText("F = G · (m₁ · m₂) / r²", bx, by - 8);

    // Explanation Caption
    ctx.font = "11px system-ui, sans-serif";
    ctx.fillStyle = "#475569"; // slate-600
    ctx.fillText("Gaya tarik gravitasi sebanding dengan perkalian", bx, by + 18);
    ctx.fillText("massa benda dan berbanding terbalik kuadrat jarak!", bx, by + 34);

    // Derivation badge to g
    ctx.font = "bold 10px monospace";
    ctx.fillStyle = "#15803d"; // green-700
    ctx.fillText("g = G·M_bumi / R_bumi² ≈ 9.81 m/s²", bx, by + 52);

    ctx.restore();
  }
}
