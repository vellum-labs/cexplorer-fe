import { handlePersistStore } from "@vellumlabs/cexplorer-sdk";
import type { TableOptionsCore } from "@/types/tableTypes";

export interface RecentVotesColumns {
  index: boolean;
  proposal: boolean;
  cc_member: boolean;
  vote: boolean;
  tx: boolean;
  time: boolean;
  governance_action_name: boolean;
}

export const useRecentVotesTableStore = (storeKey?: string) =>
  handlePersistStore<
    TableOptionsCore<RecentVotesColumns>,
    {
      setColumnVisibility: (
        columnKey: keyof RecentVotesColumns,
        isVisible: boolean,
      ) => void;
      setIsResponsive: (isResponsive: boolean) => void;
      setRows: (rows: number) => void;
      setColumsOrder: (columnsOrder: (keyof RecentVotesColumns)[]) => void;
    }
  >(
    storeKey ?? "recent_votes_table_store",
    {
      columnsVisibility: {
        index: true,
        proposal: true,
        cc_member: true,
        vote: true,
        tx: true,
        time: true,
        governance_action_name: true,
      },
      isResponsive: true,
      rows: 10,
      columnsOrder: [
        "index",
        "proposal",
        "governance_action_name",
        "cc_member",
        "vote",
        "tx",
        "time",
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
