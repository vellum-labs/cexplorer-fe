import type { ReactNode } from "react";
import type { MouseEventHandler, RefObject } from "react";

interface TableColumn<T> {
  key: string;
  render: (value: T, index?: number) => ReactNode;
  title: ReactNode;
  visible: boolean;
  standByRanking?: boolean;
  rankingStart?: "asc" | "desc" | undefined;
  jsonFormat?: (value: T, index?: number) => string | number;
  jsonTitleFormat?: string | number;
  widthPx: number;
  filter?: {
    filterOpen?: boolean;
    filterContent?: ReactNode;
    filterButtonDisabled?: boolean;
    anchorRef: RefObject<any>;
    activeFunnel?: boolean;
    width?: string;
    onShow?: MouseEventHandler<SVGSVGElement>;
    onReset?: () => void;
    onFilter?: () => void;
  };
}

export type TableColumns<T> = TableColumn<T>[];

export type TableOptionsCore<T> = {
  columnsVisibility: T;
  isResponsive: boolean;
  rows: number;
  columnsOrder: (keyof T)[];
};

export type PaginatedSearchParams = {
  offset?: number | undefined;
  limit?: number | undefined;
  page?: number | undefined;
  hash?: string | undefined;
  datum?: string | undefined;
  tab?: string | undefined;
};

export type BlockListColumns = {
  date: boolean;
  block_no: boolean;
  epoch_no: boolean;
  slot_no: boolean;
  tx_count: boolean;
  minted_by: boolean;
  epoch_slot_no: boolean;
  vrf_key: boolean;
  protocol: boolean;
  hash: boolean;
  cert_counter: boolean;
  size: boolean;
};

export type LiveDelegationsColumns = {
  date: boolean;
  epoch: boolean;
  address: boolean;
  amount: boolean;
  delegation: boolean;
  tx: boolean;
};

export type RetiredDelegationsColumns = {
  index: boolean;
  pool: boolean;
  epoch: boolean;
  stake: boolean;
  delegators: boolean;
  longevity: boolean;
};

export type WithdrawalsColumns = {
  date: boolean;
  epoch: boolean;
  address: boolean;
  amount_controlled: boolean;
  amount_withdrawn: boolean;
  delegated_to: boolean;
  tx: boolean;
};

export type LiveDelegationsTableOptions = {
  columnsVisibility: LiveDelegationsColumns;
  rows: number;
  columnsOrder: (keyof LiveDelegationsColumns)[];
};

export interface NewPoolsColumns {
  date: boolean;
  pool: boolean;
  epoch: boolean;
  fees: boolean;
  pledge: boolean;
  tx_hash: boolean;
}

export type PoolBlocksColumns = {
  date: boolean;
  block_no: boolean;
  epoch_no: boolean;
  slot_no: boolean;
  tx_count: boolean;
  hash: boolean;
  size: boolean;
  protocol: boolean;
  cert_counter: boolean;
};

export interface PoolPefomanceColumns {
  epoch: boolean;
  date_start: boolean;
  date_end: boolean;
  active_stake: boolean;
  blocks: boolean;
  delegators: boolean;
  luck: boolean;
  pledged: boolean;
  roa: boolean;
}

export type PoolRewardsColumns = {
  epoch: boolean;
  rewards: boolean;
  active_stake: boolean;
  epoch_stake: boolean;
  roa: boolean;
  luck: boolean;
  blocks: boolean;
  delegators: boolean;
};

export type PoolDelegatorsColumns = {
  date: boolean;
  active_in: boolean;
  address: boolean;
  amount: boolean;
  loyalty: boolean;
  tx: boolean;
  registered: boolean;
  pool_delegation: boolean;
};

export type DrepDelegationsColumns = {
  date: boolean;
  drep: boolean;
  active_stake: boolean;
  live_stake: boolean;
  loyalty: boolean;
  tx: boolean;
  address: boolean;
  amount: boolean;
  delegation: boolean;
};

export type PoolStructureColumns = {
  wallet_size: boolean;
  amount: boolean;
  amount_pie: boolean;
  holdings: boolean;
  holdings_pie: boolean;
};

export interface DrepStructureColumns {
  wallet_size: boolean;
  amount: boolean;
  amount_pie: boolean;
  holdings: boolean;
  holdings_pie: boolean;
}

export interface DrepRegistrationsColumns {
  date: boolean;
  view: boolean;
  type: boolean;
  deposit: boolean;
  hash: boolean;
  epoch_block: boolean;
}

export interface PoolRegistrationsColumns {
  date: boolean;
  view: boolean;
  fee: boolean;
  deposit: boolean;
  pledge: boolean;
  hash: boolean;
  epoch_block: boolean;
}

