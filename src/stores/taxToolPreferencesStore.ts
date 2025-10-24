import type { Currencies } from "@/types/storeTypes";

import { handlePersistStore } from "@vellumlabs/cexplorer-sdk";

export const useTaxToolPreferencesStore = handlePersistStore<
  {
    secondaryCurrency: Currencies;
  },
  {
    setSecondaryCurrency: (currency: Currencies) => void;
  }
>(
  "tax_tool_preferences_store",
  {
    secondaryCurrency: "usd",
  },
  set => ({
    setSecondaryCurrency: currency =>
      set(state => {
        state.secondaryCurrency = currency;
      }),
  }),
);
