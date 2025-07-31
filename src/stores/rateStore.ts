import type { BasicRate } from "@/types/miscTypes";
import { handlePersistStore } from "../lib/handlePersistStore";

export const useRateStore = handlePersistStore<
  { rate: BasicRate[] },
  {
    setRate: (value: BasicRate[]) => void;
  }
>("rate_store", { rate: [] }, set => ({
  setRate: value =>
    set(state => {
      state.rate = value;
    }),
}));
