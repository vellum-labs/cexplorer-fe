import { handlePersistStore } from "@vellumlabs/cexplorer-sdk";

export const useViewStore = handlePersistStore<
  { view: "grid" | "list" },
  { setView: (value: "grid" | "list") => void }
>("view_store", { view: "list" }, set => ({
  setView: value =>
    set(state => {
      state.view = value;
    }),
}));
