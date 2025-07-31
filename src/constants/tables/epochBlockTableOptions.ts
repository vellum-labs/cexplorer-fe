import type { EpochBlockListTableOptions } from "@/types/tableTypes";

interface EpochBlockOptions {
  key: keyof EpochBlockListTableOptions["columnsVisibility"];
  name: string;
}

export const epochBlockTableOptions: EpochBlockOptions[] = [
  {
    key: "date",
    name: "Date",
  },
  {
    key: "block_no",
    name: "Height",
  },
  {
    key: "slot_no",
    name: "Slot",
  },
  {
    key: "tx_count",
    name: "TXs",
  },
  {
    key: "minted_by",
    name: "Minted by",
  },
  {
    key: "size",
    name: "Size",
  },
];
