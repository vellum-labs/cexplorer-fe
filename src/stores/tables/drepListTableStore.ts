import type {
  DrepListTableColumns,
  DrepListTableOptions,
} from "@/types/tableTypes";

import { handlePersistStore } from "@vellumlabs/cexplorer-sdk";

export const useDrepListTableStore = (storeKey?: string) =>
  handlePersistStore<
    DrepListTableOptions,
    {
      setColumnVisibility: (columnKey: string, isVisible: boolean) => void;
      setIsResponsive: (isResponsive: boolean) => void;
      setRows: (rows: number) => void;
      setColumsOrder: (columnsOrder: (keyof DrepListTableColumns)[]) => void;
    }
  >(
    storeKey ?? "drep_list_table_store",
    {
      columnsVisibility: {
        ranking: true,
        drep_name: true,
        metadata: false,
        registered: true,
        status: true,
        voting_activity: false,
        recent_activity: true,
        voting_power: true,
        owner_stake: false,
        average_stake: true,
        delegators: true,
        selected_vote: false,
        spo: false,
        top_delegator: true,
      },
      isResponsive: true,
      rows: 20,
      columnsOrder: [
        "ranking",
        "status",
        "drep_name",
        "voting_power",
        "recent_activity",
        "average_stake",
        "delegators",
        "top_delegator",
        "registered",
        "voting_activity",
        "owner_stake",
        "selected_vote",
        "metadata",
        "spo",
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
