import type { ScriptListRanklistTableOptions } from "@/types/tableTypes";

interface ScriptListRanklistOptions {
  key: keyof ScriptListRanklistTableOptions["columnsVisibility"];
  name: string;
}

export const scriptListRanklistOptions: ScriptListRanklistOptions[] = [
  {
    key: "order",
    name: "#",
  },
  {
    key: "dapp",
    name: "Hash",
  },
  {
    key: "category",
    name: "Category",
  },
  {
    key: "users",
    name: "Users",
  },
  {
    key: "int_this_epoch",
    name: "Interactions this epoch",
  },
  {
    key: "activity_change",
    name: "Activity change",
  },
  {
    key: "epoch_volume",
    name: "Epoch Volume",
  },
];
