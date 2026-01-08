import type { ResponseCore } from "./commonTypes";

export interface AssetRegistry {
  ticker?: string;
  name?: string;
  decimals?: number;
  has_logo?: boolean;
  description?: string;
  url?: string;
}

export type AssetListType =
  | "nft"
  | "token"
  | "all"
  | "recent-tokens"
  | "recent-nfts";

type Scripts = SigScript | SlotScript;

interface SigScript {
  type: "sig";
  keyHash: string;
}

interface SlotScript {
  type: "before" | "after";
  slot: number;
}

interface AllScript {
  type: "all";
  scripts: Scripts[];
}

interface AnyScript {
  type: "any";
  scripts: Scripts[];
}

interface AtLeastScript {
  type: "atLeast";
  required: number;
  scripts: Scripts[];
}

export type NestedScript = AllScript | AnyScript | AtLeastScript;
export type ScriptType = "sig" | "before" | "after" | "all" | "any" | "atLeast";

export type PolicyJson =
  | SigScript
  | SlotScript
  | AllScript
  | AnyScript
  | AtLeastScript;

type PolicyScript = {
  type: "timelock";
  json: PolicyJson;
};

export interface AssetPolicy {
  quantity: number;
  mintc: number;
  last_mint: string;
  first_mint: string;
  script: PolicyScript;
}

interface AssetStatAsset extends AssetPolicy {
  param: [];
  onchain: unknown;
  stats:
    | {
        count: number;
        stake: number;
        address: string;
        ada_volume: number;
        asset_volume: number;
        payment_cred: string;
        holders: number;
      }[]
    | null;
}

interface AssetStat {
  asset: AssetStatAsset;
  policy: AssetPolicy;
}

export interface AssetCore {
  name: string;
  registry?: AssetRegistry;
}

export type TxAsset = { quantity: number } & AssetCore;

export interface AssetList {
  name: string;
  registry: AssetRegistry;
  stat: AssetStat;
  dex: AssetDetailDex;
}

interface AssetListData {
  count: number;
  data: AssetList[];
}

export interface AssetDetailDex {
  is_verified: boolean;
  ada_pools: {
    dex_name: string;
    token_1_amount: number;
    token_2_amount: number;
    pool_fee?: number;
    pool_id?: string;
    pool_name?: string;
  }[];
  price: number;
  liquidity: number;
  stat: null;
}

export interface AssetDetail extends AssetList {
  fingerprint: string;
  policy: string;
}

interface AssetBlock {
  hash: string;
  no: number;
  time: string;
  epoch_no: number;
}

export interface AssetOwnerAdaHandle {
  name: string;
  type: "wallet" | "script";
}

export interface AssetOwner {
  address: string;
  quantity: number;
  adahandle?: AssetOwnerAdaHandle | null;
}

interface AssetOwners {
  count: number;
  data: AssetOwner[];
}

export interface AssetOwnersNftItem {
  tx: AssetTx;
  block: AssetBlock;
  owner: Pick<AssetOwner, "address">;
  quantity: number;
  adahandle?: AssetOwnerAdaHandle | null;
}

interface AssetOwnersNft {
  count: number;
  data: AssetOwnersNftItem[];
}

export interface MetadataTx {
  hash: string;
  time: string;
  invalid_hereafter: number;
  treasury_donation: number;
}

export interface AssetMetadataItem {
  key: number;
  json: {
    [key: string]: any;
  };
  tx: MetadataTx;
}

interface AssetMetadata {
  count: number;
  data: AssetMetadataItem[];
}

interface AssetTx {
  hash: string;
  invalid_hereafter: null | string;
  time: string;
  treasury_donation: number;
  fee: number;
}

export interface AssetMint {
  asset: {
    name: string;
    policy: string;
  };
  quantity: number;
  tx: AssetTx;
}
interface AssetMintData {
  count: number;
  data: AssetMint[];
}

interface AssetStatsData {
  epoch: number;
  stat: {
    count: number;
    stake: number;
    address: number;
    with_data: number;
    ada_volume: number;
    asset_volume: number;
    payment_cred: number;
  }[];
}

export type AssetListResponse = ResponseCore<AssetListData>;
export type AssetDetailResponse = ResponseCore<AssetDetail>;
export type AssetOwnersResponse = ResponseCore<AssetOwners>;
export type AssetOwnersNftResponse = ResponseCore<AssetOwnersNft>;
export type AssetMetadataResponse = ResponseCore<AssetMetadata>;
export type AssetMintResponse = ResponseCore<AssetMintData>;
export type AssetStatsResponse = ResponseCore<{
  data: AssetStatsData[];
}>;

export interface AdaHandleHolder {
  type: string;
  holder: string;
  address: string;
  key: string;
}

export interface AdaHandle {
  hex: string;
  name: string;
  image: string;
  holder: AdaHandleHolder;
  rarity: string;
  utxo: string;
  updated_slot: number;
}

export interface AdaHandleListItem extends AdaHandle {
  last_mint: string;
  last_mint_tx: string;
}

interface AdaHandleListData {
  count: number;
  data: AdaHandleListItem[];
}

export type AdaHandleResponse = ResponseCore<AdaHandle>;
export type AdaHandleListResponse = ResponseCore<AdaHandleListData>;
