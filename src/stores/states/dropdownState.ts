import { handleCreateStore } from "@/lib/handleCreateStore";

export const useDropdownState = handleCreateStore<
  { openId: string | null },
  { setOpenId: (openId: string | null) => void }
>("dropdown_state", { openId: null }, set => ({
  setOpenId: (openId: string | null) =>
    set(state => {
      state.openId = openId;
    }),
}));