export interface PoolDeregistrationsColumns {
  date: boolean;
  longetivity: boolean;
  view: boolean;
  fee: boolean;
  deposit: boolean;
  pledge: boolean;
  hash: boolean;
  epoch_block: boolean;
}

export interface StakeRegistrationsColumns {
  date: boolean;
  type: boolean;
  view: boolean;
  deposit: boolean;
  hash: boolean;
  epoch_block: boolean;
}

export interface ContractInteractionsColumns {
  date: boolean;
  type: boolean;
  purpose: boolean;
  view: boolean;
  deposit: boolean;
  unit_steps: boolean;
  hash: boolean;
  epoch_block: boolean;
}

export interface NetworkTPSTableColumns {
  timeframe: boolean;
  transactions: boolean;
  tps: boolean;
  max_tps: boolean;
}

export type BasicTableOptions<T> = {
  columnsVisibility: T;
  isResponsive: boolean;
  rows: number;
  columnsOrder: (keyof T)[];
};

export interface BlockDetailColumns {
  date: boolean;
  hash: boolean;
  block: boolean;
  total_ouput: boolean;
  fee: boolean;
  utxo: boolean;
  size: boolean;
}

export type StakeWithdrawalsColumns = {
  date: boolean;
  tx_hash: boolean;
  block: boolean;
  total_output: boolean;
  amount: boolean;
  fee: boolean;
  size: boolean;
};

export interface StakeWithdrawalsTableOptions {
  columnsVisibility: StakeWithdrawalsColumns;
  columnsOrder: (keyof StakeWithdrawalsColumns)[];
  rows: number;
}

export type TaxToolSummaryColumns = {
  period: boolean;
  epochs: boolean;
  rewards_ada: boolean;
  rewards_usd: boolean;
  rewards_secondary: boolean;
};

export type TaxToolEpochRewardsColumns = {
  epoch: boolean;
  end_time: boolean;
  type: boolean;
  rewards_ada: boolean;
  rewards_usd: boolean;
  rewards_secondary: boolean;
  ada_usd_rate: boolean;
  ada_secondary_rate: boolean;
};

export type TaxToolWithdrawalsColumns = {
  timestamp: boolean;
  transaction: boolean;
  rewards_ada: boolean;
  rewards_usd: boolean;
  rewards_secondary: boolean;
  ada_usd_rate: boolean;
  ada_secondary_rate: boolean;
};

export interface BlockDetailTableOptions
  extends Pick<TableOptionsCore<BlockDetailColumns>, "isResponsive" | "rows"> {
  columnsVisibility: BlockDetailColumns;
  columnsOrder: (keyof BlockDetailColumns)[];
}

export interface PoolsListColumns {
  ranking: boolean;
  delegators: boolean;
  avg_stake: boolean;
  pool: boolean;
  stake: boolean;
  rewards: boolean;
  luck: boolean;
  fees: boolean;
  blocks: boolean;
  pledge: boolean;
  selected_vote: boolean;
  top_delegator: boolean;
  drep: boolean;
  pledge_leverage: boolean;
}

export interface PoolsListTableOptions
  extends Pick<TableOptionsCore<PoolsListColumns>, "isResponsive" | "rows"> {
  columnsVisibility: PoolsListColumns;
  columnsOrder: (keyof PoolsListColumns)[];
}

export interface PoolBlockTableColumns {
  pool: boolean;
  minted_blocks: boolean;
  luck: boolean;
  estimated_blocks: boolean;
}

export interface PoolBlockTableOptions
  extends Pick<TableOptionsCore<PoolsListColumns>, "isResponsive" | "rows"> {
  columnsVisibility: PoolBlockTableColumns;
  columnsOrder: (keyof PoolBlockTableColumns)[];
}

export interface ScriptDetailUsesColumns {
  date: boolean;
  hash: boolean;
  output: boolean;
  fee: boolean;
  memory: boolean;
  steps: boolean;
  purpose: boolean;
}

export interface ScriptDetailUsesTableOptions
  extends Pick<
    TableOptionsCore<ScriptDetailUsesColumns>,
    "isResponsive" | "rows"
  > {
  columnsVisibility: ScriptDetailUsesColumns;
  columnsOrder: (keyof ScriptDetailUsesColumns)[];
}

export interface PoolUpdatesColumns {
  date: boolean;
  epoch: boolean;
  pool: boolean;
  active_stake: boolean;
  fees: boolean;
  pledge: boolean;
  tx_hash: boolean;
  certificate: boolean;
}

