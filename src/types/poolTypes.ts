import type { BlockBasicInfo } from "./blockTypes";
import type { ResponseCore } from "./commonTypes";
import type { PaginatedSearchParams } from "./tableTypes";
import type { TxBasicInfo } from "./txTypes";

export interface PoolListSearchParams extends PaginatedSearchParams {
  order:
    | "ranking"
    | "live_stake"
    | "active_stake"
    | "delegators"
    | "average_stake"
    | "pledge"
    | "blocks"
    | "pledged"
    | "roa_lifetime"
    | "roa_recent"
    | "blocks_epoch"
    | "blocks_total"
    | "slot_update"
    | "top_delegator"
    | "leverage";
  sort: "asc" | "desc";
}

interface PoolEpochBlock {
  minted: number;
  estimated: number;
  luck: number;
}

export interface PoolEpochReward {
  leader_lovelace: number;
  leader_pct: number;
  member_lovelace: number;
  member_pct: number;
}

interface PoolEpochData {
  epoch_stake: number;
  delegators: number;
  block: PoolEpochBlock;
  reward: PoolEpochReward;
  pledged: number;
}

interface PoolEpoch {
  no: number;
  data: PoolEpochData;
}

interface PoolsListResponseDataItemEpochs {
  [key: number]: null | PoolEpoch;
}

interface PoolUpdateRetireItem {
  active_epoch_no: number;
  fixed_cost: number;
  index: number;
  margin: number;
  meta_id: string | null;
  pledge: number;
  reward_addr_id: number;
  reward_drep: string | null;
  tx_id: number;
  tx: {
    id: number;
    hash: string;
    time: string;
  };
}

export interface PoolUpdateRetire {
  active: PoolUpdateRetireItem;
  live: PoolUpdateRetireItem;
}

interface PoolRetireItem {
  index: number | null;
  tx_id: number | null;
  retiring_epoch: number | null;
}

export interface PoolRetire {
  active: PoolRetireItem;
  live: PoolRetireItem;
}

interface PoolStatsItem {
  epochs: number;
  luck: number;
  roa: number;
}

interface PoolStats {
  lifetime: PoolStatsItem;
  recent: PoolStatsItem;
}
export interface PoolData {
  pool_id: string;
  pool_id_hash_raw: string;
  active_stake: number | undefined;
  live_stake: number | undefined;
  epochs: PoolsListResponseDataItemEpochs;
  active_epochs: number;
  pool_name: PoolMeta;
  pool_retire: PoolRetire;
  pool_update: PoolUpdateRetire;
  stats: PoolStats;
  pledged: number;
  blocks: {
    epoch: number;
    total: number;
  };
}

export interface PoolsListResponse {
  data: {
    count: number;
    data: PoolData[];
  };
}
export interface PoolMetaExtended {
  github_handle?: string;
  twitter_handle?: string;
  discord_handle?: string;
  twitch_handle?: string;
  youtube_handle?: string;
  facebook_handle?: string;
  telegram_handle?: string;
}

export interface PoolMeta {
  ticker: string;
  name: string;
  description: string;
  extended: PoolMetaExtended | null;
  homepage: string;
}

export type PoolInfo = {
  id: string;
  meta: PoolMeta | null;
};

export interface PoolDetailResponseData
  extends Omit<PoolData, "pool_id_hash_raw" | "active_epochs"> {
  epochs: PoolEpoch[];
  hash_raw: string;
  active_epochs: number | undefined;
  delegators: number | undefined;
  registered: string | undefined;
}

export interface PoolDetailResponse {
  code: number;
  data: PoolDetailResponseData;
}

interface PoolEpochCert {
  tx: string;
  margin: number;
  pledge: number;
  fixed_cost: number;
}

export interface PoolRewardResponseData {
  no: number;
  active_stake: number | null;
  block: PoolEpochBlock | null;
  reward: PoolEpochReward | null;
  delegator: number | null;
  epoch_stake: number | null;
  pledged: number | null;
  cert: PoolEpochCert | null;
}

export interface PoolRewardsResponse {
  code: number;
  data: {
    data: PoolRewardResponseData[];
    count: number;
  };
}

export interface PoolBlocksResponseData {
  date: string;
  block: {
    count: number;
    avg_tx_count: number;
  };
}

export interface PoolBlocksResponse {
  code: number;
  data: PoolBlocksResponseData[];
}

interface PoolDelegation {
  tx: {
    slot: number;
    tx_hash: string;
    active_epoch_no: number;
  } | null;
  pool: string;
}

export interface PoolDelegatorResponseData {
  view: string | null;
  script: string;
  slot_update: number | null;
  slot_first_registered: number | null;
  live_stake: number | null;
  live_pool: PoolInfo & PoolDelegation;
  active_pool: PoolInfo & PoolDelegation;
  previous_pool: PoolInfo & PoolDelegation;
}

export interface PoolDelegatorsResponse {
  code: number;
  data: {
    data: PoolDelegatorResponseData[];
    count: number;
  };
}

interface PoolAccountItem {
  view: string;
  active_stake: number;
  live_stake: number;
}

interface PoolAccount {
  reward: PoolAccountItem;
  owner: PoolAccountItem;
}

interface PoolUpdateMeta {
  hash: string;
  url: string;
  data: PoolMeta;
}

interface PoolUpdate {
  tx_hash: string;
  time: string;
  active_epoch_no: number;
  vrf_key_hash: string;
  pledge: number;
  margin: string;
  fixed_cost: number;
  account: PoolAccount;
  meta: PoolUpdateMeta;
}

export interface PoolUpdateResponse {
  code: number;
  data: {
    data: PoolUpdate[];
    count: number;
  };
}

interface PoolAward {
  time: string;
  category: string;
  type: string;
  detail: {
    time: string;
  };
}

