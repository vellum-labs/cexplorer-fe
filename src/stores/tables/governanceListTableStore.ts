import type {
  GovernanceListTableColumns,
  BasicTableOptions,
} from "@/types/tableTypes";

import { handlePersistStore } from "@vellumlabs/cexplorer-sdk";

export const useGovernanceListTableStore = handlePersistStore<
  BasicTableOptions<GovernanceListTableColumns>,
  {
    setColumnVisibility: (columnKey: string, isVisible: boolean) => void;
    setIsResponsive: (isResponsive: boolean) => void;
    setRows: (rows: number) => void;
    setColumsOrder: (
      columnsOrder: (keyof GovernanceListTableColumns)[],
    ) => void;
  }
>(
  "governance_list_table_store",
  {
    columnsVisibility: {
      start: true,
      type: true,
      gov_action_name: true,
      duration: true,
      end: true,
      status: true,
      progress: true,
      tx: true,
    },

    isResponsive: true,
    rows: 20,
    columnsOrder: [
      "start",
      "type",
      "gov_action_name",
      "duration",
      "end",
      "status",
      "progress",
      "tx",
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
