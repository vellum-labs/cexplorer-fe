import { handlePersistStore } from "../lib/handlePersistStore";

export const useInfiniteScrollingStore = handlePersistStore<
  { infiniteScrolling: boolean },
  { toggleInfiniteScrolling: () => void }
>("infinite_scrolling_store", { infiniteScrolling: false }, set => ({
  toggleInfiniteScrolling: () =>
    set(state => {
      state.infiniteScrolling = !state.infiniteScrolling;
    }),
}));
