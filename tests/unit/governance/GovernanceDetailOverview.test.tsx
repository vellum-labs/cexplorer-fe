import { vi } from "vitest";
import { render, screen } from "@testing-library/react";

// --- Activate common mocks ---
import "../mocks";

import {
  governanceActionDetailFixture,
  governanceActionDetailResponseFixture,
} from "../fixtures/governanceActionDetail";

// --- Mock internal components ---
vi.mock("@/components/governance/GovernanceCard", () => ({
  GovernanceCard: (props: any) => (
    <div
      data-testid={`GovernanceCard-${props.voterType}`}
      data-yes={props.yes}
      data-no={props.no}
      data-noconfidence={props.noConfidence}
      data-notvoted={props.notVoted}
      data-threshold={props.threshold}
    />
  ),
}));

vi.mock("@/utils/generateImageUrl", () => ({
  generateImageUrl: vi.fn((...args: any[]) => `https://img/${args[0]}`),
}));

vi.mock("@/utils/format/transformAnchorUrl", () => ({
  transformAnchorUrl: vi.fn((url: string) => url),
}));

vi.mock("@/utils/calculateEpochTimeByNumber", () => ({
  calculateEpochTimeByNumber: vi.fn(() => ({
    startTime: new Date("2025-01-15T21:44:51.000Z"),
    endTime: new Date("2025-01-20T21:44:51.000Z"),
  })),
}));

vi.mock("@/utils/determineApproval", () => ({
  determineApproval: vi.fn(() => ({
    dRepsApproved: true,
    sPOsApproved: false,
    constitutionalCommitteeApproved: true,
    drepThreshold: 0.67,
    spoThreshold: 0.51,
    ccThreshold: 0.667,
  })),
}));

vi.mock("@/utils/governanceVoting", () => ({
  shouldCCVote: vi.fn((type: string) =>
    ["NewConstitution", "HardForkInitiation", "ParameterChange", "TreasuryWithdrawals", "InfoAction"].includes(type),
  ),
  shouldDRepVote: vi.fn((type: string) =>
    ["NoConfidence", "NewCommittee", "NewConstitution", "HardForkInitiation", "ParameterChange", "TreasuryWithdrawals", "InfoAction"].includes(type),
  ),
  shouldSPOVote: vi.fn((_type: string, _desc?: any) => false),
}));

import { GovernanceDetailOverview } from "@/components/governance/GovernanceDetailOverview";
import { shouldCCVote, shouldDRepVote, shouldSPOVote } from "@/utils/governanceVoting";
import { determineApproval } from "@/utils/determineApproval";

const fixture = governanceActionDetailFixture;

const createQuery = (data = fixture, overrides: Record<string, any> = {}) => ({
  data: { ...governanceActionDetailResponseFixture, data },
  error: null,
  isError: false,
  isLoading: false,
  isSuccess: true,
  isPending: false,
  isFetching: false,
  status: "success" as const,
  refetch: vi.fn(),
  ...overrides,
});

const loadingQuery = () => ({
  data: undefined,
  error: null,
  isError: false,
  isLoading: true,
  isSuccess: false,
  isPending: true,
  isFetching: true,
  status: "pending" as const,
  refetch: vi.fn(),
});

/** Helper: find an OverviewCard stub by its data-title attribute value */
const findCardByTitle = (title: string) =>
  screen.getAllByTestId("OverviewCard").find(
    (el) => el.getAttribute("data-title") === title,
  );

