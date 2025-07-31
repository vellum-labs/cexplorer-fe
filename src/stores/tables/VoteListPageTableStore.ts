import type {
  VoteListPageColumns,
  BasicTableOptions,
} from "@/types/tableTypes";

import { handlePersistStore } from "../../lib/handlePersistStore";

export const useVoteListPageTableStore = handlePersistStore<
  BasicTableOptions<VoteListPageColumns>,
  {
    setColumnVisibility: (columnKey: string, isVisible: boolean) => void;
    setIsResponsive: (isResponsive: boolean) => void;
    setRows: (rows: number) => void;
    setColumsOrder: (columnsOrder: (keyof VoteListPageColumns)[]) => void;
  }
>(
  "vote_list_page_table_store",
  {
    columnsVisibility: {
      date: true,
      gov_action: true,
      voter: true,
      voter_role: true,
      voting_power: true,
      vote: true,
      epoch: true,
      block: true,
      tx: true,
    },
    isResponsive: true,
    rows: 20,
    columnsOrder: [
      "date",
      "gov_action",
      "voter",
      "voter_role",
      "voting_power",
      "vote",
      "epoch",
      "block",
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
