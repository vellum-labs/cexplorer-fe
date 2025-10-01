import type { ResponseCore } from "./commonTypes";
import type { MiscApiData } from "./miscTypes";
import type { PoolInfo } from "./poolTypes";

export interface UserLoginResponse {
  code: number;
  data: {
    approved: boolean;
    token: string;
  };
}

export type UserProfile = {
  name: string;
  picture: string;
  social: {
    web: string;
    xcom: string;
    telegram: string;
    discord: string;
    patreon: string;
    facebook: string;
    instagram: string;
    github: string;
    linkedin: string;
  };
};

export interface User {
  profile: UserProfile;
  address: string;
  membership: {
    og: number;
    nfts: number;
    extra: string[];
  };
}

export interface UserInfoResponse {
  code: string;
  msg: string | undefined;
  data: {
    account: {
      view: string | null;
      adahandle: string | null;
      live_stake: number;
      live_pool: PoolInfo;
      active_pool: PoolInfo;
    }[];
    power: string[] | null;
    membership: {
      nfts: number;
      power: number;
    };
    profile: {
      data: UserProfile & { public: boolean };
      is_public: number;
    };
    payment_cred: string;
    address: string;
  };
}

export interface CexplorerNftsData {
  name: string;
  mint_date: string;
  modified_power_date: string;
  type: string;
  ident: string;
}

export type CexplorerNftsResponse = ResponseCore<{
  data: CexplorerNftsData[];
  count: number;
}>;

export type SetCexplorerNftsResponse = ResponseCore<{
  data: number | true | "invalid_ident";
}>;

export type UserApiStat = {
  date: string;
  rqs: number;
  tok: number | null;
};

export type UserApiObject = {
  name: string;
  is_active: boolean;
  key: string;
  rqs_day: number;
  tok_day: number;
  type: string;
  numerator: number;
  created: string;
  changed: string;
  native: boolean;
  activity: string | null;
  stat: UserApiStat[] | null;
};

export type UserApiData = {
  data: UserApiObject[] | null;
  plans: MiscApiData;
};

export type UserApiResponse = ResponseCore<UserApiData>;

export type AdminPageListResponse = ResponseCore<{
  data: {
    lang: "en";
    mod_date: string | null;
    name: string;
    render: "html";
    type: "page";
    url: string;
  }[];
  count: number;
}>;

type AdminPageDetailData = {
  name: string;
  url: string;
  data: string[];
  keywords: string | null;
  description: string | null;
  lang: "en";
  type: "page";
  render: "html";
};

export type AdminPageDetailResponse = ResponseCore<AdminPageDetailData>;

export type AdminArticleDetailResponse = ResponseCore<
  AdminPageDetailData & {
    state: string | null;
    pub_date: string;
    mod_date: string | null;
    category: string[];
    image: string | null;
    need_check: 0 | 1;
  }
>;

export type AdminArticleCreationResponse = ResponseCore<{
  url: string;
  lang: string;
}>;

export type AdminArticleListResponse = ResponseCore<{
  data: {
    name: string;
    url: string;
    mod_date: string | null;
    lang: string;
    type: "article";
    render: string;
    state: string | null;
    pub_date: string;
    category: string[];
    user_owner: User;
    user_approved: {
      profile: string | null;
      address: string | null;
      membership: string | null;
    };
  }[];
  count: number;
}>;

export type AdminConfigListResponse = ResponseCore<{
  data: {
    name: string;
    url: string;
    mod_date: string | null;
    lang: string;
    type: "article";
    render: string;
    state: string | null;
    pub_date: string;
    category: string[];
    user_owner: {
      profile: string | null;
      address: string;
      membership: {
        og: number;
        nfts: number;
        extra: string[];
      };
    };
    user_approved: {
      profile: string | null;
      address: string | null;
      membership: string | null;
    };
  }[];
  count: number;
}>;

export type WatchlistResponse = ResponseCore<{
  action: {
    type: "add" | "remove";
    element: "asset";
    ident: string;
  };
  count: number;
  data: {
    ident: string;
    label: string;
    type: string;
  }[];
}>;

export interface StakeDelegation {
  id: string | null;
  meta: string | null;
  delegation: string | null;
}

export interface StakeStatus {
  amount: number | null;
  accounts: number;
  deleg: StakeDelegation;
}

export interface StakeReward {
  total: number;
  withdrawn: number | null;
}

export interface StakeInfo {
  slot_update: number | null;
  slot_first_registered: number | null;
  slot_deregistered: number | null;
  active: boolean | null;
}

export interface Stake {
  active: StakeStatus;
  live: StakeStatus;
  reward: StakeReward;
  info: StakeInfo;
}

export interface AssetMarket {
  quantity: number;
  price: number | null;
  liquidity: number | null;
}

export interface Asset {
  name: string;
  quantity: number;
  market: AssetMarket;
  registry: string | null;
}

export interface UserInfo {
  profile: string | null;
  address: string | null;
  membership: string | null;
}

export interface StakeKeyData {
  view: string;
  user: UserInfo;
  hash_raw: string;
  script_hash: string | null;
  adahandle: string | null;
  stake: Stake;
  vote: unknown | null;
  asset: Asset[];
}

export type AccountListResponse = ResponseCore<{
  data: StakeKeyData[];
}>;

export interface Poll {
  name: string;
  url: string;
  applied: string | null;
  date_start: string;
  date_end: string;
  description: string;
  options: string[];
  state: "available" | "closed";
  vote: {
    power: number;
    is_valid: boolean;
    option: string;
    date: string;
  } | null;
  result: Record<string, { count: number; power: number }> | null;
}

export type PollListResponse = ResponseCore<Poll[]>;

interface MiscValidate {
  type: string;
  ident: string;
  valid: boolean;
}

export type MiscValidateResponse = ResponseCore<MiscValidate>;
export interface AdminGroupListResponse {
  data: {
    data: {
      name: string;
      url: string;
      description: string | null;
      param: string | null;
      members: number;
    }[];
    count: number;
  };
}

export interface AdminGroupDetailResponse {
  data: {
    name: string;
    url: string;
    description: string | null;
    param: any[] | null;
    members: {
      type: "pool";
      ident: string;
    }[];
  };
}

export interface UserLabels {
  labels: {
    ident?: string;
    address?: string;
    label?: string;
  }[];
}

export type GetUserLabelsResponse = ResponseCore<UserLabels>;

export type GroupType = "pool" | "ident" | "asset" | "drep" | "collection";
