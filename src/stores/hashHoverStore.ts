import { create } from "zustand";

interface HashHoverStore {
  hoveredHash: string | null;
  setHoveredHash: (hash: string | null) => void;
}

export const useHashHoverStore = create<HashHoverStore>(set => ({
  hoveredHash: null,
  setHoveredHash: (hash: string | null) => set({ hoveredHash: hash }),
}));
