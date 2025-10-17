import type { BasicTableOptions, PoolBlocksColumns } from "@/types/tableTypes";
import { handlePersistStore } from "@vellumlabs/cexplorer-sdk";

export const usePoolBlocksTableStore = handlePersistStore<
  BasicTableOptions<PoolBlocksColumns>,
  {
    setColumnVisibility: (columnKey: string, isVisible: boolean) => void;
    setRows: (rows: number) => void;
    setColumsOrder: (columnsOrder: (keyof PoolBlocksColumns)[]) => void;
  }
>(
  "pool_blocks_table_store",
  {
    columnsVisibility: {
      date: true,
      block_no: true,
      epoch_no: true,
      slot_no: true,
      tx_count: true,
      hash: true,
      size: true,
      protocol: true,
    },
    isResponsive: true,
    rows: 20,
    columnsOrder: [
      "date",
      "block_no",
      "epoch_no",
      "slot_no",
      "tx_count",
      "hash",
      "size",
      "protocol",
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
  }),
);
