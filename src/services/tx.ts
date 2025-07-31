import type {
  TxDetailParams,
  TxDetailResponse,
  TxListParams,
  TxListResponse,
} from "@/types/txTypes";

import { handleFetch } from "@/lib/handleFetch";
import type { ContractInteractionsResponse } from "@/types/contractTypes";
import type { DrepRegistrationsResponse } from "@/types/drepTypes";
import type { PoolRegistrationsResponse } from "@/types/poolTypes";
import type { StakeRegistrationsResponse } from "@/types/stakeTypes";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export const fetchTxDetail = async ({ hash }: TxDetailParams) => {
  const url = `/tx/detail?hash=${hash}`;

  return handleFetch<TxDetailResponse>(url);
};

export const useFetchTxDetail = (hash: string) =>
  useQuery({
    queryKey: ["tx-detail", hash],
    queryFn: () => fetchTxDetail({ hash }),
    enabled: !!hash,
    staleTime: Infinity,
  });

export const fetchTxList = async ({
  hash,
  limit = 10,
  offset = 0,
  address,
  stake,
  asset,
  script,
  has_donation,
  policy,
}: TxListParams) => {
  const url = `/tx/list`;
  const options = {
    params: {
      limit,
      offset,
      hash,
      address,
      stake,
      asset,
      script,
      has_donation,
      policy,
    },
  };

  return handleFetch<TxListResponse>(url, offset, options);
};

export const useFetchTxList = (
  limit: number,
  page: number,
  hash?: string,
  address?: string,
  stake?: string,
  asset?: string,
  script?: string,
  has_donation?: 1 | undefined,
  policyId?: string,
) =>
  useInfiniteQuery({
    queryKey: [
      "transactions-list",
      limit,
      asset,
      page,
      hash,
      address,
      script,
      has_donation,
      policyId,
    ],
    queryFn: ({ pageParam = page }) =>
      fetchTxList({
        limit,
        offset: pageParam,
        hash,
        address,
        stake,
        asset,
        script,
        has_donation,
        policy: policyId,
      }),
    initialPageParam: page,
    getNextPageParam: lastPage => {
      const nextOffset = (lastPage.prevOffset as number) + limit;
      if (nextOffset >= lastPage.data.count) return undefined;
      return nextOffset;
    },
    refetchOnWindowFocus: false,
    refetchInterval: 15000,
  });

export const fetchDrepRegistrations = async ({
  limit = 10,
  offset = 0,
}: TxListParams) => {
  const url = `/tx/filter`;
  const options = {
    params: {
      limit,
      offset,
      type: "drep_registrations",
    },
  };

  return handleFetch<DrepRegistrationsResponse>(url, offset, options);
};

export const useFetchDrepRegistrations = (limit: number, page: number) =>
  useInfiniteQuery({
    queryKey: ["drep-registrations", limit, page],
    queryFn: ({ pageParam = page }) =>
      fetchDrepRegistrations({
        limit,
        offset: pageParam,
      }),
    initialPageParam: page,
    getNextPageParam: lastPage => {
      const nextOffset = (lastPage.prevOffset as number) + limit;
      if (nextOffset >= lastPage.data.count) return undefined;
      return nextOffset;
    },
    refetchOnWindowFocus: false,
    refetchInterval: 15000,
  });

export const fetchDrepDeregistrations = async ({
  limit = 10,
  offset = 0,
}: TxListParams) => {
  const url = `/tx/filter`;
  const options = {
    params: {
      limit,
      offset,
      type: "drep_deregistrations",
    },
  };

  return handleFetch<DrepRegistrationsResponse>(url, offset, options);
};

export const useFetchDrepDeregistrations = (limit: number, page: number) =>
  useInfiniteQuery({
    queryKey: ["drep-deregistrations", limit, page],
    queryFn: ({ pageParam = page }) =>
      fetchDrepDeregistrations({
        limit,
        offset: pageParam,
      }),
    initialPageParam: page,
    getNextPageParam: lastPage => {
      const nextOffset = (lastPage.prevOffset as number) + limit;
      if (nextOffset >= lastPage.data.count) return undefined;
      return nextOffset;
    },
    refetchOnWindowFocus: false,
    refetchInterval: 15000,
  });

export const fetchDrepUpdates = async ({
  limit = 10,
  offset = 0,
}: TxListParams) => {
  const url = `/tx/filter`;
  const options = {
    params: {
      limit,
      offset,
      type: "drep_updates",
    },
  };

  return handleFetch<DrepRegistrationsResponse>(url, offset, options);
};

