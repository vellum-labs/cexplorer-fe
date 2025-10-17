import type {
  HardforkTableOptions,
  HardforkTableColumns,
} from "@/types/tableTypes";

import { handlePersistStore } from "@vellumlabs/cexplorer-sdk";

export const useHardforkTableStore = handlePersistStore<
  HardforkTableOptions,
  {
    setIsResponsive: (isResponsive: boolean) => void;
    setRows: (rows: number) => void;
    setColumsOrder: (columnsOrder: (keyof HardforkTableColumns)[]) => void;
  }
>(
  "hardfork_table_store",
  {
    rows: 20,
    isResponsive: true,
    columnsOrder: ["exchanges", "liquidity", "status", "last_updated"],
  },
  set => ({
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
