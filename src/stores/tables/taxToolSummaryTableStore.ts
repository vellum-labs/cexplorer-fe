import { handlePersistStore } from "@vellumlabs/cexplorer-sdk";

import type {
  BasicTableOptions,
  TaxToolSummaryColumns,
} from "@/types/tableTypes";

export const useTaxToolSummaryTableStore = handlePersistStore<
  BasicTableOptions<TaxToolSummaryColumns>,
  {
    setColumnVisibility: (
      columnKey: keyof TaxToolSummaryColumns,
      isVisible: boolean,
    ) => void;
    setRows: (rows: number) => void;
    setColumsOrder: (
      columnsOrder: (keyof TaxToolSummaryColumns)[],
    ) => void;
    setIsResponsive: (isResponsive: boolean) => void;
  }
>(
  "tax_tool_summary_table_store",
  {
    columnsVisibility: {
      period: true,
      epochs: true,
      rewards_ada: true,
      rewards_usd: true,
      rewards_secondary: true,
    },
    isResponsive: true,
    rows: 5,
    columnsOrder: [
      "period",
      "epochs",
      "rewards_ada",
      "rewards_usd",
      "rewards_secondary",
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
    setIsResponsive: isResponsive =>
      set(state => {
        state.isResponsive = isResponsive;
      }),
  }),
);
