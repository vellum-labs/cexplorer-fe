import { render, renderHook } from "@testing-library/react";
import { vi } from "vitest";

import "../../mocks/useAppTranslation";
import "../../mocks/router";
import "../../mocks/services"; 

vi.mock("@/services/epoch", () => ({
  useFetchEpochDetailParam: vi.fn(() => ({
    data: { committee_max_term_length: 146 },
  })),
}));

vi.mock("@/utils/calculateEpochTimeByNumber", () => ({
  calculateEpochTimeByNumber: vi.fn(() => ({
    endTime: new Date("2025-06-01T00:00:00Z"),
  })),
}));

vi.mock("date-fns", () => ({
  formatDistanceToNow: vi.fn(() => "about 3 months"),
  format: vi.fn(() => "01/06/2025, 00:00"),
}));

vi.mock("@/utils/generateImageUrl", () => ({
  generateImageUrl: vi.fn(() => "/img/test.png"),
}));

vi.mock("@/constants/alphabet", () => ({
  alphabetWithNumbers: "abcdefghijklmnopqrstuvwxyz0123456789",
}));

vi.mock("@vellumlabs/cexplorer-sdk", () => ({
  Copy: () => <span />,
  PulseDot: (props: any) => (
    <span data-testid="PulseDot" data-color={props.color ?? "none"} />
  ),
  Image: () => <span />,
  TimeDateIndicator: (props: any) => (
    <span data-testid="TimeDateIndicator" data-time={props.time} />
  ),
  formatString: vi.fn((s: string) => s),
}));

import { useCCMemberDetail } from "@/hooks/details/useCCMemberDetail";
import type { CommitteeMember } from "@/types/governanceTypes";


const buildMember = (overrides: Partial<CommitteeMember> = {}): CommitteeMember => ({
  ident: { raw: "abc123", has_script: false, cold: "cc_cold1abc", hot: "cc_hot1abc" },
  registry: { img: "", name: "Test Member" },
  registration: null,
  de_registration: null,
  expiration_epoch: 600,
  ...overrides,
});


