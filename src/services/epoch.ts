import type {
  EpochDetailParamResponse,
  EpochDetailStatsResponse,
  EpochListResponse,
} from "@/types/epochTypes";

import { handleFetch } from "@/lib/handleFetch";

import { useQuery } from "@tanstack/react-query";

export const fetchEpochList = async () => {
  const url = "/epoch/list";

  const options = {
    timeout: 60000,
  };

  return handleFetch<EpochListResponse>(url, undefined, options);
};

export const useFetchEpochList = () =>
  useQuery({
    queryKey: ["epoch-list"],
    queryFn: async () => {
      const { data } = await fetchEpochList();

      return data;
    },
  });

export const fetchEpochDetailParam = async (no: number) => {
  const url = "/epoch/param";
  const options = {
    params: { no },
  };

  return handleFetch<EpochDetailParamResponse>(url, undefined, options);
};

export const useFetchEpochDetailParam = (no: number) =>
  useQuery({
    queryKey: ["epoch-detail-param", no],
    queryFn: async () => {
      const { data } = await fetchEpochDetailParam(no);

      return data;
    },
  });

export const fetchEpochDetailStats = async (no: number) => {
  const url = "/epoch/stats";
  const options = {
    params: { no },
  };

  return handleFetch<EpochDetailStatsResponse>(url, undefined, options);
};

export const useFetchEpochDetailStats = (no: number) =>
  useQuery({
    queryKey: ["epoch-detail-stats", no],
    queryFn: async () => {
      const { data } = await fetchEpochDetailStats(no);

      return data;
    },
  });
