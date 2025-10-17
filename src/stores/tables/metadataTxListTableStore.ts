import type {
  MetadataTxListTableColumns,
  MetadataTxListTableOptions,
} from "@/types/tableTypes";

import { handlePersistStore } from "@vellumlabs/cexplorer-sdk";

export const useMetadataTxListTableStore = handlePersistStore<
  MetadataTxListTableOptions,
  {
    setColumnVisibility: (columnKey: string, isVisible: boolean) => void;
    setIsResponsive: (isResponsive: boolean) => void;
    setRows: (rows: number) => void;
    setColumsOrder: (
      columnsOrder: (keyof MetadataTxListTableColumns)[],
    ) => void;
  }
>(
  "metadata_tx_list_table_store",
  {
    columnsVisibility: {
      date: true,
      key: true,
      hash: true,
      size: true,
      md: true,
    },
    isResponsive: true,
    rows: 20,
    columnsOrder: ["date", "key", "hash", "size", "md"],
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
