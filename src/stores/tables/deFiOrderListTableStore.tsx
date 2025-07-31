import type {
  DeFiOrderListColumns,
  BasicTableOptions,
} from "@/types/tableTypes";

import { handlePersistStore } from "../../lib/handlePersistStore";

export const useDeFiOrderListTableStore = (key?: string) =>
  handlePersistStore<
    BasicTableOptions<DeFiOrderListColumns> & { currency: "usd" | "ada" },
    {
      setColumnVisibility: (columnKey: string, isVisible: boolean) => void;
      setIsResponsive: (isResponsive: boolean) => void;
      setRows: (rows: number) => void;
      setColumsOrder: (columnsOrder: (keyof DeFiOrderListColumns)[]) => void;
      setCurrency: (currency: "usd" | "ada") => void;
    }
  >(
    key ?? "defi_order_list_table_store",
    {
      columnsVisibility: {
        ada_amount: true,
        ada_price: true,
        date: true,
        maker: true,
        pair: true,
        platform: true,
        status: true,
        token_amount: true,
        tx: false,
        type: true,
      },
      isResponsive: true,
      rows: 20,
      columnsOrder: [
        "date",
        "tx",
        "type",
        "pair",
        "token_amount",
        "ada_amount",
        "ada_price",
        "status",
        "maker",
        "platform",
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
