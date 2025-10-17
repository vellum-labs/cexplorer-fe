import type { WatchlistResponse } from "@/types/userTypes";
import { handlePersistStore } from "@vellumlabs/cexplorer-sdk";

export const useWatchlistStore = handlePersistStore<
  { watchlist: WatchlistResponse["data"]["data"] | undefined },
  {
    setWatchlist: (
      value: WatchlistResponse["data"]["data"] | undefined,
    ) => void;
  }
>("watchlist_store", { watchlist: [] }, set => ({
  setWatchlist: value =>
    set(state => {
      state.watchlist = value;
    }),
}));
