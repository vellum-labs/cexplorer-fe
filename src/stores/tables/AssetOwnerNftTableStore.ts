import type {
  AssetOwnerNftColumns,
  AssetOwnerNftOptions,
} from "@/types/tableTypes";

import { handlePersistStore } from "@vellumlabs/cexplorer-sdk";

export const useAssetOwnerNftTableStore = handlePersistStore<
  AssetOwnerNftOptions,
  {
    setColumsOrder: (columnsOrder: (keyof AssetOwnerNftColumns)[]) => void;
  }
>(
  "asset_owner_nft_table_store",
  {
    columnsOrder: ["order", "type", "owner", "date", "quantity", "value"],
  },
  set => ({
    setColumsOrder: columnsOrder =>
      set(state => {
        state.columnsOrder = columnsOrder;
      }),
  }),
);
