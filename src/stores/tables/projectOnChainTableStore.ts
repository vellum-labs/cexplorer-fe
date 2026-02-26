import type {
  ProjectOnChainTableColumns,
  ProjectOnChainTableOptions,
} from "@/types/tableTypes";

import { handlePersistStore } from "@vellumlabs/cexplorer-sdk";

export const useProjectOnChainTableStore = () =>
  handlePersistStore<
    ProjectOnChainTableOptions,
    {
      setColumnVisibility: (columnKey: string, isVisible: boolean) => void;
      setRows: (rows: number) => void;
      setColumsOrder: (
        columnsOrder: (keyof ProjectOnChainTableColumns)[],
      ) => void;
    }
  >(
    "project_on_chain_table_store",
    {
      columnsVisibility: {
        type: true,
        name: true,
        description: true,
      },
      rows: 10,
      columnsOrder: ["type", "name", "description"],
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
