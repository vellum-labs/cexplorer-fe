import type {
  TreasuryWithdrawalsTableColumns,
  BasicTableOptions,
} from "@/types/tableTypes";

import { handlePersistStore } from "@vellumlabs/cexplorer-sdk";

export const useTreasuryWithdrawalsTableStore = handlePersistStore<
  BasicTableOptions<TreasuryWithdrawalsTableColumns>,
  {
    setColumnVisibility: (columnKey: string, isVisible: boolean) => void;
    setIsResponsive: (isResponsive: boolean) => void;
    setRows: (rows: number) => void;
    setColumnsOrder: (
      columnsOrder: (keyof TreasuryWithdrawalsTableColumns)[],
    ) => void;
  }
>(
  "treasury_withdrawals_table_store",
  {
    columnsVisibility: {
      start: true,
      type: true,
      gov_action_name: true,
      amount: true,
      status: true,
      progress: true,
      tx: true,
    },

    isResponsive: true,
    rows: 20,
    columnsOrder: [
      "start",
      "type",
      "gov_action_name",
      "amount",
      "status",
      "progress",
      "tx",
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
    setColumnsOrder: columnsOrder =>
      set(state => {
        state.columnsOrder = columnsOrder;
      }),
  }),
);
