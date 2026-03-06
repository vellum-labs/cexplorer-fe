import type { StablecoinResponse } from "@/types/stablecoinTypes";

import { handleFetch } from "@/lib/handleFetch";
import { useQuery } from "@tanstack/react-query";

export const fetchStablecoins = async () => {
  const url = "/analytics/stablecoins";

  return handleFetch<StablecoinResponse>(url);
};

export const useFetchStablecoins = () =>
  useQuery({
    queryKey: ["stablecoins"],
    queryFn: async () => {
      const res = await fetchStablecoins();

      return res;
    },
  });
