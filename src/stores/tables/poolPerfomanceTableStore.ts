import type {
  BasicTableOptions,
  PoolPefomanceColumns,
} from "@/types/tableTypes";
import { handlePersistStore } from "@vellumlabs/cexplorer-sdk";

export const usePoolPerfomanceTableStore = handlePersistStore<
  BasicTableOptions<PoolPefomanceColumns>,
  {
    setColumnVisibility: (columnKey: string, isVisible: boolean) => void;
    setRows: (rows: number) => void;
    setColumsOrder: (columnsOrder: (keyof PoolPefomanceColumns)[]) => void;
  }
>(
  "pool_perfomance_table_store",
  {
    columnsVisibility: {
      active_stake: true,
      blocks: true,
      date_end: true,
      date_start: true,
      delegators: true,
      epoch: true,
      luck: true,
      pledged: true,
      roa: true,
    },
    isResponsive: true,
    rows: 20,
    columnsOrder: [
      "epoch",
      "date_start",
      "date_end",
      "active_stake",
      "blocks",
      "delegators",
      "luck",
      "pledged",
      "roa",
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
