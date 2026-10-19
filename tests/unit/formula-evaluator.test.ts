import { describe, it, expect } from "vitest";
import { evaluateFormula } from "../../src/modules/content/formula/evaluator";

describe("Formula Evaluator (Safe Sandbox)", () => {
  it("evaluates basic arithmetic correctly", () => {
    expect(evaluateFormula("2 + 3 * 4")).toBe(14);
    expect(evaluateFormula("(2 + 3) * 4")).toBe(20);
    expect(evaluateFormula("10 - 4 / 2")).toBe(8);
    expect(evaluateFormula("2 ^ 3")).toBe(8);
  });

  it("evaluates variables properly", () => {
    const vars = { v0: 20, t: 3, g: 9.8 };
    expect(evaluateFormula("v0 * t", vars)).toBe(60);
    expect(evaluateFormula("v0 * t - 0.5 * g * t^2", vars)).toBeCloseTo(15.9);
  });

  it("supports math functions and constants", () => {
    expect(evaluateFormula("sin(0)")).toBe(0);
    expect(evaluateFormula("cos(0)")).toBe(1);
    expect(evaluateFormula("sqrt(16)")).toBe(4);
    expect(evaluateFormula("pi")).toBeCloseTo(Math.PI);
  });

  it("strictly prevents code injection attempts", () => {
    // eval
    expect(() => evaluateFormula("eval('2+2')")).toThrow(/terlarang/);
    // Function constructor
    expect(() => evaluateFormula("Function('return 2')()")).toThrow(/terlarang/);
    // prototype pollution
    expect(() => evaluateFormula("constructor.prototype")).toThrow(/terlarang/);
    expect(() => evaluateFormula("__proto__")).toThrow(/terlarang/);
    // window / process
    expect(() => evaluateFormula("window.alert(1)")).toThrow(/terlarang/);
    expect(() => evaluateFormula("process.exit(1)")).toThrow(/terlarang/);
    // forbidden punctuation
    expect(() => evaluateFormula("2; alert(1)")).toThrow(/terlarang/);
    expect(() => evaluateFormula("() => 5")).toThrow(/terlarang/);
  });
});