describe("useCCMemberDetail — governance vote statistics", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  
  it("governance list has exactly 1 item (no extra activity bars)", () => {
    const { result } = renderHook(() =>
      useCCMemberDetail({ memberData: buildMember() }),
    );
    expect(result.current.governance).toHaveLength(1);
  });

 
  it("renders 'gov.cc.totalVotes' label always", () => {
    const { result } = renderHook(() =>
      useCCMemberDetail({ memberData: buildMember() }),
    );
    const { getByText } = render(<>{result.current.governance[0].value}</>);
    expect(getByText("gov.cc.totalVotes")).toBeInTheDocument();
  });

  it("renders 'gov.cc.lastVote' label when lastVoteTime is provided", () => {
    const { result } = renderHook(() =>
      useCCMemberDetail({
        memberData: buildMember(),
        lastVoteTime: "2024-02-04T08:00:00Z",
      }),
    );
    const { getByText } = render(<>{result.current.governance[0].value}</>);
    expect(getByText("gov.cc.lastVote")).toBeInTheDocument();
  });

  it("does NOT render 'gov.cc.lastVote' label when lastVoteTime is absent", () => {
    const { result } = renderHook(() =>
      useCCMemberDetail({ memberData: buildMember() }),
    );
    const { queryByText } = render(<>{result.current.governance[0].value}</>);
    expect(queryByText("gov.cc.lastVote")).not.toBeInTheDocument();
  });

  
  it("shows totalVotes = 0 when stat is absent", () => {
    const { result } = renderHook(() =>
      useCCMemberDetail({ memberData: buildMember() }),
    );
    const { getByText } = render(<>{result.current.governance[0].value}</>);
    expect(getByText("0")).toBeInTheDocument();
  });

  it("shows 0.00% for all vote types when stat is absent", () => {
    const { result } = renderHook(() =>
      useCCMemberDetail({ memberData: buildMember() }),
    );
    const { getAllByText } = render(<>{result.current.governance[0].value}</>);
    
    expect(getAllByText("0.00%")).toHaveLength(3);
  });

  it("calculates totalVotes as sum of all stat.votes counts", () => {
    const memberData = buildMember({
      stat: {
        votes: [
          { vote: "Yes", count: 61 },
          { vote: "No", count: 10 },
          { vote: "Abstain", count: 4 },
        ],
      },
    });
    const { result } = renderHook(() => useCCMemberDetail({ memberData }));
    const { getByText } = render(<>{result.current.governance[0].value}</>);
    expect(getByText("75")).toBeInTheDocument(); 
  });

  it("calculates Yes percentage correctly (61/75 = 81.33%)", () => {
    const memberData = buildMember({
      stat: {
        votes: [
          { vote: "Yes", count: 61 },
          { vote: "No", count: 10 },
          { vote: "Abstain", count: 4 },
        ],
      },
    });
    const { result } = renderHook(() => useCCMemberDetail({ memberData }));
    const { getByText } = render(<>{result.current.governance[0].value}</>);
    expect(getByText("81.33%")).toBeInTheDocument();
  });

  it("calculates No percentage correctly (10/75 = 13.33%)", () => {
    const memberData = buildMember({
      stat: {
        votes: [
          { vote: "Yes", count: 61 },
          { vote: "No", count: 10 },
          { vote: "Abstain", count: 4 },
        ],
      },
    });
    const { result } = renderHook(() => useCCMemberDetail({ memberData }));
    const { getByText } = render(<>{result.current.governance[0].value}</>);
    expect(getByText("13.33%")).toBeInTheDocument();
  });

  it("calculates Abstain percentage correctly (4/75 = 5.33%)", () => {
    const memberData = buildMember({
      stat: {
        votes: [
          { vote: "Yes", count: 61 },
          { vote: "No", count: 10 },
          { vote: "Abstain", count: 4 },
        ],
      },
    });
    const { result } = renderHook(() => useCCMemberDetail({ memberData }));
    const { getByText } = render(<>{result.current.governance[0].value}</>);
    expect(getByText("5.33%")).toBeInTheDocument();
  });

  it("shows vote counts in labels — Yes (61), No (10), Abstain (4)", () => {
    const memberData = buildMember({
      stat: {
        votes: [
          { vote: "Yes", count: 61 },
          { vote: "No", count: 10 },
          { vote: "Abstain", count: 4 },
        ],
      },
    });
    const { result } = renderHook(() => useCCMemberDetail({ memberData }));
    const { getByText } = render(<>{result.current.governance[0].value}</>);
    expect(getByText("governance.common.yes (61)")).toBeInTheDocument();
    expect(getByText("governance.common.no (10)")).toBeInTheDocument();
    expect(getByText("governance.common.abstain (4)")).toBeInTheDocument();
  });

  it("handles 100% Yes votes correctly", () => {
    const memberData = buildMember({
      stat: { votes: [{ vote: "Yes", count: 10 }] },
    });
    const { result } = renderHook(() => useCCMemberDetail({ memberData }));
    const { getByText } = render(<>{result.current.governance[0].value}</>);
    expect(getByText("100.00%")).toBeInTheDocument();
    expect(getByText("10")).toBeInTheDocument();
  });

  it("handles votes with only No votes (0% Yes and Abstain)", () => {
    const memberData = buildMember({
      stat: { votes: [{ vote: "No", count: 5 }] },
    });
    const { result } = renderHook(() => useCCMemberDetail({ memberData }));
    const { getByText, getAllByText } = render(
      <>{result.current.governance[0].value}</>,
    );
    expect(getByText("100.00%")).toBeInTheDocument(); 
    expect(getAllByText("0.00%")).toHaveLength(2);     
  });

  
  it("shows TimeDateIndicator when lastVoteTime is provided", () => {
    const { result } = renderHook(() =>
      useCCMemberDetail({
        memberData: buildMember(),
        lastVoteTime: "2024-02-04T08:00:00Z",
      }),
    );
    const { getByTestId } = render(<>{result.current.governance[0].value}</>);
    const indicator = getByTestId("TimeDateIndicator");
    expect(indicator.getAttribute("data-time")).toBe("2024-02-04T08:00:00Z");
  });

  it("does not show TimeDateIndicator when lastVoteTime is absent", () => {
    const { result } = renderHook(() =>
      useCCMemberDetail({ memberData: buildMember() }),
    );
    const { queryByTestId } = render(<>{result.current.governance[0].value}</>);
    expect(queryByTestId("TimeDateIndicator")).not.toBeInTheDocument();
  });
});

