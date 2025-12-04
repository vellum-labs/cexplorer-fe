import type {
  AnalyticsAdaPotsResponse,
  AveragePoolResponse,
  GenesisAddressResponse,
  GroupDetailResponse,
  GroupsListResponse,
  WealthCompositionResponse,
} from "@/types/analyticsTypes";
import {
  type AnalyticsPoolBlockResponse,
  type AnalyticsRateResponse,
  type AnalyticsTopAddressesReponse,
  type AnalyticsTopStakingAccountsResponse,
  type EpochAnalyticsResponse,
  type HardforkResponse,
} from "@/types/analyticsTypes";

import { handleFetch } from "@/lib/handleFetch";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export const fetchHardforks = async () => {
  const url = "/analytics/hardforks";

  return handleFetch<HardforkResponse>(url);
};

export const useFetchHardforks = () =>
  useQuery({
    queryKey: ["hardforks"],
    queryFn: async () => {
      const { data } = await fetchHardforks();

      return data;
    },
  });

export const fetchEpochAnalytics = async () => {
  const url =
    "/analytics/epoch?display=sum_fee,count_tx,avg_tx_fee,block_version,tx_composition,max_block_tx_count,count_block,count_tx_out,avg_block_size,max_block_size,count_tx_out_address,count_tx_out_stake,count_tx_out_address_not_yesterday,count_tx_out_stake_not_yesterday";

  return handleFetch<EpochAnalyticsResponse>(url);
};

export const useFetchEpochAnalytics = () =>
  useQuery({
    queryKey: ["analytics-epoch"],
    queryFn: async () => {
      const { data } = await fetchEpochAnalytics();

      return data;
    },
  });

export const fetchAnalyticsRate = async () => {
  const url =
    "/analytics/rate?display=sum_fee,count_tx,avg_tx_fee,block_version,tx_composition,max_block_tx_count,count_tx_out,count_block,avg_block_size,max_block_size,count_tx_out_address,count_tx_out_stake,count_tx_out_address_not_yesterday,count_tx_out_stake_not_yesterday,count_pool_relay_uniq,count_pool";

  return handleFetch<AnalyticsRateResponse>(url);
};

export const useFetchAnalyticsRate = () =>
  useQuery({
    queryKey: ["analytics-rate"],
    queryFn: async () => {
      const { data } = await fetchAnalyticsRate();

      return data;
    },
  });

export const fetchAnalyticsPoolBlock = async ({
  epoch_no,
}: {
  epoch_no: number;
}) => {
  const url = "/analytics/pool_block";
  const options = {
    params: {
      epoch_no,
    },
  };

  return handleFetch<AnalyticsPoolBlockResponse>(url, undefined, options);
};

export const useFetchAnalyticsPoolBlock = (epoch_no: number) =>
  useQuery({
    queryKey: ["analytics-pool-block", epoch_no],
    queryFn: async () => {
      const { data } = await fetchAnalyticsPoolBlock({
        epoch_no,
      });

      return data;
    },
  });

export const fetchAnalyticsStakingAccounts = async ({
  limit = 20,
  offset = 0,
  drepOnly,
  poolOnly,
}: {
  limit?: number;
  offset?: number;
  drepOnly?: 2 | 1;
  poolOnly?: 2 | 1;
}) => {
  const url = `/analytics/top_account`;
  const options = {
    params: { limit, offset, drep_only: drepOnly, pool_only: poolOnly },
  };

  return handleFetch<AnalyticsTopStakingAccountsResponse>(url, offset, options);
};

export const useFetchAnalyticsStakingAccounts = (
  page: number,
  limit: number,
  drepOnly?: 2 | 1,
  poolOnly?: 2 | 1,
) =>
  useInfiniteQuery({
    queryKey: [
      "analytics_top_staking_accounts",
      limit,
      page,
      drepOnly,
      poolOnly,
    ],
    queryFn: ({ pageParam = page }) =>
      fetchAnalyticsStakingAccounts({
        limit,
        offset: pageParam,
        drepOnly,
        poolOnly,
      }),
    initialPageParam: page,
    getNextPageParam: lastPage => {
      const nextOffset = (lastPage.prevOffset as number) + limit;
      if (nextOffset >= lastPage.data[0]?.count) return undefined;
      return nextOffset;
    },
  });

