import type { MetadataTx } from "./assetsTypes";
import type { ResponseCore } from "./commonTypes";
import type { InlineDatum, Label } from "./txTypes";

export interface ScriptStatItem {
  item: {
    data: {
      redeemer: {
        sum: number;
        count: number;
        stake: number;
        redeemers: number;
      };
      tx_payment_cred: {
        out: {
          sum: number;
          count: number;
          stake: number;
          address: number;
        } | null;
        tx_mint: {
          count: number;
          amount: null;
          assets: number;
        } | null;
      } | null;
      tx_reference_script: null;
    };
    epoch_no: number;
  };
}

interface ScriptStatTotal {
  epochs: number;
  interactions: number;
  volume: number;
}

export interface ScriptDetailData {
  tx: MetadataTx;
  hash: string;
  json: null;
  type: string;
  label: Label;
  bytecode: string;
  serialised_size: number;
  purpose: {
    count: number;
    purpose: string;
  }[];
  stat: ScriptStatItem[];
  stat_total: ScriptStatTotal;
}

export type ScriptDetailResponse = ResponseCore<ScriptDetailData>;

export interface ScriptDetailRedeemerData {
  tx: MetadataTx & {
    out_sum: number;
  };
  fee: number;
  data: InlineDatum & { hash: string };
  purpose: string;
  unit_mem: number;
  unit_steps: number;
  epoch_param: {
    max_tx_ex_mem: number;
    max_tx_ex_steps: number;
  };
}

export type ScriptDetailRedeemerResponse = ResponseCore<{
  count: number;
  data: ScriptDetailRedeemerData[];
}>;

interface ScriptListStatItem {
  redeemer: {
    sum: number;
    count: number;
    stake: number;
    redeemers: number;
  };
  tx_payment_cred: {
    out: {
      sum: number;
      count: number;
      stake: number;
      address: number;
    };
    tx_mint: {
      count: number;
      amount: null | number;
      assets: number;
    };
  };
  tx_reference_script: null | any;
}

interface ScriptStat {
  recent: ScriptListStatItem;
  previous: ScriptListStatItem;
}

export interface ScriptListData {
  hash: string;
  type: string;
  serialised_size: number;
  is_live: boolean;
  stat: ScriptStat;
  label: Label;
}
interface ScriptList {
  count: number;
  data: ScriptListData[];
}

export type ScriptListResponse = ResponseCore<ScriptList>;
