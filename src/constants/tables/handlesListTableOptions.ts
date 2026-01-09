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
    key: "rarity",
    name: "Rarity",
  },
  {
    key: "holder",
    name: "Holder",
  },
];
