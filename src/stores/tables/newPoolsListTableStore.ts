import type { BasicTableOptions, NewPoolsColumns } from "@/types/tableTypes";
import { handlePersistStore } from "@vellumlabs/cexplorer-sdk";

export const useNewPoolsListTableStore = handlePersistStore<
  BasicTableOptions<NewPoolsColumns>,
  {
    setColumnVisibility: (columnKey: string, isVisible: boolean) => void;
    setRows: (rows: number) => void;
    setColumsOrder: (columnsOrder: (keyof NewPoolsColumns)[]) => void;
  }
>(
  "new_pools_table_store",
  {
    columnsVisibility: {
      date: true,
      epoch: true,
      pool: true,
      fees: true,
      pledge: true,
      tx_hash: true,
    },
    isResponsive: true,
    rows: 20,
    columnsOrder: ["date", "pool", "epoch", "fees", "pledge", "tx_hash"],
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
