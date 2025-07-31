import type {
  AccountAnalyticsTopAddressesTableColumns,
  AccountAnalyticsTopAddressesTableOptions,
} from "@/types/tableTypes";

import { handlePersistStore } from "../../lib/handlePersistStore";

export const useAccountTopAddressesTableStore = handlePersistStore<
  AccountAnalyticsTopAddressesTableOptions,
  {
    setColumnVisibility: (columnKey: string, isVisible: boolean) => void;
    setIsResponsive: (isResponsive: boolean) => void;
    setRows: (rows: number) => void;
    setColumsOrder: (
      columnsOrder: (keyof AccountAnalyticsTopAddressesTableColumns)[],
    ) => void;
  }
>(
  "account_analytics_top_addresses",
  {
    columnsVisibility: {
      account: true,
      ada_balance: true,
      pool_delegation: true,
      drep_delegation: true,
      first_activity: true,
      last_activity: true,
      order: true,
    },
    isResponsive: true,
    rows: 20,
    columnsOrder: [
      "order",
      "account",
      "ada_balance",
      "pool_delegation",
      "drep_delegation",
      "first_activity",
      "last_activity",
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
