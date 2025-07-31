import { handleFetch } from "@/lib/handleFetch";
import type {
  ScriptDetailRedeemerResponse,
  ScriptDetailResponse,
  ScriptListResponse,
} from "@/types/scriptTypes";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export const fetchScriptDetail = async ({ hash }: { hash: string }) => {
  const url = `/script/detail`;
  const options = {
    params: { hash },
  };

  return handleFetch<ScriptDetailResponse>(url, undefined, options);
};

export const useFetchScriptDetail = (hash: string) =>
  useQuery({
    queryKey: ["script-detail", hash],
    queryFn: () => fetchScriptDetail({ hash }),
    refetchInterval: 300000,
    enabled: !!hash,
  });

export const fetchScriptDetailRedeemer = async ({
  limit = 20,
  offset = 0,
  hash,
}: {
  limit?: number;
  offset?: number;
  hash: string | undefined;
}) => {
  const url = `/script/detail_redeemer`;
  const options = {
    params: { hash, limit, offset },
  };

  return handleFetch<ScriptDetailRedeemerResponse>(url, offset, options);
};

export const useFetchScriptDetailRedeemer = (
  hash: string | undefined,
  page: number,
  limit: number,
  scriptList = false,
) =>
  useInfiniteQuery({
    queryKey: ["script-detail-redeemer", hash, limit, page],
    queryFn: ({ pageParam = page }) =>
      fetchScriptDetailRedeemer({
        limit,
        offset: pageParam,
        hash,
      }),
    enabled: !!hash || scriptList,
    initialPageParam: page,
    getNextPageParam: lastPage => {
      const nextOffset = (lastPage.prevOffset as number) + limit;
      if (nextOffset >= lastPage.data[0]?.count) return undefined;
      return nextOffset;
    },
    staleTime: 300000,
  });

export const fetchScriptList = async ({
  limit = 20,
  offset = 0,
  hash,
  order,
}: {
  limit?: number;
  offset?: number;
  hash?: string;
  order?: "tx" | "redeemer.count" | "tx_payment_cred.out.sum";
}) => {
  const url = `/script/list`;
  const options = {
    params: { limit, offset, hash, order },
  };

  return handleFetch<ScriptListResponse>(url, offset, options);
};

export const useFetchScriptList = (
  page: number,
  limit: number,
  hash?: string,
  order?: "tx" | "redeemer.count" | "tx_payment_cred.out.sum",
) =>
  useInfiniteQuery({
    queryKey: ["script-list", hash, limit, page, order],
    queryFn: ({ pageParam = page }) =>
      fetchScriptList({
        limit,
        offset: pageParam,
        hash,
        order,
      }),
    initialPageParam: page,
    getNextPageParam: lastPage => {
      const nextOffset = (lastPage.prevOffset as number) + limit;
      if (nextOffset >= lastPage.data[0]?.count) return undefined;
      return nextOffset;
    },
    staleTime: 300000,
  });
