import type { ResponseCore } from "./commonTypes";
import type { PoolInfo } from "./poolTypes";

interface Reward {
  amount: number;
  pool_id: string;
  earned_epoch: number;
  spendable_epoch: number;
}

interface Stake {
  live: number;
  active: {
    epoch: number;
    amount: number;
  }[];
}

interface Delegation {
  slot_no: number;
  pool: PoolInfo;
  tx_hash: string;
  active_epoch_no: number;
}

export interface DelegationStateData {
  view: string;
  stake: Stake;
  reward: Reward[] | null;
  script: null;
  hash_raw: string;
  delegation: {
    live: Delegation;
    active: Delegation;
  };
}

export type DelegationStateResponse = ResponseCore<{
  count: number;
  data: DelegationStateData[];
}>;

export interface DelegationData {
  tx: {
    hash: string;
    slot_no: number;
  };
  view: string;
  pool: {
    live: PoolInfo;
    previous: PoolInfo;
  };
  active_stake: number | null;
  live_stake: number | null;
  active_epoch_no: number;
}

export interface DelegationToRetiredData {
  pool: PoolInfo;
  view: string;
  account: {
    script: null;
    live_stake: number;
  };
}

export type DelegationResponse = ResponseCore<{
  count: number;
  data: DelegationData[];
}>;

export type DelegationToRetiredResponse = ResponseCore<{
  count: number;
  data: DelegationToRetiredData[];
}>;
