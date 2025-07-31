import type { BasicTableOptions, NewPoolsColumns } from "@/types/tableTypes";

interface NewPoolsTableOptions {
  key: keyof BasicTableOptions<NewPoolsColumns>["columnsVisibility"];
  name: string;
}

export const newPoolsTableOptions: NewPoolsTableOptions[] = [
  {
    key: "date",
    name: "Date",
  },
  {
    key: "pool",
    name: "Pool",
  },
  {
    key: "epoch",
    name: "Epoch",
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
    name: "Tx Hash",
  },
];
