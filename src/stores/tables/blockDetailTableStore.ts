import type {
  BlockDetailColumns,
  BlockDetailTableOptions,
} from "@/types/tableTypes";
import { handlePersistStore } from "@/lib/handlePersistStore";

export const useBlockDetailTableStore = handlePersistStore<
  BlockDetailTableOptions,
  {
    setColumnVisibility: (columnKey: string, isVisible: boolean) => void;
    setIsResponsive: (isResponsive: boolean) => void;
    setRows: (rows: number) => void;
    setColumsOrder: (columnsOrder: (keyof BlockDetailColumns)[]) => void;
  }
>(
  "block_detail_table_store",
  {
    columnsVisibility: {
      date: false,
      block: false,
      fee: true,
      hash: true,
      size: true,
      total_ouput: true,
      utxo: true,
    },
    isResponsive: true,
    rows: 20,
    columnsOrder: ["date"],
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
