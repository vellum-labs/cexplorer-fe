import type { AssetMintColumns, TableOptionsCore } from "@/types/tableTypes";

type AssetDetailMintOptions = {
  key: keyof TableOptionsCore<AssetMintColumns>["columnsVisibility"];
  name: string;
}[];

export const assetDetailMintTableOptions: AssetDetailMintOptions = [
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
  {
    key: "tx",
    name: "Tx",
  },
];
