import type {
  BasicTableOptions,
  NetworkTPSTableColumns,
} from "@/types/tableTypes";

import { handlePersistStore } from "@vellumlabs/cexplorer-sdk";

export const useNetworkTPSTableStore = handlePersistStore<
  BasicTableOptions<NetworkTPSTableColumns>,
  {
    setColumnVisibility: (columnKey: string, isVisible: boolean) => void;
    setRows: (rows: number) => void;
    setColumsOrder: (columnsOrder: (keyof NetworkTPSTableColumns)[]) => void;
  }
>(
  "network_tps_table_store",
  {
    columnsVisibility: {
      max_tps: true,
      timeframe: true,
      tps: true,
      transactions: true,
    },
    isResponsive: true,
    rows: 20,
    columnsOrder: ["timeframe", "transactions", "tps", "max_tps"],
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
