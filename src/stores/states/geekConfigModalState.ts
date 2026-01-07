import { handleCreateStore } from "@vellumlabs/cexplorer-sdk";

export const useGeekConfigModalState = handleCreateStore<
  { isOpen: boolean },
  { setIsOpen: (isOpen: boolean) => void }
>("geek_config_modal_state", { isOpen: false }, set => ({
  setIsOpen: isOpen =>
    set(state => {
      state.isOpen = isOpen;
    }),
}));
