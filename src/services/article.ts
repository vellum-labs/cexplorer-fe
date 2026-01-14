import { handleFetch } from "@/lib/handleFetch";
import type {
  ArticleDetailResponse,
  ArticleListResponse,
  WikiDetailResponse,
  WikiListResponse,
} from "@/types/articleTypes";
import type { Locales } from "@/types/storeTypes";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

// Map app locale to API language code
const toApiLang = (locale: Locales): string => {
  if (locale === "cz") return "cs";
  return locale;
};

interface ArticleDetailProps {
  lng: Locales;
  type: "page" | "article";
  url: string;
}

export const fetchArticleDetail = async ({
  lng,
  type,
  url,
}: ArticleDetailProps) => {
  const apiUrl = "/article/detail";

  const options = {
    params: {
      lng: toApiLang(lng),
      type,
      url,
    },
  };

  return handleFetch<ArticleDetailResponse>(apiUrl, undefined, options);
};

export const useFetchArticleDetail = (
  lng: Locales,
  type: "page" | "article",
  url: string,
) =>
  useQuery({
    queryKey: ["articleDetail", lng, type, url],
    queryFn: async () => {
      const { data } = await fetchArticleDetail({
        lng,
        type,
        url,
      });

      return data;
    },
    staleTime: 1000 * 60 * 5,
  });

export const fetchArticleList = async ({
  lng,
  offset,
  limit,
  category,
}: {
  lng: Locales;
  offset: number;
  limit: number;
  category?: string;
}) => {
  const apiUrl = "/article/list";

  const options = {
    params: {
      lng: toApiLang(lng),
      type: "article",
      limit,
      offset,
      category,
    },
  };

  return handleFetch<ArticleListResponse>(apiUrl, offset, options);
};

export const useFetchArticleList = (
  lng: Locales,
  page: number,
  limit: number,
  category?: string,
) =>
  useInfiniteQuery({
    queryKey: ["article-list", lng, page, limit, category],
    queryFn: async ({ pageParam = page }) =>
      await fetchArticleList({
        lng,
        offset: pageParam,
        limit,
        category,
      }),
    initialPageParam: page,
    getNextPageParam: lastPage => {
      const nextOffset = (lastPage.prevOffset as number) + limit;
      if (nextOffset >= lastPage.data.count) return undefined;
      return nextOffset;
    },
    staleTime: 1000 * 60 * 5,
  });

export const fetchWikiDetail = async ({
  lng,
  url,
}: {
  lng: Locales;
  url: string;
}) => {
  const apiUrl = "/article/detail";

  const options = {
    params: {
      lng: toApiLang(lng),
      type: "wiki",
      url,
    },
  };

  return handleFetch<WikiDetailResponse>(apiUrl, undefined, options);
};

export const useFetchWikiDetail = (
  lng: Locales,
  url: string,
  enabled: boolean = true,
) =>
  useQuery({
    queryKey: ["wikiDetail", lng, url],
    queryFn: async () => {
      const { data } = await fetchWikiDetail({ lng, url });
      return data;
    },
    staleTime: 1000 * 60 * 5,
    enabled,
  });

export const fetchWikiList = async ({
  lng,
  offset,
  limit,
}: {
  lng: Locales;
  offset: number;
  limit: number;
}) => {
  const apiUrl = "/article/list";

  const options = {
    params: {
      lng: toApiLang(lng),
      type: "wiki",
      limit,
      offset,
    },
  };

  return handleFetch<WikiListResponse>(apiUrl, offset, options);
};

export const useFetchWikiList = (lng: Locales, page: number, limit: number) =>
  useInfiniteQuery({
    queryKey: ["wiki-list", lng, page, limit],
    queryFn: async ({ pageParam = page }) =>
      await fetchWikiList({
        lng,
        offset: pageParam,
        limit,
      }),
    initialPageParam: page,
    getNextPageParam: lastPage => {
      const nextOffset = (lastPage.prevOffset as number) + limit;
      if (nextOffset >= lastPage.data.count) return undefined;
      return nextOffset;
    },
    staleTime: 1000 * 60 * 5,
  });
