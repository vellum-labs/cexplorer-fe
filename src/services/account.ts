import type {
  AccountRewardResponse,
  CheckDelegationResponse,
  WithdrawalsResponse,
} from "@/types/accountTypes";

import { handleFetch } from "@/lib/handleFetch";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import type { AddressDetailParams } from "./stake";

interface AccountRewardsArgs {
  view: string;
  limit?: number;
  offset?: number;
}

export const fetchAccountRewards = async ({
  limit = 20,
  offset = 0,
  view,
}: AccountRewardsArgs) => {
  const url = `/account/reward`;

  const options = {
    params: { limit, offset, view },
  };

  return handleFetch<AccountRewardResponse>(url, offset, options);
};

export const useFetchAccountRewards = (
  limit: number,
  page: number,
  view: string,
) =>
  useInfiniteQuery({
    queryKey: ["account-rewards", limit, page, view],
    queryFn: async () => {
      const { data } = await fetchAccountRewards({
        view,
        limit,
        offset: page,
      });

      return data;
    },
    initialPageParam: page,
    getNextPageParam: lastPage => {
      const nextOffset = (lastPage.prevOffset as number) + limit;
      if (nextOffset >= lastPage.count) return undefined;
      return nextOffset;
    },
    enabled: !!view,
  });

export const useFetchAccountRewardsPaginated = (
  limit: number,
  offset: number,
  view: string,
) =>
  useQuery({
    queryKey: ["account-rewards-paginated", limit, offset, view],
    queryFn: async () => {
      const { data } = await fetchAccountRewards({
        view,
        limit,
        offset,
      });
      return data;
    },
    enabled: !!view,
  });

export const checkUserDelegation = async (view: string | undefined | null) => {
  const url = "/account/has_delegation";
  const options = {
    params: { view },
  };

  return handleFetch<CheckDelegationResponse>(url, undefined, options);
};

export const useCheckUserDelegation = (view: string | undefined | null) =>
  useQuery({
    queryKey: ["check-user-delegation", view],
    queryFn: () => checkUserDelegation(view),
    enabled: !!view,
    staleTime: 120000,
  });

export const fetchWithrawals = async ({
  view,
  limit = 20,
  offset = 0,
}: AddressDetailParams) => {
  const url = `/account/withdrawal`;

  const options = {
    params: {
      view,
      limit,
      offset,
    },
  };

  return handleFetch<WithdrawalsResponse>(url, offset, options);
};

export const useFetchWithdrawals = (
  limit: number,
  page: number,
  address?: string,
) =>
  useInfiniteQuery({
    queryKey: ["withdrawals", address, limit, page],
    queryFn: async ({ pageParam = page }) =>
      fetchWithrawals({ view: address, limit, offset: pageParam }),
    initialPageParam: page,
    getNextPageParam: lastPage => {
      const nextOffset = (lastPage.prevOffset as number) + limit;
      if (nextOffset >= lastPage.data.count) return undefined;
      return nextOffset;
    },
    refetchInterval: 30_000,
  });

export const useFetchWithdrawalsPaginated = (
  limit: number,
  offset: number,
  view: string,
) =>
  useQuery({
    queryKey: ["withdrawals-paginated", limit, offset, view],
    queryFn: async () => {
      const { data } = await fetchWithrawals({
        view,
        limit,
        offset,
      });
      return data;
    },
    enabled: !!view,
  });
