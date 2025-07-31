import type { PoolUpdatesTableOptions } from "@/types/tableTypes";

interface PoolUpdatesOptions {
  key: keyof PoolUpdatesTableOptions["columnsVisibility"];
  name: string;
}

export const poolUpdatesTableOptions: PoolUpdatesOptions[] = [
  {
    key: "date",
    name: "Date",
  },
  {
    key: "epoch",
    name: "Epoch",
  },
  {
    key: "pool",
    name: "Pool",
  },
  {
    key: "active_stake",
    name: "Active stake",
  },
  {
    key: "fees",
    name: "Fees",
  },
  {
    key: "pledge",
    name: "Pledge",
  },
  {
    key: "tx_hash",
    name: "Transaction Hash",
  },
  {
    key: "certificate",
    name: "Certificate",
  },
];
