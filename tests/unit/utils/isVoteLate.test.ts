import { describe, it, expect } from "vitest";
import { isVoteLate } from "@/utils/governance/isVoteLate";

describe("isVoteLate", () => {
  const makeVote = (
    epochNo: number | undefined | null,
    proposal: {
      expired_epoch?: number | null;
      enacted_epoch?: number | null;
      ratified_epoch?: number | null;
    } = {},
  ) =>
    ({
      tx: { epoch_no: epochNo },
      proposal: {
        expired_epoch: proposal.expired_epoch ?? null,
        enacted_epoch: proposal.enacted_epoch ?? null,
        ratified_epoch: proposal.ratified_epoch ?? null,
      },
    }) as any;

  it("returns false when vote epoch is undefined", () => {
    expect(isVoteLate(makeVote(undefined, { expired_epoch: 100 }))).toBe(false);
  });

  it("returns false when vote epoch is null", () => {
    expect(isVoteLate(makeVote(null, { expired_epoch: 100 }))).toBe(false);
  });

  it("returns false when no closing epochs exist", () => {
    expect(isVoteLate(makeVote(50))).toBe(false);
  });

  it("returns true when vote epoch equals expired epoch", () => {
    expect(isVoteLate(makeVote(100, { expired_epoch: 100 }))).toBe(true);
  });

  it("returns true when vote epoch is after expired epoch", () => {
    expect(isVoteLate(makeVote(101, { expired_epoch: 100 }))).toBe(true);
  });

  it("returns false when vote epoch is before expired epoch", () => {
    expect(isVoteLate(makeVote(99, { expired_epoch: 100 }))).toBe(false);
  });

  it("returns true when vote epoch equals enacted epoch", () => {
    expect(isVoteLate(makeVote(200, { enacted_epoch: 200 }))).toBe(true);
  });

  it("returns true when vote epoch equals ratified epoch", () => {
    expect(isVoteLate(makeVote(150, { ratified_epoch: 150 }))).toBe(true);
  });

  it("uses the minimum closing epoch when multiple are set", () => {
    // ratified at 100, enacted at 110 → min is 100
    expect(
      isVoteLate(makeVote(99, { ratified_epoch: 100, enacted_epoch: 110 })),
    ).toBe(false);
    expect(
      isVoteLate(makeVote(100, { ratified_epoch: 100, enacted_epoch: 110 })),
    ).toBe(true);
  });

  it("ignores null closing epochs when others exist", () => {
    expect(
      isVoteLate(
        makeVote(99, {
          expired_epoch: null,
          enacted_epoch: null,
          ratified_epoch: 100,
        }),
      ),
    ).toBe(false);
    expect(
      isVoteLate(
        makeVote(100, {
          expired_epoch: null,
          enacted_epoch: null,
          ratified_epoch: 100,
        }),
      ),
    ).toBe(true);
  });
});
