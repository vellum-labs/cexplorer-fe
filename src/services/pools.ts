import type {
  DelegEpochRegisteredResponse,
  PoolAboutResponse,
  PoolAwardsResponse,
  PoolBirthdaysResponse,
  PoolBlocksResponse,
  PoolDebugResponse,
  PoolDelegatorsResponse,
  PoolDelegatorStatsResponse,
  PoolDetailResponse,
  PoolRetirmentResponse,
  PoolRewardsResponse,
  PoolsListResponse,
  PoolUpdateResponse,
  RetiredPoolsResponse,
  StakeDrepsNotSpoResponse,
  TopMarginsWithDelegatorsResponse,
  TopMultiDelegatorsResponse,
} from "@/types/poolTypes";

import { handleFetch } from "@/lib/handleFetch";
import { useWatchlistStore } from "@/stores/watchlistStore";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import type { AddressDetailParams } from "./stake";

interface PoolListArgs {
  limit?: number;
  offset?: number;
  sort?: "asc" | "desc";
  order?:
    | "ranking"
    | "live_stake"
    | "active_stake"
    | "delegators"
    | "pledge"
    | "pledged"
    | "roa_lifetime"
    | "average_stake"
    | "blocks"
    | "roa_recent"
    | "blocks_epoch"
    | "blocks_total"
    | "slot_update"
    | "new"
    | "update"
    | "top_delegator"
    | "leverage";
  name?: string;
  pool_id?: string;
  token?: string;
  watchlistOnly?: "1" | undefined;
  gov_action?: string;
  is_drep?: number;
  is_not_drep?: number;
}

interface PoolRewardsArgs {
  limit?: number;
  offset?: number;
  sort?: "asc" | "desc";
  order?: string;
  name?: string;
  pool_id?: string;
}

export const fetchPoolBlocks = async ({ pool_id }: { pool_id: string }) => {
  const url = `/pool/block`;
  const options = {
    params: { pool_id },
  };

  return handleFetch<PoolBlocksResponse>(url, undefined, options);
};

export const useFetchPoolBlocks = (pool_id: string) =>
  useQuery({
    queryKey: ["pool-blocks", pool_id],
    queryFn: () => fetchPoolBlocks({ pool_id }),
    enabled: !!pool_id && pool_id.startsWith("pool1"),
    staleTime: 300000,
  });

export const fetchPoolDelegators = async ({
  limit = 20,
  offset = 0,
  pool_id,
  type,
  order,
  sort,
}: {
  limit?: number;
  offset?: number;
  pool_id: string;
  type: "gone" | "live";
  sort: "asc" | "desc" | undefined;
  order: "live_stake" | "slot_update" | undefined;
}) => {
  const url = `/pool/delegator`;
  const options = {
    params: { limit, offset, pool_id, type, order, sort },
  };

  return handleFetch<PoolDelegatorsResponse>(url, offset, options);
};

export const useFetchPoolDelegators = (
  pool_id: string,
  page: number,
  limit: number,
  type: "gone" | "live",
  sort: "asc" | "desc" | undefined,
  order: "live_stake" | "slot_update" | undefined,
) =>
  useInfiniteQuery({
    queryKey: ["pool-delegators", pool_id, type, sort, order, limit, page],
    queryFn: ({ pageParam = page }) =>
      fetchPoolDelegators({
        pool_id,
        type,
        sort,
        order,
        limit,
        offset: pageParam,
      }),
    enabled: !!pool_id && pool_id.startsWith("pool1"),
    initialPageParam: page,
    getNextPageParam: lastPage => {
      const nextOffset = (lastPage.prevOffset as number) + limit;
      if (nextOffset >= lastPage.data[0]?.count) return undefined;
      return nextOffset;
    },
    staleTime: 300000,
  });

export const fetchPoolReward = async ({
  limit = 20,
  offset = 0,
  name,
  pool_id,
}: PoolRewardsArgs) => {
  const url = `/pool/reward`;
  const options = {
    params: { limit, offset, name, pool_id },
  };

  return handleFetch<PoolRewardsResponse>(url, offset, options);
};

