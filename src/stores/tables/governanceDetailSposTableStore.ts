import type {
  GovernanceActionDetailAboutListColumns,
  BasicTableOptions,
} from "@/types/tableTypes";

import { handlePersistStore } from "../../lib/handlePersistStore";

export const useGovActionDetailSposTableStore = handlePersistStore<
  BasicTableOptions<GovernanceActionDetailAboutListColumns>,
  {
    setColumnVisibility: (columnKey: string, isVisible: boolean) => void;
    setIsResponsive: (isResponsive: boolean) => void;
    setRows: (rows: number) => void;
    setColumsOrder: (
      columnsOrder: (keyof GovernanceActionDetailAboutListColumns)[],
    ) => void;
  }
>(
  "governance_action_detail_spos_table_store",
  {
    columnsVisibility: {
      date: true,
      block: true,
      epoch: true,
      tx: true,
      vote: true,
      voter: true,
      voter_role: true,
      voting_power: true,
      delegators: true,
    },
    isResponsive: true,
    rows: 20,
    columnsOrder: [
      "date",
      "voter",
      "voter_role",
      "voting_power",
      "vote",
      "epoch",
      "block",
      "tx",
      "delegators",
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
