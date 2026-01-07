import type { WalletState } from "@/types/walletTypes";
import { parse, stringify } from "flatted";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const PERSISTED_ENTRIES: readonly (keyof WalletState)[] = [
  "address",
  "stakeKey",
  "walletType",
  "disabledExt",
];

const defaultState: WalletState = {
  address: undefined,
  stakeKey: undefined,
  walletType: undefined,
  disabledExt: false,
  wallet: null,
};

export const useWalletStore = create<
  WalletState & {
    setWalletState: (state: Partial<WalletState>) => void;
  }
>()(
  persist(
    set => ({
      ...defaultState,
      setWalletState: state => set(state),
    }),
    {
      name: "wallet-store",
      serialize: data =>
        stringify(data, (_, value) =>
          typeof value === "bigint" ? value.toString() : value,
        ),
      deserialize: data =>
        parse(data, (_, value) =>
          typeof value === "string" && /^\d+n$/.test(value)
            ? BigInt(value.slice(0, -1))
            : value,
        ),
      partialize: state =>
        Object.fromEntries(
          Object.entries(state).filter(([key]) =>
            PERSISTED_ENTRIES.includes(key as keyof WalletState),
          ),
        ),
    },
  ),
);
