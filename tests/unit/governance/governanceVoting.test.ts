import {
  shouldDRepVote,
  shouldSPOVote,
  shouldCCVote,
  hasCriticalParameters,
} from "@/utils/governanceVoting";

describe("shouldDRepVote", () => {
  it.each([
    "NoConfidence",
    "NewCommittee",
    "NewConstitution",
    "HardForkInitiation",
    "ParameterChange",
    "TreasuryWithdrawals",
    "InfoAction",
  ])("returns true for %s", (type) => {
    expect(shouldDRepVote(type)).toBe(true);
  });

  it("returns false for unknown action type", () => {
    expect(shouldDRepVote("SomeUnknownType")).toBe(false);
  });

  it("returns false for empty string", () => {
    expect(shouldDRepVote("")).toBe(false);
  });
});

describe("shouldCCVote", () => {
  it.each([
    "NewConstitution",
    "HardForkInitiation",
    "ParameterChange",
    "TreasuryWithdrawals",
    "InfoAction",
  ])("returns true for %s", (type) => {
    expect(shouldCCVote(type)).toBe(true);
  });

  it.each(["NoConfidence", "NewCommittee"])(
    "returns false for %s (CC does not vote)",
    (type) => {
      expect(shouldCCVote(type)).toBe(false);
    },
  );

  it("returns false for unknown action type", () => {
    expect(shouldCCVote("SomeUnknownType")).toBe(false);
  });
});

describe("shouldSPOVote", () => {
  it.each(["NoConfidence", "NewCommittee", "HardForkInitiation", "InfoAction"])(
    "returns true for %s (direct SPO voting action)",
    (type) => {
      expect(shouldSPOVote(type)).toBe(true);
    },
  );

  it.each(["NewConstitution", "TreasuryWithdrawals"])(
    "returns false for %s (SPOs do not vote on these)",
    (type) => {
      expect(shouldSPOVote(type)).toBe(false);
    },
  );

  describe("ParameterChange with critical parameters", () => {
    it("returns true when description contains critical protocol parameters", () => {
      const description = {
        tag: "ParameterChange",
        contents: [
          null,
          { maxBlockBodySize: 90112, txFeePerByte: 44 },
        ],
      };
      expect(shouldSPOVote("ParameterChange", description)).toBe(true);
    });

    it("returns false when description contains only non-critical parameters", () => {
      const description = {
        tag: "ParameterChange",
        contents: [
          null,
          { someNonCriticalParam: 100 },
        ],
      };
      expect(shouldSPOVote("ParameterChange", description)).toBe(false);
    });

    it("returns false when description has no contents", () => {
      expect(shouldSPOVote("ParameterChange", undefined)).toBe(false);
      expect(shouldSPOVote("ParameterChange", { tag: "ParameterChange" })).toBe(false);
    });
  });
});

describe("hasCriticalParameters", () => {
  it("returns true when at least one critical parameter is present", () => {
    expect(
      hasCriticalParameters({
        contents: [null, { maxTxSize: 16384 }],
      }),
    ).toBe(true);
  });

  it("returns true for govDeposit (last in the list)", () => {
    expect(
      hasCriticalParameters({
        contents: [null, { govDeposit: 100000 }],
      }),
    ).toBe(true);
  });

  it("returns false when no critical parameters are present", () => {
    expect(
      hasCriticalParameters({
        contents: [null, { randomParam: 42 }],
      }),
    ).toBe(false);
  });

  it("returns false when contents[1] is an array", () => {
    expect(
      hasCriticalParameters({
        contents: [null, ["maxTxSize"]],
      }),
    ).toBe(false);
  });

  it("returns false when contents[1] is null", () => {
    expect(
      hasCriticalParameters({
        contents: [null, null],
      }),
    ).toBe(false);
  });

  it("returns false when description is undefined", () => {
    expect(hasCriticalParameters(undefined)).toBe(false);
  });

  it("returns false when contents is missing", () => {
    expect(hasCriticalParameters({ tag: "ParameterChange" })).toBe(false);
  });
});
