import { handleFetch } from "@/lib/handleFetch";
import type {
  DelegationResponse,
  DelegationStateResponse,
} from "@/types/delegationTypes";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import type { AddressDetailParams } from "./stake";

export const fetchDelegationsState = async ({ view }: AddressDetailParams) => {
  const url = `/account/delegation_state?view=${view}`;

  return handleFetch<DelegationStateResponse>(url);
};

export const useFetchDelegationsState = (address: string) =>
  useQuery({
    queryKey: ["delegations-state", { address }],
    queryFn: async () => {
      const { data } = await fetchDelegationsState({ view: address });

      return data;
    },
  });

export const fetchStakeDelegations = async ({
  view,
  limit = 20,
  offset = 0,
}: AddressDetailParams) => {
  const url = `/account/delegation`;

  const options = {
    params: {
      view,
      limit,
      offset,
    },
  };

  return handleFetch<DelegationResponse>(url, offset, options);
};

export const useFetchDelegations = (
  limit: number,
  page: number,
  address?: string,
) =>
  useInfiniteQuery({
    queryKey: ["delegations", address, limit, page],
    queryFn: async ({ pageParam = page }) =>
      fetchStakeDelegations({
        view: address,
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
