import type {
  ScriptListRanklistTableColumns,
  ScriptListRanklistTableOptions,
} from "@/types/tableTypes";

import { handlePersistStore } from "../../lib/handlePersistStore";

export const useScriptListRanklistTableStore = handlePersistStore<
  ScriptListRanklistTableOptions,
  {
    setColumnVisibility: (columnKey: string, isVisible: boolean) => void;
    setRows: (rows: number) => void;
    setColumsOrder: (
      columnsOrder: (keyof ScriptListRanklistTableColumns)[],
    ) => void;
  }
>(
  "script_list_ranklist_table_store",
  {
    columnsVisibility: {
      activity_change: true,
      category: true,
      dapp: true,
      epoch_volume: true,
      int_this_epoch: true,
      order: true,
      purpose: true,
      users: true,
    },
    rows: 20,
    columnsOrder: [
      "order",
      "purpose",
      "dapp",
      "category",
      "users",
      "int_this_epoch",
      "activity_change",
      "epoch_volume",
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
