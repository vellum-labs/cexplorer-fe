import type {
  PoolBirthdaysColumns,
  PoolBirthdaysTableOptions,
} from "@/types/tableTypes";

import { handlePersistStore } from "@vellumlabs/cexplorer-sdk";

export const usePoolBirthdaysTableStore = handlePersistStore<
  PoolBirthdaysTableOptions,
  {
    setColumnVisibility: (columnKey: string, isVisible: boolean) => void;
    setIsResponsive: (isResponsive: boolean) => void;
    setRows: (rows: number) => void;
    setColumsOrder: (columnsOrder: (keyof PoolBirthdaysColumns)[]) => void;
  }
>(
  "pool_birthdays_table_store",
  {
    columnsVisibility: {
      active_stake: true,
      birthday: true,
      date: true,
      pool: true,
      registered: true,
      delegators: true,
    },
    isResponsive: true,
    rows: 20,
    columnsOrder: [
      "date",
      "pool",
      "birthday",
      "registered",
      "delegators",
      "active_stake",
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
