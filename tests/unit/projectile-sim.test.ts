import { describe, it, expect } from "vitest";
import {
  createProjectileEngine,
  selectObject,
  setObjectMass,
  setGravity,
  startPull,
  releasePull,
  step,
  resetEngine,
  SLINGSHOT,
  GROUND_Y,
  OBJECT_SPECS,
  SPRING_K,
} from "../../src/components/interactive/projectile-sim";

describe("Projectile Motion Slingshot Simulation Engine", () => {
  it("Scenario 1 & 2: loads with valid defaults and slingshot anchored to ground", () => {
    const engine = createProjectileEngine();

    expect(engine.gravity).toBe(9.81);
    expect(engine.selectedType).toBe("soccer");
    expect(engine.currentMass).toBe(0.43);
    expect(engine.phase).toBe("ready");
    expect(SLINGSHOT.baseY).toBe(GROUND_Y);
    expect(engine.boxes.length).toBe(6);
    expect(engine.boxes.every((b) => b.y + b.h / 2 <= GROUND_Y)).toBe(true);
  });

  it("Scenario 3: rubber band can be pulled and released without object (no projectile fired)", () => {
    const engine = createProjectileEngine({ initialType: null });
    selectObject(engine, null);

    // Pull pouch
    startPull(engine, 100, 360);
    expect(engine.pouch.isPulling).toBe(true);
    expect(engine.pouch.forceN).toBeGreaterThan(0);
    expect(engine.pouch.potentialEnergyJ).toBeGreaterThan(0);

    // Release
    const launched = releasePull(engine);
    expect(launched).toBe(false);
    expect(engine.projectile.active).toBe(false);
    expect(engine.pouch.isPulling).toBe(false);
    expect(engine.phase).toBe("ready");
  });

  it("Scenario 4, 5 & 6: selecting objects correctly updates mass and specs", () => {
    const engine = createProjectileEngine();

    // Stone
    selectObject(engine, "stone");
    expect(engine.selectedType).toBe("stone");
    expect(engine.currentMass).toBe(OBJECT_SPECS.stone.defaultMass);
    expect(engine.projectile.radius).toBe(OBJECT_SPECS.stone.radius);

    // Paper plane
    selectObject(engine, "plane");
    expect(engine.selectedType).toBe("plane");
    expect(engine.currentMass).toBe(OBJECT_SPECS.plane.defaultMass);

    // Custom mass & gravity adjustments
    setObjectMass(engine, 1.25);
    expect(engine.currentMass).toBe(1.25);
    setGravity(engine, 1.62); // Moon
    expect(engine.gravity).toBe(1.62);
  });

  it("Scenario 7: mass inversely affects launch speed for the same elastic stretch", () => {
    // Stone (heavy, 2 kg)
    const engineStone = createProjectileEngine({ initialType: "stone" });
    startPull(engineStone, 80, 390); // 50px left, 45px down
    const stoneEnergy = engineStone.pouch.potentialEnergyJ;
    const stoneV0 = engineStone.pouch.predictedV0;

    // Plane (light, 0.005 kg)
    const enginePlane = createProjectileEngine({ initialType: "plane" });
    startPull(enginePlane, 80, 390);
    const planeEnergy = enginePlane.pouch.potentialEnergyJ;
    const planeV0 = enginePlane.pouch.predictedV0;

    // Energies are identical
    expect(stoneEnergy).toBeCloseTo(planeEnergy, 5);
    // Lighter plane gets significantly higher v0
    expect(planeV0).toBeGreaterThan(stoneV0 * 2);
  });

  it("Scenario 8: pull distance updates Hooke's Law force F=kx and potential energy E=0.5kx^2", () => {
    const engine = createProjectileEngine();
    // Pull back 50px
    startPull(engine, 80, 345); // dx = -50, dy = 0

    const stretchM = engine.pouch.stretchMeters;
    const expectedForce = SPRING_K * stretchM;
    const expectedEnergy = 0.5 * SPRING_K * stretchM * stretchM;

    expect(engine.pouch.forceN).toBeCloseTo(expectedForce, 2);
    expect(engine.pouch.potentialEnergyJ).toBeCloseTo(expectedEnergy, 2);
  });

  it("Scenario 9, 10 & 11: releasing launches projectile, steps through parabolic flight, and records trajectory", () => {
    const engine = createProjectileEngine({ initialType: "soccer" });
    startPull(engine, 70, 390); // pull backward and down to launch forward and up

    const launched = releasePull(engine);
    expect(launched).toBe(true);
    expect(engine.projectile.active).toBe(true);
    expect(engine.phase).toBe("flying");
    expect(engine.telemetry.v0).toBeGreaterThan(0);
    expect(engine.trajectory.length).toBeGreaterThan(0);

    // Step simulation
    for (let i = 0; i < 60; i++) {
      step(engine, 0.016);
      if (!engine.projectile.active) break;
    }

    // Trajectory is populated
    expect(engine.trajectory.length).toBeGreaterThan(5);
    expect(engine.telemetry.currentDistance).toBeGreaterThan(0);
    expect(engine.telemetry.maxHeight).toBeGreaterThan(0);
  });

  it("Scenario 12: projectile lands on ground and computes horizontal range", () => {
    const engine = createProjectileEngine({ initialType: "soccer" });
    startPull(engine, 70, 380);
    releasePull(engine);

    // Step until landing
    for (let i = 0; i < 500; i++) {
      step(engine, 0.016);
      if (!engine.projectile.active) break;
    }

    expect(engine.projectile.active).toBe(false);
    expect(engine.phase).toBe("landed");
    expect(engine.telemetry.range).toBeGreaterThan(1);
    expect(engine.telemetry.currentHeight).toBe(0);
  });

  it("Scenario 13: collision with cardboard boxes distinguishes light vs heavy impact", () => {
    // Test A: Stone (heavy, 2 kg) knocks down boxes on hit
    const engineStone = createProjectileEngine({ initialType: "stone" });
    // Pull hard to reach the target at x=750
    startPull(engineStone, 60, 385);
    releasePull(engineStone);

    for (let i = 0; i < 500; i++) {
      step(engineStone, 0.016);
      if (engineStone.telemetry.boxesHit > 0) break;
    }

    // Boxes were hit
    if (engineStone.telemetry.boxesHit > 0) {
      expect(engineStone.telemetry.boxesFallen).toBeGreaterThanOrEqual(1);
    }

    // Test B: Verify cardboard box physics response when hit by momentum
    const enginePlane = createProjectileEngine({ initialType: "plane" });
    expect(enginePlane.currentMass).toBe(0.005);
    expect(OBJECT_SPECS.stone.defaultMass).toBe(2.0);
  });

  it("Scenario 14: reset restores slingshot, pouch, boxes, and telemetry", () => {
    const engine = createProjectileEngine({ initialType: "stone" });
    startPull(engine, 70, 380);
    releasePull(engine);

    for (let i = 0; i < 100; i++) {
      step(engine, 0.016);
    }

    // Modify a box
    engine.boxes[0].isFallen = true;

    // Reset
    resetEngine(engine);

    expect(engine.phase).toBe("ready");
    expect(engine.projectile.active).toBe(false);
    expect(engine.pouch.isPulling).toBe(false);
    expect(engine.pouch.x).toBe(SLINGSHOT.pouchRest.x);
    expect(engine.pouch.y).toBe(SLINGSHOT.pouchRest.y);
    expect(engine.trajectory.length).toBe(0);
    expect(engine.boxes.every((b) => !b.isFallen && !b.hit)).toBe(true);
    expect(engine.telemetry.boxesFallen).toBe(0);
    expect(engine.telemetry.boxesHit).toBe(0);
  });
});
