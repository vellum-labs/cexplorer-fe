import { handleFetch } from "@/lib/handleFetch";
import type { StakeDetailResponse } from "@/types/stakeTypes";
import { useQuery } from "@tanstack/react-query";

export interface AddressDetailParams {
  view?: string;
  limit?: number;
  offset?: number;
}

export const fetchStakeDetail = async ({ view }: AddressDetailParams) => {
  const url = `/account/detail?view=${view}`;

  return handleFetch<StakeDetailResponse>(url);
};

export const useFetchStakeDetail = (address: string) =>
  useQuery({
    queryKey: ["stake-detail", { address }],
    queryFn: async () => {
      const { data } = await fetchStakeDetail({ view: address });

      return data;
    },
  });
