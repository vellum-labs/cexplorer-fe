import type {
  ScriptListInteractionsTableColumns,
  ScriptListInteractionsTableOptions,
} from "@/types/tableTypes";

import { handlePersistStore } from "@vellumlabs/cexplorer-sdk";

export const useScriptListInteractionsTableStore = handlePersistStore<
  ScriptListInteractionsTableOptions,
  {
    setColumnVisibility: (columnKey: string, isVisible: boolean) => void;
    setRows: (rows: number) => void;
    setColumsOrder: (
      columnsOrder: (keyof ScriptListInteractionsTableColumns)[],
    ) => void;
  }
>(
  "script_list_interactions_table_store",
  {
    columnsVisibility: {
      cpu_steps: true,
      dapp: true,
      date: true,
      fee: true,
      memory_used: true,
      output: true,
      purpose: true,
      tx_hash: true,
    },
    rows: 20,
    columnsOrder: [
      "date",
      "dapp",
      "tx_hash",
      "output",
      "fee",
      "memory_used",
      "cpu_steps",
      "purpose",
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
