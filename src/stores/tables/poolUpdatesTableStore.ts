import type {
  PoolUpdatesColumns,
  PoolUpdatesTableOptions,
} from "@/types/tableTypes";

import { handlePersistStore } from "../../lib/handlePersistStore";

export const usePoolUpdatesTableStore = handlePersistStore<
  PoolUpdatesTableOptions,
  {
    setColumnVisibility: (columnKey: string, isVisible: boolean) => void;
    setIsResponsive: (isResponsive: boolean) => void;
    setRows: (rows: number) => void;
    setColumsOrder: (columnsOrder: (keyof PoolUpdatesColumns)[]) => void;
  }
>(
  "pool_updates_table_store",
  {
    columnsVisibility: {
      active_stake: true,
      certificate: true,
      date: true,
      epoch: true,
      fees: true,
      pledge: true,
      pool: true,
      tx_hash: true,
    },
    isResponsive: true,
    rows: 20,
    columnsOrder: [
      "date",
      "epoch",
      "pool",
      "active_stake",
      "fees",
      "pledge",
      "tx_hash",
      "certificate",
    ],
  },
  set => ({
    setColumnVisibility: (columnKey, isVisible) =>
      set(state => {
        state.columnsVisibility[columnKey] = isVisible;
      }),
    setIsResponsive: isResponsive =>
      set(state => {
        state.isResponsive = isResponsive;
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
