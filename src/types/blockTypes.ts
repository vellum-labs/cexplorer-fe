import type { EpochParam } from "./epochTypes";
import type { PoolInfo } from "./poolTypes";
import type { TxBasicInfo, TxInfo, Withdrawal } from "./txTypes";

export type BlocksListResponse = {
  code: number;
  data: {
    count: number;
    data: (Block & {
      pool: PoolInfo;
      epoch_param: {
        max_block_size: number;
        protocol_major: number;
        protocol_minor: number;
        max_block_ex_mem: number;
        max_block_ex_steps: number;
      };
    })[];
  };
};

export interface BlockDetailParams {
  block_no?: number;
  slot_no?: number;
  hash: string;
}

interface BlockDetailResponseDataTxsItemMints {
  quantity: number;
  policy_id: string;
  asset_name: string;
  fingerprint: string;
}

interface BlockDetailResponseDataTxsItemMetaDataItemNft {
  [key: string]: {
    name: string;
    image: string;
  };
}

interface BlockDetailResponseDataTxsItemMetaDataItem {
  [key: string]: BlockDetailResponseDataTxsItemMetaDataItemNft;
}

interface BlockDetailResponseDataTxsItemMetaData {
  [key: number]: BlockDetailResponseDataTxsItemMetaDataItem;
}

interface BlockDetailResponseDataTxsItemRateCurrency {
  close: number;
  high: number;
  low: number;
  market_cap: number;
  open: number;
  time_close: string;
  time_open: string;
  volume: number;
}

interface BlockDetailResponseDataTxsItemRateFiat {
  [key: string]: [currency: number, ada: number];
}

export interface Rate {
  ada: BlockDetailResponseDataTxsItemRateCurrency[];
  btc: BlockDetailResponseDataTxsItemRateCurrency[];
  date: string;
  epoch_no: number;
  fiat: BlockDetailResponseDataTxsItemRateFiat;
  need_fix: string;
}

export interface BlockDetailResponseDataTxsItem extends TxBasicInfo {
  pool: PoolInfo;
  collateral_inputs: TxInfo[] | null;
  reference_inputs: TxInfo[] | null;
  all_inputs: TxInfo[];
  all_collateral_outputs: null;
  all_outputs: TxInfo[];
  all_withdrawals: Withdrawal[] | null;
  mints: BlockDetailResponseDataTxsItemMints[];
  metadata: BlockDetailResponseDataTxsItemMetaData;
  scripts: null;
  plutus_contracts: null;
  epoch_param: EpochParam;
}

export interface BlockBasicInfo {
  no: number;
  hash: string;
  time: string;
  epoch_no: number;
  slot_no: number;
}

export interface Block {
  block_no: number;
  time: string;
  hash: string;
  epoch_no: number;
  slot_no: number;
  epoch_slot_no: number;
  size: number;
  proto_minor: number;
  proto_major: number;
  op_cert_counter: number;
  vrf_key: string;
  tx_count: number;
}

export interface BlockDetailResponseData extends Block {
  pool: PoolInfo;
  epoch_param: EpochParam;
  txs: BlockDetailResponseDataTxsItem[];
  rewards: number;
  tokens: number;
  ex: number;
  debug: boolean;
}

export interface BlockDetailResponse {
  code: number;
  data: BlockDetailResponseData;
}
