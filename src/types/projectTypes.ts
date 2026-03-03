import type { ResponseCore } from "./commonTypes";

export interface ProjectOfficialLinks {
  x: string;
  docs: string;
  github: string;
  discord: string;
  website: string;
  telegram: string;
}

export interface ProjectInsightStat {
  date: string;
  commits: number;
}

export interface ProjectInsight {
  repo_name: string;
  stats: ProjectInsightStat[];
}

export type RawInsights =
  | ProjectInsight[]
  | Record<string, { day: string; commits_count: number }[] | null>;

export const normalizeInsights = (insights: RawInsights | undefined): ProjectInsight[] => {
  if (!insights) return [];
  if (Array.isArray(insights)) return insights;

  return Object.entries(insights)
    .filter(([, stats]) => Array.isArray(stats))
    .map(([repoName, stats]) => ({
      repo_name: repoName,
      stats: (stats as { day: string; commits_count: number }[]).map(s => ({
        date: s.day.split("T")[0],
        commits: s.commits_count,
      })),
    }));
};

export interface ProjectListItem {
  project_id: string;
  name: string;
  verified: boolean;
  category: string[];
  description_short: string;
  icon: string;
  official_links: ProjectOfficialLinks;
  insights: RawInsights;
}

export interface ProjectProduct {
  name: string;
  links: {
    app: string;
    docs: string;
    github: string;
    website: string;
  };
  description: string;
}

export interface ProjectTrackedRepository {
  url: string;
  name: string;
}

export interface ProjectAsset {
  asset_id: string;
  asset_name: string;
  description: string;
}

export interface ProjectPolicy {
  policy_id: string;
  description: string;
  policy_name: string;
}

export interface ProjectScript {
  script_id: string;
  description: string;
  script_name: string;
}

export interface ProjectDrep {
  name: string;
  drep_id: string;
}

export interface ProjectDetail {
  project_id: string;
  name: string;
  organization: string;
  verified: boolean;
  category: string[];
  description_short: string;
  description_long: string;
  icon: string;
  official_links: ProjectOfficialLinks;
  products: ProjectProduct[];
  tracked_repositories: ProjectTrackedRepository[];
  assets: ProjectAsset[];
  policy: ProjectPolicy[];
  scripts: ProjectScript[];
  drep: ProjectDrep;
  pools: string[];
  tags: string[];
  status: string;
  launch_year: number;
  insights: RawInsights;
  updated_at: string;
  lastfetch: string;
}

export type ProjectListResponse = ResponseCore<{
  data: ProjectListItem[];
  count: number;
}>;

export type ProjectDetailResponse = ResponseCore<ProjectDetail>;
