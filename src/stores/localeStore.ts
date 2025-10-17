import type { Locales } from "@/types/storeTypes";
import { handlePersistStore } from "@vellumlabs/cexplorer-sdk";

export const useLocaleStore = handlePersistStore<
  { locale: Locales },
  { setLocale: (value: Locales) => void }
>("locale_store", { locale: "en" }, set => ({
  setLocale: (value: Locales) =>
    set(state => {
      state.locale = value;
    }),
}));
