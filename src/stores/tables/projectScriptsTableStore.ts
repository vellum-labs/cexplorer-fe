import type {
  ProjectScriptsTableColumns,
  ProjectScriptsTableOptions,
} from "@/types/tableTypes";

import { handlePersistStore } from "@vellumlabs/cexplorer-sdk";

export const useProjectScriptsTableStore = () =>
  handlePersistStore<
    ProjectScriptsTableOptions,
    {
      setColumnVisibility: (columnKey: string, isVisible: boolean) => void;
      setRows: (rows: number) => void;
      setColumsOrder: (
        columnsOrder: (keyof ProjectScriptsTableColumns)[],
      ) => void;
    }
  >(
    "project_scripts_table_store",
    {
      columnsVisibility: {
        script_name: true,
        description: true,
        script_id: true,
      },
      rows: 10,
      columnsOrder: ["script_name", "description", "script_id"],
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
