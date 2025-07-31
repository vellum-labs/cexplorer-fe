import type { BlockBasicInfo } from "./blockTypes";
import type { ResponseCore } from "./commonTypes";
import type { TxBasicInfo } from "./txTypes";

export interface ContractInteractionsData {
  tx: Omit<TxBasicInfo, "block">;
  data: {
    purpose: string;
    unit_mem: number;
    data_hash: string | null;
    data_value: string | null;
    unit_steps: number;
    script_hash: string;
  };
  block: Omit<BlockBasicInfo, "slot_no">;
}

export type ContractInteractionsResponse = ResponseCore<{
  count: number;
  data: ContractInteractionsData[];
}>;
