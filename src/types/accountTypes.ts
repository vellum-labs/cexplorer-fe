import type { ResponseCore } from "./commonTypes";
import type { PoolInfo } from "./poolTypes";

export interface Meta {
  ticker: null | string;
  name: null | string;
  description: null | string;
  extended: null | string;
  homepage: null | string;
}

interface RewardAccount {
  live_stake: number;
  script: null | string;
  epoch_stake: number;
}

interface RewardSpendableEpoch {
  no: number | null;
  start_time: string | null;
  end_time: string | null;
  rate: number | null;
}

interface RewardPool {
  id: string;
  meta: Meta;
}

export interface RewardItem {
  amount: number;
  type: string;
  earned_epoch: number;
  account: RewardAccount;
  spendable_epoch: RewardSpendableEpoch;
  pool: RewardPool;
}

export interface AccountReward {
  count: number;
  data: RewardItem[];
  prevOffset: number;
}

export type AccountRewardResponse = ResponseCore<AccountReward>;
export type CheckDelegationResponse = ResponseCore<
  | {
      deposit: number;
      epoch_no: number;
      tx: string;
    }
  | []
>;

export interface Withdrawal {
  amount: number;
  tx: {
    hash: string;
    out_sum: number;
    treasury_donation: number;
    size: number;
    fee: number;
  };
  block: {
    epoch_no: number;
    hash: string;
    time: string;
  };
  account: {
    live_stake: number;
    script: null;
  };
  pool: {
    live: PoolInfo;
  };
  view: string;
}

export type WithdrawalsData = {
  count: number;
  data: Withdrawal[];
};

export type WithdrawalsResponse = ResponseCore<WithdrawalsData>;
