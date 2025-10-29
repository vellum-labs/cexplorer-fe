import type { BasicTableOptions, PoolBlocksColumns } from "@/types/tableTypes";

type PoolBlocksOptions = {
  key: keyof BasicTableOptions<PoolBlocksColumns>["columnsVisibility"];
  name: string;
}[];

export const poolBlocksTableOptions: PoolBlocksOptions = [
  {
    key: "date",
    name: "Date",
  },
  {
    key: "block_no",
    name: "Height",
  },
  {
    key: "epoch_no",
    name: "Epoch",
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
    key: "hash",
    name: "Hash",
  },
  {
    key: "size",
    name: "Size",
  },
  {
    key: "protocol",
    name: "Protocol",
  },
  {
    key: "cert_counter",
    name: "Cert counter",
  },
];
