import { handleCreateStore } from "@/lib/handleCreateStore";

export const useHoverHighlightState = handleCreateStore<
  { hoverValue: string | null },
  { setHoverValue: (hoverValue: string | null) => void }
>("hover_highlight_state", { hoverValue: null }, set => ({
  setHoverValue: (hoverValue: string | null) =>
    set(state => {
      state.hoverValue = hoverValue;
    }),
}));
