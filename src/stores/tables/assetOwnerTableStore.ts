import type { AssetOwnerColumns, AssetOwnerOptions } from "@/types/tableTypes";

import { handlePersistStore } from "@/lib/handlePersistStore";

export const useAssetOwnerTableStore = handlePersistStore<
  AssetOwnerOptions,
  {
    setColumsOrder: (columnsOrder: (keyof AssetOwnerColumns)[]) => void;
  }
>(
  "asset_owner_table_store",
  {
    columnsOrder: ["order", "type", "owner", "quantity", "share", "value"],
  },
  set => ({
    setColumsOrder: columnsOrder =>
      set(state => {
        state.columnsOrder = columnsOrder;
      }),
  }),
);
