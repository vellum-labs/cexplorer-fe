import type {
  BasicTableOptions,
  LiveDelegationsColumns,
} from "@/types/tableTypes";

type LiveDelegationsTableOptions = {
  key: keyof BasicTableOptions<LiveDelegationsColumns>["columnsVisibility"];
  name: string;
}[];

export const liveDelegationsTableOptions: LiveDelegationsTableOptions = [
  {
    key: "date",
    name: "Date",
  },
  {
    key: "epoch",
    name: "Epoch",
  },
  {
    key: "address",
    name: "Address",
  },
  {
    key: "amount",
    name: "Amount",
  },
  {
    key: "delegation",
    name: "Delegation",
  },
  {
    key: "tx",
    name: "Tx",
  },
];