export const fetchAnalyticsTopAddresses = async ({
  limit = 20,
  offset = 0,
  drepOnly,
  poolOnly,
}: {
  limit?: number;
  offset?: number;
  drepOnly?: 2 | 1;
  poolOnly?: 2 | 1;
}) => {
  const url = `/analytics/top_address`;
  const options = {
    params: { limit, offset, drep_only: drepOnly, pool_only: poolOnly },
  };

  return handleFetch<AnalyticsTopAddressesReponse>(url, offset, options);
};

export const useFetchAnalyticsTopAddresses = (
  page: number,
  limit: number,
  drepOnly?: 2 | 1,
  poolOnly?: 2 | 1,
) =>
  useInfiniteQuery({
    queryKey: ["analytics_top_addresses", limit, page, drepOnly, poolOnly],
    queryFn: ({ pageParam = page }) =>
      fetchAnalyticsTopAddresses({
        limit,
        offset: pageParam,
        drepOnly,
        poolOnly,
      }),
    initialPageParam: page,
    getNextPageParam: lastPage => {
      const nextOffset = (lastPage.prevOffset as number) + limit;
      if (nextOffset >= lastPage.data[0]?.count) return undefined;
      return nextOffset;
    },
  });

export const fetchWealthComposition = async () => {
  const url = "/analytics/wealth";

  return handleFetch<WealthCompositionResponse>(url);
};

export const useFetchWealthComposition = () =>
  useQuery({
    queryKey: ["analytics-wealth"],
    queryFn: () => fetchWealthComposition(),
  });

export const fetchAdaPots = async () => {
  const url = "/analytics/ada_pot";

  return handleFetch<AnalyticsAdaPotsResponse>(url);
};

export const useFetchAdaPots = () =>
  useQuery({
    queryKey: ["ada-pots"],
    queryFn: () => fetchAdaPots(),
  });

const fetchGroupList = async () => {
  const url = "/analytics/group_list";

  return handleFetch<GroupsListResponse>(url);
};

export const useFetchGroupsList = () => {
  return useQuery({
    queryKey: ["group-list"],
    queryFn: fetchGroupList,
  });
};

const fetchGroupDetail = async (id: string) => {
  const url = `/analytics/group_detail?id=${id}`;

  return handleFetch<GroupDetailResponse>(url);
};

export const useFetchGroupDetail = (id: string) => {
  return useQuery({
    queryKey: ["group-detail", id],
    queryFn: () => fetchGroupDetail(id),
  });
};

const fetchAveragePool = async () => {
  const url = "/analytics/avg_pool?type=avg_num_per_pool";

  return handleFetch<AveragePoolResponse>(url);
};

export const useFetchAveragePool = () => {
  return useQuery({
    queryKey: ["average-pool"],
    queryFn: () => fetchAveragePool(),
  });
};

export const fetchGenesisAddresses = async ({
  limit = 10,
  offset = 0,
}: {
  limit?: number;
  offset?: number;
}) => {
  const url = "/analytics/genesis_addr";
  const options = {
    params: { limit, offset },
  };

  return handleFetch<GenesisAddressResponse>(url, offset, options);
};

export const useFetchGenesisAddresses = (page: number, limit: number) =>
  useInfiniteQuery({
    queryKey: ["analytics_genesis_addresses", limit, page],
    queryFn: ({ pageParam = page }) =>
      fetchGenesisAddresses({
        limit,
        offset: pageParam,
      }),
    initialPageParam: page,
    getNextPageParam: lastPage => {
      const nextOffset = (lastPage.prevOffset as number) + limit;
      if (nextOffset >= lastPage.data.count) return undefined;
      return nextOffset;
    },
  });
