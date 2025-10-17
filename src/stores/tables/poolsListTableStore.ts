import type {
  PoolsListColumns,
  PoolsListTableOptions,
} from "@/types/tableTypes";
import { handlePersistStore } from "@vellumlabs/cexplorer-sdk";

export const usePoolsListTableStore = (storeKey?: string) =>
  handlePersistStore<
    PoolsListTableOptions,
    {
      setColumnVisibility: (columnKey: string, isVisible: boolean) => void;
      setIsResponsive: (isResponsive: boolean) => void;
      setRows: (rows: number) => void;
      setColumsOrder: (columnsOrder: (keyof PoolsListColumns)[]) => void;
    }
  >(
    storeKey ?? "pools_list_table_store",
    {
      columnsVisibility: {
        blocks: true,
        fees: true,
        luck: true,
        ranking: true,
        pledge: true,
        pool: true,
        rewards: true,
        stake: true,
        avg_stake: false,
        delegators: false,
        selected_vote: false,
        top_delegator: true,
        drep: false,
        pledge_leverage: false,
      },
      isResponsive: true,
      rows: 20,
      columnsOrder: [
        "ranking",
        "pool",
        "stake",
        "rewards",
        "luck",
        "fees",
        "top_delegator",
        "blocks",
        "avg_stake",
        "delegators",
        "selected_vote",
        "drep",
        "pledge_leverage",
        "pledge",
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
