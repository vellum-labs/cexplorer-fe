import type { articleCategories } from "@/constants/article";
import type { ResponseCore } from "./commonTypes";
import type { User } from "./userTypes";

export type ArticleUrl =
  | "faq"
  | "wallets"
  | "about-us"
  | "brand-assets"
  | "contact-us"
  | "terms"
  | "ads"
  | "bots"
  | "contributors"
  | "developers"
  | "education"
  | "newsletter";

export interface ArticleDetailData {
  name: string;
  url: string;
  type: string;
  category: string | null;
  data: string[];
  pub_date: string;
  mod_date: string | null;
  keywords: string | null;
  description: string;
  image: string | null;
  license: string | null;
  state: string | null;
  render: string;
  mirroring_article: string | null;
  user_owner: User;
}

export type ArticleDetailResponse = ResponseCore<ArticleDetailData>;

export interface ArticleListData {
  name: string;
  url: string;
  type: string;
  category: string[];
  pub_date: string;
  mod_date: string;
  keywords: string;
  description: string;
  image: string;
  license: string | null;
  state: string | null;
  user_owner: User;
}

export type ArticleListResponse = ResponseCore<{
  count: number;
  data: ArticleListData[];
}>;

export type ArticleCategories = (typeof articleCategories)[number];
