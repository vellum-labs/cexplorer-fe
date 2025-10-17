import { handleCreateStore } from "@vellumlabs/cexplorer-sdk";

export const useWalletConfigModalState = handleCreateStore<
  { isOpen: boolean },
  { setIsOpen: (openId: boolean) => void }
>("wallet_config_state", { isOpen: false }, set => ({
  setIsOpen: (value: boolean) =>
    set(state => {
      state.isOpen = value;
    }),
}));
