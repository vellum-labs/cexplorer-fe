import { vi } from "vitest";
import { render, screen } from "@testing-library/react";

// Import individual mocks (NOT barrel) so we can provide custom SDK mock
import "../../mocks/useAppTranslation";
import "../../mocks/router";
import "../../mocks/services";

// --- Custom SDK mock: Tabs exposes items visibility, HeaderBannerSubtitle exposes title ---
vi.mock("@vellumlabs/cexplorer-sdk", () => ({
  Tabs: (props: any) => (
    <div
      data-testid="Tabs"
      data-apiloading={String(props.apiLoading ?? false)}
    >
      {props.items?.map((item: any) => (
        <div
          key={item.key}
          data-testid={`tab-${item.key}`}
          data-visible={String(item.visible)}
          data-label={item.label}
        >
          {item.content}
        </div>
      ))}
    </div>
  ),
  HeaderBannerSubtitle: (props: any) => (
    <div
      data-testid="HeaderBannerSubtitle"
      data-title={props.title}
      data-hash={props.hash}
      data-hashstring={props.hashString}
    />
  ),
  JsonDisplay: () => <div data-testid="JsonDisplay" />,
  formatString: vi.fn((str: string) => str),
  formatNumber: vi.fn((n: number) => String(n)),
  toUtcDate: vi.fn((d: string) => d),
}));

// --- Mock heavy child components as simple stubs ---
vi.mock("@/components/governance/GovernanceDetailOverview", () => ({
  GovernanceDetailOverview: (props: any) => (
    <div data-testid="GovernanceDetailOverview" data-isloading={String(props.query?.isLoading ?? false)} />
  ),
}));

vi.mock("@/components/governance/tabs/GovernanceDetailAboutTab", () => ({
  GovernanceDetailAboutTab: (props: any) => (
    <div data-testid="GovernanceDetailAboutTab" data-id={props.id} />
  ),
}));

vi.mock("@/components/governance/tabs/GovernanceDetailNotVotedTab", () => ({
  GovernanceDetailNotVotedTab: (props: any) => (
    <div
      data-testid="GovernanceDetailNotVotedTab"
      data-id={props.id}
      data-hasaction={String(!!props.governanceAction)}
    />
  ),
}));

vi.mock("@/components/governance/tabs/GovernanceDetailStatusHistoryTab", () => ({
  GovernanceDetailStatusHistoryTab: () => (
    <div data-testid="GovernanceDetailStatusHistoryTab" />
  ),
}));

vi.mock("@/components/governance/tabs/GovernanceDetailMetadataTab", () => ({
  GovernanceDetailMetadataTab: () => (
    <div data-testid="GovernanceDetailMetadataTab" />
  ),
}));

vi.mock("@/components/global/pages/PageBase", () => ({
  PageBase: ({ children, title, subTitle, breadcrumbItems, metadataReplace, metadataTitle, homepageAd }: any) => (
    <div data-testid="PageBase" data-metadatatitle={metadataTitle} data-homepagead={String(!!homepageAd)}>
      <div data-testid="page-title">{title}</div>
      <div data-testid="page-subtitle">{subTitle}</div>
      <div data-testid="page-breadcrumbs" data-count={breadcrumbItems?.length ?? 0}>
        {breadcrumbItems?.map((item: any, i: number) => (
          <span key={i} data-testid={`breadcrumb-${i}`} data-link={item.link ?? ""} data-ident={item.ident ?? ""}>
            {item.label}
          </span>
        ))}
      </div>
      <div data-testid="metadata-replace">{metadataReplace?.after}</div>
      {children}
    </div>
  ),
}));

// --- Import fixtures and mocks ---
import {
  mockUseFetchGovernanceActionDetail,
  createMockQueryResult,
} from "../../mocks/services";
import {
  governanceActionDetailResponseFixture,
  governanceActionDetailFixture,
  minimalGovernanceActionFixture,
} from "../../fixtures/governanceActionDetail";
import { defaultRouterParams } from "../../mocks/router";

// Import the component under test AFTER all mocks are set up
import { GovernanceDetailPage } from "@/pages/governance/GovernanceDetailPage";

