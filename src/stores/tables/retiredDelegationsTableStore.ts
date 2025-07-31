import type {
  BasicTableOptions,
  RetiredDelegationsColumns,
} from "@/types/tableTypes";
import { handlePersistStore } from "../../lib/handlePersistStore";

export const useRetiredDelegationsTableStore = handlePersistStore<
  BasicTableOptions<RetiredDelegationsColumns>,
  {
    setColumnVisibility: (columnKey: string, isVisible: boolean) => void;
    setRows: (rows: number) => void;
    setColumsOrder: (columnsOrder: (keyof RetiredDelegationsColumns)[]) => void;
  }
>(
  "retired_delegations_table_store",
  {
    columnsVisibility: {
      index: true,
      pool: true,
      epoch: true,
      stake: true,
      delegators: true,
      longevity: true,
    },
    isResponsive: true,
    rows: 20,
    columnsOrder: [
      "index",
      "pool",
      "epoch",
      "stake",
      "delegators",
      "longevity",
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
