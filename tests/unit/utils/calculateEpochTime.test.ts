import { vi } from "vitest";

// Mock dependencies before importing the module under test
vi.mock("@/constants/confVariables", () => ({
  epochLength: 432000, // 5 days in seconds (standard Cardano epoch)
}));

vi.mock("@vellumlabs/cexplorer-sdk", () => ({
  toUtcDate: vi.fn((date: string) => date),
}));

import {
  calculateEpochTimeByNumber,
  getEpochTimestamp,
} from "@/utils/calculateEpochTimeByNumber";

const EPOCH_LENGTH_MS = 432000 * 1000; // 5 days in ms
const CURRENT_EPOCH = 500;
const CURRENT_START = "2024-12-01T21:44:51.000Z";

describe("calculateEpochTimeByNumber", () => {
  it("returns current epoch times when epoch equals currentEpochNumber", () => {
    const result = calculateEpochTimeByNumber(500, 500, CURRENT_START);
    const expectedStart = new Date(CURRENT_START);
    const expectedEnd = new Date(expectedStart.getTime() + EPOCH_LENGTH_MS);

    expect(result.startTime.getTime()).toBe(expectedStart.getTime());
    expect(result.endTime.getTime()).toBe(expectedEnd.getTime());
  });

  it("calculates future epoch time correctly (epoch + 1)", () => {
    const result = calculateEpochTimeByNumber(501, CURRENT_EPOCH, CURRENT_START);
    const currentStart = new Date(CURRENT_START);

    expect(result.startTime.getTime()).toBe(
      currentStart.getTime() + EPOCH_LENGTH_MS,
    );
    expect(result.endTime.getTime()).toBe(
      currentStart.getTime() + 2 * EPOCH_LENGTH_MS,
    );
  });

  it("calculates future epoch time correctly (epoch + 10)", () => {
    const result = calculateEpochTimeByNumber(510, CURRENT_EPOCH, CURRENT_START);
    const currentStart = new Date(CURRENT_START);

    expect(result.startTime.getTime()).toBe(
      currentStart.getTime() + 10 * EPOCH_LENGTH_MS,
    );
  });

  it("calculates past epoch time correctly (epoch - 5)", () => {
    const result = calculateEpochTimeByNumber(495, CURRENT_EPOCH, CURRENT_START);
    const currentStart = new Date(CURRENT_START);

    expect(result.startTime.getTime()).toBe(
      currentStart.getTime() - 5 * EPOCH_LENGTH_MS,
    );
  });

  it("endTime is always epochLength after startTime", () => {
    const result = calculateEpochTimeByNumber(503, CURRENT_EPOCH, CURRENT_START);
    expect(result.endTime.getTime() - result.startTime.getTime()).toBe(
      EPOCH_LENGTH_MS,
    );
  });
});

describe("getEpochTimestamp", () => {
  it("returns formatted ISO timestamp string for a valid epoch", () => {
    const result = getEpochTimestamp(500, CURRENT_EPOCH, CURRENT_START);
    expect(result).toBe("2024-12-01T21:44:51");
  });

  it("returns correct timestamp for a future epoch", () => {
    const result = getEpochTimestamp(501, CURRENT_EPOCH, CURRENT_START);
    // 500 starts at 2024-12-01T21:44:51, epoch is 5 days
    // 501 starts at 2024-12-06T21:44:51
    expect(result).toBe("2024-12-06T21:44:51");
  });

  it("returns null when currentEpochNo is undefined", () => {
    expect(getEpochTimestamp(500, undefined, CURRENT_START)).toBeNull();
  });

  it("returns null when currentEpochStartTime is undefined", () => {
    expect(getEpochTimestamp(500, CURRENT_EPOCH, undefined)).toBeNull();
  });

  it("returns null when currentEpochNo is 0 (falsy)", () => {
    expect(getEpochTimestamp(500, 0, CURRENT_START)).toBeNull();
  });

  it("returns correctly padded timestamp", () => {
    // Epoch 500 start = 2024-12-01T21:44:51 — all parts should be zero-padded
    const result = getEpochTimestamp(500, CURRENT_EPOCH, CURRENT_START);
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/);
  });
});
