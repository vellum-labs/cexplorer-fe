import type { AddressDetailAssetTableOptions } from "@/types/tableTypes";

interface EpochListOptions {
  key: keyof AddressDetailAssetTableOptions["columnsVisibility"];
  name: string;
}

export const addressDetailAssetTableOptions: EpochListOptions[] = [
  {
    key: "token",
    name: "Asset",
  },
  {
    key: "policy_id",
    name: "Policy ID",
  },
  {
    key: "ticker",
    name: "Ticker",
  },
  {
    key: "price",
    name: "Price",
  },
  {
    key: "pnl_24",
    name: "PnL (24h)",
  },
  {
    key: "pnl_7",
    name: "PnL (7d)",
  },
  {
    key: "holdings",
    name: "Holdings",
  },
  {
    key: "supply",
    name: "% Supply",
  },
  {
    key: "portfolio",
    name: "% Portfolio",
  },
  {
    key: "value",
    name: "Value",
  },
];
