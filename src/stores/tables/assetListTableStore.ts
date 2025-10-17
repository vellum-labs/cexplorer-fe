import type {
  AssetListTableOptions,
  AssetListTableColumns,
} from "@/types/tableTypes";

import { handlePersistStore } from "@vellumlabs/cexplorer-sdk";

export const useAssetListTableStore = (storeKey?: string) => (type?: string) =>
  handlePersistStore<
    AssetListTableOptions,
    {
      setColumnVisibility: (columnKey: string, isVisible: boolean) => void;
      setIsResponsive: (isResponsive: boolean) => void;
      setRows: (rows: number) => void;
      setColumsOrder: (
        columnsOrder: typeof type extends "string"
          ? typeof type extends "nft"
            ? (keyof Omit<AssetListTableColumns, "type" | "mint_quantity">)[]
            : (keyof Omit<AssetListTableColumns, "type">)[]
          : (keyof AssetListTableColumns)[],
      ) => void;
    }
  >(
    storeKey ?? `${type ? type : "asset"}_list_table_store`,
    {
      isResponsive: true,
      rows: 20,
      columnsVisibility: {
        order: true,
        asset: true,
        policy_id: true,
        asset_minted: true,
        mint_count: true,
        ...(!type && {
          type: true,
        }),
        ...(type !== "nft" && {
          mint_quantity: true,
        }),
        price: true,
      },
      columnsOrder: [
        "order",
        "type",
        "asset",
        "policy_id",
        "asset_minted",
        "mint_quantity",
        "mint_count",
        "price",
      ].filter(item =>
        type
          ? type === "nft"
            ? item !== "type" && item !== "mint_quantity"
            : item !== "type"
          : true,
      ) as (keyof AssetListTableColumns)[],
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
