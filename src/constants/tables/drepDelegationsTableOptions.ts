import type {
  BasicTableOptions,
  DrepDelegationsColumns,
} from "@/types/tableTypes";

type DrepDelegationsTableOptions = {
  key: keyof BasicTableOptions<DrepDelegationsColumns>["columnsVisibility"];
  name: string;
}[];

export const drepDelegationsTableOptions: DrepDelegationsTableOptions = [
  {
    key: "date",
    name: "Date",
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
