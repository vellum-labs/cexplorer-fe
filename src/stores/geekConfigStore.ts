import { handlePersistStore } from "@vellumlabs/cexplorer-sdk";

export type UTxOSortOption = "index" | "value";

interface GeekConfigState {
  displayHandles: boolean;
  displayADAInTooltips: boolean;
  sortUTxOs: UTxOSortOption;
}

interface GeekConfigActions {
  setDisplayHandles: (value: boolean) => void;
  setDisplayADAInTooltips: (value: boolean) => void;
  setSortUTxOs: (value: UTxOSortOption) => void;
}

export const useGeekConfigStore = handlePersistStore<
  GeekConfigState,
  GeekConfigActions
>(
  "geek_config",
  {
    displayHandles: true,
    displayADAInTooltips: true,
    sortUTxOs: "value",
  },
  set => ({
    setDisplayHandles: value =>
      set(state => {
        state.displayHandles = value;
      }),
    setDisplayADAInTooltips: value =>
      set(state => {
        state.displayADAInTooltips = value;
      }),
    setSortUTxOs: value =>
      set(state => {
        state.sortUTxOs = value;
      }),
  }),
);
