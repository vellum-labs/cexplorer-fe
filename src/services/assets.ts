import type {
  AdaHandleResponse,
  AdaHandleListResponse,
  AssetDetailResponse,
  AssetListResponse,
  AssetMetadataResponse,
  AssetMintResponse,
  AssetOwnersNftResponse,
  AssetStatsResponse,
} from "@/types/assetsTypes";

import { handleFetch } from "@/lib/handleFetch";
import { useWatchlistStore } from "@/stores/watchlistStore";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

interface AssetListProps {
  limit?: number;
  offset?: number;
  sort?: "asc" | "desc";
  order?: "collection_quantity" | "native" | "mint";
  policy?: string;
  name?: string;
  filter?: "nft" | "token" | "assets";
  watchlist?: "1" | undefined;
  token?: string;
}

export const fetchAssetList = async ({
  limit = 20,
  offset = 0,
  filter,
  name,
  order,
  policy,
  sort,
  watchlist,
  token,
}: AssetListProps) => {
  const url = "/asset/list";
  const options = {
    params: {
      limit,
      offset,
      filter,
      name,
      order,
      policy,
      sort,
      watchlist_only: watchlist,
    },
    headers: {
      usertoken: token || "",
    },
  };

  return handleFetch<AssetListResponse>(url, offset, options);
};

export const useFetchAssetList = (
  limit: number,
  page: number,
  filter,
  name,
  order,
  policy,
  sort,
  watchlist: "1" | undefined,
  token?: string,
) => {
  const { watchlist: wl } = useWatchlistStore();
  return useInfiniteQuery({
    queryKey: [
      "asset-list",
      limit,
      page,
      filter,
      name,
      order,
      policy,
      sort,
      watchlist,
      token,
      wl,
    ],
    queryFn: ({ pageParam = page }) =>
      fetchAssetList({
        limit,
        offset: pageParam,
        filter,
        name,
        order,
        policy,
        sort,
        watchlist,
        token,
      }),
    initialPageParam: page,
    getNextPageParam: lastPage => {
      const nextOffset = (lastPage.prevOffset as number) + limit;
      if (nextOffset >= lastPage.data.count) return undefined;
      return nextOffset;
    },
    refetchOnWindowFocus: false,
    refetchInterval: 20000,
  });
};

export const fetchAssetDetail = async (fingerprint: string) => {
  const url = `/asset/detail`;
  const options = {
    params: {
      fingerprint,
    },
  };

  return handleFetch<AssetDetailResponse>(url, undefined, options);
};

export const useFetchAssetDetail = (
  fingerprint: string,
  options?: { enabled?: boolean },
) =>
  useQuery({
    queryKey: ["asset-detail", fingerprint],
    queryFn: () => fetchAssetDetail(fingerprint),
    enabled: options?.enabled ?? true,
  });

export const fetchAssetOwners = async (
  assetname: string,
  offset: number,
  limit: number,
) => {
  const url = `/asset/owner`;
  const options = {
    params: {
      assetname,
      offset,
      limit,
    },
  };

  return handleFetch<AssetOwnersNftResponse>(url, undefined, options);
};

export const useFetchAssetOwners = (
  assetname: string,
  page: number,
  limit: number,
) =>
  useInfiniteQuery({
    queryKey: ["asset-owners", assetname, page, limit],
    queryFn: async ({ pageParam = page }) =>
      await fetchAssetOwners(assetname, pageParam, limit),
    initialPageParam: page,
    getNextPageParam: lastPage => {
      const nextOffset = (lastPage.prevOffset as number) + limit;
      if (nextOffset >= lastPage.data.count) return undefined;
      return nextOffset;
    },
  });

export const fetchNftAssetOwners = async (
  assetname: string,
  offset: number,
  limit: number,
) => {
  const url = `/asset/owner_history`;
  const options = {
    params: {
      assetname,
      offset,
      limit,
    },
  };

  return handleFetch<AssetOwnersNftResponse>(url, undefined, options);
};

export const useFetchNftAssetOwners = (
  assetname: string,
  page: number,
  limit: number,
) =>
  useInfiniteQuery({
    queryKey: ["asset-owners-history", assetname, page, limit],
    queryFn: async ({ pageParam = page }) =>
      await fetchNftAssetOwners(assetname, pageParam, limit),
    initialPageParam: page,
    getNextPageParam: lastPage => {
      const nextOffset = (lastPage.prevOffset as number) + limit;
      if (nextOffset >= lastPage.data.count) return undefined;
      return nextOffset;
    },
  });

