import type { AdaPotsOptions, AdaPotsTableColumns } from "@/types/tableTypes";

import { handlePersistStore } from "@vellumlabs/cexplorer-sdk";

type EpochsOptions = "all" | "100" | "50" | "25" | "10";

export const useAdaPotsTableStore = handlePersistStore<
  AdaPotsOptions,
  {
    setColumnVisibility: (columnKey: string, isVisible: boolean) => void;
    setEpochsToShow: (epochsToShow: EpochsOptions) => void;
    setRows: (rows: number) => void;
    setColumsOrder: (columnsOrder: (keyof AdaPotsTableColumns)[]) => void;
  }
>(
  "epoch_list_table_store",
  {
    columnsVisibility: {
      epoch: true,
      treasury: true,
      reserves: true,
      rewards: true,
      utxo: true,
      deposits: true,
      fees: true,
    },
    epochsToShow: "50",
    rows: 20,
    columnsOrder: [
      "epoch",
      "treasury",
      "reserves",
      "rewards",
      "utxo",
      "deposits",
      "fees",
    ],
  },
  set => ({
    setColumnVisibility: (columnKey, isVisible) =>
      set(state => {
        state.columnsVisibility[columnKey] = isVisible;
      }),
    setEpochsToShow: epochsToShow =>
      set(state => {
        state.epochsToShow = epochsToShow;
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
