import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

// Activate all common mocks
import "../mocks";

// Mock child components not covered by SDK mock
vi.mock("@/components/table/ExportButton", () => ({
  default: () => <div data-testid="ExportButton" />,
}));
vi.mock("@/components/gov/GovVoterCell", () => ({
  GovVoterCell: (props: any) => (
    <div data-testid="GovVoterCell" data-role={props.role} />
  ),
}));
vi.mock("@/components/governance/vote/VoteCell", () => ({
  VoteCell: (props: any) => (
    <div data-testid="VoteCell" data-vote={props.vote} data-islate={String(props.isLate)} />
  ),
}));
vi.mock("@/utils/governance/isVoteLate", () => ({
  isVoteLate: vi.fn(() => false),
}));
vi.mock("@/constants/tables/governanceActionDetailAboutTableOptions", () => ({
  governanceActionDetailAboutTableOptions: [
    { key: "date" },
    { key: "voter" },
    { key: "voter_role" },
    { key: "voting_power" },
    { key: "vote" },
    { key: "epoch" },
    { key: "block" },
    { key: "tx" },
  ],
}));
vi.mock("lucide-react", () => ({
  ExternalLink: () => <span data-testid="ExternalLink" />,
  Landmark: () => <span data-testid="Landmark" />,
  Route: () => <span data-testid="Route" />,
  User: () => <span data-testid="User" />,
  X: (props: any) => <span data-testid="X" onClick={props.onClick} />,
}));

import { GovernanceDetailAboutTab } from "@/components/governance/tabs/GovernanceDetailAboutTab";
import {
  mockUseFetchGovernanceVote,
  createMockInfiniteQueryResult,
} from "../mocks/services";

// ── Vote fixtures ──────────────────────────────────────────
const makeVote = (overrides: Record<string, any> = {}) => ({
  tx: {
    time: "2024-11-15T10:30:00",
    hash: "txhash123",
    epoch_no: 500,
    block_no: 12345,
    block_hash: "blockhash123",
  },
  voter_role: "DRep",
  vote: "Yes",
  info: {
    id: "drep1abc",
    meta: null,
    ident: null,
    power: { stake: 5000000000 },
  },
  proposal: {
    ident: { id: "proposal1" },
    expired_epoch: null,
    enacted_epoch: null,
    ratified_epoch: null,
  },
  anchor: null,
  ...overrides,
});

const votesPage = {
  data: {
    data: [
      makeVote(),
      makeVote({ voter_role: "SPO", vote: "No", info: { id: "pool1xyz", meta: null, ident: null, power: { stake: 3000000000 } } }),
      makeVote({ voter_role: "ConstitutionalCommittee", vote: "Abstain", info: { id: "cc1hash", meta: null, ident: null, power: null } }),
    ],
    count: 3,
  },
};

describe("GovernanceDetailAboutTab", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseFetchGovernanceVote.mockReturnValue(
      createMockInfiniteQueryResult([votesPage]),
    );
  });

  it("calls useFetchGovernanceVote with the provided id", () => {
    render(<GovernanceDetailAboutTab id="gov_action1abc#0" />);

    expect(mockUseFetchGovernanceVote).toHaveBeenCalled();
    // The id is the 3rd argument (index 2)
    const callArgs = mockUseFetchGovernanceVote.mock.calls[0];
    expect(callArgs[2]).toBe("gov_action1abc#0");
  });

  it("renders GlobalTable with type=infinite", () => {
    render(<GovernanceDetailAboutTab id="gov_action1abc#0" />);

    const table = screen.getByTestId("GlobalTable");
    expect(table).toBeInTheDocument();
    expect(table.getAttribute("data-type")).toBe("infinite");
  });

  it("renders TableSearchInput", () => {
    render(<GovernanceDetailAboutTab id="test-id" />);
    expect(screen.getAllByTestId("TableSearchInput").length).toBeGreaterThan(0);
  });

  it("renders TableSettingsDropdown", () => {
    render(<GovernanceDetailAboutTab id="test-id" />);
    expect(screen.getAllByTestId("TableSettingsDropdown").length).toBeGreaterThan(0);
  });

  it("renders ExportButton", () => {
    render(<GovernanceDetailAboutTab id="test-id" />);
    expect(screen.getAllByTestId("ExportButton").length).toBeGreaterThan(0);
  });

  it("shows total votes count when data is loaded", () => {
    render(<GovernanceDetailAboutTab id="test-id" />);

    // t() returns the key, formatNumber returns the string
    expect(document.body.textContent).toContain("common:governance.voting.totalVotes");
  });

  it("shows LoadingSkeleton when query is loading", () => {
    mockUseFetchGovernanceVote.mockReturnValue({
      ...createMockInfiniteQueryResult(),
      isLoading: true,
      isFetching: true,
    });
    render(<GovernanceDetailAboutTab id="test-id" />);

    expect(screen.getByTestId("LoadingSkeleton")).toBeInTheDocument();
  });

  it("does not show total votes when loading", () => {
    mockUseFetchGovernanceVote.mockReturnValue({
      ...createMockInfiniteQueryResult(),
      isLoading: true,
      isFetching: true,
    });
    render(<GovernanceDetailAboutTab id="test-id" />);

    expect(document.body.textContent).not.toContain("common:governance.voting.totalVotes");
  });

  it("passes rows from store as itemsPerPage to GlobalTable", () => {
    render(<GovernanceDetailAboutTab id="test-id" />);

    const table = screen.getByTestId("GlobalTable");
    expect(table.getAttribute("data-itemsperpage")).toBe("20");
  });
});
