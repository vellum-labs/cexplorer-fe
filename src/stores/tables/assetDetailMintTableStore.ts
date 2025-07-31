import type { AssetMintColumns, AssetMintOptions } from "@/types/tableTypes";

import { handlePersistStore } from "@/lib/handlePersistStore";

export const useAssetDetailMintTableStore = handlePersistStore<
  AssetMintOptions,
  {
    setColumsOrder: (columnsOrder: (keyof AssetMintColumns)[]) => void;
    setColumnVisibility: (columnKey: string, isVisible: boolean) => void;
    setRows: (rows: number) => void;
  }
>(
  "asset_mint_table_store",
  {
    columnsVisibility: {
      order: true,
      type: true,
      asset: false,
      policy_id: false,
      asset_minted: true,
      mint_quantity: true,
      tx: true,
    },
    isResponsive: true,
    columnsOrder: [
      "order",
      "type",
      "asset",
      "policy_id",
      "asset_minted",
      "mint_quantity",
      "tx",
    ],
    rows: 20,
  },
  set => ({
    setColumnVisibility: (columnKey, isVisible) =>
      set(state => {
        state.columnsVisibility[columnKey] = isVisible;
      }),
    setRows: rows =>
      set(state => {
        state.rows = rows;
      }),
    setColumsOrder: columnsOrder =>
      set(state => {
        state.columnsOrder = columnsOrder;
      }),
  }),
);
