import { handleCreateStore } from "@/lib/handleCreateStore";

export const useCustomLabelModalState = handleCreateStore<
  { isOpen: boolean; addressToEdit: string | null },
  {
    setIsOpen: (openId: boolean) => void;
    setAddressToEdit: (address: string | null) => void;
  }
>("custom_label_modal_state", { isOpen: false, addressToEdit: null }, set => ({
  setIsOpen: isOpen =>
    set(state => {
      state.isOpen = isOpen;
    }),
  setAddressToEdit: address =>
    set(state => {
      state.addressToEdit = address;
    }),
}));
