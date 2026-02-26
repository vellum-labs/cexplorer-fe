import { intersectMboApiUrl } from "@/constants/confVariables";
import { handleFetch } from "@/lib/handleFetch";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import type {
  VendorContractsResponse,
  FetchVendorContractsParams,
  TreasuryResponse,
  StatisticsResponse,
  VendorContractDetailResponse,
  MilestonesResponse,
  EventsResponse,
  FetchEventsParams,
} from "@/types/vendorContractTypes";

export type {
  MilestonesSummary,
  Financials,
  Treasury,
  VendorContract,
  VendorContractsResponse,
  VendorContractStatusFilter,
  FetchVendorContractsParams,
  TreasuryStatistics,
  TreasuryFinancials,
  TreasuryData,
  TreasuryResponse,
  StatisticsTreasury,
  StatisticsProjects,
  StatisticsMilestones,
  StatisticsEvents,
  StatisticsFinancials,
  StatisticsSync,
  StatisticsData,
  StatisticsResponse,
  VendorContractDetail,
  VendorContractDetailResponse,
  Milestone,
  MilestonesResponse,
  VendorContractEvent,
  EventsResponse,
  FetchEventsParams,
} from "@/types/vendorContractTypes";

export const fetchVendorContracts = async ({
  page = 1,
  limit = 10,
  status,
  search,
  sort,
  order,
  from_time,
  to_time,
}: FetchVendorContractsParams = {}) => {
  if (!intersectMboApiUrl) {
    throw new Error("Intersect MBO API is not configured");
  }

  return handleFetch<VendorContractsResponse>(
    "/vendor-contracts",
    undefined,
    {
      baseUrl: intersectMboApiUrl,
      params: {
        page,
        limit,
        status,
        search,
        sort,
        order,
        from_time,
        to_time,
      },
    },
  );
};

export const useFetchVendorContracts = (
  params: FetchVendorContractsParams = {},
) => {
  const { page = 1, limit = 10, ...rest } = params;

  return useQuery({
    queryKey: ["vendor-contracts", page, limit, rest],
    queryFn: () => fetchVendorContracts({ page, limit, ...rest }),
    enabled: !!intersectMboApiUrl,
  });
};

export const useFetchVendorContractsInfinite = (
  params: FetchVendorContractsParams = {},
) => {
  const { page = 1, limit = 10, ...rest } = params;

  return useInfiniteQuery({
    queryKey: ["vendor-contracts-infinite", page, limit, rest],
    queryFn: ({ pageParam = page }) =>
      fetchVendorContracts({ page: pageParam, limit, ...rest }),
    initialPageParam: page,
    getNextPageParam: lastPage => {
      if (!lastPage.pagination.has_next) return undefined;
      return lastPage.pagination.page + 1;
    },
    enabled: !!intersectMboApiUrl,
  });
};

export const fetchTreasury = async () => {
  if (!intersectMboApiUrl) {
    throw new Error("Intersect MBO API is not configured");
  }

  return handleFetch<TreasuryResponse>(
    "/treasury",
    undefined,
    { baseUrl: intersectMboApiUrl },
  );
};

export const useFetchTreasury = () => {
  return useQuery({
    queryKey: ["treasury"],
    queryFn: fetchTreasury,
    enabled: !!intersectMboApiUrl,
  });
};

export const fetchStatistics = async () => {
  if (!intersectMboApiUrl) {
    throw new Error("Intersect MBO API is not configured");
  }

  return handleFetch<StatisticsResponse>(
    "/statistics",
    undefined,
    { baseUrl: intersectMboApiUrl },
  );
};

export const useFetchStatistics = () => {
  return useQuery({
    queryKey: ["treasury-statistics"],
    queryFn: fetchStatistics,
    enabled: !!intersectMboApiUrl,
  });
};

export const fetchVendorContractDetail = async (projectId: string) => {
  if (!intersectMboApiUrl) {
    throw new Error("Intersect MBO API is not configured");
  }

  return handleFetch<VendorContractDetailResponse>(
    `/vendor-contracts/${projectId}`,
    undefined,
    { baseUrl: intersectMboApiUrl },
  );
};

export const useFetchVendorContractDetail = (projectId: string) => {
  return useQuery({
    queryKey: ["vendor-contract-detail", projectId],
    queryFn: () => fetchVendorContractDetail(projectId),
    enabled: !!intersectMboApiUrl && !!projectId,
  });
};

export const fetchVendorContractMilestones = async (projectId: string) => {
  if (!intersectMboApiUrl) {
    throw new Error("Intersect MBO API is not configured");
  }

  return handleFetch<MilestonesResponse>(
    `/vendor-contracts/${projectId}/milestones`,
    undefined,
    { baseUrl: intersectMboApiUrl },
  );
};

export const useFetchVendorContractMilestones = (projectId: string) => {
  return useQuery({
    queryKey: ["vendor-contract-milestones", projectId],
    queryFn: () => fetchVendorContractMilestones(projectId),
    enabled: !!intersectMboApiUrl && !!projectId,
  });
};

export const fetchVendorContractEvents = async ({
  projectId,
  page = 1,
  limit = 10,
}: FetchEventsParams) => {
  if (!intersectMboApiUrl) {
    throw new Error("Intersect MBO API is not configured");
  }

  return handleFetch<EventsResponse>(
    `/vendor-contracts/${projectId}/events`,
    undefined,
    {
      baseUrl: intersectMboApiUrl,
      params: { page, limit },
    },
  );
};

export const useFetchVendorContractEvents = (params: FetchEventsParams) => {
  const { projectId, page = 1, limit = 10 } = params;

  return useQuery({
    queryKey: ["vendor-contract-events", projectId, page, limit],
    queryFn: () => fetchVendorContractEvents({ projectId, page, limit }),
    enabled: !!intersectMboApiUrl && !!projectId,
  });
};

export const useFetchVendorContractEventsInfinite = (
  params: FetchEventsParams,
) => {
  const { projectId, page = 1, limit = 10 } = params;

  return useInfiniteQuery({
    queryKey: ["vendor-contract-events-infinite", projectId, page, limit],
    queryFn: ({ pageParam = page }) =>
      fetchVendorContractEvents({ projectId, page: pageParam, limit }),
    initialPageParam: page,
    getNextPageParam: lastPage => {
      if (!lastPage.pagination.has_next) return undefined;
      return lastPage.pagination.page + 1;
    },
    enabled: !!intersectMboApiUrl && !!projectId,
  });
};
