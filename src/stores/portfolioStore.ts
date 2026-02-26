import { handlePersistStore } from "@vellumlabs/cexplorer-sdk";

export interface PortfolioWallet {
  id: string;
  name: string;
  stakeAddress: string;
  originalAddress: string;
}

interface PortfolioState {
  wallets: PortfolioWallet[];
  selectedWalletId: string | null;
}

interface PortfolioActions {
  addWallet: (wallet: Omit<PortfolioWallet, "id">) => void;
  removeWallet: (id: string) => void;
  updateWalletName: (id: string, name: string) => void;
  setSelectedWallet: (id: string | null) => void;
  clearWallets: () => void;
}

export const usePortfolioStore = handlePersistStore<
  PortfolioState,
  PortfolioActions
>("portfolio_store", { wallets: [], selectedWalletId: null }, set => ({
  addWallet: wallet =>
    set(state => {
      state.wallets.push({ ...wallet, id: crypto.randomUUID() });
    }),
  removeWallet: id =>
    set(state => {
      state.wallets = state.wallets.filter(w => w.id !== id);
      if (state.selectedWalletId === id) {
        state.selectedWalletId = null;
      }
    }),
  updateWalletName: (id, name) =>
    set(state => {
      const wallet = state.wallets.find(w => w.id === id);
      if (wallet) wallet.name = name;
    }),
  setSelectedWallet: id =>
    set(state => {
      state.selectedWalletId = id;
    }),
  clearWallets: () =>
    set(state => {
      state.wallets = [];
      state.selectedWalletId = null;
    }),
}));
