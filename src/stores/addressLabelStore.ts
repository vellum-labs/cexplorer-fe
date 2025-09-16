import type { AddressLabel } from "@/types/commonTypes";
import { handlePersistStore } from "../lib/handlePersistStore";

type WalletLabels = {
  wallet: string;
  labels: AddressLabel[];
};

type HistoryLabels = {
  empty: AddressLabel[];
  wallets: WalletLabels[];
};

export const useAddressLabelStore = handlePersistStore<
  {
    labels: AddressLabel[];
    HistoryLabels: HistoryLabels;
  },
  {
    setLabels: (value: AddressLabel[]) => void;
    updateHistoryLabels: (wallet: string | null, labels: AddressLabel[]) => void;
    getLabelsForWallet: (wallet: string | null) => AddressLabel[];
    mergeApiLabels: (apiLabels: AddressLabel[], wallet: string | null) => void;
  }
>("address_label_store", {
  labels: [],
  HistoryLabels: { empty: [], wallets: [] }
}, (set, get) => ({
  setLabels: value =>
    set(state => {
      state.labels = value;
    }),

  updateHistoryLabels: (wallet, labels) =>
    set(state => {
      if (!wallet) {
        state.HistoryLabels.empty = labels;
      } else {
        const existingIndex = state.HistoryLabels.wallets.findIndex(w => w.wallet === wallet);
        if (existingIndex >= 0) {
          state.HistoryLabels.wallets[existingIndex].labels = labels;
        } else {
          state.HistoryLabels.wallets.push({ wallet, labels });
        }
      }
    }),

  getLabelsForWallet: (wallet) => {
    const state = get();
    if (!wallet) {
      return state.HistoryLabels.empty;
    }
    const walletData = state.HistoryLabels.wallets.find(w => w.wallet === wallet);
    return walletData?.labels || [];
  },

  mergeApiLabels: (apiLabels, wallet) =>
    set(state => {
      const currentLabels = wallet
        ? state.HistoryLabels.wallets.find(w => w.wallet === wallet)?.labels || []
        : state.HistoryLabels.empty;

      const mergedLabels = [...currentLabels];

      apiLabels.forEach(apiLabel => {
        const exists = currentLabels.some(l => l.ident === apiLabel.ident);
        if (!exists) {
          mergedLabels.push(apiLabel);
        }
      });

      if (!wallet) {
        state.HistoryLabels.empty = mergedLabels;
      } else {
        const existingIndex = state.HistoryLabels.wallets.findIndex(w => w.wallet === wallet);
        if (existingIndex >= 0) {
          state.HistoryLabels.wallets[existingIndex].labels = mergedLabels;
        } else {
          state.HistoryLabels.wallets.push({ wallet, labels: mergedLabels });
        }
      }
    }),
}));
