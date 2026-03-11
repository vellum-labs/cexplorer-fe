import type {
  ProjectProductsTableColumns,
  ProjectProductsTableOptions,
} from "@/types/tableTypes";

import { handlePersistStore } from "@vellumlabs/cexplorer-sdk";

export const useProjectProductsTableStore = () =>
  handlePersistStore<
    ProjectProductsTableOptions,
    {
      setColumnVisibility: (columnKey: string, isVisible: boolean) => void;
      setRows: (rows: number) => void;
      setColumsOrder: (
        columnsOrder: (keyof ProjectProductsTableColumns)[],
      ) => void;
    }
  >(
    "project_products_table_store",
    {
      columnsVisibility: {
        product_name: true,
        website: true,
        app: true,
        docs: true,
        github: true,
      },
      rows: 10,
      columnsOrder: ["product_name", "website", "app", "docs", "github"],
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
