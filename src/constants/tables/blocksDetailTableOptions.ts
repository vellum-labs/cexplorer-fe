import type { BlockDetailTableOptions } from "@/types/tableTypes";

interface BlockDetailOptions {
  key: keyof BlockDetailTableOptions["columnsVisibility"];
  name: string;
}

export const blocksDetailTableOptions: BlockDetailOptions[] = [
  {
    key: "date",
    name: "Date",
  },
  {
    key: "hash",
    name: "Transaction Hash",
  },
  {
    key: "block",
    name: "Block",
  },
  {
    key: "total_ouput",
    name: "Total Output",
  },
  {
    key: "fee",
    name: "Fee",
  },
  {
    key: "utxo",
    name: "UTXOs",
  },
  {
    key: "size",
    name: "Size",
  },
];
