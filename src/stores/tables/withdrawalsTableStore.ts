import type { BasicTableOptions, WithdrawalsColumns } from "@/types/tableTypes";
import { handlePersistStore } from "../../lib/handlePersistStore";

export const useWithdrawalsTableStore = handlePersistStore<
  BasicTableOptions<WithdrawalsColumns>,
  {
    setColumnVisibility: (columnKey: string, isVisible: boolean) => void;
    setRows: (rows: number) => void;
    setColumsOrder: (columnsOrder: (keyof WithdrawalsColumns)[]) => void;
  }
>(
  "withdrawals_table_store",
  {
    columnsVisibility: {
      date: true,
      epoch: true,
      address: true,
      amount_controlled: true,
      amount_withdrawn: true,
      delegated_to: true,
      tx: true,
    },
    isResponsive: true,
    rows: 20,
    columnsOrder: [
      "date",
      "epoch",
      "address",
      "amount_controlled",
      "amount_withdrawn",
      "delegated_to",
      "tx",
    ],
  },
  set => ({
    setColumnVisibility: (columnKey, isVisible) =>
      set(state => {
        state.columnsVisibility[columnKey] = isVisible;
      }),
    setRows: rows =>
      set(state => {
        state.rows = rows;
      }),
    setColumsOrder: columnsOrder =>
      set(state => {
        state.columnsOrder = columnsOrder;
      }),
  }),
);
