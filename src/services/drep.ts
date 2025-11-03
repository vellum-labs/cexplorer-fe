import type {
  DelegEpochChangesResponse,
  DrepAnalyticsResponse,
  DrepDelegatorResponse,
  DrepDetailResponse,
  DrepListOrder,
  DrepListResponse,
  DrepStatResponse,
  DrepVoteResponse,
  StakeIsSpoDrepResponse,
  StakeDrepRetiredResponse,
} from "@/types/drepTypes";
import type {
  DrepNotSpoSameTimeResponse,
  PoolDelegatorStatsResponse,
} from "@/types/poolTypes";

import type {
  AverageDrepResponse,
  CombinedAverageDrepResponse,
  DrepSpoSameTimeResponse,
} from "@/types/drepTypes";

import { handleFetch } from "@/lib/handleFetch";
import { useWatchlistStore } from "@/stores/watchlistStore";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

interface DrepListParams {
  limit?: number;
  offset?: number;
  view?: string;
  watchlistOnly?: "1" | undefined;
  token?: string;
  sort?: "asc" | "desc";
  order?: DrepListOrder;
  gov_action?: string;
  is_spo?: number;
  is_not_spo?: number;
}

interface DrepVoteParams {
  voter_role: "DRep" | "SPO";
  limit?: number;
  offset?: number;
  drep_voter?: string;
}

interface DrepDelegatorParams {
  view: string;
  limit?: number;
  offset?: number;
  order: "live_stake" | "slot_update";
  filter: "migrations" | "live";
}

export const fetchDrepStat = async () => {
  const url = "/gov/stat";

  return handleFetch<DrepStatResponse>(url);
};

export const useFetchDrepStat = () =>
  useQuery({
    queryKey: ["drep-stat"],
    queryFn: async () => {
      const { data } = await fetchDrepStat();

      return data;
    },
  });

export const fetchDrepAnalytics = async () => {
  const url = "/gov/drep_analytics";

  return handleFetch<DrepAnalyticsResponse>(url);
};

export const useFetchDrepAnalytics = () =>
  useQuery({
    queryKey: ["drep-analytics"],
    queryFn: async () => {
      const { data } = await fetchDrepAnalytics();

      return data;
    },
  });

export const fetchStakeDrepRetired = async () => {
  const url = "/analytics/stake?type=stake_drep_retired";

  return handleFetch<StakeDrepRetiredResponse>(url);
};

export const useFetchStakeDrepRetired = () =>
  useQuery({
    queryKey: ["stake-drep-retired"],
    queryFn: async () => {
      const { data } = await fetchStakeDrepRetired();

      return data;
    },
  });

export const fetchDrepList = async ({
  limit = 10,
  offset = 0,
  sort,
  order,
  view,
  watchlistOnly,
  token,
  gov_action,
  is_spo,
  is_not_spo,
}: DrepListParams) => {
  const url = `/gov/drep_list`;
  const options = {
    headers: {
      usertoken: token || "",
    },
    params: {
      limit,
      sort,
      order,
      offset,
      view,
      watchlist_only: watchlistOnly,
      gov_action,
      is_spo,
      is_not_spo,
    },
  };

  return handleFetch<DrepListResponse>(url, offset, options);
};

export const useFetchDrepList = (
  limit: number,
  page: number,
  sort: "asc" | "desc",
  order: DrepListOrder,
  view?: string,
  watchlistOnly?: "1" | undefined,
  token?: string,
  gov_action?: string,
  is_spo?: number,
  is_not_spo?: number,
) => {
  const { watchlist } = useWatchlistStore();

  return useInfiniteQuery({
    queryKey: [
      "drep-list",
      limit,
      page,
      order,
      sort,
      view,
      watchlistOnly,
      token,
      watchlist,
      gov_action,
      is_spo,
      is_not_spo,
    ],
    queryFn: ({ pageParam = page }) =>
      fetchDrepList({
        limit,
        offset: pageParam,
        sort,
        order,
        view,
        watchlistOnly,
        token,
        gov_action,
        is_spo,
        is_not_spo,
      }),
    initialPageParam: page,
    getNextPageParam: lastPage => {
      const nextOffset = (lastPage.prevOffset as number) + limit;
      if (nextOffset >= lastPage.data.count) return undefined;
      return nextOffset;
    },
    refetchOnWindowFocus: false,
    refetchInterval: 60000,
  });
};

export const fetchDrepDetail = async (hash: string) => {
  const url = `/gov/drep_detail?view=${hash}`;

  return handleFetch<DrepDetailResponse>(url);
};

export const useFetchDrepDetail = (hash: string) =>
  useQuery({
    queryKey: ["drep-detail", hash],
    queryFn: async () => {
      const { data } = await fetchDrepDetail(hash);

      return data;
    },
  });

