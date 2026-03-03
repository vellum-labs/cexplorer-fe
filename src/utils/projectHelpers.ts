import type { RawInsights } from "@/types/projectTypes";
import { normalizeInsights } from "@/types/projectTypes";

export const isValidLink = (url: string | undefined): url is string =>
  !!url && url !== "..." && !url.includes("...");

export const capitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const createMockQuery = <T>(data: T) => ({
  data,
  isLoading: false as const,
  isError: false as const,
  error: null,
  refetch: () => Promise.resolve({} as any),
});

export const computeInsightStats = (insights: RawInsights | undefined) => {
  const normalized = normalizeInsights(insights);
  let totalCommits = 0;
  let lastActivity = "";

  for (const insight of normalized) {
    for (const stat of insight.stats) {
      totalCommits += stat.commits;
      if (stat.commits > 0 && stat.date > lastActivity) {
        lastActivity = stat.date;
      }
    }
  }

  return {
    totalCommits,
    lastActivity: lastActivity || null,
    repoCount: normalized.length,
  };
};