export const useFetchPoolReward = (
  pool_id: string,
  limit: number,
  page: number,
) =>
  useInfiniteQuery({
    queryKey: ["pool-reward", limit, page, pool_id],
    queryFn: ({ pageParam = page }) =>
      fetchPoolReward({
        pool_id,
        limit,
        offset: pageParam,
      }),
    enabled: !!pool_id && pool_id.startsWith("pool1"),
    initialPageParam: page,
    getNextPageParam: lastPage => {
      const nextOffset = (lastPage.prevOffset as number) + limit;
      if (nextOffset >= lastPage.data[0]?.count) return undefined;
      return nextOffset;
    },
    staleTime: 300000,
  });

interface PoolDetailArgs {
  pool_id: string | undefined;
  hash_raw: string | undefined;
}

export const fetchPoolDetail = async ({
  pool_id,
  hash_raw,
}: PoolDetailArgs) => {
  const url = `/pool/detail`;
  const options = {
    params: { hash_raw, pool_id },
  };

  return handleFetch<PoolDetailResponse>(url, undefined, options);
};

export const fetchPoolsList = async ({
  limit = 20,
  offset = 0,
  sort = "desc",
  order = "ranking",
  name,
  pool_id,
  token,
  watchlistOnly,
  gov_action,
  is_drep,
  is_not_drep,
}: PoolListArgs) => {
  const url = "/pool/list";
  const options = {
    headers: { usertoken: token || "" },
    params: {
      limit,
      offset,
      sort,
      order,
      name,
      pool_id,
      watchlist_only: watchlistOnly,
      gov_action,
      is_drep,
      is_not_drep,
    },
  };

  return handleFetch<PoolsListResponse>(url, offset, options);
};

export const useFetchPoolListDefault = () =>
  useQuery({
    queryKey: ["pool-list-default"],
    queryFn: () =>
      fetchPoolsList({
        limit: 100,
        offset: 0,
        sort: "desc",
        order: "active_stake",
      }),
  });

export const fetchPoolsBirthdays = async ({ pool_id }: PoolListArgs) => {
  const url = "/pool/birthday";
  const options = {
    params: { pool_id },
  };

  return handleFetch<PoolBirthdaysResponse>(url, undefined, options);
};

export const useFetchPoolBirthdays = (pool_id: string | undefined) =>
  useQuery({
    queryKey: ["pool-birthdays", pool_id],
    queryFn: () => fetchPoolsBirthdays({ pool_id }),
  });

export const useFetchPoolDetail = (
  pool_id: string | undefined,
  hash_raw: string | undefined,
) =>
  useQuery({
    queryKey: ["pool-detail", pool_id, hash_raw],
    queryFn: () => fetchPoolDetail({ pool_id, hash_raw }),
    refetchInterval: 300000,
    enabled: !!pool_id || !!hash_raw,
  });

export const useFetchPoolsList = (
  limit: number,
  page: number,
  sort: "asc" | "desc",
  order:
    | "ranking"
    | "live_stake"
    | "active_stake"
    | "average_stake"
    | "delegators"
    | "blocks"
    | "pledged"
    | "roa_lifetime"
    | "roa_recent"
    | "pledge"
    | "blocks_epoch"
    | "blocks_total"
    | "slot_update"
    | "new"
    | "update"
    | "top_delegator"
    | "leverage",
  name?: string,
  pool_id?: string,
  token?: string,
  watchlistOnly?: "1" | undefined,
  gov_action?: string,
  is_drep?: number,
  is_not_drep?: number,
) => {
  const { watchlist } = useWatchlistStore();
  return useInfiniteQuery({
    queryKey: [
      "pools-list",
      limit,
      page,
      sort,
      order,
      name,
      pool_id,
      token,
      watchlistOnly,
      watchlist,
      gov_action,
      is_drep,
      is_not_drep,
    ],
    queryFn: ({ pageParam = page }) => {
      const options = {
        limit,
        offset: pageParam,
        sort,
        order,
        token,
        watchlistOnly,
        gov_action,
        is_drep,
        is_not_drep,
      };

      if (!pool_id) {
        options["name"] = name;
      } else {
        options["pool_id"] = pool_id;
      }

      return fetchPoolsList(options);
    },

    initialPageParam: page,
    getNextPageParam: lastPage => {
      const nextOffset = (lastPage.prevOffset as number) + limit;
      if (nextOffset >= lastPage.data.count) return undefined;
      return nextOffset;
    },
    refetchOnWindowFocus: false,
    refetchInterval: 300000,
  });
};

