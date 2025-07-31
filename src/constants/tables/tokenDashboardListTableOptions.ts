import type {
  DeFiTokenTableColumns,
  BasicTableOptions,
} from "@/types/tableTypes";

interface TokenDashboardOptions {
  key: keyof BasicTableOptions<DeFiTokenTableColumns>["columnsVisibility"];
  name: string;
}

export const tokenDashboardListTableOptions: TokenDashboardOptions[] = [
  {
    key: "order",
    name: "#",
  },
  {
    key: "token",
    name: "Token",
  },
  {
    key: "price",
    name: "Price",
  },
  {
    key: "volume",
    name: "Volume",
  },
  {
    key: "liquidity",
    name: "Liquidity",
  },
  {
    key: "age",
    name: "Age",
  },
  {
    key: "last_week",
    name: "Last 7 days",
  },
];
