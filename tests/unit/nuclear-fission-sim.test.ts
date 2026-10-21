import { describe, it, expect } from "vitest";
import {
  createEngine,
  addNuclei,
  fireNeutron,
  step,
  getStats,
  setRodInsertion,
  isInsideRod,
  MAX_NUCLEI,
  ADD_INCREMENT,
  ENERGY_PER_FISSION_MEV,
  MEV_TO_JOULE,
  VESSEL,
  MIN_NUCLEUS_SPACING,
} from "../../src/components/interactive/nuclear-fission-sim";

describe("Nuclear Fission Simulation Engine", () => {
  it("Scenario 1: starts with exactly 1 intact U-235 nucleus, 0 energy, and 0 active neutrons", () => {
    const engine = createEngine(12345, 0.3);
    const stats = getStats(engine);

    expect(stats.totalNuclei).toBe(1);
    expect(stats.intactNuclei).toBe(1);
    expect(stats.fissionedNuclei).toBe(0);
    expect(stats.energyMeV).toBe(0);
    expect(stats.activeNeutrons).toBe(0);
    expect(stats.fissionEvents).toBe(0);
    expect(stats.phase).toBe("ready");
  });

  it("Scenario 2: adding nuclei increases nucleus count by ADD_INCREMENT without exceeding MAX_NUCLEI", () => {
    const engine = createEngine(12345, 0.3);
    const added = addNuclei(engine, ADD_INCREMENT);

    expect(added).toBe(ADD_INCREMENT);
    expect(engine.nuclei.length).toBe(1 + ADD_INCREMENT);

    // Keep adding until capped
    for (let i = 0; i < 20; i++) {
      addNuclei(engine, ADD_INCREMENT);
    }
    expect(engine.nuclei.length).toBeLessThanOrEqual(MAX_NUCLEI);
  });

  it("Scenario 3: spawned nuclei are positioned within valid reactor vessel boundaries and respect spacing", () => {
    const engine = createEngine(9999, 0.3);
    addNuclei(engine, 10);

    for (const n of engine.nuclei) {
      expect(n.x).toBeGreaterThan(VESSEL.left);
      expect(n.x).toBeLessThan(VESSEL.right);
      expect(n.y).toBeGreaterThan(VESSEL.top);
      expect(n.y).toBeLessThan(VESSEL.bottom);
      expect(n.state).toBe("intact");
    }

    // Check mutual spacing between distinct nuclei
    for (let i = 0; i < engine.nuclei.length; i++) {
      for (let j = i + 1; j < engine.nuclei.length; j++) {
        const dist = Math.hypot(
          engine.nuclei[i].x - engine.nuclei[j].x,
          engine.nuclei[i].y - engine.nuclei[j].y
        );
        expect(dist).toBeGreaterThanOrEqual(MIN_NUCLEUS_SPACING);
      }
    }
  });

  it("Scenario 4 & 5: trigger neutron moves and produces fission, fragments, and secondary neutrons", () => {
    // With 0 control rod and initial nucleus at target, fire neutron
    const engine = createEngine(42, 0.0);
    const fired = fireNeutron(engine);
    expect(fired).toBe(true);
    expect(engine.neutrons.length).toBe(1);

    // Step simulation forward until collision occurs
    for (let stepIdx = 0; stepIdx < 120; stepIdx++) {
      step(engine, 0.016);
      if (engine.fissionEvents > 0) break;
    }

    expect(engine.fissionEvents).toBe(1);
    expect(engine.fragments.length).toBe(2);
    expect(engine.fragments.some((f) => f.kind === "Ba-141")).toBe(true);
    expect(engine.fragments.some((f) => f.kind === "Kr-92")).toBe(true);
    // Should have generated 2 or 3 secondary neutrons
    expect(engine.neutrons.length).toBeGreaterThanOrEqual(2);
  });

  it("Scenario 6: chain reaction can propagate through multiple nuclei", () => {
    // Add multiple nuclei and run simulation
    const engine = createEngine(101, 0.0);
    addNuclei(engine, 20);
    fireNeutron(engine);

    // Step through the chain reaction
    for (let stepIdx = 0; stepIdx < 500; stepIdx++) {
      step(engine, 0.016);
      if (engine.neutrons.length === 0) break;
    }

    // Chain reaction occurred
    expect(engine.fissionEvents).toBeGreaterThanOrEqual(1);
    expect(engine.maxGeneration).toBeGreaterThanOrEqual(1);
  });

  it("Scenario 7: an intact nucleus fissions at most once", () => {
    const engine = createEngine(42, 0.0);
    fireNeutron(engine);

    for (let i = 0; i < 200; i++) {
      step(engine, 0.016);
    }

    const firstNucleus = engine.nuclei[0];
    expect(firstNucleus.state === "fissioned" || firstNucleus.state === "fissioning").toBe(true);

    // Fire another neutron directly across the spent nucleus
    fireNeutron(engine);
    for (let i = 0; i < 200; i++) {
      step(engine, 0.016);
    }

    // Total fission events for the single nucleus cannot exceed 1
    expect(engine.fissionEvents).toBe(1);
  });

  it("Scenario 8 & 9: energy is strictly proportional to successful fission events", () => {
    const engine = createEngine(777, 0.0);
    // No neutron fired -> 0 events -> 0 energy
    step(engine, 0.1);
    expect(getStats(engine).energyMeV).toBe(0);

    fireNeutron(engine);
    for (let i = 0; i < 150; i++) {
      step(engine, 0.016);
      if (engine.fissionEvents > 0) break;
    }

    const stats = getStats(engine);
    expect(stats.energyMeV).toBe(stats.fissionEvents * ENERGY_PER_FISSION_MEV);
    const expectedJoules = stats.energyMeV * MEV_TO_JOULE;
    expect(stats.energyMeV * MEV_TO_JOULE).toBeCloseTo(expectedJoules, 10);
  });

  it("Scenario 10 & 11: reset completely resets nuclei, energy, neutrons, and events", () => {
    const engine = createEngine(42, 0.0);
    addNuclei(engine, 15);
    fireNeutron(engine);
    for (let i = 0; i < 100; i++) {
      step(engine, 0.016);
    }

    expect(engine.nuclei.length).toBeGreaterThan(1);

    // Reset by creating clean engine
    const resetEngine = createEngine(8888, 0.3, "reset");
    const stats = getStats(resetEngine);

    expect(stats.totalNuclei).toBe(1);
    expect(stats.intactNuclei).toBe(1);
    expect(stats.fissionedNuclei).toBe(0);
    expect(stats.energyMeV).toBe(0);
    expect(stats.fissionEvents).toBe(0);
    expect(stats.activeNeutrons).toBe(0);
    expect(resetEngine.neutrons.length).toBe(0);
    expect(resetEngine.fragments.length).toBe(0);
    expect(resetEngine.effects.length).toBe(0);
    expect(stats.phase).toBe("reset");
  });

  it("Control rods: absorb neutrons when inserted and allow transmission when retracted", () => {
    // Case A: 100% inserted rods - blocks neutron fired towards target at (340, 360)
    const engineInserted = createEngine(42, 1.0);
    setRodInsertion(engineInserted, 1.0);
    expect(isInsideRod(engineInserted, 225, 360)).toBe(true);

    fireNeutron(engineInserted);
    for (let i = 0; i < 150; i++) {
      step(engineInserted, 0.016);
      if (engineInserted.neutrons.length === 0) break;
    }

    // Neutron was absorbed by the rod at x=225 before reaching nucleus at x=340
    expect(engineInserted.absorbedByRods).toBe(1);
    expect(engineInserted.fissionEvents).toBe(0);

    // Case B: 0% inserted rods (retracted) - allows neutron to reach nucleus and cause fission
    const engineRetracted = createEngine(42, 0.0);
    setRodInsertion(engineRetracted, 0.0);
    expect(isInsideRod(engineRetracted, 225, 360)).toBe(false);

    fireNeutron(engineRetracted);
    for (let i = 0; i < 150; i++) {
      step(engineRetracted, 0.016);
      if (engineRetracted.fissionEvents > 0) break;
    }

    expect(engineRetracted.absorbedByRods).toBe(0);
    expect(engineRetracted.fissionEvents).toBe(1);
  });
});
