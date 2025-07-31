import { handlePersistStore } from "@/lib/handlePersistStore";

type Sort = "value" | "index";

export const useTxSortStore = handlePersistStore<
  { sort: Sort },
  { setSort: (value: Sort) => void }
>("tx_sort_store", { sort: "value" }, set => ({
  setSort: (value: Sort) =>
    set(state => {
      state.sort = value;
    }),
}));
