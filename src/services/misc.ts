import { useAuthToken } from "@/hooks/useAuthToken";
import { handleFetch } from "@/lib/handleFetch";
import { useConstStore } from "@/stores/constStore";

import { useRateStore } from "@/stores/rateStore";
import { useVersionStore } from "@/stores/versionsStore";
import type {
  MiscApiResponse,
  MiscBasicResponse,
  MiscConstResponse,
  MiscHealthResponse,
  MiscNewResponse,
  MiscRateResponse,
  MiscSearchResponse,
} from "@/types/miscTypes";
import type { Locales } from "@/types/storeTypes";
import type {
  GroupType,
  MiscValidateResponse,
  PollListResponse,
} from "@/types/userTypes";
import { useQuery } from "@tanstack/react-query";

export const fetchMiscApi = async () => {
  const url = "/misc/api";

  return handleFetch<MiscApiResponse>(url, undefined, {});
};

export const useFetchMiscApi = () =>
  useQuery({
    queryKey: ["misc-api"],
    queryFn: () => fetchMiscApi(),
  });

export const fetchMiscBasic = async () => {
  const url = "/misc/basic";

  return handleFetch<MiscBasicResponse>(url, undefined, {});
};

const fetchMiscRate = async () => {
  const url = "/misc/rate";
  return handleFetch<MiscRateResponse>(url, undefined, {});
};

export const useFetchMiscBasic = (disableRefetch: boolean = false) => {
  const query = useQuery({
    queryKey: ["misc-basic"],
    queryFn: () => fetchMiscBasic(),
    refetchInterval: disableRefetch ? false : 60000,
  });

  return query;
};

export const fetchMiscHealth = async () => {
  const url = "/misc/health";

  return handleFetch<MiscHealthResponse>(url, undefined, {});
};

export const useFetchMiscHealth = (disableRefetch: boolean = false) => {
  const query = useQuery({
    queryKey: ["misc-health"],
    queryFn: () => fetchMiscHealth(),
    refetchInterval: disableRefetch ? false : 60000,
  });

  return query;
};

export const useFetchMiscRate = (basicVersion: number | undefined) => {
  const { setRate } = useRateStore();
  const { setRateVersion, rateVersion } = useVersionStore();

  const query = useQuery({
    queryKey: ["misc-rate", basicVersion, rateVersion],
    queryFn: () => fetchMiscRate(),
    enabled:
      rateVersion !== undefined &&
      basicVersion !== undefined &&
      rateVersion !== basicVersion,
  });

  if (basicVersion && query.isSuccess) {
    setRateVersion(basicVersion);
  }

  if (query.data) {
    setRate(query.data.data.rates);
  }

  return query;
};

const fetchMiscConst = async () => {
  const url = "/misc/const";
  return handleFetch<MiscConstResponse>(url, undefined, {});
};

export const useFetchMiscConst = (basicVersion: number | undefined) => {
  const { setConst } = useConstStore();
  const { setConstVersion, constVersion } = useVersionStore();

  const query = useQuery({
    queryKey: ["misc-const", basicVersion, constVersion],
    queryFn: () => fetchMiscConst(),
    enabled:
      constVersion !== undefined &&
      basicVersion !== undefined &&
      constVersion !== basicVersion,
  });

  if (basicVersion && query.isSuccess && query.data) {
    setConstVersion(basicVersion);
    setConst(query.data.data);
  }

  return query;
};

export const fetchMiscNew = async () => {
  const url = "/misc/new";

  return handleFetch<MiscNewResponse>(url, undefined, {});
};

export const useFetchMiscNew = () =>
  useQuery({
    queryKey: ["misc-new"],
    queryFn: () => fetchMiscNew(),
  });

export const fetchMiscSW = async (state: "done" | "install") => {
  const url = `/misc/sw?state=${state}`;

  return handleFetch(url, undefined, {});
};

export const useFetchMiscSW = (state: "done" | "install") =>
  useQuery({
    queryKey: ["misc-sw", state],
    queryFn: () => fetchMiscSW(state),
  });

const fetchMiscSearch = (
  query: string | undefined,
  category?: string,
  locale?: Locales,
) => {
  const url = "/misc/search";
  const localeCategories = ["user", "article", "page"];

  const options = {
    params: {
      query,
      category,
      ...(category &&
        localeCategories.includes(category) && {
          lng: locale,
        }),
    },
  };

  return handleFetch<MiscSearchResponse>(url, undefined, options);
};

export const useFetchMiscSearch = (
  query: string | undefined,
  category?: string,
  locale?: Locales,
) =>
  useQuery({
    queryKey: ["misc-search", query, category],
    queryFn: () => fetchMiscSearch(query, category, locale),
    enabled: !!query,
  });

export const fetchPollList = async ({ token }: { token?: string }) => {
  const apiUrl = token ? "/user/gov" : "/misc/gw/gov";

  const options = {
    headers: {
      usertoken: token || "",
    },
  };

  return handleFetch<PollListResponse>(apiUrl, undefined, options);
};

export const useFetchPollList = () => {
  const token = useAuthToken();
  return useQuery({
    queryKey: ["vote-list"],
    queryFn: async () => await fetchPollList({ token }),
  });
};

export const miscValidate = async (
  type: GroupType | undefined,
  ident: string,
) => {
  const url = "/misc/validate";
  const options = {
    params: {
      type,
      ident,
    },
  };

  return handleFetch<MiscValidateResponse>(url, undefined, options);
};

export const useFetchMiscValidate = (
  type: GroupType | undefined,
  ident: string,
) =>
  useQuery({
    queryKey: ["misc-validate", type, ident],
    queryFn: async () => await miscValidate(type, ident),
    enabled: !!ident,
  });
