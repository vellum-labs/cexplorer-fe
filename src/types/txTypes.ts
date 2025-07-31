import type { AssetRegistry, TxAsset } from "./assetsTypes";
import type { BlockBasicInfo, Rate } from "./blockTypes";
import type { ResponseCore } from "./commonTypes";
import type { DrepProposal, DrepVoteItem } from "./drepTypes";
import type { EpochParam } from "./epochTypes";
import type { PoolInfo } from "./poolTypes";

export type TxTabItemKeys =
  | "overview"
  | "content"
  | "contracts"
  | "collateral"
  | "metadata"
  | "mint"
  | "withdrawals"
  | "inputs";

export interface TxDetailParams {
  block_no?: number;
  slot_no?: number;
  hash: string;
}

export interface TxListParams {
  limit?: number;
  offset?: number;
  hash?: string;
  script?: string;
  address?: string;
  stake?: string;
  asset?: string;
  has_donation?: 1 | undefined;
  policy?: string;
}

export interface TxMetadata {
  [key: string]: {
    [key: string]: string;
  };
}

export interface TxBasicInfo {
  block: BlockBasicInfo;
  fee: number;
  hash: string;
  size: number;
  deposit: number;
  out_sum: number;
  script_size: number;
  invalid_before: number;
  invalid_hereafter: number;
  valid_contract: boolean;
  treasury_donation: number;
}

export interface Withdrawal {
  amount: number;
  stake_addr: string;
}

export interface Mint {
  quantity: number;
  name: string;
  registry: AssetRegistry;
}

export interface Datum {
  hash: string;
  value: DatumValue;
}

export interface TxInput {
  datum: Datum;
  redeemer: {
    fee: number;
    unit: {
      mem: number;
      steps: number;
    };
    datum: Datum;
    purpose: string;
  };
}

export interface Label {
  data: {
    scriptHash: string;
    contractAddress: string;
  };
  extra: {
    bg: string | null;
    fw: number | null;
    link: string | null;
    color: string | null;
  };
  label: string;
  source: string;
  category: string[];
}

export interface PlutusContract {
  size: number;
  input: TxInput;
  output: Datum;
  address: string;
  bytecode: string;
  script_hash: string;
  type: string;
  valid_contract: unknown[];
  label: Label;
}

interface Delegation {
  type: string;
  view: string;
  detail: PoolInfo;
  stake: {
    live: number;
    active: number;
  };
}

export type TxDetailData = TxBasicInfo & {
  epoch_param: EpochParam;
  all_inputs: TxInfo[] | null;
  all_outputs: TxInfo[] | null;
  all_collateral_outputs: TxInfo[] | null;
  all_withdrawals: Withdrawal[] | null;
  collateral_inputs: TxInfo[] | null;
  reference_inputs: TxInfo[] | null;
  metadata: TxMetadata;
  mints: Mint[];
  defi?: any[];
  plutus_contracts: PlutusContract[];
  pool: PoolInfo;
  rate: Rate;
  delegation: Delegation[];
  governance: {
    voting_procedure: {
      info: {
        id: string;
        meta: any;
        power: {
          stake: number;
          represented_by: number;
        };
      };
      vote: string;
      proposal: DrepProposal;
      voter_role: DrepVoteItem["voter_role"];
    }[];
  } | null;
};

export interface TxDetailResponse {
  code: number;
  tokens: number;
  data: TxDetailData;
}

export interface DatumValue {
  fields: unknown[];
  constructor: number | null;
}

export interface InlineDatum {
  bytes: string;
  value: {
    fields: unknown[];
    constructor: number | null;
  };
}

export interface TxInfo {
  value: number;
  tx_id: number;
  tx_hash: string;
  tx_index: number;
  asset: TxAsset[] | null;
  datum_hash: null | string;
  stake_addr: string;
  inline_datum: InlineDatum | null;
  reference_script: ReferenceScript | null;
  payment_addr_cred: string;
  payment_addr_bech32: string;
  consumed_utxo?: string | null;
}

export interface ReferenceScript {
  hash: string;
  size: number;
  type: string;
  bytes: string;
  value: string | null;
}

interface TxListData {
  count: number;
  data: TxBasicInfo[];
}

export type TxListResponse = ResponseCore<TxListData>;
