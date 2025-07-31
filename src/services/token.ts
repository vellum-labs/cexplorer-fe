import type {
  DeFiOrderListResponse,
  DeFiTokenListResponse,
  DeFiTokenStatResponse,
} from "@/types/tokenTypes";

import { handleFetch } from "@/lib/handleFetch";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export type DeFiTokenOrder = "price" | "volume" | "liquidity" | undefined;

interface DeFiTokenListParams {
  limit?: number;
  offset?: number;
  order?: DeFiTokenOrder;
  assetname?: string;
  sort?: "asc" | "desc";
}

interface DeFiOrderListParams {
  limit?: number;
  offset?: number;
  address?: string;
  stake?: string;
  status?: string;
  dex?: string;
  tx?: string;
  fingerprint?: string;
  token_in?: string;
  token_out?: string;
}

export const fetchDefiTokenList = async ({
  limit = 10,
  offset = 0,
  sort = "asc",
  order = "volume",
  assetname,
}: DeFiTokenListParams) => {
  const url = `/defi/token`;
  const options = {
    params: {
      limit,
      offset,
      order,
      sort,
      assetname,
    },
  };

  return handleFetch<DeFiTokenListResponse>(url, offset, options);
};

export const useFetchDeFiTokenList = (
  limit: number,
  page: number,
  sort: "asc" | "desc",
  order: DeFiTokenOrder,
  assetname?: string,
) => {
  return useInfiniteQuery({
    queryKey: ["dashboard-token-list", limit, page, order, sort, assetname],
    queryFn: ({ pageParam = page }) =>
      fetchDefiTokenList({
        limit,
        offset: pageParam,
        order,
        sort,
        assetname,
      }),
    initialPageParam: page,
    getNextPageParam: lastPage => {
      const nextOffset = (lastPage.prevOffset as number) + limit;
      if (nextOffset >= lastPage?.data?.count) return undefined;
      return nextOffset;
    },
    refetchOnWindowFocus: false,
    refetchInterval: 60000,
  });
};

export const fetchDefiTokenStat = async () => {
  const url = `/defi/stat`;

  return handleFetch<DeFiTokenStatResponse>(url);
};

export const useFetchDeFiTokenStat = () =>
  useQuery({
    queryKey: ["exchanges"],
    queryFn: fetchDefiTokenStat,
    select: res => res.data,
  });

export const fetchDeFiOrder = async ({
  limit,
  offset,
  address,
  stake,
  status,
  dex,
  tx,
  fingerprint,
  token_in,
  token_out,
}: DeFiOrderListParams) => {
  const url = `/defi/order`;
  const options = {
    params: {
      limit,
      offset,
      address,
      stake,
      status,
      dex,
      tx,
      token: fingerprint,
      token_in,
      token_out,
    },
  };

  return handleFetch<DeFiOrderListResponse>(url, offset, options);
};

export const useFetchDeFiOrderList = (
  limit?: number,
  page?: number,
  address?: string,
  stake?: string,
  status?: string,
  dex?: string,
  tx?: string,
  fingerprint?: string,
  token_in?: string,
  token_out?: string,
) => {
  return useInfiniteQuery({
    queryKey: [
      "defi-order-list",
      limit,
      page,
      address,
      stake,
      status,
      dex,
      tx,
      fingerprint,
      token_in,
      token_out,
    ],
    queryFn: ({ pageParam = page }) =>
      fetchDeFiOrder({
        limit,
        offset: pageParam,
        address,
        stake,
        status,
        dex,
        tx,
        fingerprint,
        token_in,
        token_out,
      }),
    initialPageParam: page,
    getNextPageParam: lastPage => {
      const nextOffset = (lastPage.prevOffset as number) + (limit ?? 0);
      if (nextOffset >= lastPage?.data?.count) return undefined;
      return nextOffset;
    },
    refetchOnWindowFocus: false,
    refetchInterval: 60000,
  });
};
