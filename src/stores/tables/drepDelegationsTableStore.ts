import type {
  BasicTableOptions,
  DrepDelegationsColumns,
} from "@/types/tableTypes";
import { handlePersistStore } from "../../lib/handlePersistStore";

export const useDrepDelegationsTableStore = handlePersistStore<
  BasicTableOptions<DrepDelegationsColumns>,
  {
    setColumnVisibility: (columnKey: string, isVisible: boolean) => void;
    setRows: (rows: number) => void;
    setColumsOrder: (columnsOrder: (keyof DrepDelegationsColumns)[]) => void;
  }
>(
  "drep_delegations_table_store",
  {
    columnsVisibility: {
      date: true,
      address: true,
      amount: true,
      delegation: true,
      tx: true,
    },
    isResponsive: true,
    rows: 20,
    columnsOrder: ["date", "address", "amount", "delegation", "tx"],
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