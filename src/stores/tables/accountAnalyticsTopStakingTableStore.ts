import type {
  AccountAnalyticsTopStakingTableColumns,
  AccountAnalyticsTopStakingTableOptions,
} from "@/types/tableTypes";

import { handlePersistStore } from "../../lib/handlePersistStore";

export const useAccountAnalyticsTableStore = handlePersistStore<
  AccountAnalyticsTopStakingTableOptions,
  {
    setColumnVisibility: (columnKey: string, isVisible: boolean) => void;
    setIsResponsive: (isResponsive: boolean) => void;
    setRows: (rows: number) => void;
    setColumsOrder: (
      columnsOrder: (keyof AccountAnalyticsTopStakingTableColumns)[],
    ) => void;
  }
>(
  "account_analytics_top_staking_table_store",
  {
    columnsVisibility: {
      account: true,
      pool_delegation: true,
      drep_delegation: true,
      live_stake: true,
      loyalty: true,
      order: true,
    },
    isResponsive: true,
    rows: 20,
    columnsOrder: [
      "order",
      "account",
      "live_stake",
      "loyalty",
      "pool_delegation",
      "drep_delegation",
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
