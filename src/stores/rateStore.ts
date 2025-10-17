import type { BasicRate } from "@/types/miscTypes";
import { handlePersistStore } from "@vellumlabs/cexplorer-sdk";

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
