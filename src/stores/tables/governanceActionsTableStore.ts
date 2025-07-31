import type {
  GovernanceActionsTableColumns,
  GovernanceActionsTableOptions,
} from "@/types/tableTypes";

import { handlePersistStore } from "@/lib/handlePersistStore";

export const useGovernanceActionsTableStore = handlePersistStore<
  GovernanceActionsTableOptions,
  {
    setColumnVisibility: (columnKey: string, isVisible: boolean) => void;
    setRows: (rows: number) => void;
    setColumsOrder: (
      columnsOrder: (keyof GovernanceActionsTableColumns)[],
    ) => void;
  }
>(
  "governance_actions_table_store",
  {
    columnsVisibility: {
      date: true,
      drep: true,
      governance_action_name: true,
      tx: true,
      type: true,
      proposal_name: true,
      vote: true,
      voting_power: true,
    },
    rows: 20,
    columnsOrder: [
      "date",
      "type",
      "proposal_name",
      "drep",
      "governance_action_name",
      "vote",
      "voting_power",
      "tx",
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
