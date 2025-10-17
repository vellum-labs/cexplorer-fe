import type { BasicTableOptions, PoolRewardsColumns } from "@/types/tableTypes";
import { handlePersistStore } from "@vellumlabs/cexplorer-sdk";

export const usePoolRewardsTableStore = handlePersistStore<
  BasicTableOptions<PoolRewardsColumns>,
  {
    setColumnVisibility: (columnKey: string, isVisible: boolean) => void;
    setRows: (rows: number) => void;
    setColumsOrder: (columnsOrder: (keyof PoolRewardsColumns)[]) => void;
  }
>(
  "pool_rewards_table_store",
  {
    columnsVisibility: {
      epoch: true,
      rewards: true,
      active_stake: true,
      epoch_stake: true,
      roa: true,
      luck: true,
      blocks: true,
      delegators: true,
    },
    isResponsive: true,
    rows: 20,
    columnsOrder: [
      "epoch",
      "rewards",
      "active_stake",
      "epoch_stake",
      "roa",
      "luck",
      "blocks",
      "delegators",
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
