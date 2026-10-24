import { describe, it, expect } from "vitest";
import {
  createGravityEngine,
  selectGravityObject,
  setGravityObjectMass,
  setInitialHeight,
  setAirResistance,
  startSimulation,
  pauseSimulation,
  resetGravityEngine,
  stepGravity,
  calculateUniversalGravity,
  GRAVITY_OBJECTS,
  NEWTON_HEAD,
  DEFAULT_G,
  EARTH_MASS,
  EARTH_RADIUS,
} from "../../src/components/interactive/newtonian-gravity-sim";

describe("Newtonian Gravity Simulation Engine", () => {
  it("Scenario 1: initializes with accurate default state", () => {
    const engine = createGravityEngine();

    expect(engine.objectType).toBe("apple");
    expect(engine.mass).toBe(0.15);
    expect(engine.initialHeightM).toBe(5.0);
    expect(engine.gravityG).toBe(DEFAULT_G);
    expect(engine.useAirResistance).toBe(false);
    expect(engine.phase).toBe("ready");
    expect(engine.t).toBe(0);
    expect(engine.yM).toBe(5.0);
    expect(engine.vM).toBe(0);
    expect(engine.telemetry.hasCollided).toBe(false);
    expect(engine.telemetry.thoughtBubbleVisible).toBe(false);
    expect(engine.telemetry.gravitationalForceN).toBeCloseTo(0.15 * 9.81, 3);
  });

  it("Scenario 2: selecting objects updates mass, specs, and resets cleanly", () => {
    const engine = createGravityEngine();

    // Select durian
    selectGravityObject(engine, "durian");
    expect(engine.objectType).toBe("durian");
    expect(engine.mass).toBe(1.5);
    expect(engine.telemetry.gravitationalForceN).toBeCloseTo(1.5 * 9.81, 3);
    expect(engine.phase).toBe("ready");

    // Select feather
    selectGravityObject(engine, "feather");
    expect(engine.objectType).toBe("feather");
    expect(engine.mass).toBe(0.001);
    expect(engine.telemetry.gravitationalForceN).toBeCloseTo(0.001 * 9.81, 4);

    // Select iron ball
    selectGravityObject(engine, "iron_ball");
    expect(engine.objectType).toBe("iron_ball");
    expect(engine.mass).toBe(1.0);
    expect(engine.telemetry.gravitationalForceN).toBeCloseTo(1.0 * 9.81, 3);
  });

  it("Scenario 3: changing mass, initial height, and air resistance updates engine state", () => {
    const engine = createGravityEngine({ objectType: "apple" });
    expect(engine.mass).toBe(GRAVITY_OBJECTS.apple.defaultMass);

    setGravityObjectMass(engine, 0.3); // heavier apple
    expect(engine.mass).toBe(0.3);
    expect(engine.gravityG).toBe(9.81); // g must remain unchanged!
    expect(engine.telemetry.gravitationalForceN).toBeCloseTo(0.3 * 9.81, 3);

    // Initial height adjustment
    setInitialHeight(engine, 4.2);
    expect(engine.initialHeightM).toBe(4.2);
    expect(engine.yM).toBe(4.2);

    // Air resistance toggle
    setAirResistance(engine, true);
    expect(engine.useAirResistance).toBe(true);
  });

  it("Scenario 4: in vacuum, all objects fall with identical acceleration and reach Newton simultaneously", () => {
    const engineApple = createGravityEngine({ objectType: "apple", airResistance: false });
    const engineFeather = createGravityEngine({ objectType: "feather", airResistance: false });
    const engineIron = createGravityEngine({ objectType: "iron_ball", airResistance: false });

    startSimulation(engineApple);
    startSimulation(engineFeather);
    startSimulation(engineIron);

    const dt = 0.02; // 50 fps steps
    for (let step = 0; step < 25; step++) {
      stepGravity(engineApple, dt);
      stepGravity(engineFeather, dt);
      stepGravity(engineIron, dt);

      // At all times, height and velocity must be exactly identical in vacuum!
      expect(engineApple.yM).toBeCloseTo(engineFeather.yM, 5);
      expect(engineApple.yM).toBeCloseTo(engineIron.yM, 5);
      expect(engineApple.vM).toBeCloseTo(engineFeather.vM, 5);
      expect(engineApple.vM).toBeCloseTo(engineIron.vM, 5);
    }
  });

  it("Scenario 5: with air resistance, feather experiences drag and falls significantly slower than iron ball", () => {
    const engineFeatherAir = createGravityEngine({ objectType: "feather", airResistance: true });
    const engineIronAir = createGravityEngine({ objectType: "iron_ball", airResistance: true });

    startSimulation(engineFeatherAir);
    startSimulation(engineIronAir);

    const dt = 0.02;
    // Step until 0.6 seconds
    for (let step = 0; step < 30; step++) {
      stepGravity(engineFeatherAir, dt);
      stepGravity(engineIronAir, dt);
    }

    // Iron ball has fallen much further than the feather
    expect(engineIronAir.yM).toBeLessThan(engineFeatherAir.yM);
    // Iron ball has much higher velocity
    expect(engineIronAir.vM).toBeGreaterThan(engineFeatherAir.vM);
    // Drag force on feather should be non-zero
    expect(engineFeatherAir.telemetry.dragForceN).toBeGreaterThan(0);
  });

  it("Scenario 6: collision with Newton triggers exactly once and halts motion at head height", () => {
    const engine = createGravityEngine({ objectType: "apple", airResistance: false });
    startSimulation(engine);

    const dt = 0.02;
    // Step until impact (around 0.92s = 46 steps)
    while (engine.phase === "falling") {
      stepGravity(engine, dt);
    }

    expect(engine.phase).toBe("impacted");
    expect(engine.telemetry.hasCollided).toBe(true);
    expect(engine.telemetry.thoughtBubbleVisible).toBe(true);
    expect(engine.yM).toBe(NEWTON_HEAD.heightM);
    expect(engine.telemetry.impactTime).toBeGreaterThan(0.85);
    expect(engine.telemetry.impactTime).toBeLessThan(1.0);
    expect(engine.telemetry.impactSpeed).toBeCloseTo(Math.sqrt(2 * 9.81 * (5.0 - 0.85)), 1);

    // Subsequent steps should not change the state or advance height
    const recordedTime = engine.t;
    stepGravity(engine, dt);
    expect(engine.t).toBe(recordedTime);
    expect(engine.yM).toBe(NEWTON_HEAD.heightM);
  });

  it("Scenario 7: pause and resume works correctly", () => {
    const engine = createGravityEngine();
    startSimulation(engine);
    stepGravity(engine, 0.1);
    expect(engine.phase).toBe("falling");

    pauseSimulation(engine);
    expect(engine.phase).toBe("paused");
    const yAtPause = engine.yM;

    // Stepping while paused should have no effect
    stepGravity(engine, 0.1);
    expect(engine.yM).toBe(yAtPause);

    // Resuming
    startSimulation(engine);
    expect(engine.phase).toBe("falling");
    stepGravity(engine, 0.1);
    expect(engine.yM).toBeLessThan(yAtPause);
  });

  it("Scenario 8: reset restores clean initial state", () => {
    const engine = createGravityEngine({ objectType: "durian" });
    startSimulation(engine);
    for (let i = 0; i < 20; i++) stepGravity(engine, 0.02);

    expect(engine.t).toBeGreaterThan(0);
    expect(engine.vM).toBeGreaterThan(0);

    resetGravityEngine(engine);
    expect(engine.phase).toBe("ready");
    expect(engine.t).toBe(0);
    expect(engine.vM).toBe(0);
    expect(engine.yM).toBe(engine.initialHeightM);
    expect(engine.telemetry.hasCollided).toBe(false);
    expect(engine.telemetry.thoughtBubbleVisible).toBe(false);
  });

  it("Scenario 9: universal gravitation formula calculation", () => {
    // Gravitational force of Earth on a 0.15 kg apple at Earth's surface
    const result = calculateUniversalGravity(EARTH_MASS, 0.15, EARTH_RADIUS);
    // F = G * M * m / R^2 = m * g ≈ 0.15 * 9.81 ≈ 1.4715 N
    expect(result.force).toBeCloseTo(0.15 * 9.81, 1);
    expect(result.formulaString).toContain("N");

    // Invalid distance
    expect(calculateUniversalGravity(EARTH_MASS, 0.15, 0).force).toBe(0);
  });
});
