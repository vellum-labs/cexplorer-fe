import { handlePersistStore } from "@vellumlabs/cexplorer-sdk";

export interface BookmarksTableColumns {
  type: boolean;
  my_name: boolean;
  url: boolean;
}

interface BookmarksTableOptions {
  columnsVisibility: BookmarksTableColumns;
  rows: number;
  columnsOrder: (keyof BookmarksTableColumns)[];
}

export const useBookmarksTableStore = handlePersistStore<
  BookmarksTableOptions,
  {
    setColumnVisibility: (columnKey: string, isVisible: boolean) => void;
    setRows: (rows: number) => void;
    setColumnsOrder: (columnsOrder: (keyof BookmarksTableColumns)[]) => void;
  }
>(
  "bookmarks_table_store",
  {
    columnsVisibility: {
      type: true,
      my_name: true,
      url: true,
    },
    rows: 20,
    columnsOrder: ["type", "my_name", "url"],
  },
  set => ({
    setColumnVisibility: (columnKey, isVisible) =>
      set(state => {
        state.columnsVisibility[columnKey as keyof BookmarksTableColumns] =
          isVisible;
      }),
    setRows: rows =>
      set(state => {
        state.rows = rows;
      }),
    setColumnsOrder: columnsOrder =>
      set(state => {
        state.columnsOrder = columnsOrder;
      }),
  }),
);
