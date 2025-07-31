import type { BasicTableOptions, TxListTableColumns } from "@/types/tableTypes";

interface TxListOptions {
  key: keyof BasicTableOptions<TxListTableColumns>["columnsVisibility"];
  name: string;
}

export const txListTableOptions: TxListOptions[] = [
  {
    key: "date",
    name: "Date",
  },
  {
    key: "hash",
    name: "Hash",
  },
  {
    key: "block",
    name: "Block",
  },
  {
    key: "total_output",
    name: "Total Output",
  },
  {
    key: "donation",
    name: "Treasury Donation",
  },
  {
    key: "fee",
    name: "Fee",
  },
  {
    key: "size",
    name: "Size",
  },
  {
    key: "script_size",
    name: "Script Size",
  },
];
