import { handlePersistStore } from "@vellumlabs/cexplorer-sdk";

export const useTxExpandStore = handlePersistStore<
  { expandRows: string[] },
  { setExpandRows: (updater: (prev: string[]) => string[]) => void }
>("tx_expand_store", { expandRows: [] }, set => ({
  setExpandRows: updater =>
    set(state => {
      state.expandRows = updater(state.expandRows);
    }),
}));
