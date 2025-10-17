import type {
  EpochBlockListColumns,
  EpochBlockListTableOptions,
} from "@/types/tableTypes";
import { handlePersistStore } from "@vellumlabs/cexplorer-sdk";

export const useEpochBlockListTableStore = handlePersistStore<
  EpochBlockListTableOptions,
  {
    setColumnVisibility: (columnKey: string, isVisible: boolean) => void;
    setIsResponsive: (isResponsive: boolean) => void;
    setRows: (rows: number) => void;
    setColumsOrder: (columnsOrder: (keyof EpochBlockListColumns)[]) => void;
  }
>(
  "epoch_block_list_table_store",
  {
    isResponsive: true,
    rows: 20,
    columnsVisibility: {
      block_no: true,
      date: true,
      minted_by: true,
      size: true,
      slot_no: true,
      tx_count: true,
    },
    columnsOrder: [
      "date",
      "block_no",
      "slot_no",
      "tx_count",
      "minted_by",
      "size",
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
