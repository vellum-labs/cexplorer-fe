import type { MiscConstResponseData } from "@/types/miscTypes";
import { handlePersistStore } from "../lib/handlePersistStore";

export const useConstStore = handlePersistStore<
  { constData: MiscConstResponseData | undefined },
  {
    setConst: (value: MiscConstResponseData) => void;
  }
>("const_store", { constData: undefined }, set => ({
  setConst: value =>
    set(state => {
      state.constData = value;
    }),
}));
