import type {
  BlockDetailParams,
  BlockDetailResponse,
  BlocksListResponse,
} from "@/types/blockTypes";

import { handleFetch } from "@/lib/handleFetch";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

type BlockListProps = {
  limit?: number;
  offset?: number;
  pool_id?: string;
  epoch_no?: number;
  hash?: string;
  slot_no?: number;
  block_no?: number;
  proto?: string;
};

export const fetchBlocksList = async ({
  limit = 20,
  offset = 0,
  pool_id,
  epoch_no,
  hash,
  slot_no,
  block_no,
  proto,
}: BlockListProps) => {
  const url = "/block/list";
  const options = {
    params: {
      limit,
      offset,
      pool_id,
      epoch_no,
      hash,
      slot_no,
      block_no,
      proto,
    },
  };

  return handleFetch<BlocksListResponse>(url, offset, options);
};

export const useFetchBlocksList = (
  limit: number,
  page: number,
  enabled?: boolean,
  pool_id?: string,
  epoch_no?: number,
  hash?: string,
  slot_no?: number,
  block_no?: number,
  proto?: string,
) =>
  useInfiniteQuery({
    queryKey: [
      "blocks-list",
      limit,
      page,
      pool_id,
      epoch_no,
      hash,
      slot_no,
      block_no,
      proto,
    ],
    queryFn: ({ pageParam = page }) =>
      fetchBlocksList({
        limit,
        offset: pageParam,
        epoch_no,
        pool_id,
        hash,
        slot_no,
        block_no,
        proto,
      }),
    initialPageParam: page,
    getNextPageParam: lastPage => {
      const nextOffset = (lastPage.prevOffset as number) + limit;
      if (nextOffset >= lastPage.data.count) return undefined;
      return nextOffset;
    },
    refetchOnWindowFocus: true,
    refetchInterval: 20000,
    enabled: enabled,
  });

export const fetchBlockDetail = async ({ hash }: BlockDetailParams) => {
  const url = `/block/detail?hash=${hash}`;

  return handleFetch<BlockDetailResponse>(url);
};

export const useFetchBlockDetail = (hash: string) =>
  useQuery({
    queryKey: ["block_detail", { hash }],
    queryFn: async () => {
      const { data } = await fetchBlockDetail({ hash });

      return data;
    },
  });
