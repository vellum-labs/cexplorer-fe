import type { Currencies } from "@/types/storeTypes";
import { handlePersistStore } from "../lib/handlePersistStore";

export const useCurrencyStore = handlePersistStore<
  { currency: Currencies },
  { setCurrency: (value: Currencies) => void }
>("currency_store", { currency: "usd" }, set => ({
  setCurrency: (value: Currencies) =>
    set(state => {
      state.currency = value;
    }),
}));
