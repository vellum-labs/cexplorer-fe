import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

// Import individual mocks (NOT barrel) to avoid global SDK mock overriding our custom one
import "../../mocks/useAppTranslation";
import "../../mocks/router";
import "../../mocks/services";

vi.mock("lucide-react", () => ({
  ExternalLink: () => <span data-testid="ExternalLink" />,
}));

// Custom SDK mock that renders GlobalTable items for introspection
vi.mock("@vellumlabs/cexplorer-sdk", () => ({
  GlobalTable: (props: any) => (
    <div
      data-testid="GlobalTable"
      data-type={props.type}
      data-itemcount={props.items?.length ?? 0}
    >
      {props.items?.map((item: any, i: number) => (
        <div
          key={i}
          data-testid="table-row"
          data-status={item.status}
          data-epoch={String(item.epoch)}
          data-txhash={item.txHash ?? ""}
        >
          {item.description}
        </div>
      ))}
    </div>
  ),
  GovernanceStatusBadge: (props: any) => <div data-testid="GovernanceStatusBadge" />,
  EpochCell: (props: any) => <div data-testid="EpochCell" />,
  DateCell: (props: any) => <div data-testid="DateCell" />,
  formatString: vi.fn((s: string) => s),
  formatNumber: vi.fn((n: number) => String(n)),
  toUtcDate: vi.fn((d: string) => d),
}));

import { GovernanceDetailStatusHistoryTab } from "@/components/governance/tabs/GovernanceDetailStatusHistoryTab";
import { createMockQueryResult } from "../../mocks/services";
import {
  governanceActionDetailFixture,
  enactedGovernanceActionFixture,
  expiredGovernanceActionFixture,
} from "../../fixtures/governanceActionDetail";

// Helper to build a query prop
const makeQuery = (data: any, overrides: Record<string, any> = {}) => ({
  ...createMockQueryResult({ data }),
  ...overrides,
});

describe("GovernanceDetailStatusHistoryTab", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Null guard ──────────────────────────────────────────
  it("returns null when query has no data", () => {
    const { container } = render(
      <GovernanceDetailStatusHistoryTab query={makeQuery(undefined)} />,
    );
    expect(container.innerHTML).toBe("");
  });

  // ── Basic rendering ─────────────────────────────────────
  it("renders GlobalTable when data is present", () => {
    render(
      <GovernanceDetailStatusHistoryTab
        query={makeQuery(governanceActionDetailFixture)}
      />,
    );
    expect(screen.getByTestId("GlobalTable")).toBeInTheDocument();
  });

  it("renders GlobalTable with type=default", () => {
    render(
      <GovernanceDetailStatusHistoryTab
        query={makeQuery(governanceActionDetailFixture)}
      />,
    );
    const table = screen.getByTestId("GlobalTable");
    expect(table.getAttribute("data-type")).toBe("default");
  });

  // ── Status history for base fixture (no ratified/enacted/expired/dropped) ──
  describe("with base fixture (only submitted)", () => {
    it("produces 1 status history row (submitted)", () => {
      render(
        <GovernanceDetailStatusHistoryTab
          query={makeQuery(governanceActionDetailFixture)}
        />,
      );
      const table = screen.getByTestId("GlobalTable");
      expect(table.getAttribute("data-itemcount")).toBe("1");
    });

    it("submitted row has status=active and the tx hash", () => {
      render(
        <GovernanceDetailStatusHistoryTab
          query={makeQuery(governanceActionDetailFixture)}
        />,
      );
      const rows = screen.getAllByTestId("table-row");
      expect(rows).toHaveLength(1);
      expect(rows[0].getAttribute("data-status")).toBe("active");
      expect(rows[0].getAttribute("data-txhash")).toBe(
        governanceActionDetailFixture.tx.hash,
      );
    });

    it("submitted row description uses the t() key for submitted", () => {
      render(
        <GovernanceDetailStatusHistoryTab
          query={makeQuery(governanceActionDetailFixture)}
        />,
      );
      const rows = screen.getAllByTestId("table-row");
      expect(rows[0].textContent).toBe("governance.statusHistory.submitted");
    });
  });

  // ── Enacted fixture has ratified + enacted epochs ───────
  describe("with enacted fixture (ratified_epoch=505, enacted_epoch=510)", () => {
    it("produces 3 rows (submitted + ratified + enacted)", () => {
      render(
        <GovernanceDetailStatusHistoryTab
          query={makeQuery(enactedGovernanceActionFixture)}
        />,
      );
      const table = screen.getByTestId("GlobalTable");
      expect(table.getAttribute("data-itemcount")).toBe("3");
    });

    it("rows are in reverse order (enacted first, submitted last)", () => {
      render(
        <GovernanceDetailStatusHistoryTab
          query={makeQuery(enactedGovernanceActionFixture)}
        />,
      );
      const rows = screen.getAllByTestId("table-row");
      const statuses = rows.map((r) => r.getAttribute("data-status"));
      expect(statuses).toEqual(["enacted", "ratified", "active"]);
    });

    it("ratified and enacted rows have epoch values", () => {
      render(
        <GovernanceDetailStatusHistoryTab
          query={makeQuery(enactedGovernanceActionFixture)}
        />,
      );
      const rows = screen.getAllByTestId("table-row");
      expect(rows[0].getAttribute("data-epoch")).toBe("510");
      expect(rows[1].getAttribute("data-epoch")).toBe("505");
    });

    it("submitted row has no epoch (null)", () => {
      render(
        <GovernanceDetailStatusHistoryTab
          query={makeQuery(enactedGovernanceActionFixture)}
        />,
      );
      const rows = screen.getAllByTestId("table-row");
      expect(rows[2].getAttribute("data-epoch")).toBe("null");
    });
  });

  // ── Expired fixture ─────────────────────────────────────
  describe("with expired fixture (expired_epoch=508)", () => {
    it("produces 2 rows (submitted + expired)", () => {
      render(
        <GovernanceDetailStatusHistoryTab
          query={makeQuery(expiredGovernanceActionFixture)}
        />,
      );
      const table = screen.getByTestId("GlobalTable");
      expect(table.getAttribute("data-itemcount")).toBe("2");
    });

    it("expired row is first (reverse chronological)", () => {
      render(
        <GovernanceDetailStatusHistoryTab
          query={makeQuery(expiredGovernanceActionFixture)}
        />,
      );
      const rows = screen.getAllByTestId("table-row");
      expect(rows[0].getAttribute("data-status")).toBe("expired");
      expect(rows[1].getAttribute("data-status")).toBe("active");
    });
  });

  // ── Loading passthrough ─────────────────────────────────
  it("passes loading state to GlobalTable", () => {
    render(
      <GovernanceDetailStatusHistoryTab
        query={makeQuery(governanceActionDetailFixture, {
          isLoading: true,
          isFetching: true,
        })}
      />,
    );
    expect(screen.getByTestId("GlobalTable")).toBeInTheDocument();
  });
});
