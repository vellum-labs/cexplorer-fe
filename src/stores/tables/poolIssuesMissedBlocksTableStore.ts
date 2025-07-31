import type {
  PoolBlockTableColumns,
  PoolBlockTableOptions,
} from "@/types/tableTypes";
import { handlePersistStore } from "../../lib/handlePersistStore";

export const usePoolsIssuesMissedBlocksTableStore = handlePersistStore<
  PoolBlockTableOptions,
  {
    setColumnVisibility: (columnKey: string, isVisible: boolean) => void;
    setIsResponsive: (isResponsive: boolean) => void;
    setRows: (rows: number) => void;
    setColumsOrder: (columnsOrder: (keyof PoolBlockTableColumns)[]) => void;
  }
>(
  "pools_issues_missed_blocks_table_store",
  {
    columnsVisibility: {
      pool: true,
      luck: true,
      minted_blocks: true,
      estimated_blocks: true,
    },
    isResponsive: true,
    rows: 20,
    columnsOrder: ["pool", "luck", "minted_blocks", "estimated_blocks"],
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