export interface PoolAwardsResponse {
  code: number;
  data: {
    data: PoolAward[];
    count: number;
  };
}

export interface PoolDelegatorStatsResponse {
  code: number;
  data: {
    data: {
      [key: string]: {
        count: number;
        sum: number;
      };
    }[];
    count: number;
  };
}

interface PoolRelay {
  ipv4: null | string;
  ipv6: null | string;
  dns_name: string;
  dns_srv_name: null | string;
  port: number;
}
interface PoolAbout {
  pool: {
    id: string;
    meta: PoolMeta;
  };
  relay: PoolRelay[];
}

export interface PoolAboutResponse {
  code: number;
  data: PoolAbout;
}

export interface TopMarginsWithDelegatorsData {
  active_epochs: number;
  active_stake: number;
  blocks: {
    epoch: number;
    total: number;
  };
  delegators: number;
  epochs: Record<string, EpochDetails>;
  last_block: {
    proto: number;
    slot_no: number;
  };
  live_stake: number;
  pledged: number;
  pool_id: string;
  pool_id_hash_raw: string;
  pool_name: PoolName;
  pool_retire: {
    live: null;
    active: null;
  };
  pool_update: {
    live: PoolUpdate;
    active: PoolUpdate;
  };
  stats: {
    recent: EpochStats;
    lifetime: EpochStats;
  };
  top_delegator: {
    view: string;
    stake: number;
  };
}

export type TopMarginsWithDelegatorsResponse = ResponseCore<{
  data: TopMarginsWithDelegatorsData;
  count: number;
}>;

export interface EpochStats {
  roa: number;
  luck: number;
  epochs: number;
}

export interface EpochDetails {
  no: number;
  data: {
    block: {
      luck: number;
      minted: number;
      estimated: number;
    };
    reward: {
      leader_pct: number;
      member_pct: number;
      leader_lovelace: number;
      member_lovelace: number;
    };
    pledged: number;
    delegators: number;
    epoch_stake: number;
  };
}

export interface EpochInfo {
  no: number;
  data: {
    block: {
      luck: number;
      minted: number;
      estimated: number;
    };
    reward: {
      leader_pct: number;
      member_pct: number;
      leader_lovelace: number;
      member_lovelace: number;
    };
    pledged: number;
    delegators: number;
    epoch_stake: number;
  };
}

export interface PoolName {
  name: string | null;
  ticker: string | null;
  extended: string | null;
  homepage: string | null;
  description: string | null;
}

export interface PoolRetireOrUpdate {
  tx: {
    hash: string;
    time: string;
  };
  index: number;
  owner: Array<{
    view: string;
  }>;
  margin: number;
  pledge: number;
  meta_id: number;
  fixed_cost: number;
  reward_addr: string;
  active_epoch_no: number;
}

interface RetiredPoolStat {
  count: number;
  stake: number;
  accounts: number;
}

export interface RetiredPoolItem {
  name: PoolInfo;
  stat: {
    live: number;
    active: number | null;
    epochs: number;
    accounts: number;
  };
  pool_retire: {
    live: {
      index: number;
      tx_id: number;
      retiring_epoch: number;
    };
    active: {
      tx: number;
      index: number;
      retiring_epoch: number;
    };
  };
}

export type RetiredPoolsResponse = ResponseCore<{
  count: number;
  stat: RetiredPoolStat;
  data: RetiredPoolItem[];
}>;

export interface PoolBirthday {
  live_stake: number;
  delegators: number;
  pledged: number;
  active_epochs: number;
  anniversary: string;
  registered: string;
  stats: PoolStats;
  pool: {
    id: string;
    meta: PoolMeta;
  };
}

export type PoolBirthdaysResponse = ResponseCore<{
  data: PoolBirthday[];
}>;

export interface PoolRegistrationsData {
  tx: Omit<TxBasicInfo, "block">;
  data: {
    view: string;
    hash_raw: string;
    meta: PoolMeta;
    pledge: number;
    margin: number;
    fixed_cost: number;
    registered: string;
  };
  block: Omit<BlockBasicInfo, "slot_no">;
}

export type PoolRegistrationsResponse = ResponseCore<{
  count: number;
  data: PoolRegistrationsData[];
}>;

export interface TopMultiDelegators {
  payment_cred: string;
  stake: {
    balance: number;
    count: number;
  };
}

export type TopMultiDelegatorsResponse = ResponseCore<{
  count: number;
  data: TopMultiDelegators[];
}>;

export interface DelegEpochRegistered {
  no: number;
  slot_min: number;
  slot_max: number;
  stat: {
    count: number;
    stake: number;
  };
}

export type DelegEpochRegisteredResponse = ResponseCore<DelegEpochRegistered[]>;

export interface StakeDrepsNotSpo {
  epoch_no: number;
  count: number;
  stake: number;
  delegator: number;
}

export type StakeDrepsNotSpoResponse = ResponseCore<StakeDrepsNotSpo[]>;

export interface DrepNotSpoSameTime {
  epoch_no: number;
  count: number;
  stake: number;
  delegator: number;
  total: {
    stake: number;
    count: number;
  };
}

interface PoolRetirmentData {
  tx_hash: string;
  cert_index: number;
  time: string;
  retiring_epoch: number;
}

export interface PoolRetirment {
  data: PoolRetirmentData[];
  count: number;
}

export type DrepNotSpoSameTimeResponse = ResponseCore<DrepNotSpoSameTime[]>;

export type PoolRetirmentResponse = ResponseCore<PoolRetirment>;

export interface PoolDebugError {
  type: string;
  description: string;
  date: string;
}

export interface PoolDebugData {
  error: PoolDebugError[];
}

export type PoolDebugResponse = ResponseCore<PoolDebugData>;
