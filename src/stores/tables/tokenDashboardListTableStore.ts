import type {
  DeFiTokenTableColumns,
  BasicTableOptions,
} from "@/types/tableTypes";

import { handlePersistStore } from "../../lib/handlePersistStore";

export const useTokenDashboardListTableStore = handlePersistStore<
  BasicTableOptions<DeFiTokenTableColumns> & { currency: "usd" | "ada" },
  {
    setColumnVisibility: (columnKey: string, isVisible: boolean) => void;
    setIsResponsive: (isResponsive: boolean) => void;
    setRows: (rows: number) => void;
    setColumsOrder: (columnsOrder: (keyof DeFiTokenTableColumns)[]) => void;
    setCurrency: (currency: "usd" | "ada") => void;
  }
>(
  "token_dashboard_list_table_store",
  {
    columnsVisibility: {
      price: true,
      age: true,
      last_week: true,
      liquidity: true,
      order: true,
      token: true,
      volume: true,
      change_24h: true,
    },
    isResponsive: true,
    rows: 20,
    columnsOrder: [
      "order",
      "token",
      "price",
      "change_24h",
      "volume",
      "liquidity",
      "age",
      "last_week",
    ],
    currency: "ada",
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
    setCurrency: currency =>
      set(state => {
        state.currency = currency;
      }),
  }),
);
