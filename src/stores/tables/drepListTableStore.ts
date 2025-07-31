import type {
  DrepListTableColumns,
  DrepListTableOptions,
} from "@/types/tableTypes";

import { handlePersistStore } from "../../lib/handlePersistStore";

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
        drep_name: true,
        metadata: true,
        registered: true,
        status: true,
        voting_activity: true,
        voting_power: true,
        owner_stake: true,
        average_stake: true,
        delegators: true,
        selected_vote: false,
        spo: false,
        top_delegator: true,
      },
      isResponsive: true,
      rows: 20,
      columnsOrder: [
        "status",
        "drep_name",
        "voting_power",
        "voting_activity",
        "owner_stake",
        "average_stake",
        "registered",
        "delegators",
        "selected_vote",
        "top_delegator",
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
