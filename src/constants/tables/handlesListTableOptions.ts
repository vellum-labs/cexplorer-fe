import type { HandlesListColumns } from "@/stores/tables/handlesListTableStore";

type HandlesListOptions = {
  key: HandlesListColumns;
  name: string;
}[];

export const handlesListTableOptions: HandlesListOptions = [
  {
    key: "minted",
    name: "Asset minted",
  },
  {
    key: "standard",
    name: "Standard",
  },
  {
    key: "handle",
    name: "Asset",
  },
  {
    key: "policy",
    name: "Policy ID",
  },
  {
    key: "quantity",
    name: "Mint quantity",
  },
  {
    key: "transaction",
    name: "Transaction",
  },
];
