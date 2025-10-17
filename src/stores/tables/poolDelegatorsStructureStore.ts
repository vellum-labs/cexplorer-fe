import type {
  BasicTableOptions,
  PoolStructureColumns,
} from "@/types/tableTypes";

import { handlePersistStore } from "@vellumlabs/cexplorer-sdk";

export const usePoolDelegatorsStructureStore = handlePersistStore<
  BasicTableOptions<PoolStructureColumns>,
  {
    setColumnVisibility: (columnKey: string, isVisible: boolean) => void;
    setRows: (rows: number) => void;
    setColumsOrder: (columnsOrder: (keyof PoolStructureColumns)[]) => void;
  }
>(
  "pool_structure_table_store",
  {
    columnsVisibility: {
      wallet_size: true,
      amount: true,
      amount_pie: true,
      holdings: true,
      holdings_pie: true,
    },
    isResponsive: true,
    rows: 20,
    columnsOrder: [
      "wallet_size",
      "amount",
      "amount_pie",
      "holdings",
      "holdings_pie",
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
