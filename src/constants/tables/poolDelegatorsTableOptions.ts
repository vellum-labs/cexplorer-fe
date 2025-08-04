import type {
  BasicTableOptions,
  PoolDelegatorsColumns,
} from "@/types/tableTypes";

type PoolDelegatorsOptions = {
  key: keyof BasicTableOptions<PoolDelegatorsColumns>["columnsVisibility"];
  name: string;
}[];

export const poolDelegatorsTableOptions: PoolDelegatorsOptions = [
  {
    key: "date",
    name: "Date",
  },
  {
    key: "active_in",
    name: "Active In",
  },
  {
    key: "address",
    name: "Address",
  },
  {
    key: "pool_delegation",
    name: "Pool Delegation",
  },
  {
    key: "amount",
    name: "Amount",
  },
  {
    key: "loyalty",
    name: "Loyalty",
  },
  {
    key: "registered",
    name: "Registered",
  },
];