describe("useCCMemberDetail — member status", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows 'gov.cc.active' when expiration_epoch > currentEpochNo (500)", () => {
    const memberData = buildMember({ expiration_epoch: 600 });
    const { result } = renderHook(() => useCCMemberDetail({ memberData }));
    const { getByText } = render(<>{result.current.about[1].value}</>);
    expect(getByText("gov.cc.active")).toBeInTheDocument();
  });

  it("shows 'gov.cc.inactive' when expiration_epoch < currentEpochNo and no de_registration", () => {
    const memberData = buildMember({ expiration_epoch: 400 }); 
    const { result } = renderHook(() => useCCMemberDetail({ memberData }));
    const { getByText } = render(<>{result.current.about[1].value}</>);
    expect(getByText("gov.cc.inactive")).toBeInTheDocument();
  });

  it("shows 'gov.cc.retired' when de_registration.time is in the past", () => {
    const memberData = buildMember({
      expiration_epoch: 600,
      de_registration: {
        hash: "hash_dereg",
        time: "2020-01-01T00:00:00Z", 
        index: 0,
        invalid_hereafter: null,
        treasury_donation: 0,
      },
    });
    const { result } = renderHook(() => useCCMemberDetail({ memberData }));
    const { getByText } = render(<>{result.current.about[1].value}</>);
    expect(getByText("gov.cc.retired")).toBeInTheDocument();
  });

  it("PulseDot has no explicit color when member is active (green dot default)", () => {
    const memberData = buildMember({ expiration_epoch: 600 });
    const { result } = renderHook(() => useCCMemberDetail({ memberData }));
    const { getByTestId } = render(<>{result.current.about[1].value}</>);
    expect(getByTestId("PulseDot").getAttribute("data-color")).toBe("none");
  });

  it("PulseDot has 'bg-redText' color when member is inactive", () => {
    const memberData = buildMember({ expiration_epoch: 400 });
    const { result } = renderHook(() => useCCMemberDetail({ memberData }));
    const { getByTestId } = render(<>{result.current.about[1].value}</>);
    expect(getByTestId("PulseDot").getAttribute("data-color")).toBe("bg-redText");
  });

  it("PulseDot has 'bg-redText' color when member is retired", () => {
    const memberData = buildMember({
      expiration_epoch: 600,
      de_registration: {
        hash: "hash_dereg",
        time: "2020-01-01T00:00:00Z",
        index: 0,
        invalid_hereafter: null,
        treasury_donation: 0,
      },
    });
    const { result } = renderHook(() => useCCMemberDetail({ memberData }));
    const { getByTestId } = render(<>{result.current.about[1].value}</>);
    expect(getByTestId("PulseDot").getAttribute("data-color")).toBe("bg-redText");
  });

  
  it("shows 'gov.cc.inactive' when expiration_epoch is null (no term set)", () => {
    const memberData = buildMember({ expiration_epoch: null });
    const { result } = renderHook(() => useCCMemberDetail({ memberData }));
    const { getByText } = render(<>{result.current.about[1].value}</>);
    expect(getByText("gov.cc.inactive")).toBeInTheDocument();
  });

  it("governance list still has 1 item when memberData is undefined", () => {
    const { result } = renderHook(() =>
      useCCMemberDetail({ memberData: undefined }),
    );
    expect(result.current.governance).toHaveLength(1);
  });


  it("governance JSX renders without crashing when memberData is undefined", () => {
    const { result } = renderHook(() =>
      useCCMemberDetail({ memberData: undefined }),
    );
    expect(() =>
      render(<>{result.current.governance[0]?.value ?? null}</>),
    ).not.toThrow();
  });

  it("shows totalVotes = 0 and 0.00% for all types when memberData is undefined", () => {
    const { result } = renderHook(() =>
      useCCMemberDetail({ memberData: undefined }),
    );
    const { getByText, getAllByText } = render(
      <>{result.current.governance[0]?.value ?? null}</>,
    );
    expect(getByText("0")).toBeInTheDocument();
    expect(getAllByText("0.00%")).toHaveLength(3);
  });
});
