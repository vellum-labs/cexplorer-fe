import type { AddressLabel } from "@/types/commonTypes";
import { handlePersistStore } from "@vellumlabs/cexplorer-sdk";

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
    updateHistoryLabels: (
      wallet: string | null,
      labels: AddressLabel[],
    ) => void;
    getLabelsForWallet: (wallet: string | null) => AddressLabel[];
    mergeApiLabels: (apiLabels: AddressLabel[], wallet: string | null) => void;
  }
>(
  "address_label_store",
  {
    labels: [],
    HistoryLabels: { empty: [], wallets: [] },
  },
  (set, get) => ({
    setLabels: value =>
      set(state => {
        state.labels = value;
      }),

    updateHistoryLabels: (wallet, labels) =>
      set(state => {
        if (!wallet) {
          state.HistoryLabels.empty = labels;
        } else {
          const existingIndex = state.HistoryLabels.wallets.findIndex(
            w => w.wallet === wallet,
          );
          if (existingIndex >= 0) {
            state.HistoryLabels.wallets[existingIndex].labels = labels;
          } else {
            state.HistoryLabels.wallets.push({ wallet, labels });
          }
        }
      }),

    getLabelsForWallet: wallet => {
      const state = get();
      if (!wallet) {
        return state.HistoryLabels.empty;
      }
      const walletData = state.HistoryLabels.wallets.find(
        w => w.wallet === wallet,
      );
      return walletData?.labels || [];
    },

    mergeApiLabels: (apiLabels, wallet) =>
      set(state => {
        const walletLabels = wallet
          ? state.HistoryLabels.wallets.find(w => w.wallet === wallet)
              ?.labels || []
          : [];

        const emptyLabels = state.HistoryLabels.empty;

        const mergedLabels = wallet ? [...walletLabels] : [...emptyLabels];

        if (wallet) {
          emptyLabels.forEach(label => {
            const exists = mergedLabels.some(l => l.ident === label.ident);
            if (!exists) {
              mergedLabels.push(label);
            }
          });
        }

        apiLabels.forEach(apiLabel => {
          const exists = mergedLabels.some(l => l.ident === apiLabel.ident);
          if (!exists) {
            mergedLabels.push(apiLabel);
          }
        });

        if (!wallet) {
          state.HistoryLabels.empty = mergedLabels;
        } else {
          state.HistoryLabels.empty = [];

          const existingIndex = state.HistoryLabels.wallets.findIndex(
            w => w.wallet === wallet,
          );
          if (existingIndex >= 0) {
            state.HistoryLabels.wallets[existingIndex].labels = mergedLabels;
          } else {
            state.HistoryLabels.wallets.push({ wallet, labels: mergedLabels });
          }
        }
      }),
  }),
);