export interface PoolUpdatesTableOptions
  extends Pick<TableOptionsCore<PoolUpdatesColumns>, "isResponsive" | "rows"> {
  columnsVisibility: PoolUpdatesColumns;
  columnsOrder: (keyof PoolUpdatesColumns)[];
}

export interface PoolBirthdaysColumns {
  date: boolean;
  pool: boolean;
  birthday: boolean;
  registered: boolean;
  delegators: boolean;
  active_stake: boolean;
}

export interface PoolBirthdaysTableOptions
  extends Pick<
    TableOptionsCore<PoolBirthdaysColumns>,
    "isResponsive" | "rows"
  > {
  columnsVisibility: PoolBirthdaysColumns;
  columnsOrder: (keyof PoolBirthdaysColumns)[];
}
export interface HardforkTableColumns {
  exchanges: boolean;
  liquidity: boolean;
  status: boolean;
  last_updated: boolean;
}

export interface HardforkTableOptions
  extends Pick<
    TableOptionsCore<HardforkTableColumns>,
    "isResponsive" | "rows"
  > {
  columnsOrder: (keyof HardforkTableColumns)[];
}

export interface EpochListColumns {
  start_time: boolean;
  end_time: boolean;
  epoch: boolean;
  blocks: boolean;
  txs: boolean;
  output: boolean;
  fees: boolean;
  rewards: boolean;
  stake: boolean;
  usage: boolean;
}

export interface EpochTableOptions
  extends Pick<TableOptionsCore<EpochListColumns>, "isResponsive" | "rows"> {
  columnsVisibility: EpochListColumns;
  columnsOrder: (keyof EpochListColumns)[];
}

export interface GovernanceActionDetailAboutListColumns {
  date: boolean;
  voter: boolean;
  voter_role: boolean;
  voting_power: boolean;
  delegators: boolean;
  vote: boolean;
  epoch: boolean;
  block: boolean;
  tx: boolean;
}

export interface VoteListPageColumns {
  date: boolean;
  gov_action: boolean;
  voter: boolean;
  voter_role: boolean;
  voting_power: boolean;
  vote: boolean;
  epoch: boolean;
  block: boolean;
  tx: boolean;
}

export interface EpochBlockListColumns {
  date: boolean;
  block_no: boolean;
  slot_no: boolean;
  tx_count: boolean;
  minted_by: boolean;
  size: boolean;
}

export interface EpochBlockListTableOptions
  extends Pick<
    TableOptionsCore<EpochBlockListColumns>,
    "isResponsive" | "rows"
  > {
  columnsVisibility: EpochBlockListColumns;
  columnsOrder: (keyof EpochBlockListColumns)[];
}

export interface AddressDetailAssetColumns {
  token: boolean;
  price: boolean;
  pnl_24: boolean;
  pnl_7: boolean;
  holdings: boolean;
  supply: boolean;
  portfolio: boolean;
  value: boolean;
  trade?: boolean;
  policy_id: boolean;
  ticker: boolean;
}

export interface AddressDetailAdressesColumns {
  address: boolean;
  balance: boolean;
  activity: boolean;
  last_activity: boolean;
  tokens: boolean;
}

export interface AddressDetailAdressesTableOptions {
  columnsVisibility: AddressDetailAdressesColumns;
  columnsOrder: (keyof AddressDetailAdressesColumns)[];
}

export interface AddressDetailAssetTableOptions
  extends Pick<
    TableOptionsCore<AddressDetailAssetColumns>,
    "isResponsive" | "rows"
  > {
  columnsVisibility: AddressDetailAssetColumns;
  columnsOrder: (keyof AddressDetailAssetColumns)[];
  lowBalances: boolean;
  activeAsset?: string;
  activeDetail?: string;
}

export interface AddressDetailRewardsTableColumns {
  epoch: boolean;
  date: boolean;
  stake_pool: boolean;
  active_stake: boolean;
  reward: boolean;
  roa: boolean;
}

export interface AddressDetailRewardsTableOptions
  extends Pick<
    TableOptionsCore<AddressDetailRewardsTableColumns>,
    "isResponsive" | "rows"
  > {
  columnsVisibility: AddressDetailRewardsTableColumns;
  columnsOrder: (keyof AddressDetailRewardsTableColumns)[];
}

export interface TxListTableColumns {
  date: boolean;
  hash: boolean;
  block: boolean;
  total_output: boolean;
  donation: boolean;
  fee: boolean;
  size: boolean;
  script_size: boolean;
}
export interface TxListTableOptions
  extends Pick<TableOptionsCore<TxListTableColumns>, "isResponsive" | "rows"> {
  columnsVisibility: TxListTableColumns;
  columnsOrder: (keyof TxListTableColumns)[];
}

