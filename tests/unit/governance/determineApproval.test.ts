import { determineApproval } from "@/utils/determineApproval";

const defaultEpochParams = {
  dvt_treasury_withdrawal: 0.67,
  dvt_hard_fork_initiation: 0.6,
  dvt_motion_no_confidence: 0.67,
  dvt_committee_normal: 0.67,
  dvt_update_to_constitution: 0.75,
  dvt_p_param_update: 0.67,
  pvt_treasury_withdrawal: 0.67,
  pvt_hard_fork_initiation: 0.51,
  pvt_motion_no_confidence: 0.51,
  pvt_committee_normal: 0.51,
  pvt_update_to_constitution: 0.67,
  pvt_p_param_update: 0.51,
};

const createMembers = (yes: number, no: number, notVoted: number) => [
  ...Array.from({ length: yes }, (_, i) => ({ vote: "Yes", id: `yes-${i}` })),
  ...Array.from({ length: no }, (_, i) => ({ vote: "No", id: `no-${i}` })),
  ...Array.from({ length: notVoted }, (_, i) => ({ vote: null, id: `null-${i}` })),
];

const committeeData = {
  quorum: { numerator: 2, denuminator: 3 },
};

describe("determineApproval", () => {
  describe("DRep threshold selection by action type", () => {
    it.each([
      ["TreasuryWithdrawals", 0.67],
      ["HardForkInitiation", 0.6],
      ["NoConfidence", 0.67],
      ["NewCommittee", 0.67],
      ["NewConstitution", 0.75],
      ["ParameterChange", 0.67],
    ])("uses correct DRep threshold for %s: %s", (type, expectedThreshold) => {
      const result = determineApproval(
        defaultEpochParams, [], committeeData, type, 0, 0,
      );
      expect(result.drepThreshold).toBe(expectedThreshold);
    });

    it("defaults DRep threshold to 1 for unknown types", () => {
      const result = determineApproval(
        defaultEpochParams, [], committeeData, "UnknownType", 0, 0,
      );
      expect(result.drepThreshold).toBe(1);
    });
  });

  describe("SPO threshold selection by action type", () => {
    it.each([
      ["TreasuryWithdrawals", 0.67],
      ["HardForkInitiation", 0.51],
      ["NoConfidence", 0.51],
      ["NewCommittee", 0.51],
      ["NewConstitution", 0.67],
      ["ParameterChange", 0.51],
    ])("uses correct SPO threshold for %s: %s", (type, expectedThreshold) => {
      const result = determineApproval(
        defaultEpochParams, [], committeeData, type, 0, 0,
      );
      expect(result.spoThreshold).toBe(expectedThreshold);
    });

    it("defaults SPO threshold to 1 for unknown types", () => {
      const result = determineApproval(
        defaultEpochParams, [], committeeData, "UnknownType", 0, 0,
      );
      expect(result.spoThreshold).toBe(1);
    });
  });

  describe("DRep approval logic", () => {
    it("approves DReps when voted ratio meets threshold", () => {
      const result = determineApproval(
        defaultEpochParams, [], committeeData, "TreasuryWithdrawals", 0.7, 0,
      );
      expect(result.dRepsApproved).toBe(true);
    });

    it("approves DReps when voted ratio equals threshold exactly", () => {
      const result = determineApproval(
        defaultEpochParams, [], committeeData, "TreasuryWithdrawals", 0.67, 0,
      );
      expect(result.dRepsApproved).toBe(true);
    });

    it("rejects DReps when voted ratio is below threshold", () => {
      const result = determineApproval(
        defaultEpochParams, [], committeeData, "TreasuryWithdrawals", 0.5, 0,
      );
      expect(result.dRepsApproved).toBe(false);
    });

    it("rejects DReps when voted ratio is 0", () => {
      const result = determineApproval(
        defaultEpochParams, [], committeeData, "TreasuryWithdrawals", 0, 0,
      );
      expect(result.dRepsApproved).toBe(false);
    });
  });

  describe("SPO approval logic", () => {
    it("approves SPOs when voted ratio meets threshold", () => {
      const result = determineApproval(
        defaultEpochParams, [], committeeData, "HardForkInitiation", 0, 0.55,
      );
      expect(result.sPOsApproved).toBe(true);
    });

    it("rejects SPOs when voted ratio is below threshold", () => {
      const result = determineApproval(
        defaultEpochParams, [], committeeData, "HardForkInitiation", 0, 0.3,
      );
      expect(result.sPOsApproved).toBe(false);
    });

    it("rejects SPOs when voted ratio is 0", () => {
      const result = determineApproval(
        defaultEpochParams, [], committeeData, "HardForkInitiation", 0, 0,
      );
      expect(result.sPOsApproved).toBe(false);
    });
  });

  describe("Constitutional Committee approval logic", () => {
    it("approves CC when Yes votes meet quorum (2/3)", () => {
      // 3 yes out of 4 total = 75% >= 66.7%
      const members = createMembers(3, 1, 0);
      const result = determineApproval(
        defaultEpochParams, members, committeeData, "TreasuryWithdrawals", 0, 0,
      );
      expect(result.constitutionalCommitteeApproved).toBe(true);
    });

    it("rejects CC when Yes votes are below quorum", () => {
      // 1 yes out of 4 total = 25% < 66.7%
      const members = createMembers(1, 2, 1);
      const result = determineApproval(
        defaultEpochParams, members, committeeData, "TreasuryWithdrawals", 0, 0,
      );
      expect(result.constitutionalCommitteeApproved).toBe(false);
    });

    it("rejects CC when no members exist", () => {
      const result = determineApproval(
        defaultEpochParams, [], committeeData, "TreasuryWithdrawals", 0, 0,
      );
      expect(result.constitutionalCommitteeApproved).toBe(false);
    });

    it("uses default 0.67 threshold when quorum denuminator is 0", () => {
      const badCommittee = { quorum: { numerator: 2, denuminator: 0 } };
      const result = determineApproval(
        defaultEpochParams, [], badCommittee, "TreasuryWithdrawals", 0, 0,
      );
      expect(result.ccThreshold).toBe(0.67);
    });

    it("calculates ccThreshold from quorum", () => {
      const result = determineApproval(
        defaultEpochParams, [], committeeData, "TreasuryWithdrawals", 0, 0,
      );
      expect(result.ccThreshold).toBeCloseTo(2 / 3);
    });
  });

  describe("fallback when epoch params are missing", () => {
    it("uses fallback thresholds when epoch params are empty", () => {
      const result = determineApproval(
        {}, [], committeeData, "TreasuryWithdrawals", 0.8, 0.8,
      );
      expect(result.drepThreshold).toBe(0.67);
      expect(result.spoThreshold).toBe(0.67);
      expect(result.dRepsApproved).toBe(true);
      expect(result.sPOsApproved).toBe(true);
    });
  });

  describe("combined scenario", () => {
    it("returns full approval state for a realistic governance action", () => {
      const members = createMembers(4, 1, 2);
      const result = determineApproval(
        defaultEpochParams,
        members,
        committeeData,
        "HardForkInitiation",
        0.72,
        0.55,
      );

      expect(result.dRepsApproved).toBe(true);
      expect(result.drepThreshold).toBe(0.6);
      expect(result.sPOsApproved).toBe(true);
      expect(result.spoThreshold).toBe(0.51);
      // 4/7 = 57.1% < 66.7% -> CC not approved
      expect(result.constitutionalCommitteeApproved).toBe(false);
      expect(result.ccThreshold).toBeCloseTo(2 / 3);
    });
  });
});