interface PoolUpdateArgs {
  pool_id: string;
}

export const fetchPoolUpdate = async ({ pool_id }: PoolUpdateArgs) => {
  const url = "/pool/update";
  const options = {
    params: { pool_id },
  };

  return handleFetch<PoolUpdateResponse>(url, undefined, options);
};

export const useFetchPoolUpdate = (pool_id: string) =>
  useQuery({
    queryKey: ["pool-update", pool_id],
    queryFn: () => fetchPoolUpdate({ pool_id }),
  });

interface PoolAwards extends PoolUpdateArgs {}

export const fetchPoolAwards = async ({ pool_id }: PoolAwards) => {
  const url = "/pool/award";
  const options = {
    params: { pool_id },
  };

  return handleFetch<PoolAwardsResponse>(url, undefined, options);
};

export const useFetchPoolAwards = (pool_id: string) =>
  useQuery({
    queryKey: ["pool-awards", pool_id],
    queryFn: () => fetchPoolAwards({ pool_id }),
  });

export const fetchPoolDelegatorsStats = async ({
  pool_id,
}: {
  pool_id: string;
}) => {
  const url = "/pool/delegator_stats";
  const options = {
    params: { pool_id },
  };

  return handleFetch<PoolDelegatorStatsResponse>(url, undefined, options);
};

export const fetchGlobalPoolAwards = async ({
  limit = 20,
  offset = 0,
}: {
  limit?: number;
  offset?: number;
}) => {
  const url = "/pool/award";
  const options = {
    params: { limit, offset },
  };

  return handleFetch<PoolAwardsResponse>(url, undefined, options);
};

export const useFetchGlobalPoolAwards = (limit: number, page: number) =>
  useInfiniteQuery({
    queryKey: ["pool-awards", limit, page],
    queryFn: async ({ pageParam = page }) =>
      fetchGlobalPoolAwards({
        limit,
        offset: pageParam,
      }),
    initialPageParam: page,
    getNextPageParam: lastPage => {
      const nextOffset = (lastPage.prevOffset as number) + limit;
      if (nextOffset >= lastPage.data.count) return undefined;
      return nextOffset;
    },
    refetchInterval: 180_000,
  });

export const useFetchPoolDelegatorStats = (pool_id: string) =>
  useQuery({
    queryKey: ["pool-delegator-stats", pool_id],
    queryFn: () => fetchPoolDelegatorsStats({ pool_id }),
  });

export const fetchPoolAbout = async ({ pool_id }: PoolUpdateArgs) => {
  const url = "/pool/about";
  const options = {
    params: { pool_id },
  };

  return handleFetch<PoolAboutResponse>(url, undefined, options);
};

export const useFetchPoolAbout = (pool_id: string) =>
  useQuery({
    queryKey: ["pool-about", pool_id],
    queryFn: () => fetchPoolAbout({ pool_id }),
  });

export const fetchTopMarginsWithDelegators = async ({
  type,
  offset,
  limit,
}) => {
  const url = "/analytics/top_pool";
  const options = {
    params: { type, offset, limit },
  };

  return handleFetch<TopMarginsWithDelegatorsResponse>(url, offset, options);
};

export const useFetchTopMarginsWithDelegators = (
  type: string,
  limit: number,
  page: number,
  enabled: boolean,
) =>
  useInfiniteQuery({
    queryKey: ["top-margin-with-delegators", type, page, limit],
    queryFn: async ({ pageParam = page }) =>
      fetchTopMarginsWithDelegators({ type, offset: pageParam, limit }),
    initialPageParam: page,
    getNextPageParam: lastPage => {
      const nextOffset = (lastPage.prevOffset as number) + limit;
      if (nextOffset >= lastPage.data.count) return undefined;
      return nextOffset;
    },
    enabled,
  });

