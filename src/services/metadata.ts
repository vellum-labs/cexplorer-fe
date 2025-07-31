import type { MetadataTxListResponse } from "@/types/metadataTypes";

import { handleFetch } from "@/lib/handleFetch";
import { useInfiniteQuery } from "@tanstack/react-query";

interface MetadataTxListParams {
  limit?: number;
  offset?: number;
  tx?: string;
  key?: number;
}

export const fetchMetadataTxList = async ({
  limit = 10,
  offset = 0,
  tx,
  key,
}: MetadataTxListParams) => {
  const url = `/metadata/list`;
  const options = {
    params: { limit, offset, tx, key },
  };

  return handleFetch<MetadataTxListResponse>(url, offset, options);
};

export const useFetchMetadataTxList = (
  limit: number,
  page: number,
  tx?: string,
  key?: number,
) =>
  useInfiniteQuery({
    queryKey: ["metadata-tx-list", limit, page, tx, key],
    queryFn: ({ pageParam = page }) =>
      fetchMetadataTxList({
        limit,
        offset: pageParam,
        tx,
        key,
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
