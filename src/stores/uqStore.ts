import { handlePersistStore } from "@/lib/handlePersistStore";

export const useUqStore = handlePersistStore<
  { uq: string },
  {
    setUq: (value: string) => void;
  }
>("uq_store", { uq: "" }, set => ({
  setUq: value =>
    set(state => {
      state.uq = value;
    }),
}));
