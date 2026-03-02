import { vi } from "vitest";

// --- Governance Detail About Table Store ---

export const mockGovActionDetailAboutTableStore = {
  columnsVisibility: {
    date: true,
    block: true,
    epoch: true,
    tx: true,
    vote: true,
    voter: true,
    voter_role: true,
    voting_power: true,
  },
  isResponsive: true,
  rows: 20,
  columnsOrder: [
    "date",
    "voter",
    "voter_role",
    "voting_power",
    "vote",
    "epoch",
    "block",
    "tx",
  ] as string[],
  setColumnVisibility: vi.fn(),
  setIsResponsive: vi.fn(),
  setRows: vi.fn(),
  setColumsOrder: vi.fn(),
};

vi.mock("@/stores/tables/governanceDetailAboutTableStore", () => ({
  useGovActionDetailAboutTableStore: vi.fn(
    () => mockGovActionDetailAboutTableStore,
  ),
}));

// --- Governance Detail DReps Table Store ---

export const mockGovActionDetailDrepsTableStore = {
  columnsVisibility: {
    voter: true,
    voting_power: true,
  },
  isResponsive: true,
  rows: 20,
  columnsOrder: ["voter", "voting_power"] as string[],
  setColumnVisibility: vi.fn(),
  setIsResponsive: vi.fn(),
  setRows: vi.fn(),
  setColumsOrder: vi.fn(),
};

vi.mock("@/stores/tables/governanceDetailDrepsTableStore", () => ({
  useGovActionDetailDrepsTableStore: vi.fn(
    () => mockGovActionDetailDrepsTableStore,
  ),
}));

// --- Governance Detail SPOs Table Store ---

export const mockGovActionDetailSposTableStore = {
  columnsVisibility: {
    voter: true,
    voting_power: true,
  },
  isResponsive: true,
  rows: 20,
  columnsOrder: ["voter", "voting_power"] as string[],
  setColumnVisibility: vi.fn(),
  setIsResponsive: vi.fn(),
  setRows: vi.fn(),
  setColumsOrder: vi.fn(),
};

vi.mock("@/stores/tables/governanceDetailSposTableStore", () => ({
  useGovActionDetailSposTableStore: vi.fn(
    () => mockGovActionDetailSposTableStore,
  ),
}));

// --- Table hook mocks (useFilterTable, useSearchTable) ---

export const mockFilterTable = {
  filterVisibility: {} as Record<string, boolean>,
  filter: {} as Record<string, string | undefined>,
  hasFilter: false,
  anchorRefs: {} as Record<string, any>,
  filterDraft: {} as Record<string, any>,
  changeDraftFilter: vi.fn(),
  changeFilterByKey: vi.fn(),
  toggleFilter: vi.fn(),
};

vi.mock("@/hooks/tables/useFilterTable", () => ({
  useFilterTable: vi.fn(() => mockFilterTable),
}));

export const mockSearchTable = [
  { tableSearch: "", debouncedTableSearch: "", searchPrefix: "" },
  vi.fn(),
  vi.fn(),
] as const;

vi.mock("@/hooks/tables/useSearchTable", () => ({
  useSearchTable: vi.fn(() => mockSearchTable),
}));
