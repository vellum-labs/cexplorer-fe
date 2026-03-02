import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

// Activate all common mocks
import "../mocks";

// Mock child components
vi.mock("@/components/address/AddressInspectorRow", () => ({
  AddressInspectorRow: (props: any) => (
    <div
      data-testid="AddressInspectorRow"
      data-title={props.title}
      data-darker={String(props.darker)}
    >
      {props.value}
    </div>
  ),
}));
vi.mock("react-markdown", () => ({
  default: (props: any) => <div data-testid="ReactMarkdown">{props.children}</div>,
}));
vi.mock("remark-gfm", () => ({
  default: {},
}));
vi.mock("@/constants/markdows", () => ({
  markdownComponents: vi.fn(() => ({})),
}));

import { GovernanceDetailMetadataTab } from "@/components/governance/tabs/GovernanceDetailMetadataTab";
import { createMockQueryResult } from "../mocks/services";
import {
  governanceActionDetailFixture,
  minimalGovernanceActionFixture,
} from "../fixtures/governanceActionDetail";

// Helpers
const makeQuery = (data: any) =>
  createMockQueryResult({ data }) as any;

describe("GovernanceDetailMetadataTab", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Basic rendering ─────────────────────────────────────
  it("renders 4 AddressInspectorRow items", () => {
    render(
      <GovernanceDetailMetadataTab query={makeQuery(governanceActionDetailFixture)} />,
    );
    const rows = screen.getAllByTestId("AddressInspectorRow");
    expect(rows).toHaveLength(4);
  });

  it("renders row titles for actionType, title, abstracts, rationale", () => {
    render(
      <GovernanceDetailMetadataTab query={makeQuery(governanceActionDetailFixture)} />,
    );
    const rows = screen.getAllByTestId("AddressInspectorRow");
    const titles = rows.map((r) => r.getAttribute("data-title"));
    expect(titles).toContain("governance.metadata.actionType");
    expect(titles).toContain("governance.metadata.title");
    expect(titles).toContain("governance.metadata.abstracts");
    expect(titles).toContain("governance.metadata.rationale");
  });

  // ── With full offchain data ─────────────────────────────
  it("renders ActionTypes component when type is present", () => {
    render(
      <GovernanceDetailMetadataTab query={makeQuery(governanceActionDetailFixture)} />,
    );
    expect(screen.getByTestId("ActionTypes")).toBeInTheDocument();
  });

  it("renders ReactMarkdown for name, abstract, and rationale", () => {
    render(
      <GovernanceDetailMetadataTab query={makeQuery(governanceActionDetailFixture)} />,
    );
    const markdowns = screen.getAllByTestId("ReactMarkdown");
    // name + abstract + rationale = 3
    expect(markdowns).toHaveLength(3);
  });

  it("renders the proposal name in ReactMarkdown", () => {
    render(
      <GovernanceDetailMetadataTab query={makeQuery(governanceActionDetailFixture)} />,
    );
    expect(document.body.textContent).toContain(
      "Test Governance Action Proposal",
    );
  });

  it("renders abstract text", () => {
    render(
      <GovernanceDetailMetadataTab query={makeQuery(governanceActionDetailFixture)} />,
    );
    expect(document.body.textContent).toContain(
      "This is a test governance action for unit testing.",
    );
  });

  it("renders rationale text", () => {
    render(
      <GovernanceDetailMetadataTab query={makeQuery(governanceActionDetailFixture)} />,
    );
    expect(document.body.textContent).toContain(
      "Unit tests improve code reliability.",
    );
  });

  // ── With minimal/missing offchain data ──────────────────
  describe("with missing offchain data", () => {
    it("shows 'Invalid metadata' when offchain name is missing", () => {
      render(
        <GovernanceDetailMetadataTab query={makeQuery(minimalGovernanceActionFixture)} />,
      );
      expect(document.body.textContent).toContain("Invalid metadata");
    });

    it("renders dash for abstract when offchain is null", () => {
      render(
        <GovernanceDetailMetadataTab query={makeQuery(minimalGovernanceActionFixture)} />,
      );
      // abstract and rationale should show "-"
      const rows = screen.getAllByTestId("AddressInspectorRow");
      const abstractRow = rows.find(
        (r) => r.getAttribute("data-title") === "governance.metadata.abstracts",
      );
      expect(abstractRow?.textContent).toContain("-");
    });

    it("renders dash for rationale when offchain is null", () => {
      render(
        <GovernanceDetailMetadataTab query={makeQuery(minimalGovernanceActionFixture)} />,
      );
      const rows = screen.getAllByTestId("AddressInspectorRow");
      const rationaleRow = rows.find(
        (r) => r.getAttribute("data-title") === "governance.metadata.rationale",
      );
      expect(rationaleRow?.textContent).toContain("-");
    });

    it("does not render ReactMarkdown when offchain is null", () => {
      render(
        <GovernanceDetailMetadataTab query={makeQuery(minimalGovernanceActionFixture)} />,
      );
      // No markdown rendered since offchain is null (except "Invalid metadata" text isn't via ReactMarkdown)
      const markdowns = screen.queryAllByTestId("ReactMarkdown");
      expect(markdowns).toHaveLength(0);
    });
  });

  // ── SafetyLinkModal ─────────────────────────────────────
  it("does not render SafetyLinkModal by default", () => {
    render(
      <GovernanceDetailMetadataTab query={makeQuery(governanceActionDetailFixture)} />,
    );
    expect(screen.queryByTestId("SafetyLinkModal")).not.toBeInTheDocument();
  });
});