export interface GenesisAddressesTableColumns {
  order: boolean;
  address: boolean;
  value: boolean;
  balance: boolean;
  first_activity: boolean;
  last_activity: boolean;
}
export interface GenesisAddressesTableOptions
  extends Pick<
    TableOptionsCore<GenesisAddressesTableColumns>,
    "isResponsive" | "rows"
  > {
  columnsVisibility: GenesisAddressesTableColumns;
  columnsOrder: (keyof GenesisAddressesTableColumns)[];
}

export interface MetadataTxListTableColumns {
  date: boolean;
  key: boolean;
  hash: boolean;
  size: boolean;
  md: boolean;
}

export interface MetadataTxListTableOptions
  extends Pick<
    TableOptionsCore<MetadataTxListTableColumns>,
    "isResponsive" | "rows"
  > {
  columnsVisibility: MetadataTxListTableColumns;
  columnsOrder: (keyof MetadataTxListTableColumns)[];
}

export interface AssetListTableColumns {
  order: boolean;
  type: boolean;
  asset: boolean;
  policy_id: boolean;
  asset_minted: boolean;
  mint_quantity: boolean;
  mint_count: boolean;
  price: boolean;
}

export interface AssetListTableOptions
  extends Pick<
    TableOptionsCore<AssetListTableColumns>,
    "isResponsive" | "rows"
  > {
  columnsVisibility:
    | AssetListTableColumns
    | Omit<AssetListTableColumns, "type">
    | Omit<AssetListTableColumns, "type" | "mint_quantity">;
  columnsOrder: (keyof AssetListTableColumns)[];
}

export interface AddressDetailUTXOColumns {
  hash: boolean;
  index: boolean;
  amount: boolean;
  min_utxo: boolean;
}
export interface AddressDetailUTXOOptions
  extends Pick<
    TableOptionsCore<AddressDetailUTXOColumns>,
    "isResponsive" | "rows"
  > {
  columnsVisibility: AddressDetailUTXOColumns;
  columnsOrder: (keyof AddressDetailUTXOColumns)[];
}

export interface AssetOwnerColumns {
  order: boolean;
  type: boolean;
  owner: boolean;
  quantity: boolean;
  share: boolean;
  value: boolean;
}
export interface AssetOwnerOptions {
  columnsOrder: (keyof AssetOwnerColumns)[];
}

export interface AssetOwnerNftColumns extends AssetOwnerColumns {
  date: boolean;
}

export interface AssetOwnerNftOptions {
  columnsOrder: (keyof AssetOwnerNftColumns)[];
}

export interface AssetMintColumns {
  order: boolean;
  type: boolean;
  asset: boolean;
  policy_id: boolean;
  asset_minted: boolean;
  mint_quantity: boolean;
  tx: boolean;
}

export interface AssetMintOptions
  extends Pick<TableOptionsCore<AssetMintColumns>, "isResponsive" | "rows"> {
  columnsVisibility: AssetMintColumns;
  columnsOrder: (keyof AssetMintColumns)[];
}

export interface DeFiTokenTableColumns {
  order: boolean;
  token: boolean;
  price: boolean;
  change_24h: boolean;
  volume: boolean;
  liquidity: boolean;
  age: boolean;
  last_week: boolean;
  buy: boolean;
}

export interface DrepListTableColumns {
  ranking: boolean;
  status: boolean;
  drep_name: boolean;
  voting_power: boolean;
  voting_activity: boolean;
  recent_activity: boolean;
  registered: boolean;
  metadata: boolean;
  owner_stake: boolean;
  average_stake: boolean;
  delegators: boolean;
  selected_vote: boolean;
  spo: boolean;
  top_delegator: boolean;
}

export interface DrepListTableOptions
  extends Pick<
    TableOptionsCore<DrepListTableColumns>,
    "isResponsive" | "rows"
  > {
  columnsVisibility: DrepListTableColumns;
  columnsOrder: (keyof DrepListTableColumns)[];
}

export interface GovernanceListTableColumns {
  start: boolean;
  type: boolean;
  gov_action_name: boolean;
  duration: boolean;
  end: boolean;
  status: boolean;
  progress: boolean;
  tx: boolean;
}

export interface CexplorerNftsColumns {
  star: boolean;
  index: boolean;
  nft: boolean;
  type: boolean;
  power: boolean;
  modify: boolean;
}

export type CexplorerNftsTableOptions = {
  columnsVisibility: CexplorerNftsColumns;
  rows: number;
  columnsOrder: (keyof CexplorerNftsColumns)[];
};

