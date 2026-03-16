import type { StablecoinSummaryColumns, StablecoinSummaryOptions } from "@/types/tableTypes";

import { handlePersistStore } from "@vellumlabs/cexplorer-sdk";

export const useStablecoinSummaryTableStore = handlePersistStore<
  StablecoinSummaryOptions,
  {
    setColumsOrder: (columnsOrder: (keyof StablecoinSummaryColumns)[]) => void;
    setColumnVisibility: (columnKey: string, isVisible: boolean) => void;
    setRows: (rows: number) => void;
  }
>(
  "stablecoin_summary_table_store",
  {
    columnsVisibility: {
      source: true,
      stablecoin: true,
      supply: true,
      dominance: true,
      last_mint: true,
    },
    isResponsive: true,
    columnsOrder: [
      "source",
      "stablecoin",
      "supply",
      "dominance",
      "last_mint",
    ],
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
