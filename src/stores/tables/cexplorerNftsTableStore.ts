import {
  CexplorerNftsColumns,
  CexplorerNftsTableOptions,
} from "@/types/tableTypes";
import { handlePersistStore } from "@vellumlabs/cexplorer-sdk";

export const useCexplorerNftsTableStore = handlePersistStore<
  CexplorerNftsTableOptions,
  {
    setColumnVisibility: (columnKey: string, isVisible: boolean) => void;
    setRows: (rows: number) => void;
    setColumsOrder: (columnsOrder: (keyof CexplorerNftsColumns)[]) => void;
  }
>(
  "cexplorer_nfts_table_store",
  {
    columnsVisibility: {
      star: true,
      index: true,
      nft: true,
      type: true,
      power: true,
      modify: true,
    },
    rows: 20,
    columnsOrder: ["star", "index", "nft", "type", "power", "modify"],
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
