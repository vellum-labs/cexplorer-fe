import { handleFetch } from "@/lib/handleFetch";
import type { TreasuryDonationStatsResponse } from "@/types/treasuryTypes";
import { useQuery } from "@tanstack/react-query";

export const fetchTreasuryDonationStats = async () => {
  const url = "/analytics/treasury";

  return handleFetch<TreasuryDonationStatsResponse>(url);
};

export const useFetchTreasuryDonationStats = () => {
  return useQuery({
    queryKey: ["treasury-donation-stats"],
    queryFn: async () => {
      const { data } = await fetchTreasuryDonationStats();

      return data;
    },
  });
};
