import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import "../../mocks/useAppTranslation";

// Mock the hook — we test component states, not hook logic (that's in useCCMemberDetail.test.tsx)
vi.mock("@/hooks/details/useCCMemberDetail", () => ({
  useCCMemberDetail: vi.fn(() => ({
    about: [],
    governance: [],
  })),
}));

// OverviewCard renders `title` as data-title (string props go through filterProps)
vi.mock("@vellumlabs/cexplorer-sdk", () => ({
  OverviewCard: (props: any) => (
    <div data-testid="OverviewCard" data-title={props.title} />
  ),
  LoadingSkeleton: (props: any) => (
    <div data-testid="LoadingSkeleton" data-height={props.height} />
  ),
}));

import { CCMemberDetailOverview } from "@/components/gov/cc/CCMemberDetailOverview";

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("CCMemberDetailOverview", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Loading state ─────────────────────────────────────────────────────────

  describe("loading state", () => {
    it("renders 2 LoadingSkeleton components", () => {
      render(
        <CCMemberDetailOverview
          memberData={undefined}
          isLoading={true}
          isError={false}
        />,
      );
      expect(screen.getAllByTestId("LoadingSkeleton")).toHaveLength(2);
    });

    it("does not render any OverviewCard when loading", () => {
      render(
        <CCMemberDetailOverview
          memberData={undefined}
          isLoading={true}
          isError={false}
        />,
      );
      expect(screen.queryByTestId("OverviewCard")).not.toBeInTheDocument();
    });
  });

  // ── Error state ───────────────────────────────────────────────────────────

  describe("error state", () => {
    it("renders nothing when isError is true", () => {
      const { container } = render(
        <CCMemberDetailOverview
          memberData={undefined}
          isLoading={false}
          isError={true}
        />,
      );
      expect(container.innerHTML).toBe("");
    });

    it("does not render LoadingSkeleton or OverviewCard on error", () => {
      render(
        <CCMemberDetailOverview
          memberData={undefined}
          isLoading={false}
          isError={true}
        />,
      );
      expect(screen.queryByTestId("LoadingSkeleton")).not.toBeInTheDocument();
      expect(screen.queryByTestId("OverviewCard")).not.toBeInTheDocument();
    });
  });

  // ── Success state ─────────────────────────────────────────────────────────

  describe("success state", () => {
    it("renders exactly 2 OverviewCards", () => {
      render(
        <CCMemberDetailOverview
          memberData={undefined}
          isLoading={false}
          isError={false}
        />,
      );
      expect(screen.getAllByTestId("OverviewCard")).toHaveLength(2);
    });

    it("first card has i18n key 'gov.cc.about' as title", () => {
      render(
        <CCMemberDetailOverview
          memberData={undefined}
          isLoading={false}
          isError={false}
        />,
      );
      const cards = screen.getAllByTestId("OverviewCard");
      expect(cards[0].getAttribute("data-title")).toBe("gov.cc.about");
    });

    it("second card has i18n key 'gov.cc.governance' as title", () => {
      render(
        <CCMemberDetailOverview
          memberData={undefined}
          isLoading={false}
          isError={false}
        />,
      );
      const cards = screen.getAllByTestId("OverviewCard");
      expect(cards[1].getAttribute("data-title")).toBe("gov.cc.governance");
    });

    it("does not render LoadingSkeleton when data is loaded", () => {
      render(
        <CCMemberDetailOverview
          memberData={undefined}
          isLoading={false}
          isError={false}
        />,
      );
      expect(screen.queryByTestId("LoadingSkeleton")).not.toBeInTheDocument();
    });
  });
});
