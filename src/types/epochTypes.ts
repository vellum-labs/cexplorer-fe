export interface EpochParam {
  nonce: string;
  epoch_no: number;
  influence: string;
  max_epoch: number;
  min_fee_a: number;
  min_fee_b: number;
  price_mem: string;
  price_step: string;
  key_deposit: number;
  max_bh_size: number;
  max_tx_size: number;
  max_val_size: number;
  pool_deposit: number;
  extra_entropy: null;
  max_tx_ex_mem: number;
  min_pool_cost: number;
  max_block_size: number;
  min_utxo_value: number;
  protocol_major: number;
  protocol_minor: number;
  max_tx_ex_steps: number;
  decentralisation: number;
  max_block_ex_mem: number;
  collateral_percent: number;
  max_block_ex_steps: number;
  optimal_pool_count: number;
  coins_per_utxo_size: number;
  monetary_expand_rate: number;
  treasury_growth_rate: number;
  max_collateral_inputs: number;
}

interface PotStatsDeposits {
  deposits_drep: number;
  deposits_proposal: number;
  deposits_stake: number;
}

interface PotStats {
  fees: number;
  utxo: number;
  rewards: number;
  slot_no: number;
  block_id: number;
  deposits: PotStatsDeposits;
  reserves: number;
  treasury: number;
}

interface EpochStats {
  fees: number;
  out_sum: number;
  end_time: string;
  tx_count: number;
  block_size: number;
  start_time: string;
  block_count: number;
}

interface ProtoStats {
  min: number;
  max: number;
}
interface StakePoolStats {
  minting: number;
  registered: number;
}

interface StakeStats {
  epoch: number;
  pools: StakePoolStats;
  active: number;
  accounts: number;
}

interface RewardStats {
  leader: null | number;
  member: null | number;
}

interface PoolStats {
  pools: number;
  pct_leader: null | number;
  pct_member: null | number;
  epoch_stake: null | number;
  delegator_avg: null | number;
  delegator_count: null | number;
  delegator_avg_sw: null | number;
  delegator_count_sw: null | number;
}

interface EpochStat {
  sum_fee: number;
  count_tx: number;
  avg_tx_fee: string;
  count_mint: number;
  avg_tx_size: string;
  count_block: number;
  count_datum: number;
  count_tx_out: number;
  avg_block_size: string;
  avg_tx_out_sum: string;
  count_redeemer: number;
  count_delegation: number;
  count_tx_metadata: number;
  avg_tx_script_size: string;
  count_tx_out_stake: number;
  max_block_tx_count: number;
  count_tx_out_address: number;
  count_tx_metadata_with_721: number;
  count_tx_out_stake_not_yesterday: number;
  count_tx_out_address_not_yesterday: number;
}

interface EpochDaily {
  date: string;
  stat: EpochStat;
}
export interface EpochStatsSummary {
  pots: PotStats;
  daily: EpochDaily[];
  epoch: EpochStats;
  proto: ProtoStats;
  stake: StakeStats;
  rewards: RewardStats;
  pool_stat: PoolStats;
  epoch_no: number;
  spendable_epoch: number;
}

export interface EpochListData {
  no: number;
  start_time: string;
  end_time: string;
  blk_count: number;
  tx_count: number;
  out_sum: number;
  fees: number;
  params: EpochParam;
  params_active: EpochParam;
  stats: EpochStatsSummary;
}

interface EpochCore {
  code: number;
  tokens: number;
  ex: number;
  debug: boolean;
}

export interface EpochListResponse extends EpochCore {
  data: {
    data: EpochListData[];
    count: number;
  };
}

export interface EpochDetailParamResponse extends EpochCore {
  data: EpochParam;
}

export interface EpochDetailStatsResponse extends EpochCore {
  data: EpochStatsSummary;
}

export type EpochSort = "asc" | "desc";
export type UpcomingEpochs = "1" | "10" | "25" | "50";
