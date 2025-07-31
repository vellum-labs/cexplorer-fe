import type { AssetPolicy } from "./assetsTypes";
import type { ResponseCore } from "./commonTypes";

interface PolicyRoyalties {
  rate: number;
  address: string;
}

interface PolicyStats {
  floor: number;
  owners: number;
  volume: number;
  royalties: PolicyRoyalties;
}
interface PolicyDataStats {
  assets: number;
  total_count: number;
  total_stake: number;
  total_address: number;
  total_with_data: number;
  total_ada_volume: number;
  total_asset_volume: number;
  total_payment_cred: number;
}

interface Policy extends AssetPolicy {
  stats: PolicyDataStats | null;
  script?: PolicyScript;
}

interface PolicyScript {
  type: string;
  json: any;
}

interface PolicyCollection {
  url?: string | null;
  name?: string | null;
  stats?: PolicyStats | null;
}

export interface PolicyDetail {
  id: string;
  policy: Policy;
  collection: PolicyCollection;
}

interface PolicyStat {
  epoch: number;
  stat: {
    total_count: number;
    total_stake: number;
    total_address: number;
    total_with_data: number;
    total_ada_volume: number;
    total_asset_volume: number;
    total_payment_cred: number;
    assets?: number;
  };
}

interface PolicyOwner {
  address: string;
  quantity: number;
}

interface PolicyOwners {
  data: PolicyOwner[];
  count: number;
}

export type PolicyDetailResponse = ResponseCore<PolicyDetail>;
export type PolicyStatsResponse = ResponseCore<PolicyStat[]>;
export type PolicyOwnerResponse = ResponseCore<PolicyOwners>;
