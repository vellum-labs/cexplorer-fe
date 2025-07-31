import type { AssetListTableOptions } from "@/types/tableTypes";

interface AssetListOptions {
  key: keyof AssetListTableOptions["columnsVisibility"];
  name: string;
}

export const assetListTableOptions: AssetListOptions[] = [
  {
    key: "order",
    name: "#",
  },
  {
    key: "type",
    name: "Type",
  },
  {
    key: "asset",
    name: "Asset",
  },
  {
    key: "policy_id",
    name: "Policy ID",
  },
  {
    key: "asset_minted",
    name: "Asset Minted",
  },
  {
    key: "mint_quantity",
    name: "Mint Quantity",
  },
  { key: "price", name: "Price" },
] as any;

export const assetListTableOptionsWithoutType: AssetListOptions[] = [
  {
    key: "order",
    name: "#",
  },
  {
    key: "asset",
    name: "Asset",
  },
  {
    key: "policy_id",
    name: "Policy ID",
  },
  {
    key: "asset_minted",
    name: "Asset Minted",
  },
  {
    key: "mint_quantity",
    name: "Mint Quantity",
  },
  {
    key: "mint_count",
    name: "Mint Count",
  },
] as any;
