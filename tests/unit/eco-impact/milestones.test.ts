import { MILESTONES } from "@/constants/ecoImpact";
import { getNextMilestone, getPrevMilestone, calcProgress } from "@/utils/ecoImpact/milestones";

describe("MILESTONES constant", () => {
  it("starts at 1 and ends at 100_000_000", () => {
    expect(MILESTONES[0]).toBe(1);
    expect(MILESTONES[MILESTONES.length - 1]).toBe(100_000_000);
  });

  it("is sorted in ascending order", () => {
    for (let i = 1; i < MILESTONES.length; i++) {
      expect(MILESTONES[i]).toBeGreaterThan(MILESTONES[i - 1]);
    }
  });
});

describe("getNextMilestone", () => {
  it("returns 1 for fractional trees (less than first milestone)", () => {
    expect(getNextMilestone(0)).toBe(1);
    expect(getNextMilestone(0.5)).toBe(1);
    expect(getNextMilestone(0.99)).toBe(1);
  });

  it("returns 10 for 7 trees", () => {
    expect(getNextMilestone(7)).toBe(10);
  });

  it("returns 2500 for 1251 trees", () => {
    expect(getNextMilestone(1251)).toBe(2_500);
  });

  it("returns next milestone when exactly on a milestone", () => {
    expect(getNextMilestone(100)).toBe(250);
  });

  it("returns the last milestone when trees exceed all milestones", () => {
    expect(getNextMilestone(200_000_000)).toBe(100_000_000);
  });
});

describe("getPrevMilestone", () => {
  it("returns 0 when below first milestone", () => {
    expect(getPrevMilestone(0)).toBe(0);
    expect(getPrevMilestone(0.5)).toBe(0);
  });

  it("returns 5 for 7 trees (between 5 and 10)", () => {
    expect(getPrevMilestone(7)).toBe(5);
  });

  it("returns 1000 for 1251 trees (between 1000 and 2500)", () => {
    expect(getPrevMilestone(1251)).toBe(1_000);
  });

  it("returns 100 when exactly on the 100 milestone", () => {
    expect(getPrevMilestone(100)).toBe(100);
  });
});

describe("calcProgress", () => {
  it("returns 50% when halfway between 0 and 1", () => {
    expect(calcProgress(0.5)).toBeCloseTo(50, 5);
  });

  it("returns 40% for 7 trees (between 5 and 10)", () => {
    expect(calcProgress(7)).toBeCloseTo(40, 5);
  });

  it("returns 0% when exactly on a milestone (start of next segment)", () => {
    expect(calcProgress(100)).toBeCloseTo(0, 5);
  });

  it("is capped at 99 and never reaches 100", () => {
    expect(calcProgress(200_000_000)).toBe(99);
  });

  it("progress increases as trees increase within a segment", () => {
    const p1 = calcProgress(6);
    const p2 = calcProgress(8);
    expect(p2).toBeGreaterThan(p1);
  });

  it("returns a value between 0 and 99 inclusive for all valid inputs", () => {
    const testValues = [0, 0.5, 3, 7, 100, 1251, 10_000, 1_000_000];
    for (const trees of testValues) {
      const progress = calcProgress(trees);
      expect(progress).toBeGreaterThanOrEqual(0);
      expect(progress).toBeLessThanOrEqual(99);
    }
  });
});
