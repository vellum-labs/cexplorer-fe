import type {
  PolicyDetailResponse,
  PolicyOwnerResponse,
  PolicyStatsResponse,
} from "@/types/policyTypes";

import { handleFetch } from "@/lib/handleFetch";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export const fetchPolicyDetail = async ({ id }: { id: string }) => {
  const url = `/policy/detail`;
  const options = {
    params: { id },
  };

  return handleFetch<PolicyDetailResponse>(url, undefined, options);
};

export const useFetchPolicyDetail = (policyId: string) =>
  useQuery({
    queryKey: ["policy-detail", policyId],
    queryFn: () => fetchPolicyDetail({ id: policyId }),
    refetchInterval: 300000,
    enabled: !!policyId,
  });

export const fetchPolicyStats = async ({ id }: { id: string }) => {
  const url = `/policy/stat`;
  const options = {
    params: { id },
  };

  return handleFetch<PolicyStatsResponse>(url, undefined, options);
};

export const useFetchPolicyStats = (policyId: string) =>
  useQuery({
    queryKey: ["policy-stat", policyId],
    queryFn: () => fetchPolicyStats({ id: policyId }),
    refetchInterval: 300000,
    enabled: !!policyId,
  });

export const fetchPolicyOwner = async ({
  limit = 20,
  offset = 0,
  id,
}: {
  limit?: number;
  offset?: number;
  id: string;
}) => {
  const url = `/policy/owner`;
  const options = {
    params: { limit, offset, id },
  };

  return handleFetch<PolicyOwnerResponse>(url, offset, options);
};

export const useFetchPolicyOwner = (page: number, limit: number, id: string) =>
  useInfiniteQuery({
    queryKey: ["policy-owner", id, limit, page],
    queryFn: ({ pageParam = page }) =>
      fetchPolicyOwner({
        id,
        limit,
        offset: pageParam,
      }),
    initialPageParam: page,
    getNextPageParam: lastPage => {
      const nextOffset = (lastPage.prevOffset as number) + limit;
      if (nextOffset >= lastPage.data[0]?.count) return undefined;
      return nextOffset;
    },
    staleTime: 300000,
  });
