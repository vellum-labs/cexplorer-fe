import { handlePersistStore } from "@vellumlabs/cexplorer-sdk";

import type {
  BasicTableOptions,
  TaxToolEpochRewardsColumns,
} from "@/types/tableTypes";

interface SummaryData {
  period: string;
  epochs: number;
  ada: number;
  usd: number;
  secondary: number;
}

export const useTaxToolEpochRewardsTableStore = handlePersistStore<
  BasicTableOptions<TaxToolEpochRewardsColumns> & {
    cachedSummary: SummaryData[];
    lastStakeKey: string;
  },
  {
    setColumnVisibility: (
      columnKey: keyof TaxToolEpochRewardsColumns,
      isVisible: boolean,
    ) => void;
    setRows: (rows: number) => void;
    setColumsOrder: (
      columnsOrder: (keyof TaxToolEpochRewardsColumns)[],
    ) => void;
    setIsResponsive: (isResponsive: boolean) => void;
    setCachedSummary: (summary: SummaryData[]) => void;
    setLastStakeKey: (stakeKey: string) => void;
  }
>(
  "tax_tool_epoch_rewards_table_store",
  {
    columnsVisibility: {
      epoch: true,
      end_time: true,
      type: true,
      rewards_ada: true,
      rewards_usd: true,
      rewards_secondary: true,
      ada_usd_rate: true,
      ada_secondary_rate: true,
    },
    isResponsive: true,
    rows: 20,
    columnsOrder: [
      "epoch",
      "end_time",
      "type",
      "rewards_ada",
      "rewards_usd",
      "rewards_secondary",
      "ada_usd_rate",
      "ada_secondary_rate",
    ],
    cachedSummary: [],
    lastStakeKey: "",
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
    setIsResponsive: isResponsive =>
      set(state => {
        state.isResponsive = isResponsive;
      }),
    setCachedSummary: summary =>
      set(state => {
        state.cachedSummary = summary;
      }),
    setLastStakeKey: stakeKey =>
      set(state => {
        state.lastStakeKey = stakeKey;
      }),
  }),
);
