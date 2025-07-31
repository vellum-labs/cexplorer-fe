import type {
  BasicTableOptions,
  DeFiOrderListColumns,
} from "@/types/tableTypes";

interface DeFiOrderListOptions {
  key: keyof BasicTableOptions<DeFiOrderListColumns>["columnsVisibility"];
  name: string;
}

export const defiOrderListTableOptions: DeFiOrderListOptions[] = [
  {
    key: "date",
    name: "Date",
  },
  {
    key: "tx",
    name: "Tx",
  },
  {
    key: "type",
    name: "Type",
  },
  {
    key: "pair",
    name: "Pair",
  },
  {
    key: "token_amount",
    name: "Token amount",
  },
  {
    key: "ada_amount",
    name: "ADA amount",
  },
  {
    key: "ada_price",
    name: "Ada price",
  },
  {
    key: "status",
    name: "Status",
  },
  {
    key: "maker",
    name: "Maker",
  },
  {
    key: "platform",
    name: "Platform",
  },
];
