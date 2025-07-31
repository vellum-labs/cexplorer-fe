import type {
  TxListTableColumns,
  TxListTableOptions,
} from "@/types/tableTypes";

import { handlePersistStore } from "@/lib/handlePersistStore";

export const useTxListTableStore = (storeKey?: string) =>
  handlePersistStore<
    TxListTableOptions,
    {
      setColumnVisibility: (columnKey: string, isVisible: boolean) => void;
      setIsResponsive: (isResponsive: boolean) => void;
      setRows: (rows: number) => void;
      setColumsOrder: (columnsOrder: (keyof TxListTableColumns)[]) => void;
    }
  >(
    storeKey ?? "tx_list_table_store",
    {
      columnsVisibility: {
        date: true,
        hash: true,
        block: true,
        total_output: true,
        donation: false,
        fee: true,
        size: true,
        script_size: true,
      },
      isResponsive: true,
      rows: 20,
      columnsOrder: [
        "date",
        "hash",
        "block",
        "total_output",
        "donation",
        "fee",
        "size",
        "script_size",
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