export interface GovernanceActionsTableColumns {
  date: boolean;
  type: boolean;
  proposal_name: boolean;
  drep: boolean;
  governance_action_name: boolean;
  vote: boolean;
  voting_power: boolean;
  tx: boolean;
}

export type GovernanceActionsTableOptions = {
  columnsVisibility: GovernanceActionsTableColumns;
  rows: number;
  columnsOrder: (keyof GovernanceActionsTableColumns)[];
};

export interface DrepDelegatorTableColumns {
  date: boolean;
  active_in: boolean;
  stake: boolean;
  amount: boolean;
  loyalty: boolean;
  drep_delegation: boolean;
  tx: boolean;
}

export type DrepDelegatorTableOptions = {
  columnsVisibility: DrepDelegatorTableColumns;
  rows: number;
  columnsOrder: (keyof DrepDelegatorTableColumns)[];
};

export interface ScriptListRanklistTableColumns {
  order: boolean;
  purpose: boolean;
  dapp: boolean;
  category: boolean;
  users: boolean;
  int_this_epoch: boolean;
  activity_change: boolean;
  epoch_volume: boolean;
}

export type ScriptListRanklistTableOptions = {
  columnsVisibility: ScriptListRanklistTableColumns;
  rows: number;
  columnsOrder: (keyof ScriptListRanklistTableColumns)[];
};

export interface ScriptListInteractionsTableColumns {
  date: boolean;
  dapp: boolean;
  tx_hash: boolean;
  output: boolean;
  fee: boolean;
  memory_used: boolean;
  cpu_steps: boolean;
  purpose: boolean;
}

export type ScriptListInteractionsTableOptions = {
  columnsVisibility: ScriptListInteractionsTableColumns;
  rows: number;
  columnsOrder: (keyof ScriptListInteractionsTableColumns)[];
};

export interface PolicyDetailOwnerTableColumns {
  order: boolean;
  address: boolean;
  quantity: boolean;
  share: boolean;
}

export type PolicyDetailOwnerTableOptions = {
  columnsVisibility: PolicyDetailOwnerTableColumns;
  rows: number;
  columnsOrder: (keyof PolicyDetailOwnerTableColumns)[];
};

export interface AccountAnalyticsTopStakingTableColumns {
  order: boolean;
  account: boolean;
  live_stake: boolean;
  loyalty: boolean;
  pool_delegation: boolean;
  drep_delegation: boolean;
}

export interface AccountAnalyticsTopStakingTableOptions
  extends Pick<
    TableOptionsCore<AccountAnalyticsTopStakingTableColumns>,
    "isResponsive" | "rows"
  > {
  columnsVisibility: AccountAnalyticsTopStakingTableColumns;
  columnsOrder: (keyof AccountAnalyticsTopStakingTableColumns)[];
}

export interface AccountAnalyticsTopAddressesTableColumns {
  order: boolean;
  account: boolean;
  ada_balance: boolean;
  pool_delegation: boolean;
  drep_delegation: boolean;
  first_activity: boolean;
  last_activity: boolean;
}

export interface AccountAnalyticsTopAddressesTableOptions
  extends Pick<
    TableOptionsCore<AccountAnalyticsTopAddressesTableColumns>,
    "isResponsive" | "rows"
  > {
  columnsVisibility: AccountAnalyticsTopAddressesTableColumns;
  columnsOrder: (keyof AccountAnalyticsTopAddressesTableColumns)[];
}

export interface AdaPotsTableColumns {
  epoch: boolean;
  treasury: boolean;
  reserves: boolean;
  rewards: boolean;
  utxo: boolean;
  deposits: boolean;
  fees: boolean;
}

export interface AdaPotsOptions
  extends Pick<TableOptionsCore<AdaPotsTableColumns>, "rows"> {
  columnsVisibility: AdaPotsTableColumns;
  columnsOrder: (keyof AdaPotsTableColumns)[];
  epochsToShow: "all" | "100" | "50" | "25" | "10";
}

export interface DeFiOrderListColumns {
  date: boolean;
  tx: boolean;
  type: boolean;
  pair: boolean;
  token_amount: boolean;
  ada_amount: boolean;
  ada_price: boolean;
  status: boolean;
  maker: boolean;
  platform: boolean;
}

export interface MultiPoolDelegatorsColumns {
  payment_cred: boolean;
  stake: boolean;
  delegated_to: boolean;
}

export interface MultiPoolDelegatorsOptions {
  columnsVisibility: MultiPoolDelegatorsColumns;
  columnsOrder: (keyof MultiPoolDelegatorsColumns)[];
  isResponsive: boolean;
  rows: number;
}
