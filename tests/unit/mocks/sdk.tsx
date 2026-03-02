import { vi } from "vitest";
import type { ReactNode } from "react";

/**
 * Helper: creates a simple pass-through component stub.
 * Renders a <div> with data-testid equal to the component name.
 */
const stub = (name: string) => {
  const Component = ({ children, ...props }: { children?: ReactNode; [key: string]: any }) => (
    <div data-testid={name} {...filterProps(props)}>
      {children}
    </div>
  );
  Component.displayName = name;
  return Component;
};

/**
 * Filters out non-serializable props (functions, React elements) for the stub.
 */
const filterProps = (props: Record<string, any>) => {
  const filtered: Record<string, any> = {};
  for (const [key, value] of Object.entries(props)) {
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      filtered[`data-${key.toLowerCase()}`] = String(value);
    }
  }
  return filtered;
};

vi.mock("@vellumlabs/cexplorer-sdk", () => ({
  // --- Layout components ---
  HeaderBannerSubtitle: stub("HeaderBannerSubtitle"),
  Tabs: stub("Tabs"),
  OverviewCard: stub("OverviewCard"),
  LoadingSkeleton: stub("LoadingSkeleton"),
  GlobalTable: stub("GlobalTable"),

  // --- Data display components ---
  JsonDisplay: stub("JsonDisplay"),
  AdaWithTooltip: stub("AdaWithTooltip"),
  Copy: stub("Copy"),
  Image: stub("Image"),
  TimeDateIndicator: stub("TimeDateIndicator"),
  ActionTypes: stub("ActionTypes"),
  GovernanceStatusBadge: stub("GovernanceStatusBadge"),
  VoteBadge: stub("VoteBadge"),
  PulseDot: stub("PulseDot"),
  Tooltip: stub("Tooltip"),
  SafetyLinkModal: stub("SafetyLinkModal"),

  // --- Table components ---
  TableSearchInput: stub("TableSearchInput"),
  TableSettingsDropdown: stub("TableSettingsDropdown"),
  DateCell: stub("DateCell"),
  BlockCell: stub("BlockCell"),
  EpochCell: stub("EpochCell"),
  SortArrow: stub("SortArrow"),

  // --- Utility functions ---
  formatString: vi.fn((str: string) => str),
  formatNumber: vi.fn((num: number) => String(num)),
  toUtcDate: vi.fn((date: string) => date),

  // --- Store hooks ---
  useLocaleStore: vi.fn(() => ({
    locale: "en",
    setLocale: vi.fn(),
  })),

  // --- Store utilities ---
  handlePersistStore: vi.fn((_name: string, initialState: any, createActions: any) => {
    const actions = createActions((fn: any) => {
      fn(initialState);
    });
    return vi.fn(() => ({ ...initialState, ...actions }));
  }),

  getColumnsSortOrder: vi.fn((columns: string[]) => columns),
}));
