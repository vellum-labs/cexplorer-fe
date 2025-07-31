import type {
  MultiPoolDelegatorsColumns,
  MultiPoolDelegatorsOptions,
} from "@/types/tableTypes";
import { handlePersistStore } from "@/lib/handlePersistStore";

export const useMultiPoolDelegatorsTableStore = handlePersistStore<
  MultiPoolDelegatorsOptions,
  {
    setColumsOrder: (
      columnsOrder: (keyof MultiPoolDelegatorsColumns)[],
    ) => void;
    setColumnVisibility: (
      columnKey: keyof MultiPoolDelegatorsColumns,
      isVisible: boolean,
    ) => void;
    setRows: (rows: number) => void;
  }
>(
  "multi_pool_delegators_table_store",
  {
    columnsVisibility: {
      payment_cred: true,
      stake: true,
      delegated_to: true,
    },
    isResponsive: true,
    columnsOrder: ["payment_cred", "stake", "delegated_to"],
    rows: 20,
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
