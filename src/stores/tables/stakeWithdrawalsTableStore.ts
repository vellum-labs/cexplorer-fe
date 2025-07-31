import type {
  StakeWithdrawalsColumns,
  StakeWithdrawalsTableOptions,
} from "@/types/tableTypes";
import { handlePersistStore } from "../../lib/handlePersistStore";

export const useStakeWithdrawalsTableStore = handlePersistStore<
  StakeWithdrawalsTableOptions,
  {
    setColumnVisibility: (columnKey: string, isVisible: boolean) => void;
    setColumsOrder: (columnsOrder: (keyof StakeWithdrawalsColumns)[]) => void;
    setRows: (rows: number) => void;
  }
>(
  "stake_withdrawals_table_store",
  {
    columnsVisibility: {
      date: true,
      tx_hash: true,
      block: true,
      total_output: false,
      // real_output: true,
      amount: true,
      fee: true,
      size: true,
    },
    rows: 20,
    columnsOrder: [
      "date",
      "tx_hash",
      "block",
      "total_output",
      // "real_output",
      "amount",
      "fee",
      "size",
    ],
  },
  set => ({
    setColumnVisibility: (columnKey, isVisible) =>
      set(state => {
        state.columnsVisibility[columnKey] = isVisible;
      }),
    setColumsOrder: columnsOrder =>
      set(state => {
        state.columnsOrder = columnsOrder;
      }),
    setRows: rows =>
      set(state => {
        state.rows = rows;
      }),
  }),
);
