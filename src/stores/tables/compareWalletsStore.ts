import type { CompareWalletsOptions } from "@/types/walletTypes";

import { handlePersistStore } from "../../lib/handlePersistStore";

export const useCompareWalletsStore = handlePersistStore<
  CompareWalletsOptions,
  {
    setColumnVisibility: (columnKey: string, isVisible: boolean) => void;
    removeColumnVisibility: (columnKey: string) => void;
  }
>(
  "compare_wallets_store",
  {
    columnsVisibility: {},
  },
  set => ({
    setColumnVisibility: (columnKey, isVisible) =>
      set(state => {
        state.columnsVisibility[columnKey] = isVisible;
      }),
    removeColumnVisibility: columnKey =>
      set(state => {
        delete state.columnsVisibility[columnKey];
      }),
  }),
);
