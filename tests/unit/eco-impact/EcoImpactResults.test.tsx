import { vi } from "vitest";
import { render, screen } from "@testing-library/react";

import "../mocks/sdk";
import "../mocks/useAppTranslation";

// --- Service / hook mocks (eco-impact specific) ---

const mockUseFetchAnalyticsRate = vi.fn();
vi.mock("@/services/analytics", () => ({
  useFetchAnalyticsRate: (...args: any[]) => mockUseFetchAnalyticsRate(...args),
}));

const mockUseFetchMiscBasic = vi.fn();
vi.mock("@/services/misc", () => ({
  useFetchMiscBasic: (...args: any[]) => mockUseFetchMiscBasic(...args),
}));

const mockUseMiscConst = vi.fn();
vi.mock("@/hooks/useMiscConst", () => ({
  useMiscConst: (...args: any[]) => mockUseMiscConst(...args),
}));

// Stub TreesProgressBar so we can assert the `trees` value passed to it
vi.mock("@/components/eco-impact/TreesProgressBar", () => ({
  TreesProgressBar: ({ trees }: { trees: number }) => (
    <div data-testid="TreesProgressBar" data-trees={String(trees)} />
  ),
}));

import { EcoImpactResults } from "@/components/eco-impact/EcoImpactResults";

// --- Helpers ---

const successQuery = (data: any) => ({
  data,
  isLoading: false,
  isFetching: false,
  isSuccess: true,
  isError: false,
  isPending: false,
  error: null,
  status: "success" as const,
  refetch: vi.fn(),
});

const loadingQuery = () => ({
  data: undefined,
  isLoading: true,
  isFetching: true,
  isSuccess: false,
  isError: false,
  isPending: true,
  error: null,
  status: "pending" as const,
  refetch: vi.fn(),
});

const RELAY_COUNT = 3_000;
const ACTIVE_STAKE = 25_000_000_000_000;
const STAKED_ADA = 1_000_000;

const rateData = { data: [{ stat: { count_pool_relay_uniq: RELAY_COUNT } }] };
const miscConst = { epoch_stat: { stake: { active: ACTIVE_STAKE } } };

// --- Tests ---

describe("EcoImpactResults", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseFetchAnalyticsRate.mockReturnValue(successQuery(rateData));
    mockUseFetchMiscBasic.mockReturnValue(
      successQuery({ data: { version: { const: 1 } } }),
    );
    mockUseMiscConst.mockReturnValue(miscConst);
  });

  // ── Loading state ───────────────────────────────────────────
  describe("loading state", () => {
    it("shows skeletons when rate query is loading", () => {
      mockUseFetchAnalyticsRate.mockReturnValue(loadingQuery());
      render(<EcoImpactResults stakedAda={STAKED_ADA} />);
      expect(screen.getAllByTestId("LoadingSkeleton").length).toBeGreaterThanOrEqual(1);
    });

    it("shows skeletons when misc query is loading", () => {
      mockUseFetchMiscBasic.mockReturnValue(loadingQuery());
      render(<EcoImpactResults stakedAda={STAKED_ADA} />);
      expect(screen.getAllByTestId("LoadingSkeleton").length).toBeGreaterThanOrEqual(1);
    });

    it("does not render results when loading", () => {
      mockUseFetchAnalyticsRate.mockReturnValue(loadingQuery());
      render(<EcoImpactResults stakedAda={STAKED_ADA} />);
      expect(screen.queryByTestId("TreesProgressBar")).not.toBeInTheDocument();
      expect(screen.queryByText("ecoImpact.results.energySaved")).not.toBeInTheDocument();
    });
  });

  // ── Null / missing data ─────────────────────────────────────
  describe("null state — missing data", () => {
    it("renders nothing when stakedAda is 0", () => {
      const { container } = render(<EcoImpactResults stakedAda={0} />);
      expect(container.firstChild).toBeNull();
    });

    it("renders nothing when relay count is 0", () => {
      mockUseFetchAnalyticsRate.mockReturnValue(
        successQuery({ data: [{ stat: { count_pool_relay_uniq: 0 } }] }),
      );
      const { container } = render(<EcoImpactResults stakedAda={STAKED_ADA} />);
      expect(container.firstChild).toBeNull();
    });

    it("renders nothing when active stake is 0", () => {
      mockUseMiscConst.mockReturnValue({ epoch_stat: { stake: { active: 0 } } });
      const { container } = render(<EcoImpactResults stakedAda={STAKED_ADA} />);
      expect(container.firstChild).toBeNull();
    });
  });

  // ── Results rendered ────────────────────────────────────────
  describe("results state — valid data", () => {
    it("renders all three result card labels", () => {
      render(<EcoImpactResults stakedAda={STAKED_ADA} />);
      expect(screen.getByText("ecoImpact.results.energyEfficiency")).toBeInTheDocument();
      expect(screen.getByText("ecoImpact.results.energySaved")).toBeInTheDocument();
      expect(screen.getByText("ecoImpact.results.co2Saved")).toBeInTheDocument();
    });

    it("renders TreesProgressBar with a positive, finite trees value", () => {
      render(<EcoImpactResults stakedAda={STAKED_ADA} />);
      const bar = screen.getByTestId("TreesProgressBar");
      const trees = Number(bar.getAttribute("data-trees"));
      expect(Number.isFinite(trees)).toBe(true);
      expect(trees).toBeGreaterThan(0);
    });

    it("does not render NaN anywhere in the output", () => {
      render(<EcoImpactResults stakedAda={STAKED_ADA} />);
      expect(document.body.textContent).not.toContain("NaN");
    });

    it("larger stake produces more trees", () => {
      const { unmount } = render(<EcoImpactResults stakedAda={STAKED_ADA} />);
      const treesSmall = Number(
        screen.getByTestId("TreesProgressBar").getAttribute("data-trees"),
      );
      unmount();

      render(<EcoImpactResults stakedAda={STAKED_ADA * 10} />);
      const treesLarge = Number(
        screen.getByTestId("TreesProgressBar").getAttribute("data-trees"),
      );

      expect(treesLarge).toBeGreaterThan(treesSmall);
    });
  });
});
