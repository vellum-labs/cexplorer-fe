import type { CompareWalletsResponse } from "@/types/walletTypes";

import { handleFetch } from "@/lib/handleFetch";
import { useQuery } from "@tanstack/react-query";

export const fetchCompareWallets = async () => {
  const url = `/article/detail`;
  const options = {
    params: {
      lng: "en",
      type: "page",
      url: "wallets",
    },
  };

  return handleFetch<CompareWalletsResponse>(url, undefined, options);
};

export const useFetchCompareWallets = () =>
  useQuery({
    queryKey: ["wallets"],
    queryFn: () => fetchCompareWallets(),
  });
