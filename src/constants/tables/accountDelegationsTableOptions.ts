import type {
  BasicTableOptions,
  PoolDelegatorsColumns,
} from "@/types/tableTypes";

type AccountDelegationsTableOptions = {
  key: keyof BasicTableOptions<PoolDelegatorsColumns>["columnsVisibility"];
  name: string;
}[];

export const accountDelegationsTableOptions: AccountDelegationsTableOptions = [
  {
    key: "date",
    name: "Date",
  },
  {
    key: "active_in",
    name: "Active Epoch",
  },
  {
    key: "address",
    name: "Stake Pool",
  },
  {
    key: "amount",
    name: "active_stake",
  },
  {
    key: "registered",
    name: "Registered",
  },
  {
    key: "loyalty",
    name: "Loyalty",
  },
];
