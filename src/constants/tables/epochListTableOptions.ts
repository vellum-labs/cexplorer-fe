import type { EpochTableOptions } from "@/types/tableTypes";

interface EpochListOptions {
  key: keyof EpochTableOptions["columnsVisibility"];
  name: string;
}

export const epochListTableOptions: EpochListOptions[] = [
  {
    key: "start_time",
    name: "Start Time",
  },
  {
    key: "end_time",
    name: "End Time",
  },
  {
    key: "epoch",
    name: "Epoch",
  },
  {
    key: "blocks",
    name: "Blocks",
  },
  {
    key: "txs",
    name: "TXs",
  },
  {
    key: "output",
    name: "Output",
  },
  {
    key: "fees",
    name: "Fees",
  },
  {
    key: "rewards",
    name: "Rewards",
  },
  {
    key: "stake",
    name: "Stake",
  },
  {
    key: "usage",
    name: "Usage",
  },
];
