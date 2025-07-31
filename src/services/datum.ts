import type { DatumDetailResponse } from "@/types/datumTypes";

import { handleFetch } from "@/lib/handleFetch";
import { useQuery } from "@tanstack/react-query";

interface DatumDetailParams {
  hash?: string;
}

export const fetchDatumDetail = async ({ hash }: DatumDetailParams) => {
  const url = `/datum/detail`;
  const options = {
    params: { hash },
  };

  return handleFetch<DatumDetailResponse>(url, undefined, options);
};

export const useFetchDatumDetail = (hash?: string) =>
  useQuery({
    queryKey: ["datum-detail", hash],
    queryFn: () => fetchDatumDetail({ hash }),
    staleTime: Infinity,
    enabled: !!hash,
  });
