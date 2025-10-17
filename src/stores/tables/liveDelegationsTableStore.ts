import type {
  BasicTableOptions,
  LiveDelegationsColumns,
} from "@/types/tableTypes";
import { handlePersistStore } from "@vellumlabs/cexplorer-sdk";

export const useLiveDelegationsTableStore = handlePersistStore<
  BasicTableOptions<LiveDelegationsColumns>,
  {
    setColumnVisibility: (columnKey: string, isVisible: boolean) => void;
    setRows: (rows: number) => void;
    setColumsOrder: (columnsOrder: (keyof LiveDelegationsColumns)[]) => void;
  }
>(
  "live_delegations_table_store",
  {
    columnsVisibility: {
      date: true,
      epoch: true,
      address: true,
      amount: true,
      delegation: true,
      tx: true,
    },
    isResponsive: true,
    rows: 20,
    columnsOrder: ["date", "epoch", "address", "amount", "delegation", "tx"],
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
