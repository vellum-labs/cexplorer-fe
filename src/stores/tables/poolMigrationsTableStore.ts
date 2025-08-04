import type {
  BasicTableOptions,
  PoolDelegatorsColumns,
} from "@/types/tableTypes";
import { handlePersistStore } from "../../lib/handlePersistStore";

export const usePoolMigrationsTableStore = handlePersistStore<
  BasicTableOptions<PoolDelegatorsColumns>,
  {
    setColumnVisibility: (columnKey: string, isVisible: boolean) => void;
    setRows: (rows: number) => void;
    setColumsOrder: (columnsOrder: (keyof PoolDelegatorsColumns)[]) => void;
  }
>(
  "pool_migrations_table_store",
  {
    columnsVisibility: {
      date: true,
      active_in: true,
      address: true,
      amount: true,
      loyalty: true,
      registered: true,
      pool_delegation: true,
    },
    isResponsive: true,
    rows: 20,
    columnsOrder: [
      "date",
      "active_in",
      "address",
      "pool_delegation",
      "amount",
      "loyalty",
      "registered",
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
