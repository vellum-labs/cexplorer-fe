import type { AddressLabel } from "@/types/commonTypes";
import { handlePersistStore } from "../lib/handlePersistStore";

export const useAddressLabelStore = handlePersistStore<
  { labels: AddressLabel[] },
  {
    setLabels: (value: AddressLabel[]) => void;
  }
>("address_label_store", { labels: [] }, set => ({
  setLabels: value =>
    set(state => {
      state.labels = value;
    }),
}));
