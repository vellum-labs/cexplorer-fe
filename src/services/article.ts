import { handleFetch } from "@/lib/handleFetch";
import type {
  ArticleDetailResponse,
  ArticleListResponse,
} from "@/types/articleTypes";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

interface ArticleDetailProps {
  lng: "en";
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
      lng,
      type,
      url,
    },
  };

  return handleFetch<ArticleDetailResponse>(apiUrl, undefined, options);
};

export const useFetchArticleDetail = (
  lng: "en",
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
  lng: "en";
  offset: number;
  limit: number;
  category?: string;
}) => {
  const apiUrl = "/article/list";

  const options = {
    params: {
      lng,
      type: "article",
      limit,
      offset,
      category,
    },
  };

  return handleFetch<ArticleListResponse>(apiUrl, offset, options);
};

export const useFetchArticleList = (
  lng: "en",
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
