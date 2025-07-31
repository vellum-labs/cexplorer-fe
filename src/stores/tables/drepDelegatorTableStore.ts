import type {
  DrepDelegatorTableColumns,
  DrepDelegatorTableOptions,
} from "@/types/tableTypes";

import { handlePersistStore } from "../../lib/handlePersistStore";

export const useDrepDelegatorTableStore = handlePersistStore<
  DrepDelegatorTableOptions,
  {
    setColumnVisibility: (columnKey: string, isVisible: boolean) => void;
    setRows: (rows: number) => void;
    setColumsOrder: (columnsOrder: (keyof DrepDelegatorTableColumns)[]) => void;
  }
>(
  "drep_delegator_table_store",
  {
    columnsVisibility: {
      active_in: true,
      amount: true,
      date: true,
      loyalty: true,
      stake: true,
      drep_delegation: true,
      tx: true,
    },
    rows: 20,
    columnsOrder: [
      "date",
      "active_in",
      "stake",
      "amount",
      "drep_delegation",
      "loyalty",
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
