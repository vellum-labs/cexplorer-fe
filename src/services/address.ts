import type {
  AddressDetailResponse,
  AddressDetailUTXOResponse,
  AddressInspectorResponse,
  AddressListResponse,
} from "@/types/addressTypes";

import { handleFetch } from "@/lib/handleFetch";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

interface AddressDetailParams {
  view?: string;
}

export const fetchAddressDetail = async ({ view }: AddressDetailParams) => {
  const url = `/address/detail?view=${view}`;

  return handleFetch<AddressDetailResponse>(url);
};

export const useFetchAddressDetail = (address: string) =>
  useQuery({
    queryKey: ["addres-detail", { address }],
    queryFn: async () => {
      const { data } = await fetchAddressDetail({ view: address });

      return data;
    },
  });

export const fetchAddressList = async ({
  payment,
  view,
  order,
  watchlist_only,
  token,
  limit,
  offset,
}: {
  limit?: number;
  offset?: number;
  payment?: string;
  view?: string;
  order?: "balance" | "last";
  watchlist_only?: "1" | undefined;
  token?: string;
}) => {
  const url = `/address/list`;
  const options = {
    params: {
      payment_cred: payment,
      view,
      order,
      watchlist_only,
      limit,
      offset,
    },
    headers: {
      usertoken: token ?? "",
    },
  };

  return handleFetch<AddressListResponse>(url, undefined, options);
};

export const useFetchAddressList = (
  limit: number,
  page: number,
  payment?: string,
  view?: string,
  order?: "balance" | "last",
  watchlist_only?: "1" | undefined,
  token?: string,
) =>
  useInfiniteQuery({
    queryKey: [
      "blocks-list",
      limit,
      page,
      payment,
      view,
      order,
      watchlist_only,
      token,
    ],
    queryFn: ({ pageParam = page }) =>
      fetchAddressList({
        offset: pageParam,
        limit,
        payment,
        view,
        order,
        watchlist_only,
        token,
      }),
    initialPageParam: page,
    getNextPageParam: lastPage => {
      const nextOffset = (lastPage.prevOffset as number) + limit;
      if (nextOffset >= lastPage.data.count) return undefined;
      return nextOffset;
    },
    refetchOnWindowFocus: false,
    refetchInterval: 20000,
  });

export const fetchAddressUTXO = async ({ view }: AddressDetailParams) => {
  const url = `/address/utxo?view=${view}`;

  return handleFetch<AddressDetailUTXOResponse>(url);
};

export const useFetchAddressUTXO = (address?: string) =>
  useQuery({
    queryKey: ["address-utxo", { address }],
    queryFn: async () => {
      const { data } = await fetchAddressUTXO({ view: address });

      return data;
    },
  });

export const fetchAddressInspector = async ({ view }: AddressDetailParams) => {
  const url = `/address/extract?view=${view}`;

  return handleFetch<AddressInspectorResponse>(url);
};

export const useFetchAddressInspector = (address?: string) =>
  useQuery({
    queryKey: ["address-inspector", { address }],
    queryFn: async () => {
      const { data } = await fetchAddressInspector({ view: address });

      return data;
    },
    enabled: !!address,
  });