describe("GovernanceDetailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    defaultRouterParams.id = "gov_action1qpx0qfnj6%230";
    mockUseFetchGovernanceActionDetail.mockReturnValue(
      createMockQueryResult(governanceActionDetailResponseFixture),
    );
  });

  // ── ID decoding ─────────────────────────────────────────
  describe("ID decoding", () => {
    it("decodes %23 to # and passes decoded ID to service", () => {
      render(<GovernanceDetailPage />);
      expect(mockUseFetchGovernanceActionDetail).toHaveBeenCalledWith(
        "gov_action1qpx0qfnj6#0",
      );
    });

    it("decodes multiple %23 occurrences", () => {
      defaultRouterParams.id = "gov_action1abc%23def%2342";
      render(<GovernanceDetailPage />);
      expect(mockUseFetchGovernanceActionDetail).toHaveBeenCalledWith(
        "gov_action1abc#def#42",
      );
    });

    it("passes ID unchanged when no encoded characters", () => {
      defaultRouterParams.id = "gov_action_plain_id";
      render(<GovernanceDetailPage />);
      expect(mockUseFetchGovernanceActionDetail).toHaveBeenCalledWith(
        "gov_action_plain_id",
      );
    });
  });

  // ── Tab visibility ──────────────────────────────────────
  describe("tab visibility", () => {
    it("all 5 tabs are rendered", () => {
      render(<GovernanceDetailPage />);
      expect(screen.getByTestId("tab-voted")).toBeInTheDocument();
      expect(screen.getByTestId("tab-not_voted")).toBeInTheDocument();
      expect(screen.getByTestId("tab-status_history")).toBeInTheDocument();
      expect(screen.getByTestId("tab-description")).toBeInTheDocument();
      expect(screen.getByTestId("tab-metadata")).toBeInTheDocument();
    });

    it("voted, not_voted, status_history are always visible", () => {
      render(<GovernanceDetailPage />);
      expect(screen.getByTestId("tab-voted").getAttribute("data-visible")).toBe("true");
      expect(screen.getByTestId("tab-not_voted").getAttribute("data-visible")).toBe("true");
      expect(screen.getByTestId("tab-status_history").getAttribute("data-visible")).toBe("true");
    });

    it("description tab is visible when description.contents exists", () => {
      render(<GovernanceDetailPage />);
      expect(screen.getByTestId("tab-description").getAttribute("data-visible")).toBe("true");
    });

    it("description tab is hidden when description.contents is null", () => {
      mockUseFetchGovernanceActionDetail.mockReturnValue(
        createMockQueryResult({
          ...governanceActionDetailResponseFixture,
          data: minimalGovernanceActionFixture,
        }),
      );
      render(<GovernanceDetailPage />);
      expect(screen.getByTestId("tab-description").getAttribute("data-visible")).toBe("false");
    });

    it("metadata tab is visible when anchor.offchain.name exists", () => {
      render(<GovernanceDetailPage />);
      expect(screen.getByTestId("tab-metadata").getAttribute("data-visible")).toBe("true");
    });

    it("metadata tab is hidden when offchain is null", () => {
      mockUseFetchGovernanceActionDetail.mockReturnValue(
        createMockQueryResult({
          ...governanceActionDetailResponseFixture,
          data: minimalGovernanceActionFixture,
        }),
      );
      render(<GovernanceDetailPage />);
      expect(screen.getByTestId("tab-metadata").getAttribute("data-visible")).toBe("false");
    });
  });

  // ── Props passed to child tabs ──────────────────────────
  describe("props passed to child components", () => {
    it("passes decoded ID to GovernanceDetailAboutTab", () => {
      render(<GovernanceDetailPage />);
      const tab = screen.getByTestId("GovernanceDetailAboutTab");
      expect(tab.getAttribute("data-id")).toBe("gov_action1qpx0qfnj6#0");
    });

    it("passes decoded ID to GovernanceDetailNotVotedTab", () => {
      render(<GovernanceDetailPage />);
      const tab = screen.getByTestId("GovernanceDetailNotVotedTab");
      expect(tab.getAttribute("data-id")).toBe("gov_action1qpx0qfnj6#0");
    });

    it("passes governanceAction data to GovernanceDetailNotVotedTab", () => {
      render(<GovernanceDetailPage />);
      const tab = screen.getByTestId("GovernanceDetailNotVotedTab");
      expect(tab.getAttribute("data-hasaction")).toBe("true");
    });

    it("does not pass governanceAction when data is not loaded", () => {
      mockUseFetchGovernanceActionDetail.mockReturnValue(createMockQueryResult());
      render(<GovernanceDetailPage />);
      const tab = screen.getByTestId("GovernanceDetailNotVotedTab");
      expect(tab.getAttribute("data-hasaction")).toBe("false");
    });
  });

  // ── HeaderBannerSubtitle ────────────────────────────────
  describe("HeaderBannerSubtitle", () => {
    it("renders 2 banners (bech + legacy)", () => {
      render(<GovernanceDetailPage />);
      const subtitle = screen.getByTestId("page-subtitle");
      const banners = subtitle.querySelectorAll('[data-testid="HeaderBannerSubtitle"]');
      expect(banners).toHaveLength(2);
    });

    it("first banner has bech ID and correct title", () => {
      render(<GovernanceDetailPage />);
      const banners = screen.getAllByTestId("HeaderBannerSubtitle");
      expect(banners[0].getAttribute("data-title")).toBe("governance.detail.governanceActionId");
      expect(banners[0].getAttribute("data-hash")).toBe(governanceActionDetailFixture.ident.bech);
    });

    it("second banner has legacy ID and correct title", () => {
      render(<GovernanceDetailPage />);
      const banners = screen.getAllByTestId("HeaderBannerSubtitle");
      expect(banners[1].getAttribute("data-title")).toBe("governance.detail.legacyGovernanceActionId");
      expect(banners[1].getAttribute("data-hash")).toBe(governanceActionDetailFixture.ident.id);
    });
  });

  // ── Breadcrumbs ─────────────────────────────────────────
  describe("breadcrumbs", () => {
    it("renders 3 breadcrumb items", () => {
      render(<GovernanceDetailPage />);
      expect(screen.getByTestId("page-breadcrumbs").getAttribute("data-count")).toBe("3");
    });

    it("first breadcrumb links to /gov", () => {
      render(<GovernanceDetailPage />);
      expect(screen.getByTestId("breadcrumb-0").getAttribute("data-link")).toBe("/gov");
    });

    it("second breadcrumb links to /gov/action", () => {
      render(<GovernanceDetailPage />);
      expect(screen.getByTestId("breadcrumb-1").getAttribute("data-link")).toBe("/gov/action");
    });

    it("third breadcrumb has the decoded ID as ident", () => {
      render(<GovernanceDetailPage />);
      expect(screen.getByTestId("breadcrumb-2").getAttribute("data-ident")).toBe("gov_action1qpx0qfnj6#0");
    });
  });

  // ── Page metadata ───────────────────────────────────────
  describe("page metadata", () => {
    it("passes decoded ID as metadata replacement", () => {
      render(<GovernanceDetailPage />);
      expect(screen.getByTestId("metadata-replace").textContent).toBe("gov_action1qpx0qfnj6#0");
    });

    it("uses fallback 'Governance Action' when ID is empty", () => {
      defaultRouterParams.id = "";
      render(<GovernanceDetailPage />);
      expect(screen.getByTestId("metadata-replace").textContent).toBe("Governance Action");
    });

    it("sets metadataTitle to governanceActionDetail", () => {
      render(<GovernanceDetailPage />);
      expect(screen.getByTestId("PageBase").getAttribute("data-metadatatitle")).toBe("governanceActionDetail");
    });
  });

  // ── Loading state ───────────────────────────────────────
  describe("loading state", () => {
    it("passes apiLoading=true to Tabs when query is loading", () => {
      mockUseFetchGovernanceActionDetail.mockReturnValue({
        ...createMockQueryResult(),
        isLoading: true,
      });
      render(<GovernanceDetailPage />);
      expect(screen.getByTestId("Tabs").getAttribute("data-apiloading")).toBe("true");
    });

    it("passes apiLoading=false to Tabs when data is loaded", () => {
      render(<GovernanceDetailPage />);
      expect(screen.getByTestId("Tabs").getAttribute("data-apiloading")).toBe("false");
    });

    it("passes loading query to GovernanceDetailOverview", () => {
      mockUseFetchGovernanceActionDetail.mockReturnValue({
        ...createMockQueryResult(),
        isLoading: true,
      });
      render(<GovernanceDetailPage />);
      expect(screen.getByTestId("GovernanceDetailOverview").getAttribute("data-isloading")).toBe("true");
    });
  });
});