export const fetchAssetMetaData = async (assetname: string | undefined) => {
  const url = `/asset/metadata`;
  const options = {
    params: {
      assetname,
    },
  };

  return handleFetch<AssetMetadataResponse>(url, undefined, options);
};

export const useFetchAssetMetadata = (assetname: string | undefined) =>
  useQuery({
    queryKey: ["asset-metadata", assetname],
    queryFn: () => fetchAssetMetaData(assetname),
    enabled: !!assetname,
  });

export const fetchAssetMint = async (
  assetname: string | undefined,
  id?: string,
  limit?: number,
  offset?: number,
) => {
  const url = `/policy/mint`;
  const options = {
    params: {
      assetname,
      id,
      limit,
      offset,
    },
  };

  return handleFetch<AssetMintResponse>(url, undefined, options);
};

export const useFetchAssetMint = (
  limit: number,
  offset: number,
  assetname: string | undefined,
  policyId?: string,
) =>
  useInfiniteQuery({
    queryKey: ["asset-mint", limit, offset, assetname, policyId],
    queryFn: ({ pageParam = 0 }) =>
      fetchAssetMint(assetname, policyId, limit, pageParam),
    initialPageParam: offset,
    getNextPageParam: (lastPage, allPages) => {
      const totalItems = lastPage?.data?.count ?? 0;
      const loadedItems = allPages.flatMap(page => page?.data?.data ?? []).length;
      return loadedItems < totalItems ? loadedItems : undefined;
    },
    enabled: !!assetname || !!policyId,
  });

export const fetchAssetStats = async (
  assetname?: string,
  fingerprint?: string,
) => {
  const url = `/asset/stat`;
  const options = {
    params: {
      assetname,
      fingerprint,
    },
  };

  return handleFetch<AssetStatsResponse>(url, undefined, options);
};

export const useFetchAssetStats = (assetname?: string, fingerprint?: string) =>
  useQuery({
    queryKey: ["asset-stats", assetname, fingerprint],
    queryFn: () => fetchAssetStats(assetname, fingerprint),
    enabled: !!assetname || !!fingerprint,
  });

export const fetchAssetExchangesGraph = (assetname: string, period: string) => {
  const url = "https://charts.dhapi.io/charts";

  const now = Math.floor(Date.now() / 1000);

  let from: number;

  switch (period) {
    case "1day":
      from = now - 360 * 86400;
      break;
    case "4hour":
      from = now - 120 * 4 * 3600;
      break;
    case "1hour":
      from = now - 60 * 3600;
      break;
    case "30min":
      from = now - 5 * 86400;
      break;
    case "15min":
      from = now - 3 * 86400;
      break;
    case "5min":
      from = now - 0.5 * 86400;
      break;
    default:
      from = now - (1 / 12) * 86400;
  }

  const to = now;

  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      tokenIn: "",
      tokenOut: assetname,
      period,
      from,
      to,
    }),
  });
};

export const useFetchAssetExchangesGraph = (
  assetname: string,
  period: string,
) =>
  useQuery({
    queryKey: ["asset-graph", assetname, period],
    queryFn: async () => {
      const response = await fetchAssetExchangesGraph(assetname, period);

      return response.json();
    },
  });

export const fetchAdaHandle = async (hex: string) => {
  const url = `/asset/adahandle`;
  const options = {
    params: {
      hex,
    },
  };

  return handleFetch<AdaHandleResponse>(url, undefined, options);
};

export const useFetchAdaHandle = (hex: string | undefined) =>
  useQuery({
    queryKey: ["ada-handle", hex],
    queryFn: async () => {
      try {
        return await fetchAdaHandle(hex!);
      } catch {
        return { code: 404, data: null } as AdaHandleResponse;
      }
    },
    enabled: !!hex,
    retry: false,
  });

export const fetchAdaHandleList = async (
  limit: number,
  offset: number,
  name?: string,
) => {
  const url = `/asset/adahandle`;
  const options = {
    params: {
      limit,
      offset,
      name,
    },
  };

  return handleFetch<AdaHandleListResponse>(url, offset, options);
};

export const useFetchAdaHandleList = (
  limit: number,
  offset: number,
  name?: string,
) =>
  useInfiniteQuery({
    queryKey: ["ada-handle-list", limit, offset, name],
    queryFn: ({ pageParam = offset }) =>
      fetchAdaHandleList(limit, pageParam, name),
    initialPageParam: offset,
    getNextPageParam: lastPage => {
      const nextOffset = (lastPage.prevOffset as number) + limit;
      if (nextOffset >= lastPage.data.count) return undefined;
      return nextOffset;
    },
    refetchOnWindowFocus: false,
    refetchInterval: 20000,
  });
