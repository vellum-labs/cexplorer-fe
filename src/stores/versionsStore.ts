import { handlePersistStore } from "@vellumlabs/cexplorer-sdk";

export const useVersionStore = handlePersistStore<
  { rateVersion: number; constVersion: number; storageVersion: number },
  {
    setRateVersion: (value: number) => void;
    setConstVersion: (value: number) => void;
    setStorageVersion: (value: number) => void;
  }
>(
  "versions_store",
  { rateVersion: 0, constVersion: 0, storageVersion: 0 },
  set => ({
    setRateVersion: value =>
      set(state => {
        state.rateVersion = value;
      }),
    setConstVersion: value =>
      set(state => {
        state.constVersion = value;
      }),
    setStorageVersion: value =>
      set(state => {
        state.storageVersion = value;
      }),
  }),
);
