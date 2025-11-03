import { handlePersistStore } from "@vellumlabs/cexplorer-sdk";

import type {
  BasicTableOptions,
  TaxToolWithdrawalsColumns,
} from "@/types/tableTypes";

export const useTaxToolWithdrawalsTableStore = handlePersistStore<
  BasicTableOptions<TaxToolWithdrawalsColumns>,
  {
    setColumnVisibility: (
      columnKey: keyof TaxToolWithdrawalsColumns,
      isVisible: boolean,
    ) => void;
    setRows: (rows: number) => void;
    setColumsOrder: (
      columnsOrder: (keyof TaxToolWithdrawalsColumns)[],
    ) => void;
    setIsResponsive: (isResponsive: boolean) => void;
  }
>(
  "tax_tool_withdrawals_table_store",
  {
    columnsVisibility: {
      timestamp: true,
      transaction: true,
      rewards_ada: true,
      rewards_usd: true,
      rewards_secondary: true,
      ada_usd_rate: true,
      ada_secondary_rate: true,
    },
    isResponsive: true,
    rows: 20,
    columnsOrder: [
      "timestamp",
      "transaction",
      "rewards_ada",
      "rewards_usd",
      "rewards_secondary",
      "ada_usd_rate",
      "ada_secondary_rate",
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