export const fetchDrepVote = async ({
  voter_role,
  limit = 10,
  offset = 0,
  drep_voter,
}: DrepVoteParams) => {
  const url = `/gov/vote`;

  const options = {
    params: {
      voter_role,
      limit,
      offset,
      drep_voter,
    },
  };

  return handleFetch<DrepVoteResponse>(url, offset, options);
};

export const useFetchDrepVote = (
  voter_role: "DRep" | "SPO",
  limit: number,
  page: number,
  drep_voter?: string,
) =>
  useInfiniteQuery({
    queryKey: ["drep-vote", limit, page, voter_role, drep_voter],
    queryFn: ({ pageParam = page }) =>
      fetchDrepVote({
        voter_role,
        limit,
        offset: pageParam,
        drep_voter,
      }),
    initialPageParam: page,
    getNextPageParam: lastPage => {
      const nextOffset = (lastPage.prevOffset as number) + limit;
      if (nextOffset >= lastPage.data.count) return undefined;
      return nextOffset;
    },
    refetchOnWindowFocus: false,
    refetchInterval: 60000,
  });

export const fetchDrepDelegator = async ({
  view,
  limit = 10,
  offset = 0,
  filter,
  order,
}: DrepDelegatorParams) => {
  const url = `/gov/drep_delegator`;

  const options = {
    params: {
      view,
      filter,
      order,
      limit,
      offset,
    },
  };

  return handleFetch<DrepDelegatorResponse>(url, offset, options);
};

export const useFetchDrepDelegator = (
  limit: number,
  page: number,
  view: string,
  filter: "migrations" | "live",
  order: "live_stake" | "slot_update",
) =>
  useInfiniteQuery({
    queryKey: ["drep-delegator", limit, page, view, filter, order],
    queryFn: ({ pageParam = page }) =>
      fetchDrepDelegator({
        limit,
        offset: pageParam,
        view,
        filter,
        order,
      }),
    initialPageParam: page,
    getNextPageParam: lastPage => {
      const nextOffset = (lastPage.prevOffset as number) + limit;
      if (nextOffset >= lastPage.data.count) return undefined;
      return nextOffset;
    },
    refetchOnWindowFocus: false,
    refetchInterval: 60000,
    enabled: !!view,
  });

export const fetchDrepDelegatorStats = async ({ view }: { view: string }) => {
  const url = "/gov/drep_delegator_stats";
  const options = {
    params: { view },
  };

  return handleFetch<PoolDelegatorStatsResponse>(url, undefined, options);
};

export const useFetchDrepDelegatorStats = (view: string) =>
  useQuery({
    queryKey: ["drep-delegator-stats", view],
    queryFn: () => fetchDrepDelegatorStats({ view }),
  });

const fetchAverageDrep = async () => {
  const url = "/analytics/avg_drep?type=avg_num_per_drep";

  return handleFetch<AverageDrepResponse>(url);
};

const fetchDrepSpoSameTime = () => {
  const url = "/analytics/drep_spo?type=power_drep_spo_same_time";

  return handleFetch<DrepSpoSameTimeResponse>(url);
};

const fetchCombinedAverageDrep =
  async (): Promise<CombinedAverageDrepResponse> => {
    const [avgDrepRes, drepSpoSameTimeRes] = await Promise.all([
      fetchAverageDrep(),
      fetchDrepSpoSameTime(),
    ]);

    return {
      averageDrep: avgDrepRes.data,
      drepSpoSameTime: drepSpoSameTimeRes.data,
    };
  };

export const useFetchCombinedAverageDrep = () => {
  return useQuery({
    queryKey: ["combined-average-drep"],
    queryFn: fetchCombinedAverageDrep,
  });
};

const fetchStakeIsSpoDrep = () => {
  const url = "/analytics/stake?type=stake_is_spo_drep";

  return handleFetch<StakeIsSpoDrepResponse>(url);
};

export const useFetchStakeIsSpoDrep = () => {
  return useQuery({
    queryKey: ["stake-is-spo-drep"],
    queryFn: () => fetchStakeIsSpoDrep(),
  });
};

const fetchDrepNotSpoSameTime = () => {
  const url = "/analytics/drep_spo?type=power_drep_not_spo";

  return handleFetch<DrepNotSpoSameTimeResponse>(url);
};

export const useFetchDrepNotSpoSameTime = () => {
  return useQuery({
    queryKey: ["drep-not-spo-same-time"],
    queryFn: () => fetchDrepNotSpoSameTime(),
  });
};

const fetchDelegEpochChanges = () => {
  const url = "/analytics/deleg?type=deleg_epoch_changes";

  return handleFetch<DelegEpochChangesResponse>(url);
};

export const useFetchDelegEpochChanges = () => {
  return useQuery({
    queryKey: ["deleg-epoch-changes"],
    queryFn: () => fetchDelegEpochChanges(),
  });
};
