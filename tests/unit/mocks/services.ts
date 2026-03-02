import { vi } from "vitest";

/**
 * Creates a mock TanStack Query result object.
 * Pass `data` to set the resolved data; other fields default to idle/success state.
 */
export const createMockQueryResult = (data: any = undefined) => ({
  data,
  error: null,
  isError: false,
  isLoading: false,
  isSuccess: data !== undefined,
  isPending: data === undefined,
  isFetching: false,
  isRefetching: false,
  status: data !== undefined ? "success" : "pending",
  refetch: vi.fn(),
});

/**
 * Creates a mock TanStack InfiniteQuery result object.
 */
export const createMockInfiniteQueryResult = (pages: any[] = []) => ({
  data: pages.length > 0 ? { pages, pageParams: [0] } : undefined,
  error: null,
  isError: false,
  isLoading: false,
  isSuccess: pages.length > 0,
  isPending: pages.length === 0,
  isFetching: false,
  isRefetching: false,
  isFetchingNextPage: false,
  hasNextPage: false,
  fetchNextPage: vi.fn(),
  status: pages.length > 0 ? "success" : "pending",
  refetch: vi.fn(),
});

// --- Governance service mocks ---

export const mockUseFetchGovernanceActionDetail = vi.fn(() =>
  createMockQueryResult(),
);

export const mockUseFetchGovernanceVote = vi.fn(() =>
  createMockInfiniteQueryResult(),
);

export const mockUseFetchGovernanceAction = vi.fn(() =>
  createMockInfiniteQueryResult(),
);

vi.mock("@/services/governance", () => ({
  useFetchGovernanceActionDetail: (...args: any[]) =>
    mockUseFetchGovernanceActionDetail(...args),
  useFetchGovernanceVote: (...args: any[]) =>
    mockUseFetchGovernanceVote(...args),
  useFetchGovernanceAction: (...args: any[]) =>
    mockUseFetchGovernanceAction(...args),
}));

// --- Misc service mocks ---

export const mockUseFetchMiscBasic = vi.fn(() =>
  createMockQueryResult({
    data: {
      version: { const: 1 },
    },
  }),
);

vi.mock("@/services/misc", () => ({
  useFetchMiscBasic: (...args: any[]) => mockUseFetchMiscBasic(...args),
}));

// --- useMiscConst mock ---

export const mockMiscConst = {
  epoch: {
    no: 500,
    start_time: "2024-12-01T21:44:51",
  },
};

export const mockUseMiscConst = vi.fn(() => mockMiscConst);

vi.mock("@/hooks/useMiscConst", () => ({
  useMiscConst: (...args: any[]) => mockUseMiscConst(...args),
}));