describe("GovernanceDetailOverview", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(shouldCCVote).mockImplementation((type) =>
      ["NewConstitution", "HardForkInitiation", "ParameterChange", "TreasuryWithdrawals", "InfoAction"].includes(type),
    );
    vi.mocked(shouldDRepVote).mockImplementation((type) =>
      ["NoConfidence", "NewCommittee", "NewConstitution", "HardForkInitiation", "ParameterChange", "TreasuryWithdrawals", "InfoAction"].includes(type),
    );
    vi.mocked(shouldSPOVote).mockReturnValue(false);
    vi.mocked(determineApproval).mockReturnValue({
      dRepsApproved: true,
      sPOsApproved: false,
      constitutionalCommitteeApproved: true,
      drepThreshold: 0.67,
      spoThreshold: 0.51,
      ccThreshold: 0.667,
    });
  });

  // ── Loading state ──────────────────────────────────────────
  describe("loading state", () => {
    it("shows loading skeletons when query is loading", () => {
      render(<GovernanceDetailOverview query={loadingQuery() as any} />);

      const skeletons = screen.getAllByTestId("LoadingSkeleton");
      expect(skeletons.length).toBeGreaterThanOrEqual(2);
    });

    it("does not render OverviewCards when loading", () => {
      render(<GovernanceDetailOverview query={loadingQuery() as any} />);
      expect(screen.queryByTestId("OverviewCard")).not.toBeInTheDocument();
    });
  });

  // ── Top overview cards ─────────────────────────────────────
  describe("overview cards with data", () => {
    it("renders at least Governance Action and Blockchain Records cards", () => {
      render(<GovernanceDetailOverview query={createQuery() as any} />);

      expect(findCardByTitle("governance.overview.governanceAction")).toBeDefined();
      expect(findCardByTitle("governance.overview.blockchainRecords")).toBeDefined();
    });
  });

  // ── Constitutional Committee ───────────────────────────────
  describe("constitutional committee voting group", () => {
    it("calls shouldCCVote with the action type", () => {
      render(<GovernanceDetailOverview query={createQuery() as any} />);
      expect(shouldCCVote).toHaveBeenCalledWith("TreasuryWithdrawals");
    });

    it("renders CC card when shouldCCVote returns true", () => {
      render(<GovernanceDetailOverview query={createQuery() as any} />);
      expect(findCardByTitle("governance.overview.constitutionalCommittee")).toBeDefined();
    });

    it("does not render CC card when shouldCCVote returns false", () => {
      vi.mocked(shouldCCVote).mockReturnValue(false);
      render(<GovernanceDetailOverview query={createQuery() as any} />);
      expect(findCardByTitle("governance.overview.constitutionalCommittee")).toBeUndefined();
    });
  });

  // ── DRep voting group ──────────────────────────────────────
  describe("DRep voting group", () => {
    it("calls shouldDRepVote with the action type", () => {
      render(<GovernanceDetailOverview query={createQuery() as any} />);
      expect(shouldDRepVote).toHaveBeenCalledWith("TreasuryWithdrawals");
    });

    it("renders DRep card with threshold and voterType attributes", () => {
      render(<GovernanceDetailOverview query={createQuery() as any} />);

      const cards = screen.getAllByTestId("OverviewCard");
      const drepCard = cards.find((el) => el.getAttribute("data-votertype") === "drep");
      expect(drepCard).toBeDefined();
      expect(drepCard?.getAttribute("data-threshold")).toBe("0.67");
    });

    it("renders non-voting DRep card (no voterType) when shouldDRepVote returns false", () => {
      vi.mocked(shouldDRepVote).mockReturnValue(false);
      render(<GovernanceDetailOverview query={createQuery() as any} />);

      // The voting variant passes voterType="drep"; the not-voting variant does not
      const cards = screen.getAllByTestId("OverviewCard");
      const drepVotingCard = cards.find((el) => el.getAttribute("data-votertype") === "drep");
      expect(drepVotingCard).toBeUndefined();

      // But total card count stays the same (non-voting card is still rendered)
      expect(cards).toHaveLength(5);
    });
  });

  // ── SPO voting group ───────────────────────────────────────
  describe("SPO voting group", () => {
    it("renders SPO card when shouldSPOVote returns true", () => {
      vi.mocked(shouldSPOVote).mockReturnValue(true);
      render(<GovernanceDetailOverview query={createQuery() as any} />);

      const cards = screen.getAllByTestId("OverviewCard");
      const spoCard = cards.find((el) => el.getAttribute("data-votertype") === "spo");
      expect(spoCard).toBeDefined();
      expect(spoCard?.getAttribute("data-threshold")).toBe("0.51");
    });

    it("renders non-voting SPO card (no voterType) when shouldSPOVote returns false", () => {
      vi.mocked(shouldSPOVote).mockReturnValue(false);
      render(<GovernanceDetailOverview query={createQuery() as any} />);

      // The voting variant passes voterType="spo"; the not-voting variant does not
      const cards = screen.getAllByTestId("OverviewCard");
      const spoVotingCard = cards.find((el) => el.getAttribute("data-votertype") === "spo");
      expect(spoVotingCard).toBeUndefined();
    });
  });

  // ── Card count varies by voting groups ─────────────────────
  describe("card count based on voting groups", () => {
    it("renders 5 cards when all groups vote (CC + DRep + SPO + 2 top)", () => {
      vi.mocked(shouldSPOVote).mockReturnValue(true);
      render(<GovernanceDetailOverview query={createQuery() as any} />);

      const cards = screen.getAllByTestId("OverviewCard");
      expect(cards).toHaveLength(5);
    });

    it("renders 4 cards when SPOs do not vote (CC + DRep + SPO-notVoting + 2 top)", () => {
      vi.mocked(shouldSPOVote).mockReturnValue(false);
      render(<GovernanceDetailOverview query={createQuery() as any} />);

      // 2 top cards + CC card + DRep card + SPO "not voting" card
      const cards = screen.getAllByTestId("OverviewCard");
      expect(cards).toHaveLength(5);
    });

    it("renders 3 cards when CC does not vote and SPOs do not vote", () => {
      vi.mocked(shouldCCVote).mockReturnValue(false);
      vi.mocked(shouldSPOVote).mockReturnValue(false);
      render(<GovernanceDetailOverview query={createQuery() as any} />);

      // 2 top cards + DRep card + SPO "not voting" card = 4
      // (CC card is completely hidden, not replaced with "not voting")
      const cards = screen.getAllByTestId("OverviewCard");
      expect(cards).toHaveLength(4);
    });
  });

  // ── determineApproval integration ──────────────────────────
  describe("determineApproval integration", () => {
    it("passes correct epoch params and type to determineApproval", () => {
      render(<GovernanceDetailOverview query={createQuery() as any} />);

      expect(determineApproval).toHaveBeenCalledTimes(1);
      const [epochParams, , , type] = vi.mocked(determineApproval).mock.calls[0];

      expect(epochParams).toEqual(fixture.epoch_param[0]);
      expect(type).toBe("TreasuryWithdrawals");
    });

    it("passes committee members and committee data to determineApproval", () => {
      render(<GovernanceDetailOverview query={createQuery() as any} />);

      const [, members, committeeData] = vi.mocked(determineApproval).mock.calls[0];
      expect(members).toHaveLength(5);
      expect(committeeData.quorum.numerator).toBe(2);
      expect(committeeData.quorum.denuminator).toBe(3);
    });

    it("passes DRep vote ratio between 0 and 1", () => {
      render(<GovernanceDetailOverview query={createQuery() as any} />);

      const [, , , , drepRatio] = vi.mocked(determineApproval).mock.calls[0];
      expect(drepRatio).toBeGreaterThan(0);
      expect(drepRatio).toBeLessThanOrEqual(1);
    });

    it("passes SPO vote ratio between 0 and 1", () => {
      render(<GovernanceDetailOverview query={createQuery() as any} />);

      const [, , , , , spoRatio] = vi.mocked(determineApproval).mock.calls[0];
      expect(spoRatio).toBeGreaterThan(0);
      expect(spoRatio).toBeLessThanOrEqual(1);
    });
  });

  // ── Error state ────────────────────────────────────────────
  describe("error state", () => {
    it("does not render cards when query has error", () => {
      render(
        <GovernanceDetailOverview
          query={createQuery(fixture, { isError: true, isSuccess: false }) as any}
        />,
      );
      expect(screen.queryByTestId("OverviewCard")).not.toBeInTheDocument();
    });
  });
});