export const useFetchDrepUpdates = (limit: number, page: number) =>
  useInfiniteQuery({
    queryKey: ["drep-updates", limit, page],
    queryFn: ({ pageParam = page }) =>
      fetchDrepUpdates({
        limit,
        offset: pageParam,
      }),
    initialPageParam: page,
    getNextPageParam: lastPage => {
      const nextOffset = (lastPage.prevOffset as number) + limit;
      if (nextOffset >= lastPage.data.count) return undefined;
      return nextOffset;
    },
    refetchOnWindowFocus: false,
    refetchInterval: 15000,
  });

export const fetchPoolRegistrations = async ({
  limit = 10,
  offset = 0,
}: TxListParams) => {
  const url = `/tx/filter`;
  const options = {
    params: {
      limit,
      offset,
      type: "pool_registrations",
    },
  };

  return handleFetch<PoolRegistrationsResponse>(url, offset, options);
};

export const useFetchPoolRegistrations = (limit: number, page: number) =>
  useInfiniteQuery({
    queryKey: ["pool-registrations", limit, page],
    queryFn: ({ pageParam = page }) =>
      fetchPoolRegistrations({
        limit,
        offset: pageParam,
      }),
    initialPageParam: page,
    getNextPageParam: lastPage => {
      const nextOffset = (lastPage.prevOffset as number) + limit;
      if (nextOffset >= lastPage.data.count) return undefined;
      return nextOffset;
    },
    refetchOnWindowFocus: false,
    refetchInterval: 15000,
  });

export const fetchPoolDeregistrations = async ({
  limit = 10,
  offset = 0,
}: TxListParams) => {
  const url = `/tx/filter`;
  const options = {
    params: {
      limit,
      offset,
      type: "pool_deregistrations",
    },
  };

  return handleFetch<PoolRegistrationsResponse>(url, offset, options);
};

export const useFetchPoolDeregistrations = (limit: number, page: number) =>
  useInfiniteQuery({
    queryKey: ["pool-deregistrations", limit, page],
    queryFn: ({ pageParam = page }) =>
      fetchPoolDeregistrations({
        limit,
        offset: pageParam,
      }),
    initialPageParam: page,
    getNextPageParam: lastPage => {
      const nextOffset = (lastPage.prevOffset as number) + limit;
      if (nextOffset >= lastPage.data.count) return undefined;
      return nextOffset;
    },
    refetchOnWindowFocus: false,
    refetchInterval: 15000,
  });

export const fetchStakeRegistrations = async ({
  limit = 10,
  offset = 0,
}: TxListParams) => {
  const url = `/tx/filter`;
  const options = {
    params: {
      limit,
      offset,
      type: "stake_key_registrations",
    },
  };

  return handleFetch<StakeRegistrationsResponse>(url, offset, options);
};

export const useFetchStakeRegistrations = (limit: number, page: number) =>
  useInfiniteQuery({
    queryKey: ["stake-deregistrations", limit, page],
    queryFn: ({ pageParam = page }) =>
      fetchStakeRegistrations({
        limit,
        offset: pageParam,
      }),
    initialPageParam: page,
    getNextPageParam: lastPage => {
      const nextOffset = (lastPage.prevOffset as number) + limit;
      if (nextOffset >= lastPage.data.count) return undefined;
      return nextOffset;
    },
    refetchOnWindowFocus: false,
    refetchInterval: 15000,
  });

export const fetchContractTransactions = async ({
  limit = 10,
  offset = 0,
}: TxListParams) => {
  const url = `/tx/filter`;
  const options = {
    params: {
      limit,
      offset,
      type: "contract_transactions",
    },
  };

  return handleFetch<ContractInteractionsResponse>(url, offset, options);
};

export const useFetchContractTransactions = (limit: number, page: number) =>
  useInfiniteQuery({
    queryKey: ["contract_transactions", limit, page],
    queryFn: ({ pageParam = page }) =>
      fetchContractTransactions({
        limit,
        offset: pageParam,
      }),
    initialPageParam: page,
    getNextPageParam: lastPage => {
      const nextOffset = (lastPage.prevOffset as number) + limit;
      if (nextOffset >= lastPage.data.count) return undefined;
      return nextOffset;
    },
    refetchOnWindowFocus: false,
    refetchInterval: 15000,
  });
