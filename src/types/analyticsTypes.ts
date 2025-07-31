import type { ResponseCore } from "./commonTypes";
import type { DrepDetail } from "./drepTypes";
import type { PoolData, PoolInfo, PoolMeta } from "./poolTypes";

export type WealthCompositionResponse = ResponseCore<
  Record<string, { count: number; sum: number }>
>;

interface HardforkResponseDataInfo {
  name: string;
  slug: string;
  ready: number;
  inProgress: number;
  notStarted: number;
  releaseDate: string | null;
  description: string;
}

export interface HardforkResponseDataDetailExchanges {
  name: string;
  updateOn: string;
  liquidityPercentage: number;
  status: string;
  logo: string;
}

interface HardforkResponseDataDetail extends HardforkResponseDataInfo {
  exchanges: HardforkResponseDataDetailExchanges[];
}

interface PoolsStat {
  count: number;
  version: number;
}
interface HardforkPools {
  max: string;
  stat: {
    [key in "1d" | "5d"]: PoolsStat[];
  };
}

export interface HardforkResponseData {
  info: HardforkResponseDataInfo;
  detail: HardforkResponseDataDetail;
  pools: HardforkPools;
}

export type HardforkResponse = ResponseCore<HardforkResponseData>;

interface BlockVersion {
  version: number;
  count: number;
}

interface PoolBlockVersion {
  count: number;
  stake: number;
  version: number;
}

interface TxComposition {
  datum: number;
  delegation: number;
  delegation_vote: number;
  drep_registration: number;
  gov_action_proposal: number;
  ma_tx_mint: number;
  ma_tx_out: number;
  pool_update: number;
  redeemer_data: number;
  script: number;
  stake_deregistration: number;
  stake_registration: number;
  tx_metadata: number;
  withdrawal: number;
}

export interface EpochAnalyticsResponseData {
  no: number;
  stat: {
    sum_fee: number;
    count_tx: number;
    avg_tx_fee: string;
    count_mint: number;
    avg_tx_size: string;
    count_block: number;
    count_datum: number;
    count_tx_out: number;
    block_version: BlockVersion[];
    avg_block_size: string;
    avg_tx_out_sum: string;
    count_redeemer: number;
    block_producers: number;
    count_delegation: number;
    count_tx_metadata: number;
    avg_tx_script_size: string;
    count_tx_out_stake: number;
    pool_block_version: PoolBlockVersion[];
    gov_delegation_vote: number;
    max_block_tx_count: number;
    count_tx_out_address: number;
    count_tx_metadata_with_721: number;
    count_tx_out_stake_not_yesterday: number;
    count_tx_out_address_not_yesterday: number;
    tx_composition: TxComposition;
  } | null;
}

export interface AnalyticsRateResponseData {
  date: string;
  stat: {
    sum_fee: number;
    count_tx: number;
    avg_tx_fee: string;
    count_mint: number;
    avg_tx_size: string;
    count_block: number;
    count_datum: number;
    count_tx_out: number;
    block_version: BlockVersion[];
    avg_block_size: string;
    avg_tx_out_sum: string;
    count_redeemer: number;
    block_producers: number;
    count_delegation: number;
    count_tx_metadata: number;
    avg_tx_script_size: string;
    count_tx_out_stake: number;
    pool_block_version: PoolBlockVersion[];
    gov_delegation_vote: number;
    max_block_tx_count: number;
    count_tx_out_address: number;
    count_tx_metadata_with_721: number;
    count_tx_out_stake_not_yesterday: number;
    count_tx_out_address_not_yesterday: number;
    count_pool_relay_uniq: number;
    count_pool: number;
  } | null;
}

export interface PoolBlock {
  pool_id: string;
  epochs: number;
  blocks_minted: number;
  blocks_estimated: number;
  luck: number;
  pool: PoolInfo;
}

interface PoolDelegator {
  id: string;
  meta: PoolMeta;
  delegation: {
    tx: {
      slot: number;
      tx_hash: string;
      active_epoch_no: number;
    };
    pool: string;
  };
}

interface DrepDelegator {
  id: string;
  meta: PoolMeta;
  delegation: {
    tx: {
      slot: number;
      tx_hash: string;
      active_epoch_no: number;
    };
    view: string;
  };
}

export interface AnalyticsTopStakingAccounts {
  view: string;
  live_stake: number;
  script: null;
  deleg: null | PoolDelegator;
  drep: null | DrepDelegator;
}

export interface AnalyticsTopAddresses {
  address: string;
  first: string;
  last: string;
  balance: number;
  deleg: null | PoolDelegator;
  drep: null | DrepDelegator;
}

export type EpochAnalyticsResponse = ResponseCore<{
  count: string;
  data: EpochAnalyticsResponseData[];
}>;

export type AnalyticsRateResponse = ResponseCore<{
  count: string;
  data: AnalyticsRateResponseData[];
}>;

export type AnalyticsPoolBlockResponse = ResponseCore<{
  count: number;
  data: PoolBlock[];
}>;

export type AnalyticsTopStakingAccountsResponse = ResponseCore<{
  count: number;
  data: AnalyticsTopStakingAccounts[];
}>;

export type AnalyticsTopAddressesReponse = ResponseCore<{
  count: number;
  data: AnalyticsTopAddresses[];
}>;

export interface AdaPot {
  epoch_no: number;
  treasury: number;
  reserves: number;
  rewards: number;
  utxo: number;
  deposits_stake: number;
  fees: number;
  deposits_drep: number;
  deposits_proposal: number;
}

export type AnalyticsAdaPotsResponse = ResponseCore<{
  count: number;
  data: AdaPot[];
}>;

export interface GroupsListData {
  name: string;
  url: string;
  description: string;
  param: string;
  data: {
    count: number;
    pool: null;
    asset: null;
  };
}

export type GroupsListResponse = ResponseCore<{
  count: number;
  data: GroupsListData[];
}>;

export interface GroupDetailData {
  url: string;
  name: string;
  description: string;
  items: (
    | {
        type: "pool";
        ident: string;
        info: PoolData[];
      }
    | {
        type: "drep";
        ident: string;
        info: DrepDetail[];
      }
  )[];
}

export type GroupDetailResponse = ResponseCore<{
  data: GroupDetailData[];
  count: number;
}>;

export interface AveragePool {
  epoch_no: number;
  avg_delegator: number;
  avg_epoch_stake: number;
}

export type AveragePoolResponse = ResponseCore<AveragePool[]>;

// {
//     "data": null,
//     "hash": {
//       "raw": "5bfef20b43131c5ca870846b561ef4f395add12019e9c7a47f756d44",
//       "view": "drep1t0l0yz6rzvw9e2rss344v8h57w26m5fqr85u0frlw4k5gashtw9",
//       "has_script": false
//     },
//     "stat": {
//       "total": {
//         "votes": [
//           {
//             "vote": "Yes",
//             "count": 1
//           }
//         ],
//         "opportunity": 9
//       },
//       "recently": "TBD"
//     },
//     "distr": {
//       "count": 37,
//       "amount": 23377713066938,
//       "active_until": 199
//     },
//     "owner": {
//       "stake": "stake_test1uzyy407v2k5fcvvqcaq5ddd4wflgt77r7sg873ljnkg4r6qssl3wm",
//       "address": "addr_test1qrmz4dd600tzgn3q05pz27l44ugzxryrw7ut7t0f66wuqzugf2luc4dgnsccp36pg66m2un7shau8aqs0arl98v3285qmzkxtt",
//       "balance": 2498924441405
//     },
//     "since": "2024-11-12T19:57:33",
//     "amount": 23377713066938,
//     "is_active": false
//   }