export const fetchRetiredPools = async ({
  type = "live",
  limit = 20,
  offset = 0,
  order = "date",
}: AddressDetailParams & {
  type?: "live" | "active";
  order?: "date" | "live_stake";
}) => {
  const url = "/pool/retired";

  const options = {
    params: {
      type,
      limit,
      offset,
      order,
    },
  };

  return handleFetch<RetiredPoolsResponse>(url, offset, options);
};

export const useFetchRetiredPools = (
  limit: number,
  page: number,
  type?: "live" | "active",
  order?: "date" | "live_stake",
) =>
  useInfiniteQuery({
    queryKey: ["retired-pools", type, limit, page, order],
    queryFn: async ({ pageParam = page }) =>
      fetchRetiredPools({
        type,
        limit,
        offset: pageParam,
        order,
      }),
    initialPageParam: page,
    getNextPageParam: lastPage => {
      const nextOffset = (lastPage.prevOffset as number) + limit;
      if (nextOffset >= lastPage.data.count) return undefined;
      return nextOffset;
    },
    refetchInterval: 60_000,
  });

export const fetchTopMultiDelegators = async ({
  limit = 20,
  offset = 0,
}: {
  limit?: number;
  offset?: number;
  type?: string;
}) => {
  const url = "/analytics/top_multi";

  const options = {
    params: {
      limit,
      offset,
    },
  };

  return handleFetch<TopMultiDelegatorsResponse>(url, offset, options);
};

export const useFetchTopMultiDelegators = (limit: number, page: number) =>
  useInfiniteQuery({
    queryKey: ["top-multi-delegators", limit, page],
    queryFn: async ({ pageParam = page }) =>
      fetchTopMultiDelegators({
        limit,
        offset: pageParam,
      }),
    initialPageParam: page,
    getNextPageParam: lastPage => {
      const nextOffset = (lastPage.prevOffset as number) + limit;
      if (nextOffset >= lastPage.data.count) return undefined;
      return nextOffset;
    },
    refetchInterval: 60_000,
  });

const fetchDelegEpochRegistered = () => {
  const url = "/analytics/deleg?type=deleg_epoch_registered";

  return handleFetch<DelegEpochRegisteredResponse>(url);
};

export const useFetchDelegEpochRegistered = () => {
  return useQuery({
    queryKey: ["deleg-epoch-registered"],
    queryFn: () => fetchDelegEpochRegistered(),
  });
};

const fetchStakeDrepsNotSpo = () => {
  const url = "/analytics/stake?type=stake_dreps_not_spo";

  return handleFetch<StakeDrepsNotSpoResponse>(url);
};

export const useFetchStakeDrepsNotSpo = () => {
  return useQuery({
    queryKey: ["stake-drep-not-spo"],
    queryFn: () => fetchStakeDrepsNotSpo(),
  });
};

const fetchPoolRetirment = (hash: string) => {
  const url = `/pool/retire`;

  const options = {
    params: {
      pool_id: hash,
    },
  };

  return handleFetch<PoolRetirmentResponse>(url, undefined, options);
};

export const useFetchPoolRetirment = (hash: string) => {
  return useQuery({
    queryKey: ["pool_retirment", hash],
    queryFn: () => fetchPoolRetirment(hash),
  });
};

const fetchPoolDebug = (pool_id: string) => {
  const url = `/pool/debug`;

  const options = {
    params: {
      pool_id,
    },
  };

  return handleFetch<PoolDebugResponse>(url, undefined, options);
};

export const useFetchPoolDebug = (pool_id: string) => {
  return useQuery({
    queryKey: ["pool_debug", pool_id],
    queryFn: () => fetchPoolDebug(pool_id),
    enabled: !!pool_id && pool_id.startsWith("pool1"),
  });
};
