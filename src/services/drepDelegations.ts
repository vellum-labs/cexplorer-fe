import { handleFetch } from "@/lib/handleFetch";
import type { DrepDelegationResponse } from "@/types/delegationTypes";
import { useInfiniteQuery } from "@tanstack/react-query";

export const fetchDrepDelegations = async ({
  limit = 20,
  offset = 0,
}: {
  limit?: number;
  offset?: number;
}) => {
  const url = "/account/delegation_vote";

  const options = {
    params: {
      limit,
      offset,
    },
  };

  return handleFetch<DrepDelegationResponse>(url, offset, options);
};

export const useFetchDrepDelegations = (limit: number, page: number) =>
  useInfiniteQuery({
    queryKey: ["drep-delegations", limit, page],
    queryFn: async ({ pageParam = page }) =>
      fetchDrepDelegations({
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
