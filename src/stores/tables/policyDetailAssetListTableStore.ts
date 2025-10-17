import type {
  AssetListTableOptions,
  AssetListTableColumns,
} from "@/types/tableTypes";

import { handlePersistStore } from "@vellumlabs/cexplorer-sdk";

export const usePolicyDetailAssetListTableStore = handlePersistStore<
  AssetListTableOptions,
  {
    setColumnVisibility: (columnKey: string, isVisible: boolean) => void;
    setIsResponsive: (isResponsive: boolean) => void;
    setRows: (rows: number) => void;
    setColumsOrder: (columnsOrder: (keyof AssetListTableColumns)[]) => void;
  }
>(
  `policy_detail_asset_list_table_store`,
  {
    isResponsive: true,
    rows: 20,
    columnsVisibility: {
      order: true,
      asset: true,
      policy_id: true,
      asset_minted: true,
      mint_count: true,
      type: true,
      mint_quantity: true,
    },
    columnsOrder: [
      "order",
      "type",
      "asset",
      "policy_id",
      "asset_minted",
      "mint_quantity",
      "mint_count",
    ],
  },
  set => ({
    setColumnVisibility: (columnKey, isVisible) =>
      set(state => {
        state.columnsVisibility[columnKey] = isVisible;
      }),
    setIsResponsive: isResponsive =>
      set(state => {
        state.isResponsive = isResponsive;
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
