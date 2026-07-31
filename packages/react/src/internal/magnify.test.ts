import { describe, it, expect } from "vitest";
import { magnifyValue } from "./magnify";

// Dock/Navbar magnification curve ([spec 10.3, 10.7] — the called-out unit test).
const cfg = { maxScale: 1.6, maxLift: 12 };

describe("magnifyValue", () => {
  it("peaks exactly at the pointer", () => {
    expect(magnifyValue(100, 100, 100, cfg)).toEqual({ scale: 1.6, lift: 12 });
  });

  it("is neutral (scale 1, lift 0) at/beyond the influence range", () => {
    expect(magnifyValue(0, 100, 100, cfg)).toEqual({ scale: 1, lift: 0 });
    expect(magnifyValue(0, 300, 100, cfg)).toEqual({ scale: 1, lift: 0 });
  });

  it("eases with a squared falloff (half range → influence 0.5 → +0.25 of the delta)", () => {
    const { scale } = magnifyValue(50, 100, 100, cfg); // d=50 → influence 0.5
    expect(scale).toBeCloseTo(1 + 0.25 * (1.6 - 1), 6); // 1.15
  });

  it("never shrinks below 1 or lifts below 0, however far the pointer", () => {
    const { scale, lift } = magnifyValue(99999, 0, 100, cfg);
    expect(scale).toBe(1);
    expect(lift).toBe(0);
  });

  it("is symmetric about the center and monotonic in distance", () => {
    const near = magnifyValue(90, 100, 100, cfg).scale; // d=10
    const mid = magnifyValue(70, 100, 100, cfg).scale; // d=30
    const far = magnifyValue(40, 100, 100, cfg).scale; // d=60
    expect(near).toBeGreaterThan(mid);
    expect(mid).toBeGreaterThan(far);
    // mirror image across the center is identical
    expect(magnifyValue(110, 100, 100, cfg).scale).toBeCloseTo(near, 10);
  });

  it("scales lift linearly with influence", () => {
    // at influence 0.5, lift is half of maxLift
    expect(magnifyValue(50, 100, 100, cfg).lift).toBeCloseTo(6, 6);
  });
});
